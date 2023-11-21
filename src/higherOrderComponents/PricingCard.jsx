import React from "react";

const Card = (plan) => {
  console.log(plan.forInstitutions);
  return (
    <div className="bg-white shadow-lg rounded-3xl flex flex-col">
      <div
        key={plan.title}
        className={`${
          plan.forInstitutions
            ? "border-b-2 border-main md:mx-auto"
            : "bg-light shadow-lg rounded-2xl  "
        } m-4 text-center `}
      >
        <h3 className="text-5xl font-bold py-2 text-main">{plan.title}</h3>
        <h3 className="text-4xl font-bold py-2 ">
          ${plan.price}
          <span className="text-[15px] text-grey">{plan.frequency}</span>
        </h3>
        <p className="py-4 font-bold">{plan.description}</p>
      </div>

      {/* features */}

      <ul className="mt-6 space-y-4 px-8 flex-1">
        {plan.features.map((feature) => {
          return (
            <li key={feature} className="leading-6 flex">
              <svg
                className="w-5 h-5 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 14.967 14.967"
              >
                <path
                  id="icons8-check-all"
                  d="M3.627,2A1.611,1.611,0,0,0,2,3.627v8.785a1.611,1.611,0,0,0,1.627,1.627h8.785a1.611,1.611,0,0,0,1.627-1.627V4.542l-.651.712v7.158a.959.959,0,0,1-.976.976H3.627a.959.959,0,0,1-.976-.976V3.627a.959.959,0,0,1,.976-.976h8.592l.549-.62c-.13,0-.226-.031-.356-.031Zm9.517,1.088L7.511,9.351,4.817,6.962l-.427.488,2.928,2.6.244.214.214-.244,5.857-6.507Zm1.546,1.84v.651h.651a.959.959,0,0,1,.976.976V15.34a.959.959,0,0,1-.976.976H6.555a.959.959,0,0,1-.976-.976V14.69H4.928v.651a1.611,1.611,0,0,0,1.627,1.627H15.34a1.611,1.611,0,0,0,1.627-1.627V6.555A1.611,1.611,0,0,0,15.34,4.928Z"
                  transform="translate(-2 -2)"
                  fill="currentColor"
                />
              </svg>
              <span className="ml-3">{feature}</span>
            </li>
          );
        })}
      </ul>
      <button className="mt-8 mb-5 block border border-main rounded-full mx-6 py-2 px-3 text-center hover:text-white hover:bg-main font-semibold">
        {plan.cta}
      </button>
    </div>
  );
};

export default Card;
