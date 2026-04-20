import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, User, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { googleProvider } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserData {
  uid: string;
  email: string | null;
  isAdmin: boolean;
  birthday?: string;
  phoneVerified?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch or create user document
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            // Because rules require specific shape, let's create a minimal user doc 
            // matching the user's provided validation rules:
            // return data.uid is string && data.uid == request.auth.uid && data.birthday is string && data.phoneVerified is bool;
            const newUserData: UserData = {
              uid: currentUser.uid,
              email: currentUser.email,
              isAdmin: false, // by default not an admin
              birthday: '1900-01-01',
              phoneVerified: false,
              createdAt: new Date().toISOString()
            };
            await setDoc(userRef, newUserData);
            setUserData(newUserData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          if (error instanceof Error && error.message.includes('the client is offline')) {
            console.error("Please check your Firebase configuration.");
          }
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      alert('Ошибка авторизации. Проверьте консоль.');
    }
  };

  const signOut = async () => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error('Error signing out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
