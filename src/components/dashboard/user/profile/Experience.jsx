import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthProvider";
import Delete from "@mui/icons-material/DeleteOutlined";
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

const cnt = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"]

const Experience = () => {
  const db = getFirestore(app)
  const label_style = "block text-sm font-medium text-gray-700 mb-1";
  const [show, setShow] = useState(true);
  const [disciplines, setDisciplines] = useState([])
  const {
    currentUser,
    uploadDataToFireStore,
    uploadDataToFireStoreInArray,
    profileData,
    handelDocumentDelete,
  } = useAuth();

  const [data, setData] = useState([
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

  const addClick = () => {
    const values = [...data];
    values.push({
      company: "",
      city: "",
      country: "",
      title: "",
      employement_type: "",
      industry: "",
      start_date: "",
      end_date: "",
    });
    setData(values);
    setShow(!show);
  };
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
    fetchDisciplines()
  }, [])

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
  //       company: profileData?.company,
  //       city: profileData?.city,
  //       country: profileData?.country,
  //       title: profileData?.title,
  //       employement_type: profileData?.employement_type,
  //       industry: profileData?.industry,
  //       start_date: profileData?.start_date,
  //       end_date: profileData?.end_date,
  //     })
  //   }
  // }, [])

  const handlesubmit = (e) => {
    e.preventDefault();
    console.table(data[0]);
    uploadDataToFireStoreInArray(data[0], "experience");
    // const obj = JSON.stringify(data);
    // localStorage.setItem("userExperience", obj);
    // alert(data);
    setShow(!show);
    removeclick();
  };

  // const user = localStorage.getItem("userExperience");
  // const userObj = JSON.parse(user);
  const userObj = [];

  // console.log(userObj, typeof userObj);

  return (
    <>
      {profileData &&
        profileData.experience?.map((value) => {
          return (
            <div className="max-w-5xl mx-auto px-5 flex justify-between items-center border-b-2 mb-3 pb-2">
              <div>
                <h1 className="text-md font-bold">{value.title}</h1>
                <p className="text-sm">
                  {value.company} &#x2022; {value.city} , {value.country}
                </p>
                <p className="text-sm">
                  {value.employement_type} &#x2022; {value.industry}
                </p>
                <p className="text-xs">
                  {value.start_date} to {value.end_date}
                </p>
              </div>
              {/* <button className="font-bold">&#xFE19;</button> #F40076 */}
              <Delete
                style={{ color: "red" }}
                className="cursor-pointer"
                onClick={() => handelDocumentDelete(value.id, "experience")}
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
                  <label for="company" className={label_style}>
                    Company<label className="text-main">*</label>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={input.company}
                    className="bg-light outline-none w-full p-1 px-1.5"
                    onChange={(e) => handlechange(index, e)}
                    required={true}
                  />
                </div>
                <div className="md:col-span-2 col-span-6">
                  <label for="city" className={label_style}>
                    City<label className="text-main">*</label>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={input.city}
                    className="bg-light outline-none w-full p-1 px-1.5"
                    onChange={(e) => handlechange(index, e)}
                    required={true}
                  />
                </div>

                <div className="md:col-span-2 col-span-6">
                  <label for="country" className={label_style}>
                    Country<label className="text-main">*</label>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={input.country}
                    className="mt-1 block w-full rounded-sm outline-none bg-light py-1.5 px-3"
                    onChange={(e) => handlechange(index, e)}
                    required={true}
                  >
                    <option default>Choose</option>
                    {cnt && cnt.map((cnt) => {
                      return (
                        <option>{cnt}</option>
                      )
                    })}
                  </select>
                </div>
                <div className="md:col-span-2 col-span-6">
                  <label for="title" className={label_style}>
                    Title<label className="text-main">*</label>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={input.title}
                    className="bg-light outline-none w-full p-1 px-1.5"
                    onChange={(e) => handlechange(index, e)}
                    required={true}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                  <label for="employement_type" className={label_style}>
                    Employement type<label className="text-main">*</label>
                  </label>
                  <select
                    id="employement_type"
                    name="employement_type"
                    value={input.employement_type}
                    className="mt-1 block w-full rounded-sm outline-none bg-light py-1.5 px-3"
                    onChange={(e) => handlechange(index, e)}
                    required={true}
                  >
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
                  <label for="field_of_study" className={label_style}>
                    Industry<label className="text-main">*</label>
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={input.industry}
                    className="bg-light outline-none w-full p-1 px-1.5"
                    onChange={(e) => handlechange(index, e)}
                    required={true}
                  >
                    <option value={""} disabled>Select</option>
                    {disciplines && disciplines.map((value) => {
                      return <option value={value.name} key={value.id}>{value.name}</option>;
                    })}
                  </select>
                </div>
                <div className="md:col-span-2 col-span-6">
                  <label for="" className={label_style}>
                    Start Date<label className="text-main">*</label>
                  </label>
                  <input
                    type="date"
                    value={input.start_date}
                    name="start_date"
                    className="bg-light px-1.5 py-1 w-full outline-none"
                    onChange={(e) => handlechange(index, e)}
                    required={true}
                  />
                </div>
                <div className="md:col-span-2 col-span-6">
                  <label for="" className={label_style}>
                    End Date<label className="text-main">*</label>
                  </label>
                  <input
                    type="date"
                    input={input.end_date}
                    name="end_date"
                    className="bg-light px-1.5 py-1 w-full outline-none"
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
            Add Experience
          </button>
        </div>
      </form>
    </>
  );
};

export default Experience;

// {userObj &&
//   userObj.map((value) => {
//     return (
//       <div className="max-w-5xl mx-auto border-b-2 mb-3 pb-2">
//         <h1 className="text-md font-bold">{value.title}</h1>
//         <p className="text-sm">
//           {value.company} &#x2022; {value.city} , {value.country}
//         </p>
//         <p className="text-sm">
//           {value.employement_type} &#x2022; {value.industry}
//         </p>
//         <p className="text-xs">
//           {value.start_date} - {value.end_date}
//         </p>
//       </div>
//     );
//   })}
