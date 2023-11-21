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
        <title>Login - Plan my Admission</title>
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
  const navigate = useNavigate()
  const { signIn, currentUser, googleSignIn } = useAuth();
  // const [visible, setVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  const [error, setError] = useState("");
  const [loading, setLoding] = useState(false);

  const handelSignIn = async (event) => {
    event.preventDefault();

    try {
      setLoding(true);
      setError("");
      await signIn(emailRef.current.value, passwordRef.current.value);
    } catch (error) {
      console.log("error at sign in")
      setError("Invalid credentials");
    }
    setLoding(false);
  };
  const handleGoogleSignIn = async (event) => {
    event.preventDefault()

    try {
      setLoding(true)
      setError("")
      await googleSignIn()
    }
    catch (error) {
      console.log(error)
      setError("Sign In Unsuccessful")
    }
    setLoding(false);
  }
  const auth = getAuth()
  const triggerResetEmail = async () => {
    if (emailRef.current.value) {
      try {
        await sendPasswordResetEmail(auth, emailRef.current.value)
        setError("Email sent for password reset")
      }
      catch (error) {
        setError(error.message)
      }
    }
    else {
      setError("Enter a valid email")
    }

  }

  return (
    <div className="md:w-[400px] sm:w-[360px] w-full bg-white md:px-10 px-5 py-5 rounded-2xl shadow-lg border border-main">
      <h1 className="text-4xl font-bold py-3">LOGIN</h1>
      {error && (
        <p className="text-center bg-red-200 py-1 rounded-md">{error}</p>
      )}
      <form action="" onSubmit={handelSignIn}>
        <div>
          <label for="email" className="block mb-2 text-sm font-medium">
            Email
            <input
              type="email"
              name="email"
              id="email"
              className="sm:text-sm rounded-sm block w-full p-2.5 bg-light outline-none mb-3 mt-1"
              placeholder="name@company.com"
              required={true}
              ref={emailRef}
            />
          </label>

          <label for="email" className="block mb-2 text-sm font-medium relative">
            Password
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              id="password"
              className="sm:text-sm rounded-sm block w-full p-2.5 bg-light outline-none mt-1"
              required={true}
              ref={passwordRef}
              autoComplete="off"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-gray-600"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </label>
          <Link
            for="email"
            className="block mb-2 text-sm pt-3 text-main hover:underline "
            onClick={triggerResetEmail}
          >
            Forgot password?
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="text-center bg-main py-2 w-full text-white hover:font-medium rounded-sm"
          >
            Login
          </button>
          <p className="py-2 text-sm">
            Not a user ?
            <Link to="/register" className="text-main hover:underline px-1" onClick={() => {
              localStorage.setItem("button", "reg")
            }}>
              Register
            </Link>
          </p>
        </div>
      </form>
      <p className="py-2 text-sm text-center font-bold text-lg">
        OR
      </p>
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
