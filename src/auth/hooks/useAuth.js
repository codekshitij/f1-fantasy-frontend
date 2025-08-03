import { useAuthContext } from '../context/AuthContext';

/**
 * Main auth hook - provides complete authentication state
 * Includes both Firebase and backend user data
 */
export const useAuth = () => {
  return useAuthContext();
};

// Additional auth hooks for specific data
export const useAuthUser = () => {
  const { user } = useAuthContext();
  return user;
};

export const useAuthLoading = () => {
  const { loading } = useAuthContext();
  return loading;
};

export const useAuthError = () => {
  const { error, clearError } = useAuthContext();
  return { error, clearError };
};

// Additional specific hooks
export const useAuthToken = () => {
  const { user } = useAuthContext();
  return user?.token || null;
};

export const useBackendUser = () => {
  const { user } = useAuthContext();
  return user?.firestoreUser || null;
};

export const useFirestoreUser = () => {
  const { user } = useAuthContext();
  return user?.firestoreUser || null;
};

export const useFirebaseUser = () => {
  const { user } = useAuthContext();
  return user ? {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified
  } : null;
};

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated;
};