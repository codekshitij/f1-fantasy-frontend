import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../../firebase';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Firebase Auth Service
export const firebaseAuthService = {
  // Auth state listener
  onAuthStateChanged: (callback) => onAuthStateChanged(auth, callback),

  // Sign in with email and password
  signInWithEmail: async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Email sign-in successful:', result.user.email);
      return result.user;
    } catch (error) {
      console.error('❌ Email sign-in error:', error);
      throw error;
    }
  },

  // Sign up with email and password
  signUpWithEmail: async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Email sign-up successful:', result.user.email);
      return result.user;
    } catch (error) {
      console.error('❌ Email sign-up error:', error);
      throw error;
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Google sign-in successful:', result.user.email);
      return result.user;
    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      console.log('✅ Sign-out successful');
    } catch (error) {
      console.error('❌ Sign-out error:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: () => auth.currentUser
};

// Firestore Service for user data
export const firestoreService = {
  // Create user document
  createUser: async (firebaseUser, additionalData = {}) => {
    if (!firebaseUser) return null;

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const userData = {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          profileCompleted: false,
          
          // F1 Fantasy specific fields
          fantasyTeams: [],
          totalPoints: 0,
          leagues: [],
          predictions: {},
          
          // Timestamps
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          
          ...additionalData
        };

        await setDoc(userRef, userData);
        console.log('✅ User document created:', firebaseUser.email);
        return userData;
      } else {
        // Update last login time
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp()
        });
        console.log('✅ User login time updated:', firebaseUser.email);
        return userSnap.data();
      }
    } catch (error) {
      console.error('❌ Error creating/updating user:', error);
      // Return basic user data even if Firestore fails
      return {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        profileCompleted: false,
        fantasyTeams: [],
        totalPoints: 0,
        leagues: [],
        predictions: {},
        error: 'Firestore connection failed'
      };
    }
  },

  // Get user document
  getUser: async (userId) => {
    if (!userId) return null;

    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        console.log('✅ User document retrieved:', userId);
        return userSnap.data();
      } else {
        console.log('ℹ️ No user document found:', userId);
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  },

  // Update user document
  updateUser: async (userId, data) => {
    if (!userId) return false;

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      console.log('✅ User document updated:', userId);
      return true;
    } catch (error) {
      console.error('❌ Error updating user:', error);
      return false;
    }
  },

  // Get user's fantasy teams
  getUserTeams: async (userId) => {
    if (!userId) return [];

    try {
      const teamsQuery = query(
        collection(db, 'fantasyTeams'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(teamsQuery);
      const teams = [];
      
      querySnapshot.forEach((doc) => {
        teams.push({ id: doc.id, ...doc.data() });
      });

      console.log('✅ User teams retrieved:', teams.length);
      return teams;
    } catch (error) {
      console.error('❌ Error getting user teams:', error);
      return [];
    }
  }
};