
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  type User,
} from "firebase/auth";
import { auth, db } from "./config";
import type { LoginFormData, SignupFormData, ProfileFormData } from "@/lib/validators";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { UserProfile } from "@/types";

export const signUp = async (data: SignupFormData): Promise<User> => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  // Create a user profile document in Firestore
  const userProfileRef = doc(db, "users", userCredential.user.uid);
  await setDoc(userProfileRef, {
    id: userCredential.user.uid,
    email: userCredential.user.email,
    displayName: userCredential.user.email?.split('@')[0] || 'User', // Default display name
  });
  return userCredential.user;
};

export const signIn = async (data: LoginFormData): Promise<User> => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
  return userCredential.user;
};

export const signOut = async (): Promise<void> => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  return firebaseSignOut(auth);
};

export const updateUserProfileFirebase = async (user: User, data: ProfileFormData) => {
  if (!auth || !db) throw new Error("Firebase not initialized");
  if (data.displayName) {
    await firebaseUpdateProfile(user, { displayName: data.displayName });
  }
  const userProfileRef = doc(db, "users", user.uid);
  await setDoc(userProfileRef, { 
    fitnessGoals: data.fitnessGoals,
    dietaryPreferences: data.dietaryPreferences,
   }, { merge: true }); // Merge to avoid overwriting email/id
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!db) throw new Error("Firestore not initialized");
  const userProfileRef = doc(db, "users", userId);
  const docSnap = await getDoc(userProfileRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};
