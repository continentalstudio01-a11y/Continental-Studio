import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use the designated Firestore Database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

export { doc, getDoc, setDoc, onSnapshot, updateDoc };
