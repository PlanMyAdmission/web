import React, { useState, useEffect } from "react";

const JoinUsForm = ({className}) => {
  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check for recent submissions on component mount
  useEffect(() => {
    const checkRecentSubmission = () => {
      const submissions = JSON.parse(localStorage.getItem('joinUsSubmissions') || '[]');
      if (submissions.length > 0) {
        const lastSubmission = submissions[submissions.length - 1];
        const submissionTime = new Date(lastSubmission.timestamp);
        const now = new Date();
        const timeDiff = now - submissionTime;
        
        // Show success message if submission was within last 5 minutes
        if (timeDiff < 5 * 60 * 1000) {
          setIsSubmitted(true);
        }
      }
    };
    
    checkRecentSubmission();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    // Phone validation
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Clear any previous errors and set loading state
    setErrors({});
    setIsLoading(true);
    
    try {
      const data = {
        name,
        email,
        phone
      };
      
      await fetch("https://script.google.com/macros/s/AKfycbwCEA5uGWKRFepk0XokYeLK9NcLH1hMI813EkiJewLwiIS3ONkREAfA-1q7uKmMxhgK/exec", {
        method: "POST",
        body: JSON.stringify(data)
      });
      
      // Save to localStorage (separate key for JoinUs)
      const submissionData = {
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now(),
        source: 'joinUs' // To differentiate from Hero form
      };
      
      // Get existing submissions or initialize empty array
      const existingSubmissions = JSON.parse(localStorage.getItem('joinUsSubmissions') || '[]');
      existingSubmissions.push(submissionData);
      localStorage.setItem('joinUsSubmissions', JSON.stringify(existingSubmissions));
      
      // Clear form and show success message
      setname("");
      setemail("");
      setPhone("");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillAgain = () => {
    setIsSubmitted(false);
    setErrors({});
  };

  return (
    <div className={`py-8 bg-light rounded-lg mb-2 ${className}`}>
      {!isSubmitted ? (
        <>
          <form
            action=""
            className="flex flex-col justify-center items-center space-y-5"
          >
            <div className="w-[90%]">
              <input
                type="text"
                name=""
                id="name"
                value={name}
                placeholder="Name"
                className={`py-4 px-3 rounded-md w-full outline-none ${errors.name ? 'border border-red-500' : ''}`}
                onChange={(e) => setname(e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div className="w-[90%]">
              <input
                type="tel"
                name="phone"
                id="phone"
                value={phone}
                placeholder="Phone No. (e.g. +91 9876543210)"
                className={`py-4 px-3 rounded-md w-full outline-none ${errors.phone ? 'border border-red-500' : ''}`}
                pattern="^\+?\d{10,15}$"
                maxLength={15}
                autoComplete="tel"
                onChange={(e) => {
                  // Allow only numbers, spaces, and plus sign
                  const cleaned = e.target.value.replace(/[^\d+ ]/g, "");
                  setPhone(cleaned);
                }}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            
            <div className="w-[90%]">
              <input
                type="email"
                name=""
                id="email"
                value={email}
                placeholder="Email"
                className={`py-4 px-3 rounded-md w-full outline-none ${errors.email ? 'border border-red-500' : ''}`}
                onChange={(e) => setemail(e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
            
            <button
              type="submit"
              className={`bg-main px-4 py-4 rounded-md text-white w-[90%] transition-colors flex items-center justify-center ${
                isLoading 
                  ? 'opacity-75 cursor-not-allowed' 
                  : 'hover:bg-main/90'
              }`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Starting...
                </>
              ) : (
                'Start Your Overseas Journey'
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center text-center py-8">
          <div className="mb-4">
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-main mb-2">Thank You!</h3>
          <p className="text-gray-700 text-sm px-4 mb-4">
            Thanks, We are creating AI Platform personalized for you.
          </p>
          <button
            onClick={handleFillAgain}
            className="text-main hover:text-main/80 text-sm underline underline-offset-2 transition-colors cursor-pointer"
          >
            Fill Again
          </button>
        </div>
      )}
    </div>
  );
};

export default JoinUsForm;
