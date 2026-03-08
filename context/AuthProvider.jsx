'use client';

import React, { useContext, useState, useEffect, createContext } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminEmail } from '@lib/adminAuth.js';
import { auth, db, storage } from '@lib/firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { toast } from 'react-toastify';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const signup = async (email, password, name, number) => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(result.user, {
        displayName: name,
      });
      const userDocRef = doc(db, 'users', result.user.uid);
      await setDoc(userDocRef, {
        uid: result.user.uid,
        email,
        userName: name,
        phoneNumber: number,
        createdAt: Timestamp.now(),
      });
      localStorage.setItem('logged', 'true');
      toast.success('Registration successful!', {
        autoClose: 1500,
      });
      router.push('/dashboard/profile#about');
    } catch (error) {
      toast.error(error.message || 'Signup failed. Please try again.');
      console.error('Signup Error:', error);
      throw error;
    }
  };
  const signIn = async (email, password) => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('logged', 'true');
      toast.success('Login successful!', {
        autoClose: 1500,
      });
      router.push('/dashboard/profile#about');
    } catch (error) {
      toast.error('Login failed: ' + error.message);
      console.error('SignIn Error:', error);
      throw error;
    }
  };
  const googleSignIn = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const ref = doc(db, 'users', result.user.uid);
      const docSnap = await getDoc(ref);
      if (!docSnap.exists()) {
        await setDoc(ref, {
          uid: result.user.uid,
          email: result.user.email,
          userName: result.user.displayName,
          createdAt: Timestamp.now(),
        });
      }
      localStorage.setItem('logged', 'true');
      toast.success('Google sign-in successful!');
      router.push('/dashboard/profile#about');
    } catch (error) {
      toast.error('Google Sign-In failed: ' + error.message);
      console.error('Google Sign-In Error:', error);
    }
  };
  const adminSignIn = async (email, password) => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (!isAdminEmail(result?.user?.email)) {
        await signOut(auth);
        throw new Error('This account does not have admin access.');
      }
      toast.success('Admin login successful!', {
        autoClose: 1500,
      });
      return result.user;
    } catch (error) {
      toast.error(error.message || 'Admin login failed.');
      throw error;
    }
  };
  const adminGoogleSignIn = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (!isAdminEmail(result?.user?.email)) {
        await signOut(auth);
        throw new Error('This Google account does not have admin access.');
      }
      toast.success('Admin login successful!', {
        autoClose: 1500,
      });
      return result.user;
    } catch (error) {
      toast.error(error.message || 'Admin Google login failed.');
      throw error;
    }
  };
  const logout = async (redirectTo = '/admin/login') => {
    try {
      await signOut(auth);
      localStorage.removeItem('logged');
      toast.info('Logged out successfully');
      router.push(redirectTo);
    } catch (error) {
      toast.error('Logout failed: ' + error.message);
      console.error('Logout Error:', error);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    if (currentUser?.uid) {
      const ref = doc(db, 'users', currentUser.uid);
      return onSnapshot(ref, (docSnap) => {
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      });
    }
  }, [currentUser]);
  const uploadDataToFireStore = (data) => {
    const ref = doc(db, 'users', currentUser.uid);
    return setDoc(ref, data, {
      merge: true,
    });
  };
  const uploadDataToFireStoreInArray = async (data, type) => {
    const newData = {
      [type]: arrayUnion({
        ...data,
        id: Date.now(),
      }),
    };
    const ref = doc(db, 'users', currentUser.uid);
    await updateDoc(ref, newData);
    toast.success('Detail added successfully!', {
      autoClose: 1500,
    });
  };
  const uploadImage = async (file, fileExtension, setLoading) => {
    try {
      const fileRef = ref(
        storage,
        `profile_pictures/${currentUser.uid}.${fileExtension}`,
      );
      setLoading(true);
      await uploadBytes(fileRef, file, {
        contentType: `image/${fileExtension}`,
      });
      const photoURL = await getDownloadURL(fileRef);
      await updateProfile(currentUser, {
        photoURL,
      });
      await uploadDataToFireStore({
        photoURL,
      });
      toast.success('Profile photo updated!');
    } catch (error) {
      toast.error('Image upload failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  const uploadDocument = async (file, docname) => {
    try {
      const fileRef = ref(storage, `documents/${currentUser.uid}_${docname}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      const date = new Date();
      const newData = {
        documents: arrayUnion({
          id: Date.now(),
          title: docname,
          url,
          date: date.toDateString(),
        }),
      };
      const ref_doc = doc(db, 'users', currentUser.uid);
      await updateDoc(ref_doc, newData);
      toast.success(`${docname} uploaded successfully!`);
    } catch (error) {
      toast.error('Document upload failed: ' + error.message);
    }
  };
  const handleDocumentDelete = async (docId, field) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const dataArray = profileData?.[field];
    if (!dataArray) return;
    const updatedArray = dataArray.filter((item) => item.id !== docId);
    const ref = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(ref, {
        [field]: updatedArray,
      });
      toast.success('Item removed successfully!');
    } catch (error) {
      toast.error('Failed to remove item: ' + error.message);
    }
  };
  const updateFavorite = async (value) => {
    const favorites = profileData?.favorites || [];
    const exists = favorites.some((item) => item.id === value);
    if (exists) {
      return toast.warning('Already shortlisted');
    }
    if (favorites.length >= 10) {
      return toast.warning('You can shortlist up to 10 universities only');
    }
    const ref = doc(db, 'users', currentUser.uid);
    const newData = {
      favorites: arrayUnion({
        id: value,
      }),
    };
    try {
      await updateDoc(ref, newData);
      toast.success('Shortlisted successfully!');
    } catch (error) {
      toast.error('Shortlist failed: ' + error.message);
    }
  };
  const uploadFilterData = async (filterData) => {
    const ref = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(ref, {
        filterDetails: filterData,
      });
    } catch (error) {
      toast.error('Failed to upload filter data: ' + error.message);
    }
  };
  const value = {
    currentUser,
    profileData,
    authLoading,
    isAdminUser: isAdminEmail(currentUser?.email),
    signup,
    signIn,
    googleSignIn,
    adminSignIn,
    adminGoogleSignIn,
    logout,
    uploadDataToFireStore,
    uploadDataToFireStoreInArray,
    uploadImage,
    uploadDocument,
    handleDocumentDelete,
    updateFavorite,
    uploadFilterData,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
