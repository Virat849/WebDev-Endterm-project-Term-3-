// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  signupWithEmail,
  loginWithEmail,
  loginWithGoogle as googleLogin,
  logoutUser,
} from '../services/auth';
import { createUserProfile } from '../services/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading,     setLoading]     = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  /** Sign up with email/password + create Firestore profile */
  const signup = useCallback(async (email, password, displayName) => {
    const { user } = await signupWithEmail(email, password, displayName);
    await createUserProfile(user.uid, {
      displayName: displayName,
      email:       user.email,
      photoURL:    user.photoURL || '',
    });
    return user;
  }, []);

  /** Sign in with email/password */
  const login = useCallback((email, password) => {
    return loginWithEmail(email, password);
  }, []);

  /** Sign in with Google — also creates/merges Firestore profile */
  const loginWithGoogle = useCallback(async () => {
    const { user } = await googleLogin();
    await createUserProfile(user.uid, {
      displayName: user.displayName || '',
      email:       user.email || '',
      photoURL:    user.photoURL || '',
    });
    return user;
  }, []);

  /** Sign out */
  const logout = useCallback(() => {
    return logoutUser();
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used inside AuthProvider');
  return context;
}
