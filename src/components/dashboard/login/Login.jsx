import React, { useState, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import advisors from "../../../assets/LoginImage1.jpg";
import StarRateIcon from "@mui/icons-material/StarRate";
import { useAuth } from "../../../context/AuthProvider";
import { Helmet } from "react-helmet";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const Login = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Login - Plan My Admission</title>
      </Helmet>
      <div className="max-w-7xl bg-light rounded-3xl mx-auto my-20 grid md:grid-cols-2 py-20 ">
        <div className="px-20 hidden md:block flex flex-row items-center my-5">
          <img
            src={advisors}
            alt="login image"
            width={"350px"}
            className=" my-2 self-center"
          />
          {/* <p className="text-main flex flex-nowrap text-sm">
            <StarRateIcon />
            <StarRateIcon />
            <StarRateIcon />
            <StarRateIcon />
            <StarRateIcon />
          </p> */}
          <article className="text-sm text-center">
            Login to your Planmyadmission account to access personalized recommendations, track your application progress, and connect with our team of experts. We understand that staying updated on your overseas education journey is crucial, and that's why we have designed our login page to provide you with a seamless and convenient experience.
            {/* <div className="pt-20">
              <cite className="font-bold">- Narendra Modi</cite>
              <p className="text-sm text-main">Stanford University, France</p>
            </div> */}
          </article>
        </div>
        <div className="flex flex-col items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </>
  );
};
const LoginForm = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { signIn, currentUser, googleSignIn } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleFirebaseError = (error) => {
    switch (error.code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/popup-closed-by-user":
        return "Google Sign-In was closed before completing.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection.";
      default:
        return "Login failed. Please try again.";
    }
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(handleFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      await googleSignIn();
      navigate("/dashboard");
    } catch (err) {
      setError(handleFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const triggerResetEmail = async () => {
    const email = emailRef.current.value;
    if (!validateEmail(email)) {
      setError("Enter a valid email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setError("Password reset email sent.");
    } catch (err) {
      setError(handleFirebaseError(err));
    }
  };

  return (
    <div className="md:w-[400px] sm:w-[360px] w-full bg-white md:px-10 px-5 py-5 rounded-2xl shadow-lg border border-main">
      <h1 className="text-4xl font-bold py-3">LOGIN</h1>
      {error && <p className="text-center bg-red-100 text-red-700 py-1 rounded-md">{error}</p>}
      <form onSubmit={handleSignIn}>
        <label className="block mb-2 text-sm font-medium">
          Email
          <input
            type="email"
            className="sm:text-sm rounded-sm block w-full p-2.5 bg-light outline-none mb-3 mt-1"
            placeholder="name@company.com"
            required
            ref={emailRef}
          />
        </label>
        <label className="block mb-2 text-sm font-medium relative">
          Password
          <input
            type={isPasswordVisible ? "text" : "password"}
            className="sm:text-sm rounded-sm block w-full p-2.5 bg-light outline-none mt-1"
            required
            ref={passwordRef}
            autoComplete="off"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-gray-600"
            onClick={togglePasswordVisibility}
          >
            {/* eye icon toggler here */}
          </button>
        </label>
        <button
          type="button"
          className="block text-sm pt-3 text-main hover:underline"
          onClick={triggerResetEmail}
        >
          Forgot password?
        </button>
        <button
          type="submit"
          disabled={loading}
          className="text-center bg-main py-2 w-full text-white hover:font-medium rounded-sm"
        >
          Login
        </button>
        <p className="py-2 text-sm">
          Not a user?
          <Link
            to="/register"
            className="text-main hover:underline px-1"
            onClick={() => localStorage.setItem("button", "reg")}
          >
            Register
          </Link>
        </p>
      </form>
      <p className="py-2 text-sm text-center font-bold text-lg">OR</p>
      <button
        className="text-center bg-transparent py-2 w-full text-main font-bold"
        disabled={loading}
        onClick={handleGoogleSignIn}
      >
        Sign In with Google
      </button>
    </div>
  );
};

export default Login;
