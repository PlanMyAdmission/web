import React from "react";

const Preferences = () => {
  const label_style = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-5xl mx-auto py-5 px-7 rounded-sm mb-10 space-y-2">
      <div className="">
        <label className={label_style}>
          Which degree are you looking for ?
        </label>
        <select
          className="mt-1 block w-1/3 rounded-sm bg-light py-1.5 px-3"
          // onChange={(e) => handlechange(index, e)}
        >
          <option>Bachelors</option>
          <option>Masters</option>
          <option>Kazakistani</option>
        </select>
      </div>
      <div>
        <label className={label_style}>
          Which discipline are you interested in ?
        </label>
        <select
          className="mt-1 block w-1/3 rounded-sm bg-light py-1.5 px-3"
          // onChange={(e) => handlechange(index, e)}
        >
          <option>Bachelors</option>
          <option>Masters</option>
          <option>Kazakistani</option>
        </select>
      </div>
      <div>
        <label className={label_style}>
          Which sub-disciplines are you interested in ?
        </label>
        <select
          className="mt-1 block w-1/3 rounded-sm bg-light py-1.5 px-3"
          // onChange={(e) => handlechange(index, e)}
        >
          <option>Bachelors</option>
          <option>Masters</option>
          <option>Kazakistani</option>
        </select>
      </div>
      <div>
        <label className={label_style}>When are you planning to apply ?</label>
        <select
          className="mt-1 block w-1/3 rounded-sm bg-light py-1.5 px-3"
          // onChange={(e) => handlechange(index, e)}
        >
          <option>2022</option>
          <option>2023</option>
          <option>2024</option>
        </select>
      </div>
      <div>
        <label className={label_style}>What is your budget ?</label>
        <input
          type="number"
          className="outline-none p-1 px-1.5 bg-light"
        ></input>
      </div>
      <button type="submit" className="bg-light px-4 p-1 mt-5 mr-3 rounded-sm">
        Save
      </button>
    </div>
  );
};

export default Preferences;
