import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthProvider";
import Delete from "@mui/icons-material/DeleteOutline";
import {
  Firestore,
  getFirestore,
  doc,
  collection,
  onSnapshot,
  getDocs,
  limit,
  query,
  where
} from "firebase/firestore";
import app from "../../../../firebase";

const Education = () => {
  const label_style = "block text-sm font-medium text-gray-700 mb-1";
  const db = getFirestore(app)
  const [degrees, setDegrees] = useState([])
  const [disciplines, setDisciplines] = useState([])
  const [show, setShow] = useState(true);
  const [type, setType] = useState("GPA(4)")
  const {
    currentUser,
    uploadDataToFireStore,
    uploadDataToFireStoreInArray,
    profileData,
    handelDocumentDelete,
  } = useAuth();

  const fetchDegrees = async () => {
    // e.preventDefault();
    const dataref = query(collection(db, "degrees"));
    const docSnap = await getDocs(dataref);
    docSnap.forEach(doc => {
      setDegrees((prev) => {
        return [...prev, doc.data()]
      })
    })
  }

  const fetchDisciplines = async () => {
    // e.preventDefault();
    const dataref = query(collection(db, "disciplines"));
    const docSnap = await getDocs(dataref);
    docSnap.forEach(doc => {
      setDisciplines((prev) => {
        return [...prev, doc.data()]
      })
    })
  }

  useEffect(() => {
    fetchDegrees()
    fetchDisciplines()
  }, [])

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

  // useEffect(() => {
  //   const allKeysHaveValues = Object.keys(data).every((key) => {
  //     return (
  //       data[key] !== "" &&
  //       data[key] !== null &&
  //       data[key] !== undefined
  //     );
  //   });
  //   if (!allKeysHaveValues) {
  //     setData({
  //       institute_name: profileData?.institute_name,
  //       degree: profileData?.degree,
  //       field_of_study: profileData?.field_of_study,
  //       score: profileData?.score,
  //       start_date: profileData?.start_date,
  //       end_date: profileData?.end_date,
  //     })
  //   }
  // }, [])

  const addClick = () => {
    const values = [...data];
    values.push({
      institute_name: "",
      degree: "",
      field_of_study: "",
      score_type: "GPA(4)",
      score: "",
      start_date: "",
      end_date: "",
    });
    setData(values);
    setShow(!show);
  };

  const removeclick = (i) => {
    let content = [...data];
    content.splice(i, 1);
    setData(content);
    let decision = show ? false : true;
    setShow(decision);
  };

  function handlechange(i, event) {
    let value = [...data];
    value[i][event.target.name] = event.target.value;
    setData(value);
  }

  const handlesubmit = (e) => {
    e.preventDefault();
    uploadDataToFireStoreInArray(data[0], "education");
    setShow(!show);
    removeclick();
    // console.log(data);
    // alert(data);
  };

  return (
    <>
      {profileData &&
        profileData.education?.map((value) => {
          return (
            // <div className="max-w-5xl mx-auto border-b-2 mb-3 pb-2">
            <div className="max-w-5xl mx-auto md:mx-auto px-4 flex justify-between items-center border-b-2 mb-3 pb-2">
              <div>
                <h1 className="text-md font-bold">{value.institute_name}</h1>
                <p className="text-sm">
                  {value.degree} &#x2022; {value.field_of_study} &#x2022;{" "}
                  {value.score} ({value.score_type})
                </p>
                <p className="text-xs">
                  {value.start_date} to {value.end_date}
                </p>
              </div>
              {/* <button className="font-bold">&#xFE19;</button> */}
              <Delete
                style={{ color: "red" }}
                className="cursor-pointer"
                onClick={() => handelDocumentDelete(value.id, "education")}
              />
            </div>
          );
        })}
      <form onSubmit={handlesubmit}>
        {data.length > 0 &&
          data.map((input, index) => {
            return (
              <div className="max-w-5xl md:mx-auto mb-8 mx-4">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-5">
                    <label for="institute_name" className={label_style}>
                      Institute Name<label className="text-main">*</label>
                    </label>
                    <input
                      type="text"
                      name="institute_name"
                      value={input.institute_name}
                      className="bg-light outline-none w-full p-1 px-1.5"
                      onChange={(e) => handlechange(index, e)}
                      required={true}
                    />
                  </div>
                  <br />
                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label for="degree" className={label_style}>
                      Degree<label className="text-main">*</label>
                    </label>
                    <select
                      id="degree"
                      name="degree"
                      value={input.degree}
                      className="mt-1 block w-full rounded-sm outline-none bg-light py-1.5 px-3"
                      onChange={(e) => handlechange(index, e)}
                      required={true}
                    >
                      <option value={""} disabled>Select</option>
                      {degrees && degrees.map((value) => {
                        return <option value={value.name} key={value.id}>{value.name}</option>;
                      })}
                    </select>
                  </div>
                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label for="field_of_study" className={label_style}>
                      Field of Study<label className="text-main">*</label>
                    </label>
                    <select
                      id="field_of_study"
                      name="field_of_study"
                      value={input.field_of_study}
                      className="mt-1 block w-full rounded-sm outline-none bg-light py-1.5 px-3"
                      onChange={(e) => handlechange(index, e)}
                      required={true}
                    >
                      <option value={""} disabled>Select</option>
                      {disciplines && disciplines.map((value) => {
                        return <option value={value.name} key={value.id}>{value.name}</option>;
                      })}
                    </select>
                  </div>

                  <div className="md:col-span-1 col-span-3">
                    <label for="score" className={label_style}>
                      Score<label className="text-main">*</label>
                    </label>
                    <input
                      type="text"
                      value={input.score}
                      name="score"
                      min={0}
                      max={100}
                      className="bg-light w-full py-1 pb-1.5 px-1.5 outline-none"
                      placeholder={input.score_type == "GPA(4)" ? "OUT OF 4" : input.score_type == "CGPA(10)" ? "OUT OF 10" : "OUT OF 100"}
                      onChange={(e) => handlechange(index, e)}
                      required={true}
                    />
                  </div>
                  <div className="md:col-span-1 col-span-3">
                    <select
                      id="score_type"
                      name="score_type"
                      value={input.score_type}
                      className="mt-6 block w-full rounded-sm outline-none bg-light py-1.5 px-3 "
                      onChange={(e) => {
                        handlechange(index, e)
                        setType(e.target.value)
                      }}
                      required={true}
                      defaultValue={input.score_type}
                    >
                      <option>GPA(4)</option>
                      <option>CGPA(10)</option>
                      <option>Percentage(100)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 col-span-6">
                    <label for="start_date" className={label_style}>
                      Start Date<label className="text-main">*</label>
                    </label>
                    <input
                      type="date"
                      value={input.start_date}
                      name="start_date"
                      className="bg-light px-1.5 py-1 w-full"
                      onChange={(e) => handlechange(index, e)}
                      required={true}
                    />
                  </div>
                  <div className="md:col-span-2 col-span-6">
                    <label for="end_date" className={label_style}>
                      End Date<label className="text-main">*</label>
                    </label>
                    <input
                      type="date"
                      input={input.end_date}
                      name="end_date"
                      className="bg-light px-1.5 py-1 w-full"
                      onChange={(e) => handlechange(index, e)}
                      required={true}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-light px-4 p-1 mt-3 mr-3 rounded-sm hover:bg-main outline-main hover:text-light transition duration-200"
                >
                  Save
                </button>
                <button
                  type="button"
                  value={"cancel"}
                  className="bg-light px-4 p-1 mt-3 rounded-sm hover:bg-main outline-main hover:text-light transition duration-200"
                  onClick={removeclick}
                >
                  Cancel
                </button>
              </div>
            );
          })}
        <div className="max-w-5xl mx-auto">
          <button
            type="button"
            className={`bg-light px-4 p-1 mt-3 mb-4 rounded-sm hover:bg-white hover:outline outline-main hover:text-main transition duration-200 focus:outline-none ${show ? "hidden" : "block"
              }
            `}
            onClick={addClick}
          >
            Add Education
          </button>
        </div>
      </form>
    </>
  );
};

export default Education;
