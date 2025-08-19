import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "vindhya-club-central",
  appId: "1:1039393391799:web:2db88bb005443309acb932",
  storageBucket: "vindhya-club-central.appspot.com",
  apiKey: "AIzaSyA8vtsAEq4610rfgl-3ruh4qAuPW8jt-is",
  authDomain: "vindhya-club-central.firebaseapp.com",
  messagingSenderId: "1039393391799",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Uploads an image to Firebase Storage and returns download URL.
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
  const uploadTask = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(uploadTask.ref);
  return downloadUrl;
};

export { db, storage, auth };
