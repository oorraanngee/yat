import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, addDoc, increment } from 'firebase/firestore';
import { translateToPreRevolutionary } from '../../src/services/translator.js';

// Helper to get Firebase App
const getFirebaseApp = () => {
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  // Basic validation
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Missing Firebase Configuration. Check VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID.');
  }

  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
};

const ZALGO_RANGE = /[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/;

/**
 * Strips excessive zalgo/combining marks while keeping the base text.
 * Limits to 3 marks per base character by default.
 */
function cleanZalgo(text: string, limit = 3): string {
  let result = '';
  let combiningCount = 0;
  for (const char of text) {
    if (ZALGO_RANGE.test(char)) {
      if (combiningCount < limit) {
        result += char;
        combiningCount++;
      }
    } else {
      result += char;
      combiningCount = 0;
    }
  }
  return result;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-api-key'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = req.headers['x-api-key']?.toString();
  const { text } = req.body;

  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API Key' });
  }

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing text' });
  }

  try {
    const app = getFirebaseApp();
    const db = getFirestore(app);

    // 1. Validate API Key
    const q = query(collection(db, 'api_keys'), where('key', '==', apiKey), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(403).json({ error: 'Invalid or inactive API Key' });
    }

    const keyDoc = querySnapshot.docs[0];
    const keyData = keyDoc.data();

    // 2. Clean Zalgo instead of blocking
    const cleanedText = cleanZalgo(text);

    try {
      // 3. Perform translation
      const translatedText = await translateToPreRevolutionary(cleanedText);

      // 4. Update stats
      await updateDoc(keyDoc.ref, {
        totalRequests: increment(1),
        lastUsedAt: new Date().toISOString()
      });

      // 5. Log request if history enabled
      if (keyData.historyEnabled) {
        await addDoc(collection(db, 'api_logs'), {
          key: apiKey,
          userId: keyData.userId,
          input: text.substring(0, 1000),
          output: translatedText.substring(0, 1000),
          timestamp: new Date().toISOString(),
          status: 'success'
        });
      }

      res.json({ translated: translatedText });
    } catch (translateError: any) {
      console.error('Translation Error:', translateError);
      
      // Log error to history if enabled
      if (keyData.historyEnabled) {
        await addDoc(collection(db, 'api_logs'), {
          key: apiKey,
          userId: keyData.userId,
          input: text.substring(0, 1000),
          output: `Error: ${translateError.message}`,
          timestamp: new Date().toISOString(),
          status: 'error'
        });
      }

      throw translateError; // Re-throw to be caught by global catch
    }
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error?.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
}
