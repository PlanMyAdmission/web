'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ADMIN_USERS_COLLECTION,
  canAccessAdminWorkspace,
  isGoogleUser,
  normalizeAdminRecord,
} from '@lib/adminAuth.js';
import { auth, db } from '@lib/firebase.js';
import { reportError } from '@lib/logger.js';
import {
  GoogleAuthProvider,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [adminRecord, setAdminRecord] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);

  const adminGoogleSignIn = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      const result = await signInWithPopup(auth, provider);
      if (!isGoogleUser(result?.user)) {
        await signOut(auth);
        throw new Error('Use a Google account to access the admin dashboard.');
      }

      const adminRef = doc(db, ADMIN_USERS_COLLECTION, result.user.uid);
      const adminSnap = await getDoc(adminRef);
      const nextAdminRecord = normalizeAdminRecord(adminSnap.exists() ? adminSnap.data() : null);

      if (!canAccessAdminWorkspace(result.user, nextAdminRecord)) {
        await signOut(auth);
        throw new Error('This Google account does not have an active admin record.');
      }

      toast.success('Admin login successful!', {
        autoClose: 1500,
      });
      return result.user;
    } catch (error) {
      toast.error(error?.message || 'Admin Google login failed.');
      throw error;
    }
  };

  const logout = async (redirectTo = '/') => {
    try {
      await signOut(auth);
      toast.info('Logged out successfully');
      router.push(redirectTo);
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
      reportError('Logout error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (!user) {
        setAdminRecord(null);
        setAdminLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser?.uid || !isGoogleUser(currentUser)) {
      setAdminRecord(null);
      setAdminLoading(false);
      return undefined;
    }

    setAdminLoading(true);
    const adminRef = doc(db, ADMIN_USERS_COLLECTION, currentUser.uid);

    return onSnapshot(
      adminRef,
      (docSnap) => {
        setAdminRecord(normalizeAdminRecord(docSnap.exists() ? docSnap.data() : null));
        setAdminLoading(false);
      },
      () => {
        setAdminRecord(null);
        setAdminLoading(false);
      },
    );
  }, [currentUser]);

  const value = {
    currentUser,
    adminRecord,
    authLoading,
    adminLoading,
    isAdminUser: canAccessAdminWorkspace(currentUser, adminRecord),
    adminGoogleSignIn,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
