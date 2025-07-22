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
    email: "",
    phoneNumber: "",
    gender: "",
    date_of_Birth: "",
    nationality: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
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

  const getLocation = async () => {
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
        email: currentUser?.email || "",
        phoneNumber: profileData?.phoneNumber || "",
        gender: profileData?.gender || "",
        date_of_Birth: profileData?.date_of_Birth || "",
        nationality: profileData?.nationality || "",
        address: profileData?.address || "",
        country: profileData?.country || "",
        state: profileData?.state || "",
        city: profileData?.city || "",
        zipCode: profileData?.zipCode || "",
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

  const fields = [
    ["firstName", "First Name"],
    ["lastName", "Last Name"],
    ["email", "Email Address", true],
    ["phoneNumber", "Phone Number"],
    ["gender", "Gender"],
    ["date_of_Birth", "Date of Birth"],
    ["nationality", "Nationality"],
    ["address", "Address", false, "textarea"],
  ];

  return (
    <div className="my-5 mx-4 sm:mx-auto md:mt-0">
      <form onSubmit={handleSubmit}>
        <div className="overflow-hidden max-w-5xl md:mx-auto mx-2">
          <div className="sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              {fields.map(([name, label, disabled, type = "text"]) => (
                <div
                  key={name}
                  className={`col-span-6 sm:col-span-${type === "textarea" ? "6" : "3"}`}
                >
                  <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label} {disabled ? "" : <span className="text-main">*</span>}
                  </label>
                  {type === "textarea" ? (
                    <textarea
                      name={name}
                      value={AboutData[name]}
                      onChange={handleChange}
                      rows="4"
                      disabled={disabled}
                      required={!disabled}
                      className="mt-1 block w-full rounded-md py-1.5 bg-light px-3 border border-gray-300 shadow-sm focus:ring-2 focus:ring-main focus:outline-none"
                    />
                  ) : (
                    <input
                      type={name === "date_of_Birth" ? "date" : type}
                      name={name}
                      value={AboutData[name]}
                      onChange={handleChange}
                      disabled={disabled}
                      required={!disabled}
                      max={name === "date_of_Birth" ? new Date().toISOString().split("T")[0] : undefined}
                      className="mt-1 block w-full rounded-md py-1.5 px-3 bg-light border border-gray-300 shadow-sm focus:ring-2 focus:ring-main focus:outline-none"
                    />
                  )}
                </div>
              ))}

              {/* Country */}
              <div className="md:col-span-2 col-span-6">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country <span className="text-main">*</span>
                </label>
                <select
                  name="country"
                  value={AboutData.country}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md py-1.5 px-3 bg-light border border-gray-300 shadow-sm focus:ring-2 focus:ring-main focus:outline-none"
                >
                  <option value="">Choose</option>
                  {loc.map((l) => (
                    <option key={l.id} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div className="md:col-span-2 col-span-6">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State <span className="text-main">*</span>
                </label>
                <select
                  name="state"
                  value={AboutData.state}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md py-1.5 px-3 bg-light border border-gray-300 shadow-sm focus:ring-2 focus:ring-main focus:outline-none"
                >
                  <option value="">Choose</option>
                  {state.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="md:col-span-1 col-span-6">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City <span className="text-main">*</span>
                </label>
                <select
                  name="city"
                  value={AboutData.city}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md py-1.5 px-3 bg-light border border-gray-300 shadow-sm focus:ring-2 focus:ring-main focus:outline-none"
                >
                  <option value="">Choose</option>
                  {city.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Zip Code */}
              <div className="md:col-span-1 col-span-6">
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  Zip Code <span className="text-main">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={AboutData.zipCode}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md py-1.5 px-3 bg-light border border-gray-300 shadow-sm focus:ring-2 focus:ring-main focus:outline-none"
                />
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
