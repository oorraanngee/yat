import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, addDoc, increment } from 'firebase/firestore';
import { translateToPreRevolutionary } from '../../src/services/translator.js';

// Firebase Config from env
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const ZALGO_REGEX = /[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/;
const isZalgo = (text: string) => ZALGO_REGEX.test(text);

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

  if (isZalgo(text)) {
    return res.status(400).json({ error: 'Zalgo text is strictly forbidden' });
  }

  try {
    // 1. Validate API Key
    const q = query(collection(db, 'api_keys'), where('key', '==', apiKey), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(403).json({ error: 'Invalid or inactive API Key' });
    }

    const keyDoc = querySnapshot.docs[0];
    const keyData = keyDoc.data();

    // 2. Perform translation
    const translatedText = await translateToPreRevolutionary(text);

    // 3. Update stats (fire and forget or await depending on preference, vercel recommends await)
    await updateDoc(keyDoc.ref, {
      totalRequests: increment(1),
      lastUsedAt: new Date().toISOString()
    });

    // 4. Log request if history enabled
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
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
