import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth";
// import { toast } from "react-toastify"

import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { getDownloadURL, getStorage, uploadBytes, ref } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const db = getFirestore();
const storage = getStorage();

export const useAuth = () => {
  return useContext(AuthContext);
};
toast.configure()

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const [profileData, setProfileData] = useState(null);
  const [isSignedIn, setSignedIn] = useState(false)


  // signup

  const googleSignIn = async () => {
    const result = await setPersistence(auth, browserSessionPersistence).then(() => {
      const provider = new GoogleAuthProvider()
      return signInWithPopup(auth, provider)
    })

    const ref = doc(db, "users", result.user.uid);
    if (ref) {
      console.log("Data Entered")
      localStorage.setItem("logged", true)
      navigate("/dashboard/profile#about");
    }
    else {
      const docref = await setDoc(ref, {
        email: result.user.email,
        uid: result.user.uid,
        userName: result.user.displayName,
      })
        .then((re) => {
          console.log("Data Entered")
          localStorage.setItem("logged", true)
          navigate("/dashboard/profile#about");
        })
    }

  }

  const signup = async (email, password, name, number) => {
    const result = await setPersistence(auth, browserSessionPersistence).then(() => {
      return createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    })
    // console.log(result);
    const ref = doc(db, "users", result.user.uid);
    if (ref) {
      console.log("Data Entered")
      localStorage.setItem("logged", true)
      navigate("/dashboard/profile#about");
    }
    else {
      const docref = await setDoc(ref, {
        email: result.user.email,
        uid: result.user.uid,
        userName: name,
        phoneNumber: number,
      })
        .then((re) => {
          console.log("Data entered")
          localStorage.setItem("logged", true)
          alert("Registration successful")
          navigate("/dashboard/profile#about");
        })
    }
  };

  //sign In
  const signIn = async (email, password) => {
    const user = await setPersistence(auth, browserSessionPersistence).then(() => {
      return signInWithEmailAndPassword(auth, email, password);
    })
    console.log(user);
    if (user) {
      localStorage.setItem("logged", true)
      navigate("/dashboard/profile#about");
    }
    return user
  };

  //logout
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("user Logges out");
      localStorage.removeItem("logged")
    } catch (error) {
      console.log(error.message);
    }
    navigate("/login");
  };

  //get current_user

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      console.log(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    getCurrentUserData(currentUser?.uid, setProfileData);
  }, [currentUser]);

  const uploadDataToFireStore = (data) => {
    const newData = { ...data };
    console.log("uploading.....");

    // console.table(newData);

    const ref = doc(db, "users", currentUser.uid);
    setDoc(ref, newData, { merge: true });
  };

  const uploadDataToFireStoreInArray = async (data, type) => {
    const newData = {
      [type]: arrayUnion({
        ...data,
        id: Date.now(),
      }),
    };
    const ref = doc(db, "users", currentUser.uid);
    const docref = await updateDoc(ref, newData, { merge: true });
    toast.success("Detail Added", {
      className: "foo-bar",
      autoClose: 1500
    });
  };

  const getCurrentUserData = async (id, setProfileData) => {
    const docref = doc(db, "users", id);
    // const docSnap = await getDoc(docref);

    // if (docSnap.exists()) {
    //   console.log(docSnap.data());
    //   setProfileData(docSnap.data());
    // } else {
    //   console.log("No such document!");
    // }

    const unsub = onSnapshot(docref, (value) => {
      if (value.exists()) {
        console.log("Current Data : ", value.data());
        setProfileData(value.data());
      } else {
        console.log("No such document!");
      }
    });
  };
  const [uniqueFavID, setUniqueFavID] = useState([]);

  // const updateToLocalStorage = () => {
  //   getCurrentUserData(currentUser.uid)
  // }
  // useEffect(() => {

  // }, [profileData])
  // useEffect(() => {
  //   localStorage.setItem("favorites", uniqueFavID)
  //   console.log(uniqueFavID)
  //   // console.log(local)
  // }, [uniqueFavID])

  const uploadDocument = async (file, docname, currentUser) => {
    const fileRef = ref(storage, `documents/${currentUser.uid}_${docname}`);

    const snapshot = await uploadBytes(fileRef, file);
    const keyName = await getDownloadURL(fileRef);
    console.log(keyName);
    toast.success("File uploaded successfully!", {
      className: "foo-bar",
      autoClose: 1500
    });
    <ToastContainer style={{ zIndex: "1000" }} />;

    const ref_doc = doc(db, "users", currentUser.uid);
    const date = new Date();
    const day = date.toLocaleString("en-us", { weekday: "long" });

    const newData = {
      documents: arrayUnion({
        id: Date.now(),
        title: docname,
        url: keyName,
        date: date.getDate() + " " + day + " " + date.getFullYear(),
      }),
    };

    // lastUpdateda: date,
    const docref = await updateDoc(ref_doc, newData, { merge: true });
    // alert("Updated Profile");
    // updateProfile(currentUser, { keyName });
    toast.success(`added ${docname}`, {
      className: "foo-bar",
      autoClose: 1500
    })
  };

  const uploadImage = async (file, fileExtension, setLoading) => {
    const fileRef = ref(
      storage,
      `profile_pictures/${currentUser.uid}.${fileExtension}`
    );

    setLoading(true);
    const metadata = {
      contentType: `image/${fileExtension}`,
    };

    const snapshot = await uploadBytes(fileRef, file, metadata);
    const photoURL = await getDownloadURL(fileRef);
    const data = {
      photoURL: photoURL,
    };

    uploadDataToFireStore(data);

    updateProfile(currentUser, { photoURL });
    setLoading(false);

    toast.success("Detail Added", {
      className: "foo-bar",
      autoClose: 1500
    });
  };

  const handelDocumentDelete = (docId, feild) => {
    // console.log(id);

    if (window.confirm("Are you sure")) {
      const dataArray = profileData?.[feild];
      const objectIndex = dataArray.findIndex((obj) => obj.id === docId);
      const docref = doc(db, "users", currentUser.uid);
      if (objectIndex !== -1) {
        console.log(dataArray[objectIndex]);
        dataArray.splice(objectIndex, 1);

        updateDoc(docref, {
          [feild]: dataArray,
        })
          .then(() => {
            console.log("Document removed");
            toast.success("Removed Successfully", {
              className: "foo-bar",
              autoClose: 1000
            });
          })
          .catch((err) => {
            console.log("Error occured in removal", err);
          });
      } else {
        console.log("not working");
      }
    } else {
      console.log("okay");
    }
  };

  // const handleFavoriteRemove = (id) => {
  //   if (window.confirm("Are your sure?")) {
  //     const dataArray = profileData?.["favorites"];
  //     const objectIndex = dataArray.findIndex((obj) => obj.id === id)
  //     const docref = doc(db, "users", currentUser.uid);
  //     if (objectIndex !== -1) {
  //       console.log(dataArray[objectIndex]);
  //       dataArray.splice(objectIndex, 1)

  //       updateDoc(docref, {
  //         ["favorites"]: dataArray,
  //       })
  //         .then(() => {
  //         console.log(" Removed")
  //       })
  //     }
  //   }
  // }

  const updateFavorite = async (value) => {
    // let data = {
    //   favorites: arrayUnion({
    //     id: value,
    //   })
    // }
    const data = [value,]
    // const dataref = query(collection(db, "users"), where("id", "==", currentUser.uid));
    // const snapshot = await getDocs(dataref)
    // console.log(snapshot)
    // if (!snapshot.empty) {
    //   var favorite = snapshot.data.Favorite
    //   favorite = [...data]
    //   snapshot.ref.update({ "Favorite": favorite })
    //   alert("data entered")
    // }
    // console.log(data)
    const ref = doc(db, "users", currentUser.uid);
    // const snapshot = await getDocs(docref)
    // console.log(snapshot)
    // await updateDoc(docref, {
    //   ["favorites"]: [snapshot.doc.docs[0].favorites, ...data]
    // })
    const newData = {
      "favorites": arrayUnion({
        id: value,
      }),
    };
    const dataArray = profileData?.["favorites"];
    if (!dataArray) {
      const docref = await updateDoc(ref, newData, { merge: true });
      toast.success("Shortlisted successfully...", {
        className: "foo-bar",
        autoClose: 1000
      });
      return
    }
    const objectIndex = dataArray.findIndex((obj) => obj.id === value);
    console.log(dataArray.length)
    if (dataArray.length > 9 && objectIndex != -1) {
      toast.warning("Already Shortlisted", {
        className: "foo-bar",
        autoClose: 1000
      });
    }
    else if (dataArray.length > 9) {
      toast.warning("You can shortlist upto 10 universities only", {
        className: "foo-bar",
        autoClose: 1000
      });
    }
    else if (objectIndex == -1) {
      const docref = await updateDoc(ref, newData, { merge: true });
      toast.success("Shortlisted successfully...", {
        className: "foo-bar",
        autoClose: 1000
      });
    }
    else {
      console.log("already shortlisted")
      toast.warning("Already Shortlisted", {
        className: "foo-bar",
        autoClose: 1000
      });

    }



  }

  const uploadFilterData = async (filterData) => {
    let data = {
      filterDetails: filterData
    }
    // const data = [value,]
    // const dataref = query(collection(db, "users"), where("id", "==", currentUser.uid));
    // const snapshot = await getDocs(dataref)
    // console.log(snapshot)
    // if (!snapshot.empty) {
    //   var favorite = snapshot.data.Favorite
    //   favorite = [...data]
    //   snapshot.ref.update({ "Favorite": favorite })
    //   alert("data entered")
    // }
    // console.log(data)
    const ref = doc(db, "users", currentUser.uid);
    // const snapshot = await getDocs(docref)
    // console.log(snapshot)
    // await updateDoc(docref, {
    //   ["favorites"]: [snapshot.doc.docs[0].favorites, ...data]
    // })
    const docref = await updateDoc(ref, data);
  }

  const value = {
    currentUser,
    signup,
    signIn,
    logout,
    uploadDataToFireStore,
    uploadDataToFireStoreInArray,
    getCurrentUserData,
    profileData,
    uploadDocument,
    handelDocumentDelete,
    uploadImage,
    updateFavorite,
    uploadFilterData,
    googleSignIn,
    isSignedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
