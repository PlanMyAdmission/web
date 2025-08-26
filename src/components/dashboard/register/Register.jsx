import React, { useState, useRef } from "react";
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
            alt="login"
            width={"390px"}
            className="mt-10"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <RegisterForm />
        </div>
      </div>
    </>
  );
};

const RegisterForm = () => {
  const location = useLocation();
  const data = location.state;

  const { signup } = useAuth();

  const [form, setForm] = useState({
    username: data?.name || "",
    email: data?.email || "",
    phone: data?.phone || "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [agree, setAgree] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) newErrors.username = "Full Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[6789]\d{9}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";

    if (!form.password) newErrors.password = "Password is required";
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm password";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!agree) newErrors.agree = "You must accept the terms";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      setLoading(true);
      setGeneralError("");
  
      await signup(form.email, form.password, form.username, form.phone);
  
      // Reset form
      setForm({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setAgree(false);
    } catch (error) {
      console.log(error)
      const newErrors = {};
  
      if (error.code === "auth/email-already-in-use") {
        newErrors.email = "Email is already registered";
      } else if (error.code === "auth/invalid-email") {
        newErrors.email = "Invalid email address";
      } else if (error.code === "auth/weak-password") {
        newErrors.password = "Password should be at least 6 characters";
      } else if (error.code === "auth/missing-password") {
        newErrors.password = "Password is required";
      } else {
        setGeneralError("Sign Up Unsuccessful. Please try again.");
      }
  
      setErrors((prev) => ({ ...prev, ...newErrors }));
    } finally {
      setLoading(false);
    }
  };
  

  const inputClass = "sm:text-sm rounded-sm block w-full p-2.5 bg-light outline-none mb-1";
  const labelClass = "block mb-2 text-sm font-medium";
  const errorClass = "text-xs text-red-500 mb-2";

  return (
    <div className="md:w-[400px] sm:w-[360px] w-full bg-white md:px-10 px-5 py-5 rounded-2xl shadow-lg border border-main">
      <h1 className="text-4xl font-bold py-3">Register with Us</h1>

      {generalError && (
        <p className="text-center bg-red-200 py-1 rounded-md">{generalError}</p>
      )}

      <form onSubmit={handleSubmit}>
        <label className={labelClass}>
          Full Name
          <input
            type="text"
            name="username"
            className={inputClass}
            value={form.username}
            onChange={handleChange}
          />
          {errors.username && <p className={errorClass}>{errors.username}</p>}
        </label>

        <label className={labelClass}>
          Email
          <input
            type="email"
            name="email"
            className={inputClass}
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </label>

        <label className={labelClass}>
          Phone Number
          <input
            type="tel"
            name="phone"
            className={inputClass}
            value={form.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </label>

        <label className="block mb-2 text-sm font-medium relative">
          Password
          <input
            type={isPasswordVisible ? "text" : "password"}
            name="password"
            className="sm:text-sm rounded-sm block w-full p-2.5 bg-light outline-none"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-gray-600"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <EyeSlashIcon />
            ) : (
              <EyeIcon />
            )}
          </button>
          {errors.password && <p className={errorClass}>{errors.password}</p>}
        </label>

        <label className={labelClass}>
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            className={inputClass}
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className={errorClass}>{errors.confirmPassword}</p>
          )}
        </label>

        <label className="flex items-start space-x-2 text-sm mt-2">
          <input
            type="checkbox"
            name="agree"
            checked={agree}
            onChange={() => {
              setAgree(!agree);
              setErrors((prev) => ({ ...prev, agree: "" }));
            }}
            className="mt-1"
          />
          <span>
            I agree to the <Link to='/terms&conditions' className="py-2 text-main font-bold">terms and conditions</Link> and the{" "}
            <Link to='/privacy-policy' className="py-2 text-main font-bold">disclaimer</Link>.
          </span>
        </label>
        {errors.agree && <p className={errorClass}>{errors.agree}</p>}

        <button
          disabled={loading}
          type="submit"
          className="text-center bg-main py-2 w-1/2 md:w-1/3 sm:w-1/3 text-white hover:font-medium rounded-sm mt-3"
        >
          Register
        </button>

        <p className="text-sm mt-1">
          Already a user?
          <a
            href="https://app.coursefinder.ai/student-platform/777d47d0/login"
            className="text-main hover:underline px-1"
            onClick={() => localStorage.setItem("button", "login")}
          >
            login
          </a>
        </p>
      </form>
    </div>
  );
};

// Icon components
const EyeIcon = () => (
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
);

const EyeSlashIcon = () => (
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
);


export default Register;
