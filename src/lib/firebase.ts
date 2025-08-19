import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

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
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

/**
 * Signup user with email & password
 */
export const signupUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Login user with email & password
 */
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  await signOut(auth);
};

/**
 * Add Member (with optional image upload)
 */
export const addMember = async (data: { name: string; role: string; imageFile?: File }) => {
  let imageUrl = "";
  if (data.imageFile) {
    imageUrl = await uploadImage(data.imageFile, "members");
  }

  await addDoc(collection(db, "members"), {
    name: data.name,
    role: data.role,
    imageUrl,
    createdAt: serverTimestamp(),
  });
};

/**
 * Add Event (with optional image upload)
 */
export const addEvent = async (data: { title: string; description: string; date: string; imageFile?: File }) => {
  let imageUrl = "";
  if (data.imageFile) {
    imageUrl = await uploadImage(data.imageFile, "events");
  }

  await addDoc(collection(db, "events"), {
    title: data.title,
    description: data.description,
    date: data.date,
    imageUrl,
    createdAt: serverTimestamp(),
  });
};

export { db, storage, auth };
