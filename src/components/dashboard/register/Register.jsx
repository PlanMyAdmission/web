import React, { useState, useRef } from "react";
import StarRateIcon from "@mui/icons-material/StarRate";
import { Link, useLocation } from "react-router-dom";
import advisors from "../../../assets/LoginImage1.jpg";
// import advisors from "../../../assets/about-us/leader.svg";
import { useAuth } from "../../../context/AuthProvider";
import { Helmet } from "react-helmet";
import { useEffect } from "react";



const Register = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Register - Plan My Admission</title>
        <meta desc="This is the site for admission to various universities"></meta>
      </Helmet>
      <div className="max-w-7xl bg-light rounded-3xl mx-auto my-20 grid md:grid-cols-2 py-20 ">
        <div className="px-20 flex flex-row hidden md:block p-5">
          <cite className="font-bold text-2xl text-main">Planning to study abroad?<br />We've got you covered!</cite>
          <img
            src={advisors}
            alt="login image"
            width={"390px"}
            className="mt-10"
          />
          {/* <p className="text-main flex flex-nowrap text-sm">
            <StarRateIcon />
            <StarRateIcon />
            <StarRateIcon />
            <StarRateIcon />
            <StarRateIcon />
          </p> */}
          {/* <article className="text-sm">
            With plan my admission I found everything I need for applying in one
            single place. It saved me a lot of time from searching for
            information on several university websites. Big thanks to the entire
            PMA team for making the entire process so smooth and ease wit
            constant support.
            <div className="pt-20">
              <cite className="font-bold">- Narendra Modi</cite>
              <p className="text-sm text-main">Stanford University, France</p>
            </div>
          </article> */}
        </div>
        <div className="flex flex-col items-center justify-center">
          <RegisterForm />
        </div>
      </div>
    </>
  );
};

const RegisterForm = () => {
  const location = useLocation()
  const data = location.state;


  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const PhoneNumberRef = useRef();
  const { signup, currentUser } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [agree, setAgree] = useState(false)

  // useEffect(() => {
  //   console.log(data)
  // }, [data])
  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  async function handelSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setError("Passwords are not same");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await signup(
        emailRef.current.value,
        passwordRef.current.value,
        usernameRef.current.value,
        PhoneNumberRef.current.value
      );
      emailRef.current.value = "";
      passwordRef.current.value = "";
      usernameRef.current.value = "";
      confirmPasswordRef.current.value = "";
      PhoneNumberRef.current.value = "";
    } catch (error) {
      console.log(error)
      setError("Sign Up Unsuccessful")
    }
    setLoading(false);
  }

  let style =
    "sm:text-sm rounded-sm block w-full p-2.5 bg-light outline-none mb-3 mt-1";
  let check_for = "after:absolute after:text-main after:content-['*']";

  return (
    <div className="md:w-[400px] sm:w-[360px] w-full bg-white md:px-10 px-5 py-5 rounded-2xl shadow-lg border border-main">
      <h1 className="text-4xl font-bold py-3">Register with Us</h1>
      {error && (
        <p className="text-center bg-red-200 py-1 rounded-md">{error}</p>
      )}
      <form
        className=""
        onSubmit={handelSubmit}
      >

        <label for="email" className="block mb-2 text-sm font-medium">
          Full Name

          <input type="text" className={style} defaultValue={data?.name} required ref={usernameRef}></input></label>
        <label for="email" className="block mb-2 text-sm font-medium">
          Email

          <input type="email" className={style} defaultValue={data?.email} requried ref={emailRef}></input></label>
        <label for="email" className="block mb-2 text-sm font-medium">
          Phone Number

          <input
            type="tel"
            className={style}
            requried
            pattern="^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$"
            ref={PhoneNumberRef}
            defaultValue={data?.phone}
          ></input></label>

        <label for="email" className="block mb-2 text-sm font-medium relative">
          Password
          <input
            type={isPasswordVisible ? "text" : "password"}
            name="password"
            className="sm:text-sm rounded-sm block w-full p-2.5 bg-light outline-none"
            required
            ref={passwordRef}
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

        <label for="email" className="block my-2 text-sm font-medium">
          Confirm Password


          <input
            type="password"
            name="password"
            className="sm:text-sm rounded-sm block w-full p-2.5 bg-light outline-none"
            required
            ref={confirmPasswordRef}
          /></label>

          <label className="flex items-start space-x-2 text-sm">
            <input
              type="checkbox"
              name="agree"
              checked={agree}
              onChange={(e) => setAgree(!agree) }
              className="mt-1"
              required
            />
            <span>
              I agree to the <strong>terms and conditions</strong> and the{" "}
              <strong>disclaimer</strong>.
            </span>
          </label>

        <button
          disabled={loading}
          type="submit"
          className="text-center bg-main py-2 w-1/2 md:w-1/3 sm:w-1/3 text-white hover:font-medium rounded-sm mt-3"
        >
          Register
        </button>
        <p className=" text-sm mt-1">
          Already a user ?
          <Link to="/login" className="text-main hover:underline px-1" onClick={() => {
            localStorage.setItem("button", "login")
          }}>
            login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
