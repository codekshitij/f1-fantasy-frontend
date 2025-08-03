import { useState, useEffect } from 'react';
import { firebaseAuthService } from '../services/firebaseAuth';

/**
 * Lower-level hook that directly manages Firebase authentication
 * Use this when you need direct Firebase operations without Firestore integration
 */
export const useFirebaseAuth = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged((user) => {
      setFirebaseUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await firebaseAuthService.signInWithGoogle();
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const result = await firebaseAuthService.signInWithEmail(email, password);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const result = await firebaseAuthService.signUpWithEmail(email, password);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await firebaseAuthService.signOut();
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getIdToken = async () => {
    if (!firebaseUser) return null;
    try {
      return await firebaseUser.getIdToken();
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  return {
    // Firebase user data
    firebaseUser,
    isAuthenticated: !!firebaseUser,
    loading,
    error,

    // Firebase methods
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    getIdToken,

    // Utilities
    clearError: () => setError(null),
  };
};

export default useFirebaseAuth;
