import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, increment } from 'firebase/firestore';
import { translateToPreRevolutionary, initDictionary } from './src/services/translator.js';

// Derive __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase Config
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

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Zalgo protection
const ZALGO_REGEX = /[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/;
const isZalgo = (text: string) => ZALGO_REGEX.test(text);

// Translate API Endpoint
app.post('/api/v1/translate', async (req, res) => {
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
    const userId = keyData.userId;

    // 2. Perform translation
    const translatedText = await translateToPreRevolutionary(text);

    // 3. Update stats (async)
    updateDoc(keyDoc.ref, {
      totalRequests: increment(1),
      lastUsedAt: new Date().toISOString()
    });

    // 4. Log request if history enabled
    if (keyData.historyEnabled) {
      addDoc(collection(db, 'api_logs'), {
        key: apiKey,
        userId: userId,
        input: text.substring(0, 1000), // Limit log size
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
});

async function startServer() {
  // Ensure dictionary is initialized (it might need a local path in Node)
  // We'll override the fetch if needed in translator.ts or just rely on it working if we use absolute URLs
  // For now, let's assume it works or we will fix it.
  
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API check: POST http://localhost:${PORT}/api/v1/translate with header X-API-KEY`);
  });
}

startServer();
