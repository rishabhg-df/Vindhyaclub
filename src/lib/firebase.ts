
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA8vtsAEq4610rfgl-3ruh4qAuPW8jt-is",
  authDomain: "vindhya-club-central.firebaseapp.com",
  projectId: "vindhya-club-central",
  storageBucket: "vindhya-club-central.appspot.com",
  messagingSenderId: "1039393391799",
  appId: "1:1039393391799:web:2db88bb005443309acb932",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);

/**
 * Uploads an image file to Firebase Storage.
 * @param file The image file to upload.
 * @param path The path in Firebase Storage to upload the file to.
 * @returns A promise that resolves with the public URL of the uploaded image.
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
