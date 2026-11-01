import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password?: string, displayName?: string) => Promise<void>;
  loginWithDemo: (email: string, displayName?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('plannoai_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Fetch or create profile in Firestore
        const profileRef = doc(db, 'profiles', fbUser.uid);
        try {
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            const data = profileSnap.data() as UserProfile;
            setUser(data);
            localStorage.setItem('plannoai_user', JSON.stringify(data));
          } else {
            const newProfile: UserProfile = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
              email: fbUser.email || '',
              avatarUrl: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
              role: 'Event Organizer',
              preferredCurrency: 'INR',
            };
            await setDoc(profileRef, newProfile);
            setUser(newProfile);
            localStorage.setItem('plannoai_user', JSON.stringify(newProfile));
          }
        } catch (err) {
          console.warn('Firestore profile sync error:', err);
          const fbProfile: UserProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            email: fbUser.email || '',
            avatarUrl: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
            role: 'Event Director',
            preferredCurrency: 'INR',
          };
          setUser(fbProfile);
          localStorage.setItem('plannoai_user', JSON.stringify(fbProfile));
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const profileRef = doc(db, 'profiles', fbUser.uid);
      let loggedProfile: UserProfile;

      try {
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          loggedProfile = profileSnap.data() as UserProfile;
        } else {
          loggedProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            email: fbUser.email || '',
            avatarUrl: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
            role: 'Event Director',
            preferredCurrency: 'INR',
          };
          await setDoc(profileRef, loggedProfile);
        }
      } catch {
        loggedProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || '',
          avatarUrl: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
          role: 'Event Director',
          preferredCurrency: 'INR',
        };
      }

      setUser(loggedProfile);
      localStorage.setItem('plannoai_user', JSON.stringify(loggedProfile));
    } catch (error: any) {
      console.error('Google Auth Failed:', error);
      setIsLoading(false);
      throw new Error(error.message || 'Google sign-in failed or popup was closed');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password?: string, displayName?: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));

    const cleanEmail = email.trim().toLowerCase();
    const formattedName = displayName?.trim() || cleanEmail.split('@')[0].replace(/[._-]/g, ' ').toUpperCase();

    const profile: UserProfile = {
      id: 'usr-' + Math.abs(cleanEmail.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)),
      name: formattedName,
      email: cleanEmail,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
      role: 'Event Director',
      preferredCurrency: 'INR',
    };

    setUser(profile);
    localStorage.setItem('plannoai_user', JSON.stringify(profile));

    if (firebaseUser) {
      const profileRef = doc(db, 'profiles', firebaseUser.uid);
      setDoc(profileRef, profile, { merge: true }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `profiles/${firebaseUser.uid}`)
      );
    }

    setIsLoading(false);
  };

  const loginWithDemo = async (email: string, displayName?: string) => {
    await loginWithEmail(email, undefined, displayName || 'Guest Organizer');
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('plannoai_user');
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('plannoai_user', JSON.stringify(updated));

    if (firebaseUser) {
      const profileRef = doc(db, 'profiles', firebaseUser.uid);
      try {
        await setDoc(profileRef, updated, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `profiles/${firebaseUser.uid}`);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        loginWithDemo,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
