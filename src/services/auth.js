// src/services/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();

/**
 * Create a new user with email and password.
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<UserCredential>}
 */
export async function signupWithEmail(email, password, displayName) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  return credential;
}

/**
 * Sign in with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export async function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign in / sign up with Google OAuth popup.
 * @returns {Promise<UserCredential>}
 */
export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

/**
 * Sign out the current user.
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  return signOut(auth);
}
