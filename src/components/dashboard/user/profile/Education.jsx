import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthProvider";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import {
  getFirestore,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import app from "../../../../firebase";

const Education = () => {
  const db = getFirestore(app);
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  const [degrees, setDegrees] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [show, setShow] = useState(true);
  const [data, setData] = useState([
    {
      institute_name: "",
      degree: "",
      field_of_study: "",
      score_type: "GPA(4)",
      score: "",
      start_date: "",
      end_date: "",
    },
  ]);

  const {
    profileData,
    uploadDataToFireStoreInArray,
    handleDocumentDelete,
  } = useAuth();

  useEffect(() => {
    const fetchDegrees = async () => {
      const ref = query(collection(db, "degrees"));
      const snap = await getDocs(ref);
      const result = snap.docs.map((doc) => doc.data());
      setDegrees(result);
    };

    const fetchDisciplines = async () => {
      const ref = query(collection(db, "disciplines"));
      const snap = await getDocs(ref);
      const result = snap.docs.map((doc) => doc.data());
      setDisciplines(result);
    };

    fetchDegrees();
    fetchDisciplines();
  }, []);

  const handleChange = (i, e) => {
    const updated = [...data];
    updated[i][e.target.name] = e.target.value;
    setData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    uploadDataToFireStoreInArray(data[0], "education");
    removeclick();
  };

  const addClick = () => {
    setData([
      ...data,
      {
        institute_name: "",
        degree: "",
        field_of_study: "",
        score_type: "GPA(4)",
        score: "",
        start_date: "",
        end_date: "",
      },
    ]);
    setShow(false);
  };

  const removeclick = (i = 0) => {
    const updated = [...data];
    updated.splice(i, 1);
    setData(updated);
    setShow(true);
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-darkBlue mb-4 px-5 max-w-5xl mx-auto">Education</h2>

      {profileData?.education?.map((edu, index) => (
        <div
          key={index}
          className="max-w-5xl mx-auto px-5 flex justify-between items-start border border-gray-200 shadow-sm rounded-2xl mb-3 py-4 bg-white"
        >
          <div>
            <h3 className="text-lg font-bold text-darkBlue">{edu.institute_name}</h3>
            <p className="text-sm text-gray-700">
              {edu.degree} • {edu.field_of_study} • {edu.score} ({edu.score_type})
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {edu.start_date} to {edu.end_date}
            </p>
          </div>
          <DeleteIcon
            style={{ color: "#F24822" }}
            className="cursor-pointer"
            onClick={() => handleDocumentDelete(edu.id, "education")}
          />
        </div>
      ))}

      <form onSubmit={handleSubmit} className="bg-white max-w-5xl mx-auto rounded-2xl shadow px-6 py-6 mb-6">
        {data.map((input, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 mb-6">
            <div className="grid grid-cols-6 gap-4 mb-4">
              <div className="col-span-6 md:col-span-4">
                <label htmlFor="institute_name" className={labelStyle}>Institute Name<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="institute_name"
                  value={input.institute_name}
                  onChange={(e) => handleChange(index, e)}
                  className="bg-light outline-none w-full p-2 rounded-md border border-gray-300"
                  required
                />
              </div>

              <div className="col-span-6 md:col-span-2">
                <label htmlFor="degree" className={labelStyle}>Degree<span className="text-red-500">*</span></label>
                <select
                  name="degree"
                  value={input.degree}
                  onChange={(e) => handleChange(index, e)}
                  className="bg-light w-full p-2 rounded-md border border-gray-300"
                  required
                >
                  <option value="" disabled>Select</option>
                  {degrees.map((deg, i) => (
                    <option key={i} value={deg.name}>{deg.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-6 md:col-span-3">
                <label htmlFor="field_of_study" className={labelStyle}>Field of Study<span className="text-red-500">*</span></label>
                <select
                  name="field_of_study"
                  value={input.field_of_study}
                  onChange={(e) => handleChange(index, e)}
                  className="bg-light w-full p-2 rounded-md border border-gray-300"
                  required
                >
                  <option value="" disabled>Select</option>
                  {disciplines.map((dis, i) => (
                    <option key={i} value={dis.name}>{dis.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-3 md:col-span-1">
                <label htmlFor="score" className={labelStyle}>Score<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="score"
                  value={input.score}
                  placeholder={
                    input.score_type === "GPA(4)"
                      ? "OUT OF 4"
                      : input.score_type === "CGPA(10)"
                      ? "OUT OF 10"
                      : "OUT OF 100"
                  }
                  onChange={(e) => handleChange(index, e)}
                  className="bg-light w-full p-2 rounded-md border border-gray-300"
                  required
                />
              </div>

              <div className="col-span-3 md:col-span-2">
                <label className={labelStyle}>Score Type</label>
                <select
                  name="score_type"
                  value={input.score_type}
                  onChange={(e) => handleChange(index, e)}
                  className="bg-light w-full p-2 rounded-md border border-gray-300"
                >
                  <option>GPA(4)</option>
                  <option>CGPA(10)</option>
                  <option>Percentage(100)</option>
                </select>
              </div>

              <div className="col-span-6 md:col-span-3">
                <label htmlFor="start_date" className={labelStyle}>Start Date<span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="start_date"
                  value={input.start_date}
                  onChange={(e) => handleChange(index, e)}
                  className="bg-light w-full p-2 rounded-md border border-gray-300"
                  required
                />
              </div>

              <div className="col-span-6 md:col-span-3">
                <label htmlFor="end_date" className={labelStyle}>End Date<span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="end_date"
                  value={input.end_date}
                  onChange={(e) => handleChange(index, e)}
                  className="bg-light w-full p-2 rounded-md border border-gray-300"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="submit"
                className="bg-darkBlue text-white px-6 py-2 rounded-md hover:bg-blue-800 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => removeclick(index)}
                className="bg-gray-200 px-6 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}

        {show && (
          <div className="max-w-5xl mx-auto px-5">
            <button
              type="button"
              onClick={addClick}
              className="border border-main text-main px-5 py-2 rounded-md hover:bg-main hover:text-white transition duration-200 mt-4"
            >
              Add Education
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default Education;
