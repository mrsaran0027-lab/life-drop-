import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

/**
 * Firebase Project Configuration
 * Project: life-drop-d8a32
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDv7Lm4da4E_g8U31W4iqtr6O9shQJ9l7w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "life-drop-d8a32.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "life-drop-d8a32",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "life-drop-d8a32.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "562639032756",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:562639032756:web:5057677c5f7137966a62e1",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-TKQQVN5DXH"
};

// Check if credentials are configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp;
let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
  console.log('🔥 Connected to Firebase project:', firebaseConfig.projectId);
} catch (error) {
  console.warn('Firebase initialization in fallback mode:', error);
}

export { app, db, auth };
