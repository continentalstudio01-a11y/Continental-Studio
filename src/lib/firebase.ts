import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

console.log('[Firebase Init] Initializing Firebase App with Project ID:', firebaseConfig.projectId);

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const firestoreDbId = (firebaseConfig as any).firestoreDatabaseId || undefined;
export const db = firestoreDbId ? getFirestore(app, firestoreDbId) : getFirestore(app);
export const auth = getAuth(app);

console.log('[Firebase Init] Connected to Firestore DB:', firestoreDbId || '(default)');
console.log('[Firebase Init] Firestore & Auth services initialized successfully.');

export {
  firebaseConfig,
  firestoreDbId,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  signInAnonymously,
  onAuthStateChanged
};
export type { User };
export default app;

