import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthProvider";
import Delete from "@mui/icons-material/DeleteOutlined";
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
  const [countryList, setCountryList] = useState([])
  
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
  const [disciplines, setDisciplines] = useState([]);
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

    const  getLocation = async () => {
      const dataref = query(collection(db, "location"));
      const docSnap = await getDocs(dataref);
      const locations = docSnap.docs.map((doc) => doc.data());
      setCountryList(locations)
    };

    
    fetchDisciplines();
    getLocation()
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
      {profileData?.experience?.map((exp, idx) => (
        <div
          key={idx}
          className="max-w-5xl mx-auto px-5 flex justify-between items-center border-b-2 mb-3 pb-2"
        >
          <div>
            <h1 className="text-md font-bold">{exp.title}</h1>
            <p className="text-sm">{exp.company} • {exp.city}, {exp.country}</p>
            <p className="text-sm">{exp.employement_type} • {exp.industry}</p>
            <p className="text-xs">{exp.start_date} to {exp.end_date}</p>
          </div>
          <Delete
            style={{ color: "red" }}
            className="cursor-pointer"
            onClick={() => handelDocumentDelete(exp.id, "experience")}
          />
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        {experiences.map((input, index) => (
          <div key={index} className="max-w-5xl md:mx-auto mb-8 mx-5">
            <div className="grid grid-cols-6 gap-6">
              <div className="md:col-span-2 col-span-6">
                <label htmlFor="company" className={labelStyle}>Company<span className="text-main">*</span></label>
                <input type="text" name="company" value={input.company} onChange={(e) => handleInputChange(index, e)} className="bg-light outline-none w-full p-1 px-1.5" required />
              </div>

              <div className="md:col-span-2 col-span-6">
                <label htmlFor="city" className={labelStyle}>City<span className="text-main">*</span></label>
                <input type="text" name="city" value={input.city} onChange={(e) => handleInputChange(index, e)} className="bg-light outline-none w-full p-1 px-1.5" required />
              </div>

              <div className="md:col-span-2 col-span-6">
                <label htmlFor="country" className={labelStyle}>Country<span className="text-main">*</span></label>
                <select name="country" value={input.country} onChange={(e) => handleInputChange(index, e)} className="mt-1 block w-full rounded-sm outline-none bg-light py-1.5 px-3" required>
                  <option value="">Choose</option>
                  {countryList.map((l, i) => (
                    <option key={l.id} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 col-span-6">
                <label htmlFor="title" className={labelStyle}>Title<span className="text-main">*</span></label>
                <input type="text" name="title" value={input.title} onChange={(e) => handleInputChange(index, e)} className="bg-light outline-none w-full p-1 px-1.5" required />
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label htmlFor="employement_type" className={labelStyle}>Employment Type<span className="text-main">*</span></label>
                <select name="employement_type" value={input.employement_type} onChange={(e) => handleInputChange(index, e)} className="mt-1 block w-full rounded-sm outline-none bg-light py-1.5 px-3" required>
                  <option value="">Choose</option>
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Self-Employed</option>
                  <option>Internship</option>
                  <option>Freelance</option>
                  <option>Trainee</option>
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label htmlFor="industry" className={labelStyle}>Industry<span className="text-main">*</span></label>
                <select name="industry" value={input.industry} onChange={(e) => handleInputChange(index, e)} className="bg-light outline-none w-full p-1 px-1.5" required>
                  <option value="">Select</option>
                  {disciplines.map((discipline, i) => (
                    <option key={i} value={discipline.name}>{discipline.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 col-span-6">
                <label htmlFor="start_date" className={labelStyle}>Start Date<span className="text-main">*</span></label>
                <input type="date" name="start_date" value={input.start_date} onChange={(e) => handleInputChange(index, e)} className="bg-light px-1.5 py-1 w-full outline-none" required />
              </div>

              <div className="md:col-span-2 col-span-6">
                <label htmlFor="end_date" className={labelStyle}>End Date<span className="text-main">*</span></label>
                <input type="date" name="end_date" value={input.end_date} onChange={(e) => handleInputChange(index, e)} className="bg-light px-1.5 py-1 w-full outline-none" required />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-light px-4 p-1 rounded-sm hover:bg-main hover:text-light transition duration-200">Save</button>
              <button type="button" onClick={() => handleRemoveClick(index)} className="bg-light px-4 p-1 rounded-sm hover:bg-main hover:text-light transition duration-200">Cancel</button>
            </div>
          </div>
        ))}

        <div className="max-w-5xl mx-auto">
          <button
            type="button"
            onClick={handleAddClick}
            className={`bg-light px-4 p-1 mt-3 mb-4 rounded-sm hover:outline outline-main hover:text-main transition duration-200 ${showAddButton ? "" : "hidden"}`}
          >
            Add Experience
          </button>
        </div>
      </form>
    </>
  );
};

export default Experience;
