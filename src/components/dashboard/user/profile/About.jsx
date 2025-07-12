import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/AuthProvider";
import {
  getFirestore,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import app from "../../../../firebase";

const About = () => {
  const { currentUser, uploadDataToFireStore, profileData } = useAuth();
  const navigate = useNavigate();
  const db = getFirestore(app);

  const [loading, setLoading] = useState(false);
  const [loc, setLoc] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);

  const [AboutData, setAboutData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: "",
    date_of_Birth: "",
    nationality: "",
    address: "",
    city: "jaipur",
    country: "",
    zipCode: "",
    state: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...AboutData, [name]: value };
    setAboutData(updated);

    const allKeysHaveValues = Object.keys(updated).every(
      (key) => updated[key] !== "" && updated[key] !== null && updated[key] !== undefined
    );
    setLoading(allKeysHaveValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await uploadDataToFireStore(AboutData);
      toast.success("Data uploaded Successfully", { autoClose: 1500 });
      setLoading(false);
    } catch (error) {
      toast.error(error.code || "Upload failed", { autoClose: 1500 });
    }
  };

  const  getLocation = async () => {
    const dataref = query(collection(db, "location"));
    const docSnap = await getDocs(dataref);
    const locations = docSnap.docs.map((doc) => doc.data());
    setLoc(locations);
  };

  useEffect(() => {
    getLocation();
    if (localStorage.getItem("logged") === "false") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (profileData) {
      setAboutData({
        firstName: profileData?.firstName || "",
        lastName: profileData?.lastName || "",
        phoneNumber: profileData?.phoneNumber || "",
        gender: profileData?.gender || "",
        date_of_Birth: profileData?.date_of_Birth || "",
        nationality: profileData?.nationality || "",
        address: profileData?.address || "",
        city: profileData?.city || "jaipur",
        country: profileData?.country || "",
        zipCode: profileData?.zipCode || "",
        state: profileData?.state || "",
      });
    }
  }, [profileData]);

  useEffect(() => {
    if (AboutData.country && loc.length > 0) {
      const foundCountry = loc.find((item) => item.name === AboutData.country);
      setState(foundCountry?.states || []);
    }
  }, [AboutData.country, loc]);

  useEffect(() => {
    if (AboutData.state && state.length > 0) {
      const foundState = state.find((item) => item.name === AboutData.state);
      setCity(foundState?.cities || []);
    }
  }, [AboutData.state, state]);

  return (
    <div className="my-5 mx-4 sm:mx-auto md:mt-0">
      <form onSubmit={handleSubmit}>
        <div className="overflow-hidden max-w-5xl md:mx-auto mx-2">
          <div className="sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              {/* First Name */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name <span className="text-main">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={AboutData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-sm py-1 border-gray-300 bg-light outline-none px-1.5"
                />
              </div>

              {/* Last Name */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name <span className="text-main">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={AboutData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-sm py-1 border-gray-300 bg-light outline-none px-1.5"
                />
              </div>

              {/* Email */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={currentUser?.email || ""}
                  disabled
                  className="mt-1 block w-full rounded-sm py-1 bg-light outline-none px-1.5"
                />
              </div>

              {/* Phone Number */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-main">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={AboutData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-sm py-1 border-gray-300 bg-light outline-none px-1.5"
                />
              </div>

              {/* Gender */}
              <div className="col-span-6 sm:col-span-2">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender <span className="text-main">*</span>
                </label>
                <select
                  name="gender"
                  value={AboutData.gender}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-sm bg-light py-1.5 px-3"
                >
                  <option value="">Choose</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Others</option>
                </select>
              </div>

              {/* DOB */}
              <div className="col-span-6 sm:col-span-2">
                <label htmlFor="date_of_Birth" className="block text-sm font-medium text-gray-700">
                  Date of Birth <span className="text-main">*</span>
                </label>
                <input
                  type="date"
                  name="date_of_Birth"
                  value={AboutData.date_of_Birth}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-sm py-1 bg-light px-3"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Nationality */}
              <div className="col-span-6 sm:col-span-2">
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                  Nationality <span className="text-main">*</span>
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={AboutData.nationality}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-sm py-1 bg-light px-3"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-3 col-span-full">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address <span className="text-main">*</span>
                </label>
                <textarea
                  name="address"
                  value={AboutData.address}
                  onChange={handleChange}
                  rows="5"
                  className="bg-light mt-1 py-1 px-3 [resize:none] w-full outline-none"
                  required
                ></textarea>
              </div>

              {/* City */}
              <div className="md:col-span-1">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City <span className="text-main">*</span>
                </label>
                <select
                  name="city"
                  value={AboutData.city}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-sm bg-light py-1 px-3"
                >
                  <option value="">Choose</option>
                  {city.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Country */}
              <div className="md:ml-2 md:col-span-1">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country <span className="text-main">*</span>
                </label>
                <select
                  name="country"
                  value={AboutData.country}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-sm bg-light py-1 px-3"
                >
                  <option value="">Choose</option>
                  {loc.map((l) => (
                    <option key={l.id} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>

              {/* Zip Code */}
              <div className="md:col-span-1">
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  Zip Code <span className="text-main">*</span>
                </label>
                <input
                  type="number"
                  name="zipCode"
                  value={AboutData.zipCode}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-sm py-1 bg-light outline-none px-1.5"
                />
              </div>

              {/* State */}
              <div className="md:ml-2 md:col-span-1">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State <span className="text-main">*</span>
                </label>
                <select
                  name="state"
                  value={AboutData.state}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-sm bg-light py-1 px-3"
                >
                  <option value="">Choose</option>
                  {state.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 text-right sm:px-6">
            <button
              type="submit"
              disabled={!loading}
              className={`inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium focus:outline-none ${
                loading
                  ? "bg-main text-white hover:bg-white hover:outline outline-main hover:text-main transition duration-200"
                  : "bg-light text-black"
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default About;
