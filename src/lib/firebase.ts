
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  projectId: 'vindhya-club-central',
  appId: '1:1039393391799:web:2db88bb005443309acb932',
  storageBucket: 'vindhya-club-central.appspot.com',
  apiKey: 'AIzaSyA8vtsAEq4610rfgl-3ruh4qAuPW8jt-is',
  authDomain: 'vindhya-club-central.firebaseapp.com',
  messagingSenderId: '1039393391799',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);

/**
 * Uploads an image file to Firebase Storage.
 * @param file The image file to upload.
 * @param path The path to store the image in (e.g., 'team-images/').
 * @returns The public URL of the uploaded image.
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, `${path}${Date.now()}-${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export { app, storage };
