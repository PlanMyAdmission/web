import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthProvider";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  getFirestore,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import app from "../../../../firebase";

const Experience = () => {
  const db = getFirestore(app);
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  const [countryList, setCountryList] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [experiences, setExperiences] = useState([
    {
      company: "",
      city: "",
      country: "",
      title: "",
      employement_type: "",
      industry: "",
      start_date: "",
      end_date: "",
    },
  ]);
  const [showAddButton, setShowAddButton] = useState(true);

  const {
    currentUser,
    uploadDataToFireStoreInArray,
    profileData,
    handelDocumentDelete,
  } = useAuth();

  useEffect(() => {
    const fetchDisciplines = async () => {
      const dataRef = query(collection(db, "disciplines"));
      const docSnap = await getDocs(dataRef);
      const fetched = docSnap.docs.map((doc) => doc.data());
      setDisciplines(fetched);
    };

    const getLocation = async () => {
      const dataref = query(collection(db, "location"));
      const docSnap = await getDocs(dataref);
      const locations = docSnap.docs.map((doc) => doc.data());
      setCountryList(locations);
    };

    fetchDisciplines();
    getLocation();
  }, []);

  const handleInputChange = (index, e) => {
    const newExperiences = [...experiences];
    newExperiences[index][e.target.name] = e.target.value;
    setExperiences(newExperiences);
  };

  const handleAddClick = () => {
    setExperiences((prev) => [
      ...prev,
      {
        company: "",
        city: "",
        country: "",
        title: "",
        employement_type: "",
        industry: "",
        start_date: "",
        end_date: "",
      },
    ]);
    setShowAddButton(false);
  };

  const handleRemoveClick = (index) => {
    const updated = [...experiences];
    updated.splice(index, 1);
    setExperiences(updated);
    setShowAddButton(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (experiences.length > 0) {
      uploadDataToFireStoreInArray(experiences[0], "experience");
      setShowAddButton(true);
      handleRemoveClick(0);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-darkBlue mb-4 px-5 max-w-5xl mx-auto">Experience</h2>

      {profileData?.experience?.map((exp, idx) => (
        <div
          key={idx}
          className="max-w-5xl mx-auto px-5 flex justify-between items-start border border-gray-200 shadow-sm rounded-md mb-3 py-3 bg-white"
        >
          <div>
            <h3 className="text-lg font-bold text-darkBlue">{exp.title}</h3>
            <p className="text-sm text-gray-700">{exp.company} • {exp.city}, {exp.country}</p>
            <p className="text-sm text-gray-600">{exp.employement_type} • {exp.industry}</p>
            <p className="text-xs text-gray-500 mt-1">{exp.start_date} to {exp.end_date}</p>
          </div>
          <DeleteIcon
            style={{ color: "#F24822" }}
            className="cursor-pointer"
            onClick={() => handelDocumentDelete(exp.id, "experience")}
          />
        </div>
      ))}

      <form onSubmit={handleSubmit} className="bg-white max-w-5xl mx-auto rounded-md shadow px-5 py-6 mb-6">
        {experiences.map((input, index) => (
          <div key={index}>
            <div className="grid grid-cols-6 gap-6 mb-4">
              <div className="md:col-span-2 col-span-6">
                <label htmlFor="company" className={labelStyle}>Company<span className="text-red-500">*</span></label>
                <input type="text" name="company" value={input.company} onChange={(e) => handleInputChange(index, e)} className="bg-light w-full p-2 rounded-sm border border-gray-300 outline-none" required />
              </div>

              <div className="md:col-span-2 col-span-6">
                <label htmlFor="city" className={labelStyle}>City<span className="text-red-500">*</span></label>
                <input type="text" name="city" value={input.city} onChange={(e) => handleInputChange(index, e)} className="bg-light w-full p-2 rounded-sm border border-gray-300 outline-none" required />
              </div>

              <div className="md:col-span-2 col-span-6">
                <label htmlFor="country" className={labelStyle}>Country<span className="text-red-500">*</span></label>
                <select name="country" value={input.country} onChange={(e) => handleInputChange(index, e)} className="bg-light w-full p-2 rounded-sm border border-gray-300 outline-none" required>
                  <option value="">Choose</option>
                  {countryList.map((l) => (
                    <option key={l.id} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 col-span-6">
                <label htmlFor="title" className={labelStyle}>Title<span className="text-red-500">*</span></label>
                <input type="text" name="title" value={input.title} onChange={(e) => handleInputChange(index, e)} className="bg-light w-full p-2 rounded-sm border border-gray-300 outline-none" required />
              </div>

              <div className="md:col-span-2 col-span-6">
                <label htmlFor="employement_type" className={labelStyle}>Employment Type<span className="text-red-500">*</span></label>
                <select name="employement_type" value={input.employement_type} onChange={(e) => handleInputChange(index, e)} className="bg-light w-full p-2 rounded-sm border border-gray-300 outline-none" required>
                  <option value="">Choose</option>
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Self-Employed</option>
                  <option>Internship</option>
                  <option>Freelance</option>
                  <option>Trainee</option>
                </select>
              </div>

              <div className="md:col-span-2 col-span-6">
                <label htmlFor="industry" className={labelStyle}>Industry<span className="text-red-500">*</span></label>
                <select name="industry" value={input.industry} onChange={(e) => handleInputChange(index, e)} className="bg-light w-full p-2 rounded-sm border border-gray-300 outline-none" required>
                  <option value="">Select</option>
                  {disciplines.map((d, i) => (
                    <option key={i} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3 col-span-6">
                <label htmlFor="start_date" className={labelStyle}>Start Date<span className="text-red-500">*</span></label>
                <input type="date" name="start_date" value={input.start_date} onChange={(e) => handleInputChange(index, e)} className="bg-light w-full p-2 rounded-sm border border-gray-300 outline-none" required />
              </div>

              <div className="md:col-span-3 col-span-6">
                <label htmlFor="end_date" className={labelStyle}>End Date<span className="text-red-500">*</span></label>
                <input type="date" name="end_date" value={input.end_date} onChange={(e) => handleInputChange(index, e)} className="bg-light w-full p-2 rounded-sm border border-gray-300 outline-none" required />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button type="submit" className="bg-darkBlue text-white px-5 py-2 rounded-sm hover:bg-blue-700 transition duration-150">Save</button>
              <button type="button" onClick={() => handleRemoveClick(index)} className="bg-gray-200 px-5 py-2 rounded-sm hover:bg-gray-300 transition duration-150">Cancel</button>
            </div>
          </div>
        ))}
      </form>

      {showAddButton && (
        <div className="max-w-5xl mx-auto mb-10 px-5">
          <button
            type="button"
            onClick={handleAddClick}
            className="border border-main text-main px-4 py-2 rounded-sm hover:bg-main hover:text-white transition duration-200"
          >
            Add Experience
          </button>
        </div>
      )}
    </>
  );
};

export default Experience;
