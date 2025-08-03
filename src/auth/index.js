import { firebaseAuthService, firestoreService } from './services/firebaseAuth';

// Context & Provider
export { AuthProvider, useAuthContext } from './context/AuthContext';

// Main Auth Hooks
export { 
  useAuth, 
  useAuthUser, 
  useAuthLoading, 
  useAuthError,
  useAuthToken,
  useBackendUser,
  useFirestoreUser,
  useFirebaseUser,
  useIsAuthenticated
} from './hooks/useAuth';

// Firebase-specific Hook
export { useFirebaseAuth } from './hooks/useFirebaseAuth';

// Components
export { default as Login } from './components/LoginPage';
export { default as ProtectedRoute } from './components/ProtectedRoute';

// Services
export { firebaseAuthService, firestoreService } from './services/firebaseAuth';

// You can also create convenience exports
export const authServices = {
  firebase: firebaseAuthService,
  firestore: firestoreService
};

// Auth utilities (if you want to add them later)
export const authUtils = {
  // You can add utility functions here later
  isTokenExpired: (token) => {
    // Implementation for checking if token is expired
    return false; // placeholder
  },
  
  getAuthHeaders: (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  })
};