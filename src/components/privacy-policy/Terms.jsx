import React from "react";
import Header from "../../higherOrderComponents/Header";
import data from "./term&conditions";

const Content = (data) => {
  return (
    <div className="max-w-7xl md:mx-auto bg-light md:px-10 py-10 rounded-xl px-5 mx-2 md:mb-20 mb-5">
      <h1 className="font-bold text-2xl">{data.head}</h1>
      <p className="py-4">{data.content}</p>
      <ol className="list-decimal px-3">
        {data.policy.map((item) => {
          return (
            <div key={item.title} className="mb-3">
              <li className="font-bold text-xl py-2">{item.title}</li>
              <p>{item.description}</p>
            </div>
          );
        })}
      </ol>
    </div>
  );
};

const Terms = () => {
  return (
    <div>
      <Header heading="Terms & Conditions" />
      <Content {...data} />
    </div>
  );
};

export default Terms;
