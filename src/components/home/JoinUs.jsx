import React, { useState } from "react";
import joinUs from "../../assets/JoinUs.svg";
import Heading from "../../higherOrderComponents/Heading";
import { useNavigate } from "react-router-dom";
const JoinUs = () => {
  const navigate = useNavigate()
  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [phone, setPhone] = useState("")


  return (
    <div>
      <Heading heading="Join Us" />
      <div className="flex md:flex-row flex-col md:justify-evenly items-center sm:px-5">
        <div className="md:w-[500px] w-full px-5 items-center justify-center">
          <p className="font-medium ">
            Register with us to get started for your overseas study admission journey
          </p>
          <img
            src={joinUs}
            alt="joinUs"
            className="relative top-14 -z-10 overflow-hidden sm:left-20"
          />
        </div>
        <div className="md:w-[400px] w-[90%] py-8 bg-light rounded-lg mb-10 ">
          <form
            action=""
            className="flex flex-col justify-center items-center space-y-5"
          >
            <input
              type="text"
              name=""
              id="name"
              value={name}
              placeholder="Name"
              className="py-4 px-3  rounded-md w-[90%] outline-none"
              onChange={(e) => setname(e.target.value)}
            />
            <input
              type="email"
              name=""
              id="email"
              value={email}
              placeholder="Email"
              className="py-4 px-3 rounded-md w-[90%] outline-none"
              onChange={(e) => setemail(e.target.value)}
            />
             <input
              type="number"
              name=""
              id="phone"
              value={phone}
              placeholder="Phone No."
              className="py-4 px-3 rounded-md w-[90%] outline-none"
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              type="submit"
              className="bg-main px-4 py-4 rounded-md text-white w-[90%]"
              onClick={() => {
                if (localStorage.getItem("logged")) {
                  if (localStorage.getItem("logged") == "true") {
                    navigate("/dashboard/profile#about")
                  }
                }
                else {
                  window.location.href = "https://app.coursefinder.ai/student-platform/777d47d0/sign-up"
                }

              }}
            >
              Book Your Free Consultation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;
