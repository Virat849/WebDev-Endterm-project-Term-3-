// src/hooks/useAuth.js
import { useAuthContext } from '../context/AuthContext';

/**
 * Convenient hook to consume AuthContext.
 * Usage: const { currentUser, login, logout } = useAuth();
 */
export function useAuth() {
  return useAuthContext();
}
