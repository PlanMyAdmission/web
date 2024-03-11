import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/AuthProvider";
// const cnt = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"]
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

const About = () => {
  const { currentUser, uploadDataToFireStore, profileData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loc, setLoc] = useState([])

  const [AboutData, setAboutData] = useState({
    firstName: profileData?.firstName,
    lastName: profileData?.lastName,
    phoneNumber: profileData?.phoneNumber,
    gender: profileData?.gender,
    date_of_Birth: profileData?.date_of_Birth,
    nationality: profileData?.nationality,
    address: profileData?.address,
    city: profileData?.city,
    country: profileData?.country,
    zipCode: profileData?.zipCode,
    state: profileData?.state,
  });

  const handelChange = (e) => {
    setAboutData({ ...AboutData, [e.target.name]: e.target.value });

    const allKeysHaveValues = Object.keys(AboutData).every((key) => {
      return (
        AboutData[key] !== "" &&
        AboutData[key] !== null &&
        AboutData[key] !== undefined
      );
    });

    setLoading(allKeysHaveValues);
    console.log(loading)
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      await uploadDataToFireStore(AboutData);
      toast.success("Data uploaded Successfully", {
        className: "foo-bar",
        autoClose: 1500
      })
      setAboutData({
        firstName: profileData?.firstName,
        lastName: profileData?.lastName,
        phoneNumber: profileData?.phoneNumber,
        gender: profileData?.gender,
        date_of_Birth: profileData?.date_of_Birth,
        nationality: profileData?.nationality,
        address: profileData?.address,
        city: profileData?.city,
        country: profileData?.country,
        zipCode: profileData?.zipCode,
        state: profileData?.state,
      })
    }
    catch (error) {
      toast.success(error.code, {
        className: "foo-bar",
        autoClose: 1500
      })
      console.log(AboutData.state)
    }

    e.target.reset();
    setLoading(!loading);
  };

  const navigate = useNavigate()
  const db = getFirestore(app);
  const [state, setState] = useState([])
  const [city, setCity] = useState([])

  const getLocation = async () => {
    const dataref = query(collection(db, "location"));
    const docSnap = await getDocs(dataref);
    docSnap.forEach(doc => {
      setLoc((prev) => {
        return [...prev, doc.data()]
      })
    })
  }

  useEffect(() => {
    getLocation()
    if (localStorage.getItem("logged") == false) {
      navigate("/")
    }
    const allKeysHaveValues = Object.keys(AboutData).every((key) => {
      return (
        AboutData[key] !== "" &&
        AboutData[key] !== null &&
        AboutData[key] !== undefined
      );
    });
    if (!allKeysHaveValues) {
      setAboutData({
        firstName: profileData?.firstName,
        lastName: profileData?.lastName,
        phoneNumber: profileData?.phoneNumber,
        gender: profileData?.gender,
        date_of_Birth: profileData?.date_of_Birth,
        nationality: profileData?.nationality,
        address: profileData?.address,
        city: profileData?.city,
        country: profileData?.country,
        zipCode: profileData?.zipCode,
        state: profileData?.state,
      })
    }
    console.log(AboutData)
    console.log(loading)
  }, [])

  useEffect(() => {
    loc && loc?.filter((cnt) => {
      if (cnt.name == AboutData.country) {
        setState(cnt.states)
      }
      // console.log(cnt.name)
    })
  }, [AboutData.country])

  useEffect(() => {
    state && state?.filter((st) => {
      if (st.name == AboutData.state) {
        setCity(st.cities)
      }
      // console.log(st.name)
    })
  }, [AboutData.state])

  return (
    <>
      <div className="my-5 mx-4 sm:mx-auto md:mt-0">
        <form onSubmit={handelSubmit}>
          <div className="overflow-hidden max-w-5xl md:mx-auto mx-2">
            <div className=" sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    for="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name <label className="text-main">*</label>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    autocomplete="off"
                    className="mt-1 block w-full rounded-sm py-1 border-gray-300 bg-light outline-none px-1.5"
                    onChange={handelChange}
                    required={true}
                    defaultValue={profileData?.firstName}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    for="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name <label className="text-main">*</label>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    autocomplete="family-name"
                    className="mt-1 block w-full rounded-sm py-1 border-gray-300 bg-light  outline-none px-1.5"
                    onChange={handelChange}
                    required={true}
                    defaultValue={profileData?.lastName}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    for="email-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address <label className="text-main">*</label>
                  </label>
                  <input
                    type="email"
                    name="email-address"
                    id="email-address"
                    autocomplete="off"
                    required={true}
                    value={currentUser?.email}
                    className="mt-1 block w-full rounded-sm py-1 bg-light  outline-none px-1.5"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    for="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number <label className="text-main">*</label>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    autocomplete="off"
                    className="mt-1 block w-full rounded-sm py-1 border-gray-300 bg-light  outline-none px-1.5"
                    onChange={handelChange}
                    required={true}
                    defaultValue={profileData?.phoneNumber}
                  />
                </div>
                <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                  <label
                    for="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Gender <label className="text-main">*</label>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    autocomplete="gender"
                    className="mt-1 block w-full rounded-sm  bg-light py-1.5 px-3"
                    onChange={handelChange}
                    required={true}
                    defaultValue={profileData?.gender}
                  >
                    <option value="">{profileData?.gender}</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>others</option>
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                  <label
                    for="date_of_Birth"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date of birth <label className="text-main">*</label>
                  </label>
                  <input
                    type="date"
                    name="date_of_Birth"
                    id="date_of_Birth"
                    autocomplete="off"
                    className="mt-1 block w-full rounded-sm py-1 bg-light px-3"
                    onChange={handelChange}
                    required={true}
                    max={new Date()}
                    defaultValue={profileData?.date_of_Birth}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                  <label
                    for="nationality"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nationality <label className="text-main">*</label>
                    <select
                      id="nationality"
                      name="nationality"
                      autocomplete="off"
                      className="mt-1 block w-full rounded-sm  bg-light py-1.5 px-3"
                      onChange={handelChange}
                      required={true}
                      defaultValue={profileData?.nationality}
                    >
                      <option value="">{profileData?.nationality}</option>
                      <option >Afghan</option>
                      <option>Albanian</option>
                      <option>Algerian</option>
                      <option>American</option>
                      <option>Andorran</option>
                      <option>Angolan</option>
                      <option>Anguillan</option>
                      <option>Citizen of Antigua and Barbuda</option>
                      <option>Argentine</option>
                      <option>Armenian</option>
                      <option>Australian</option>
                      <option>Austrian</option>
                      <option>Azerbaijani</option>
                      <option>Bahamian</option>
                      <option>Bahraini</option>
                      <option>Bangladeshi</option>
                      <option>Barbadian</option>
                      <option>Belarusian</option>
                      <option>Belgian</option>
                      <option>Belizean</option>
                      <option>Beninese</option>
                      <option>Bermudian</option>
                      <option>Bhutanese</option>
                      <option>Bolivian</option>
                      <option>Citizen of Bosnia and Herzegovina</option>
                      <option>Botswanan</option>
                      <option>Brazilian</option>
                      <option>British</option>
                      <option>British Virgin Islander</option>
                      <option>Bruneian</option>
                      <option>Bulgarian</option>
                      <option>Burkinan</option>
                      <option>Burmese</option>
                      <option>Burundian</option>
                      <option>Cambodian</option>
                      <option>Cameroonian</option>
                      <option>Canadian</option>
                      <option>Cape Verdean</option>
                      <option>Cayman Islander</option>
                      <option>Central African</option>
                      <option>Chadian</option>
                      <option>Chilean</option>
                      <option>Chinese</option>
                      <option>Colombian</option>
                      <option>Comoran</option>
                      <option>Congolese (Congo)</option>
                      <option>Congolese (DRC)</option>
                      <option>Cook Islander</option>
                      <option>Costa Rican</option>
                      <option>Croatian</option>
                      <option>Cuban</option>
                      <option>Cymraes</option>
                      <option>Cymro</option>
                      <option>Cypriot</option>
                      <option>Czech</option>
                      <option>Danish</option>
                      <option>Djiboutian</option>
                      <option>Dominican</option>
                      <option>Citizen of the Dominican Republic</option>
                      <option>Dutch</option>
                      <option>East Timorese</option>
                      <option>Ecuadorean</option>
                      <option>Egyptian</option>
                      <option>Emirati</option>
                      <option>English</option>
                      <option>Equatorial</option>
                      <option>Guinean</option>
                      <option>Eritrean</option>
                      <option>Estonian</option>
                      <option>Ethiopian</option>
                      <option>Faroese</option>
                      <option>Fijian</option>
                      <option>Filipino</option>
                      <option>Finnish</option>
                      <option>French</option>
                      <option>Gabonese</option>
                      <option>Gambian</option>
                      <option>Georgian</option>
                      <option>German</option>
                      <option>Ghanaian</option>
                      <option>Gibraltarian</option>
                      <option>Greek</option>
                      <option>Greenlandic</option>
                      <option>Grenadian</option>
                      <option>Guamanian</option>
                      <option>Guatemalan</option>
                      <option>Citizen of Guinea-Bissau</option>
                      <option>Guinean</option>
                      <option>Guyanese</option>
                      <option>Haitian</option>
                      <option>Honduran</option>
                      <option>Hong Konger</option>
                      <option>Hungarian</option>
                      <option>Icelandic</option>
                      <option>Indian</option>
                      <option>Indonesian</option>
                      <option>Iranian</option>
                      <option>Iraqi</option>
                      <option>Irish</option>
                      <option>Israeli</option>
                      <option>Italian</option>
                      <option>Ivorian</option>
                      <option>Jamaican</option>
                      <option>Japanese</option>
                      <option>Jordanian</option>
                      <option>Kazakh</option>
                      <option>Kenyan</option>
                      <option>Kittitian</option>
                      <option>Citizen of Kiribati</option>
                      <option>Kosovan</option>
                      <option>Kuwaiti</option>
                      <option>Kyrgyz</option>
                      <option>Lao</option>
                      <option>Latvian</option>
                      <option>Lebanese</option>
                      <option>Liberian</option>
                      <option>Libyan</option>
                      <option>Liechtenstein citizen</option>
                      <option>Lithuanian</option>
                      <option>Luxembourger</option>
                      <option>Macanese</option>
                      <option>Macedonian</option>
                      <option>Malagasy</option>
                      <option>Malawian</option>
                      <option>Malaysian</option>
                      <option>Maldivian</option>
                      <option>Malian</option>
                      <option>Maltese</option>
                      <option>Marshallese</option>
                      <option>Martiniquais</option>
                      <option>Mauritanian</option>
                      <option>Mauritian</option>
                      <option>Mexican</option>
                      <option>Micronesian</option>
                      <option>Moldovan</option>
                      <option>Monegasque</option>
                      <option>Mongolian</option>
                      <option>Montenegrin</option>
                      <option>Montserratian</option>
                      <option>Moroccan</option>
                      <option>Mosotho</option>
                      <option>Mozambican</option>
                      <option>Namibian</option>
                      <option>Nauruan</option>
                      <option>Nepalese</option>
                      <option>New Zealander</option>
                      <option>Nicaraguan</option>
                      <option>Nigerian</option>
                      <option>Nigerien</option>
                      <option>Niuean</option>
                      <option>North Korean</option>
                      <option>Northern Irish</option>
                      <option>Norwegian</option>
                      <option>Omani</option>
                      <option>Pakistani</option>
                      <option>Palauan</option>
                      <option>Palestinian</option>
                      <option>Panamanian</option>
                      <option>Papua New Guinean</option>
                      <option>Paraguayan</option>
                      <option>Peruvian</option>
                      <option>Pitcairn Islander</option>
                      <option>Polish</option>
                      <option>Portuguese</option>
                      <option>Prydeinig</option>
                      <option>Puerto Rican</option>
                      <option>Qatari</option>
                      <option>Romanian</option>
                      <option>Russian</option>
                      <option>Rwandan</option>
                      <option>Salvadorean</option>
                      <option>Sammarinese</option>
                      <option>Samoan</option>
                      <option>Sao Tomean</option>
                      <option>Saudi Arabian</option>
                      <option>Scottish</option>
                      <option>Senegalese</option>
                      <option>Serbian</option>
                      <option>Citizen of Seychelles</option>
                      <option>Sierra Leonean</option>
                      <option>Singaporean</option>
                      <option>Slovak</option>
                      <option>Slovenian</option>
                      <option>Solomon Islander</option>
                      <option>Somali</option>
                      <option>South African</option>
                      <option>South Korean</option>
                      <option>South</option>
                      <option>Sudanese</option>
                      <option>Spanish</option>
                      <option>Sri Lankan</option>
                      <option>St Helenian</option>
                      <option>St Lucian</option>
                      <option>Stateless</option>
                      <option>Sudanese</option>
                      <option>Surinamese</option>
                      <option>Swazi</option>
                      <option>Swedish</option>
                      <option>Swiss</option>
                      <option>Syrian</option>
                      <option>Taiwanese</option>
                      <option>Tajik</option>
                      <option>Tanzanian</option>
                      <option>Thai</option>
                      <option>Togolese</option>
                      <option>Tongan</option>
                      <option>Trinidadian</option>
                      <option>Tristanian</option>
                      <option>Tunisian</option>
                      <option>Turkish</option>
                      <option>Turkmen</option>
                      <option>Turks and Caicos Islander</option>
                      <option>Tuvaluan</option>
                      <option>Ugandan</option>
                      <option>Ukrainian</option>
                      <option>Uruguayan</option>
                      <option>Uzbek</option>
                      <option>Vatican citizen</option>
                      <option>Citizen of Vanuatu</option>
                      <option>Venezuelan</option>
                      <option>Vietnamese</option>
                      <option>Vincentian</option>
                      <option>Wallisian</option>
                      <option>Welsh</option>
                      <option>Yemeni</option>
                      <option>Zambian</option>
                      <option>Zimbabwean</option>
                    </select>
                  </label>
                </div>

                <div className="md:col-span-3 col-span-full">
                  <label
                    for="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address <label className="text-main">*</label>
                  </label>
                  <textarea
                    className="bg-light mt-1 py-1 px-3 [resize:none] w-full  outline-none"
                    rows="5"
                    cols="40"
                    id="address"
                    name="address"
                    onChange={handelChange}
                    required={true}
                    defaultValue={profileData?.address}
                  ></textarea>
                </div>
                <div className="grid md:grid-cols-2 grid-cols-1 col-span-6 md:col-span-2 space-y-3 md:space-y-0">
                  <div className="md:col-span-1">
                    <label
                      for="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City <label className="text-main">*</label>
                    </label>
                    <select
                      id="city"
                      name="city"
                      autocomplete="city-name"
                      className="mt-1 block w-full rounded-sm  bg-light py-1 md:px-3"
                      onChange={handelChange}
                      required={true}
                    >
                      <option value="">{profileData?.city == AboutData?.city ? profileData?.city : "Choose"}</option>
                      {city && city?.map((value) => {
                        return <option value={value.name} key={value.id}>{value.name}</option>;
                      })}
                    </select>
                  </div>

                  <div className="md:ml-2">
                    <label
                      for="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country <label className="text-main">*</label>
                    </label>
                    <select
                      id="country"
                      name="country"
                      autocomplete="country-name"
                      className="mt-1 block w-full rounded-sm  bg-light py-1 md:px-3"
                      onChange={handelChange}
                      required={true}
                      defaultValue={profileData?.country}
                    >
                      <option value="" >{profileData?.country ? profileData?.country : "Choose"}</option>
                      {loc && loc?.map((value) => {
                        return <option value={value.name} key={value.id}>{value.name}</option>;
                      })}
                    </select>
                  </div>

                  <div className="col-span-1">
                    <label
                      for="zipCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Zip Code <label className="text-main">*</label>
                    </label>
                    <input
                      type="number"
                      name="zipCode"
                      id="zipCode"
                      autocomplete="email"
                      className="mt-1 block w-full rounded-sm py-1 bg-light  outline-none px-1.5"
                      onChange={handelChange}
                      required={true}
                      defaultValue={profileData?.zipCode}
                    />
                  </div>
                  <div className="col-span-1 md:ml-2">
                    <label
                      for="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State <label className="text-main">*</label>
                    </label>
                    <select
                      id="state"
                      name="state"
                      autocomplete="state-name"
                      className="mt-1 block w-full rounded-sm  bg-light py-1 md:px-3"
                      onChange={handelChange}
                      required={true}
                      defaultValue={profileData?.state}
                    >
                      <option value="">{(profileData?.state && profileData?.state == AboutData?.state) ? profileData?.state : "Choose"}</option>
                      {state && state?.map((value) => {
                        return <option value={value.name} key={value.id}>{value.name}</option>;
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 text-right sm:px-6">
              <button
                type="submit"
                disabled={!loading}
                className={`inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium focus:outline-none ${!loading ? "bg-light text-black" : "bg-main text-white hover:bg-white hover:outline outline-main hover:text-main transition duration-200"
                  }`}
                onSubmit={handelSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default About;
