import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthProvider";
import Delete from "@mui/icons-material/DeleteOutline";
import {
  getFirestore,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import app from "../../../../firebase";

const Education = () => {
  const db = getFirestore(app);
  const label_style = "block text-sm font-medium text-gray-700 mb-1";
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
    handelDocumentDelete,
  } = useAuth();

  useEffect(() => {
    const fetchDegrees = async () => {
      const ref = query(collection(db, "degrees"));
      const snap = await getDocs(ref);
      const result = snap.docs.map(doc => doc.data());
      setDegrees(result);
    };

    const fetchDisciplines = async () => {
      const ref = query(collection(db, "disciplines"));
      const snap = await getDocs(ref);
      const result = snap.docs.map(doc => doc.data());
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
      {profileData?.education?.map((edu, index) => (
        <div key={index} className="max-w-5xl mx-auto px-4 flex justify-between items-center border-b-2 mb-3 pb-2">
          <div>
            <h1 className="text-md font-bold">{edu.institute_name}</h1>
            <p className="text-sm">
              {edu.degree} &#x2022; {edu.field_of_study} &#x2022; {edu.score} ({edu.score_type})
            </p>
            <p className="text-xs">
              {edu.start_date} to {edu.end_date}
            </p>
          </div>
          <Delete
            style={{ color: "red" }}
            className="cursor-pointer"
            onClick={() => handelDocumentDelete(edu.id, "education")}
          />
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        {data.map((input, index) => (
          <div className="max-w-5xl md:mx-auto mb-8 mx-4" key={index}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-5">
                <label htmlFor="institute_name" className={label_style}>
                  Institute Name<span className="text-main">*</span>
                </label>
                <input
                  type="text"
                  name="institute_name"
                  value={input.institute_name}
                  className="bg-light outline-none w-full p-1 px-1.5"
                  onChange={(e) => handleChange(index, e)}
                  required
                />
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label htmlFor="degree" className={label_style}>
                  Degree<span className="text-main">*</span>
                </label>
                <select
                  name="degree"
                  value={input.degree}
                  className="w-full rounded-sm outline-none bg-light py-1.5 px-3"
                  onChange={(e) => handleChange(index, e)}
                  required
                >
                  <option value="" disabled>Select</option>
                  {degrees.map((deg, i) => (
                    <option value={deg.name} key={i}>{deg.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label htmlFor="field_of_study" className={label_style}>
                  Field of Study<span className="text-main">*</span>
                </label>
                <select
                  name="field_of_study"
                  value={input.field_of_study}
                  className="w-full rounded-sm outline-none bg-light py-1.5 px-3"
                  onChange={(e) => handleChange(index, e)}
                  required
                >
                  <option value="" disabled>Select</option>
                  {disciplines.map((dis, i) => (
                    <option value={dis.name} key={i}>{dis.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1 col-span-3">
                <label htmlFor="score" className={label_style}>
                  Score<span className="text-main">*</span>
                </label>
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
                  className="bg-light w-full py-1 pb-1.5 px-1.5 outline-none"
                  onChange={(e) => handleChange(index, e)}
                  required
                />
              </div>

              <div className="md:col-span-1 col-span-3">
                <label className={label_style}>Score Type</label>
                <select
                  name="score_type"
                  value={input.score_type}
                  className="w-full rounded-sm outline-none bg-light py-1.5 px-3"
                  onChange={(e) => handleChange(index, e)}
                  required
                >
                  <option>GPA(4)</option>
                  <option>CGPA(10)</option>
                  <option>Percentage(100)</option>
                </select>
              </div>

              <div className="md:col-span-2 col-span-6">
                <label htmlFor="start_date" className={label_style}>
                  Start Date<span className="text-main">*</span>
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={input.start_date}
                  className="bg-light px-1.5 py-1 w-full"
                  onChange={(e) => handleChange(index, e)}
                  required
                />
              </div>

              <div className="md:col-span-2 col-span-6">
                <label htmlFor="end_date" className={label_style}>
                  End Date<span className="text-main">*</span>
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={input.end_date}
                  className="bg-light px-1.5 py-1 w-full"
                  onChange={(e) => handleChange(index, e)}
                  required
                />
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                className="bg-light px-4 py-1 rounded-sm hover:bg-main hover:text-white transition"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-light px-4 py-1 rounded-sm hover:bg-main hover:text-white transition"
                onClick={() => removeclick(index)}
              >
                Cancel
              </button>
            </div>
          </div>
        ))}

        {!show && (
          <div className="max-w-5xl mx-auto">
            <button
              type="button"
              className="bg-light px-4 p-1 mt-3 mb-4 rounded-sm hover:outline outline-main hover:text-main transition"
              onClick={addClick}
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
