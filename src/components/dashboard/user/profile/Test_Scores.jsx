import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthProvider";
import Delete from "@mui/icons-material/DeleteOutlined";

const Test_Scores = () => {
  const label_style = "block text-sm font-medium text-gray-700 mb-1";
  const [show, setShow] = useState(true);
  const [type, setType] = useState("")
  const [subType, setSubType] = useState("")
  const {
    currentUser,
    uploadDataToFireStore,
    uploadDataToFireStoreInArray,
    profileData,
    handelDocumentDelete,
  } = useAuth();

  const [data, setData] = useState([
    {
      exam_type: "",
      sub_type: "",
      date: "",
      listen_score: "",
      read_score: "",
      write_score: "",
      exam_score: "",
      analytical_score: "",
      verbal_score: "",
      quantitative_score: "",
    },
  ]);

  const addClick = () => {
    const values = [...data];
    values.push({
      exam_type: "",
      sub_type: "",
      date: "",
      listen_score: "",
      read_score: "",
      write_score: "",
      exam_score: "",
      analytical_score: "",
      verbal_score: "",
      quantitative_score: "",
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
    console.table(data[0]);
    uploadDataToFireStoreInArray(data[0], "test_score");
    // const obj = JSON.stringify(data);
    // localStorage.setItem("userExperience", obj);
    // alert(data);
    setShow(!show);
    removeclick();
  };

  return (
    <>
      {profileData &&
        profileData.test_score?.map((value) => {
          return (
            <div className="max-w-5xl mx-auto px-5 flex justify-between items-center border-b-2 mb-3 pb-2">
              <div>
                <h1 className="text-md text-main font-bold">{value.exam_type}</h1>
                <p className="text-sm font-bold">
                  Exam Type : {value.sub_type}
                </p>
                <div className={value.exam_type == "English Proficiency" ? "block" : "hidden"}>
                  <p className="text-sm">
                    Listening Score &#x2022; {value.listen_score}
                  </p>
                  <p className="text-sm">
                    Reading Score &#x2022; {value.read_score}
                  </p>
                  <p className="text-sm">
                    Writing Score &#x2022; {value.write_score}
                  </p>
                </div>
                <div className={value.exam_type != "English Proficiency" && value.sub_type != "GRE" ? "block" : "hidden"}>
                  <p className="text-sm">
                    Test Score &#x2022; {value.exam_score}
                  </p>
                </div>
                <div className={value.exam_type != "English Proficiency" && value.sub_type == "GRE" ? "block" : "hidden"}>
                  <p className="text-sm">
                    Analytical Writing Score &#x2022; {value.analytical_score}
                  </p>
                  <p className="text-sm">
                    Quantitative Reasoning Score &#x2022; {value.quantitative_score}
                  </p>
                  <p className="text-sm">
                    Verbal Reasoning Score &#x2022; {value.verbal_score}
                  </p>
                </div>
              </div>
              {/* <button className="font-bold">&#xFE19;</button> #F40076 */}
              <Delete
                style={{ color: "red" }}
                className="cursor-pointer"
                onClick={() => handelDocumentDelete(value.id, "test_score")}
              />
            </div>
          );
        })}


      <form onSubmit={handlesubmit}>
        {data.map((input, index) => {
          return (
            <div className="max-w-5xl md:mx-auto mb-8 mx-5">
              <div className="grid grid-cols-6 gap-6">
                <div className="md:col-span-2 col-span-6">
                  <label for="exam_type" className={label_style}>
                    Exam Type<label className="text-main">*</label>
                  </label>
                  <select
                    id="exam_type"
                    name="exam_type"
                    value={input.exam_type}
                    className="mt-1 block w-full rounded-sm outline-none bg-light py-1.5 px-3"
                    onChange={(e) => {
                      handlechange(index, e)
                      setType(e.target.value)
                      console.log(type)
                    }}
                    required={true}
                  >
                    <option value="">Choose</option>
                    <option>English Proficiency</option>
                    <option>Entrance Exam</option>
                  </select>
                </div>

                {type &&
                  <>
                    {type == "English Proficiency" &&
                      <>
                        <div className="md:col-span-2 col-span-6">
                          <label for="sub_type" className={label_style}>
                            {type} type<label className="text-main">*</label>
                          </label>
                          <select
                            id="sub_type"
                            name="sub_type"
                            className="mt-1 block w-full rounded-sm outline-none bg-light py-1.5 px-3"
                            onChange={(e) => handlechange(index, e)}
                            required={true}
                          >
                            <option value="">Choose</option>
                            <option>Revised TOEFL paper-delivered test</option>
                            <option>TOEFL iBT</option>
                            <option>IELTS Academic</option>
                            <option>IELTS General Training</option>
                            <option>Pearson PTE</option>
                            <option>KITE</option>
                            <option>Cambridge English</option>
                          </select>
                        </div>
                        <div className="md:col-span-2 col-span-6">
                          <label for="" className={label_style}>
                            Date<label className="text-main">*</label>
                          </label>
                          <input
                            type="date"
                            value={input.date}
                            name="date"
                            className="bg-light px-1.5 py-1 w-full outline-none"
                            onChange={(e) => handlechange(index, e)}
                            required={true}
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label for="listen_score" className={label_style}>
                            Listening<label className="text-main">*</label>
                          </label>
                          <input
                            type="text"
                            name="listen_score"
                            value={input.listen_score}
                            className="bg-light outline-none w-full p-1 px-1.5"
                            onChange={(e) => handlechange(index, e)}
                            required={true}
                            placeholder="OUT OF 30"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label for="read_score" className={label_style}>
                            Reading<label className="text-main">*</label>
                          </label>
                          <input
                            type="text"
                            name="read_score"
                            value={input.read_score}
                            className="bg-light outline-none w-full p-1 px-1.5"
                            onChange={(e) => handlechange(index, e)}
                            required={true}
                            placeholder="OUT OF 30"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label for="write_score" className={label_style}>
                            Writing<label className="text-main">*</label>
                          </label>
                          <input
                            type="text"
                            name="write_score"
                            value={input.write_score}
                            className="bg-light outline-none w-full p-1 px-1.5"
                            onChange={(e) => handlechange(index, e)}
                            required={true}
                            placeholder="OUT OF 30"
                          />
                        </div>
                      </>
                    }
                    {type == "Entrance Exam" &&
                      <>
                        <div className="md:col-span-2 col-span-6">
                          <label for="sub_type" className={label_style}>
                            {type}<label className="text-main">*</label>
                          </label>
                          <select
                            id="sub_type"
                            name="sub_type"
                            className="mt-1 block w-full rounded-sm outline-none bg-light py-1.5 px-3"
                            onChange={(e) => {
                              handlechange(index, e)
                              setSubType(e.target.value)
                            }}
                            required={true}

                          >
                            <option value="">Choose</option>
                            <option value={"GMAT"}>GMAT</option>
                            <option value={"GRE"}>GRE</option>
                            <option value={"ACT"}>ACT</option>
                            <option value={"SAT"}>SAT</option>
                          </select>
                        </div>
                        <div className="md:col-span-2 col-span-6">
                          <label for="" className={label_style}>
                            Date<label className="text-main">*</label>
                          </label>
                          <input
                            type="date"
                            value={input.date}
                            name="date"
                            className="bg-light px-1.5 py-1 w-full outline-none"
                            onChange={(e) => handlechange(index, e)}
                            required={true}
                          />
                        </div>
                        {subType == "GRE" &&
                          <>
                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                              <label for="analytical_score" className={label_style}>
                                Analytical writing<label className="text-main">*</label>
                              </label>
                              <input
                                type="text"
                                name="analytical_score"
                                value={input.analytical_score}
                                className="bg-light outline-none w-full p-1 px-1.5"
                                onChange={(e) => handlechange(index, e)}
                                required={true}
                                placeholder={"OUT OF 6"}
                              />
                            </div>
                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                              <label for="quantitative_score" className={label_style}>
                                Quantitative reasoning<label className="text-main">*</label>
                              </label>
                              <input
                                type="text"
                                name="quantitative_score"
                                value={input.quantitative_score}
                                className="bg-light outline-none w-full p-1 px-1.5"
                                onChange={(e) => handlechange(index, e)}
                                required={true}
                                placeholder={"130 - 170"}
                              />
                            </div>
                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                              <label for="verbal_score" className={label_style}>
                                Verbal reasoning<label className="text-main">*</label>
                              </label>
                              <input
                                type="text"
                                name="verbal_score"
                                value={input.verbal_score}
                                className="bg-light outline-none w-full p-1 px-1.5"
                                onChange={(e) => handlechange(index, e)}
                                required={true}
                                placeholder={"130 - 170"}
                              />
                            </div>
                          </>
                        }
                        {
                          subType != "GRE" &&
                          <>
                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                              <label for="exam_score" className={label_style}>
                                Total<label className="text-main">*</label>
                              </label>
                              <input
                                type="text"
                                name="exam_score"
                                value={input.exam_score}
                                className="bg-light outline-none w-full p-1 px-1.5"
                                onChange={(e) => handlechange(index, e)}
                                required={true}
                                placeholder={input.sub_type == "GMAT" ? "OUT OF 800" : input.sub_type == "ACT" ? "OUT OF 36" : input.sub_type == "SAT" ? "OUT OF 1600" : ""}
                              />
                            </div>
                          </>
                        }

                      </>
                    }

                  </>}
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
            Add Experience
          </button>
        </div>
      </form>
    </>
  );
};

export default Test_Scores;
