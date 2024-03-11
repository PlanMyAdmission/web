import React from "react";

//responsive ness reamaing

const Header = ({ heading }) => {
  return (
    <h1 className="flex flex-1 md:gap-20 sm:gap-8 gap-5 lg:text-6xl md:text-5xl sm:text-4xl text-2xl pl-5 font-bold uppercase tracking-tight my-20 md:pl-28 whitespace-nowrap">
      {heading}
      <span className="grow bg-main"></span>
    </h1>
  );
};

export default Header;

// <div className="grid md:grid-cols-4 grid-cols-2 gap-5 my-20">
//   <h1 className="md:text-6xl sm:text-4xl text-2xl uppercase md:col-span-2 col-span-1 font-bold md:mx-auto px-5 ">
//     {heading}
//   </h1>
//   <span className="bg-main md:col-span-2 col-span-1"></span>
// </div>
//     <div className="font-bold flex justify-between items-center my-20">
//   <h1 className="justify-center text-black md:text-7xl sm:text-4xl text-2xl md:pl-[150px] pl-[30px] w-2/3 uppercase ">
//     {heading}
//   </h1>
//   <span className="ml-[10px] w-full bg-main h-[70px]"></span>
// </div>

// <div className="my-20">
//       <h1 className="text-black flex md:text-7xl sm:text-4xl text-3xl md:pl-[7vw] font-bold w-1/3 uppercase after:content['']  after:md:h-[72px] after:h-[50px] after:bg-main after:w-2/3 after:absolute after:right-0 after:left-50 ">
//         {heading}
//       </h1>
//     </div>

{
  /* <h1 class="text-2xl sm:text-4xl md:text-6xl uppercase font-bold whitespace-nowrap flex gap-4">
  Terms and conditions
  <span class="bg-pink-600 grow"></span>
</h1> */
}

// <h1 class="flex flex-1 md:gap-20 sm:gap-8 gap-5 lg:text-6xl md:text-5xl sm:text-4xl text-xl pl-5 font-bold uppercase tracking-tight my-20 md:pl-20 whitespace-nowrap">
//    {heading}
//   <span class="grow bg-pink-600"></span>
// </h1>
