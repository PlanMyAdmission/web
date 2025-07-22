import React, { useContext, useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  db,
  storage
} from "../firebase"; // assumes you export auth, db, and storage from your firebase.js
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
} from "firebase/auth";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  arrayUnion,
  Timestamp
} from "firebase/firestore";
import {
  uploadBytes,
  getDownloadURL,
  ref
} from "firebase/storage";
import { toast } from "react-toastify";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // =============================
  // Auth: Signup with Email
  // =============================
  const signup = async (email, password, name, number) => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(result.user, { displayName: name });

      const userDocRef = doc(db, "users", result.user.uid);
      await setDoc(userDocRef, {
        uid: result.user.uid,
        email,
        userName: name,
        phoneNumber: number,
        createdAt: Timestamp.now()
      });

      localStorage.setItem("logged", "true");
      toast.success("Registration successful!", { autoClose: 1500 });
      navigate("/dashboard/profile#about");
    } catch (error) {
      toast.error(error.message || "Signup failed. Please try again.");
      console.error("Signup Error:", error);
      throw error
    }
  };

  // =============================
  // Auth: Sign in with Email
  // =============================
  const signIn = async (email, password) => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);

      localStorage.setItem("logged", "true");
      toast.success("Login successful!", { autoClose: 1500 });
      navigate("/dashboard/profile#about");
    } catch (error) {
      toast.error("Login failed: " + error.message);  
      console.error("SignIn Error:", error);
      throw error
    }
  };

  // =============================
  // Auth: Google Sign-In
  // =============================
  const googleSignIn = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const ref = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(ref);

      if (!docSnap.exists()) {
        await setDoc(ref, {
          uid: result.user.uid,
          email: result.user.email,
          userName: result.user.displayName,
          createdAt: Timestamp.now()
        });
      }

      localStorage.setItem("logged", "true");
      toast.success("Google sign-in successful!");
      navigate("/dashboard/profile#about");
    } catch (error) {
      toast.error("Google Sign-In failed: " + error.message);
      console.error("Google Sign-In Error:", error);
    }
  };

  // =============================
  // Logout
  // =============================
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("logged");
      toast.info("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed: " + error.message);
      console.error("Logout Error:", error);
    }
  };

  // =============================
  // Monitor Auth Changes
  // =============================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser?.uid) {
      const ref = doc(db, "users", currentUser.uid);
      return onSnapshot(ref, (docSnap) => {
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      });
    }
  }, [currentUser]);

  // =============================
  // Firestore Helpers
  // =============================
  const uploadDataToFireStore = (data) => {
    const ref = doc(db, "users", currentUser.uid);
    return setDoc(ref, data, { merge: true });
  };

  const uploadDataToFireStoreInArray = async (data, type) => {
    const newData = {
      [type]: arrayUnion({ ...data, id: Date.now() }),
    };
    const ref = doc(db, "users", currentUser.uid);
    await updateDoc(ref, newData);
    toast.success("Detail added successfully!", { autoClose: 1500 });
  };

  // =============================
  // Upload Profile Image
  // =============================
  const uploadImage = async (file, fileExtension, setLoading) => {
    try {
      const fileRef = ref(storage, `profile_pictures/${currentUser.uid}.${fileExtension}`);
      setLoading(true);
      await uploadBytes(fileRef, file, {
        contentType: `image/${fileExtension}`,
      });
      const photoURL = await getDownloadURL(fileRef);

      await updateProfile(currentUser, { photoURL });
      await uploadDataToFireStore({ photoURL });

      toast.success("Profile photo updated!");
    } catch (error) {
      toast.error("Image upload failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Upload Document
  // =============================
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

      const ref_doc = doc(db, "users", currentUser.uid);
      await updateDoc(ref_doc, newData);
      toast.success(`${docname} uploaded successfully!`);
    } catch (error) {
      toast.error("Document upload failed: " + error.message);
    }
  };

  // =============================
  // Delete Document or Array Field Item
  // =============================
  const handleDocumentDelete = async (docId, field) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    const dataArray = profileData?.[field];
    if (!dataArray) return;

    const updatedArray = dataArray.filter((item) => item.id !== docId);
    const ref = doc(db, "users", currentUser.uid);

    try {
      await updateDoc(ref, { [field]: updatedArray });
      toast.success("Item removed successfully!");
    } catch (error) {
      toast.error("Failed to remove item: " + error.message);
    }
  };

  // =============================
  // Favorites Management
  // =============================
  const updateFavorite = async (value) => {
    const favorites = profileData?.favorites || [];
    const exists = favorites.some((item) => item.id === value);

    if (exists) {
      return toast.warning("Already shortlisted");
    }

    if (favorites.length >= 10) {
      return toast.warning("You can shortlist up to 10 universities only");
    }

    const ref = doc(db, "users", currentUser.uid);
    const newData = {
      favorites: arrayUnion({ id: value }),
    };

    try {
      await updateDoc(ref, newData);
      toast.success("Shortlisted successfully!");
    } catch (error) {
      toast.error("Shortlist failed: " + error.message);
    }
  };

  // =============================
  // Upload Filter Data
  // =============================
  const uploadFilterData = async (filterData) => {
    const ref = doc(db, "users", currentUser.uid);
    try {
      await updateDoc(ref, { filterDetails: filterData });
    } catch (error) {
      toast.error("Failed to upload filter data: " + error.message);
    }
  };

  // =============================
  // Final Context Value
  // =============================
  const value = {
    currentUser,
    profileData,
    signup,
    signIn,
    googleSignIn,
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
