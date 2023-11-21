import React from "react";

const Timeline = () => {
  return (
    <div className="flex flex-col mx-auto max-w-3xl mb-20">
      <ul className="">
        {data.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-light mb-8 rounded-lg md:px-10 px-5 py-5 flex flex-row items-center justify-center relative "
            >
              {/* <span className="bg-main text-white font-bold w-[100px] inline-flex rounded-full items-center h-auto px-5 py-5 md:mr-10 mr-4 "> */}
              <span className="w-[120px] rounded-full inline-flex bg-main sm:mr-8 mr-4 md:p-5 p-4 text-white font-bold text-2xl object-cover object-center">
                {item.id}
              </span>
              <div>
                <li className="font-bold sm:text-2xl text-xl pb-2">
                  {item.title}
                </li>
                <p>{item.detatils}</p>
              </div>
              <div
                className={
                  item.id !== "04"
                    ? "bg-main w-1 h-24 -z-40 absolute -bottom-10 md:left-[70px] left-[50px]"
                    : ""
                }
              ></div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Timeline;

const data = [
  {
    id: "01",
    title: "Create your account",
    detatils:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum minima magni aliquid voluptates facere maxime aliquam distinctio quidem?Quibusdam exercitationem autem tenetur voluptatem dicta nemo assumenda",
  },
  {
    id: "02",
    title: "Shortlist University",
    detatils:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum minima magni aliquid voluptates facere maxime aliquam distinctio quidem?Quibusdam exercitationem autem tenetur voluptatem dicta nemo assumenda",
  },
  {
    id: "03",
    title: "Consult your expert",
    detatils:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum minima magni aliquid voluptates facere maxime aliquam distinctio quidem?Quibusdam exercitationem autem tenetur voluptatem dicta nemo assumenda",
  },
  {
    id: "04",
    title: "Apply",
    detatils:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum minima magni aliquid voluptates facere maxime aliquam distinctio quidem?Quibusdam exercitationem autem tenetur voluptatem dicta nemo assumenda",
  },
];
