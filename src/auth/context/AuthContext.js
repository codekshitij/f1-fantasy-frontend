import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseAuthService, firestoreService } from '../services/firebaseAuth';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          console.log('🔥 Firebase user detected:', firebaseUser.email);
          
          // Get user data from Firestore with error handling
          const firestoreUser = await firestoreService.getUser(firebaseUser.uid);
          
          if (firestoreUser) {
            setUser({
              // Firebase user data
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
              
              // Firestore user data
              firestoreUser,
              
              // Helper methods
              getToken: () => firebaseUser.getIdToken(),
            });
            
            console.log('✅ User loaded from Firestore');
          } else {
            // Create user in Firestore if doesn't exist (with fallback)
            console.log('🔄 Creating new user in Firestore...');
            const newFirestoreUser = await firestoreService.createUser(firebaseUser);
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
              firestoreUser: newFirestoreUser,
              getToken: () => firebaseUser.getIdToken(),
            });
            
            // Show warning if in fallback mode
            if (newFirestoreUser.fallbackMode) {
              console.warn('⚠️ App running in fallback mode - some features may be limited');
            }
          }
          
          setError(null);
        } catch (error) {
          console.error('❌ Auth context error:', error);
          
          // Still set user with minimal Firebase data as fallback
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            firestoreUser: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || '',
              profileCompleted: false,
              fallbackMode: true,
              firestoreError: true
            },
            getToken: () => firebaseUser.getIdToken(),
          });
          
          setError(`Firestore connection issue: ${error.message}`);
          console.warn('⚠️ App running with limited functionality due to Firestore errors');
        }
      } else {
        console.log('👤 No user authenticated');
        setUser(null);
        setError(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (method = 'google', credentials = null) => {
    try {
      setLoading(true);
      setError(null);

      let result;
      
      switch (method) {
        case 'google':
          result = await firebaseAuthService.signInWithGoogle();
          break;
        case 'email':
          if (!credentials) throw new Error('Email and password required');
          result = await firebaseAuthService.signInWithEmail(
            credentials.email, 
            credentials.password
          );
          break;
        default:
          throw new Error('Invalid login method');
      }

      console.log('✅ Login successful');
      // User state will be updated by onAuthStateChanged
      return result;
    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await firebaseAuthService.signUpWithEmail(email, password);
      console.log('✅ Sign up successful');
      return result;
    } catch (error) {
      console.error('❌ Sign up error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Logout from Firebase
      await firebaseAuthService.signOut();
      
      setUser(null);
      setError(null);
      console.log('👋 User logged out');
    } catch (error) {
      console.error('❌ Logout error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (!user?.uid) return;
    
    try {
      const userData = await firestoreService.getUser(user.uid);
      setUser(prev => ({
        ...prev,
        firestoreUser: userData
      }));
    } catch (error) {
      console.error('❌ Refresh user data error:', error);
    }
  };

  const value = {
    // State
    user,
    loading,
    error,
    isAuthenticated: !!user,
    
    // Methods
    login,
    signUp,
    logout,
    refreshUserData,
    
    // Helpers
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};