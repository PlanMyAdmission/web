import React from "react";

const university = [
  {
    id: "5f044f13a55e24365a7238a4",
    name: "Stanford University",
    logo: "https://cdn.ischoolconnect.com/logo/1991.png",
    addr_city: "Stanford",
    addr_state: "California",
    addr_country: "USA",
  },
  {
    id: "5f044f13a55e24365a7238a1",
    name: "St. Thomas More College",
    logo: "https://cdn.ischoolconnect.com/logo/1988.png",
    addr_city: "Saskatoon",
    addr_state: "Saskatchewan",
    addr_country: "CAN",
  },
];

const Applications = () => {
  return (
    <div className="max-w-7xl mx-auto my-10 h-96">
      <h1 className="font-bold text-3xl p-3 rounded-md">Applications</h1>
      {university.map((data) => {
        return (
          <div
            key={data.id}
            className="flex  items-center bg-light m-2 rounded-md py-5 px-5"
          >
            <img src={data.logo} alt={data.id} className="h-20 rounded-md" />
            <div>
              <h1 className="text-xl font-bold px-5">{data.name}</h1>
              <ul className="text-main  text-xs flex flex-row px-5 ">
                <li className="">
                  {data.addr_city}, {data.addr_state}
                </li>
                <li className="px-2">{data.addr_country}</li>
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Applications;
