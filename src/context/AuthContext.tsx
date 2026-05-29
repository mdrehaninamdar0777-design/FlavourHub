"use client";
// ==========================================
// Auth Context - Firebase Authentication
// Now also manages httpOnly session cookie
// for Edge middleware route protection
// ==========================================
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import axios from "axios";
import toast from "react-hot-toast";

interface UserProfile {
  _id: string;
  uid: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  image?: string;
  phone?: string;
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getToken: () => Promise<string | null>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Sync user to MongoDB + set Edge session cookie ──────────────────────────
  const syncUser = async (user: FirebaseUser, extraData?: { name?: string }) => {
    try {
      const token = await user.getIdToken();

      // 1. Sync user record to MongoDB (upsert)
      const { data } = await axios.post(
        "/api/users/sync",
        { name: extraData?.name || user.displayName, image: user.photoURL },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) setUserProfile(data.data);

      // 2. Create httpOnly session cookie for Edge middleware
      //    This tells the middleware the user's role without needing Firebase Admin at the edge
      await axios.post("/api/auth/session", { token });

    } catch (err) {
      console.error("Failed to sync user:", err);
    }
  };

  // ── Listen to Firebase auth state changes ───────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await syncUser(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Token helper for API calls ───────────────────────────────────────────────
  const getToken = async (): Promise<string | null> => {
    return firebaseUser ? firebaseUser.getIdToken() : null;
  };

  // ── Auth actions ─────────────────────────────────────────────────────────────
  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Welcome back!");
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    await syncUser(user, { name });
    toast.success("Account created successfully!");
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
    // onAuthStateChanged fires automatically and calls syncUser
    toast.success("Welcome!");
  };

  const logout = async () => {
    // 1. Clear the httpOnly session cookie
    await axios.delete("/api/auth/session");
    // 2. Sign out of Firebase
    await signOut(auth);
    setUserProfile(null);
    toast.success("Logged out successfully");
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
    toast.success("Password reset email sent!");
  };

  const refreshProfile = async () => {
    if (firebaseUser) await syncUser(firebaseUser);
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        loading,
        isAdmin: userProfile?.role === "admin",
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        resetPassword,
        getToken,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
