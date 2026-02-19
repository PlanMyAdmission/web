import React, { useRef } from 'react';
import Heading from '../../higherOrderComponents/Heading';
import UniversityCard from './UniversityCard';
import harvard from '../../assets/homeAssets/harvard.png';
import oxford from '../../assets/homeAssets/oxford.png';
import stanford from '../../assets/homeAssets/stanford.png';
import cambridge from '../../assets/homeAssets/cambridge.png';
import toronto from '../../assets/homeAssets/toronto.png';

const Universities = ({ usedFor }) => {
  const hold = useRef(null);
  const handelwheel = (e) => {
    hold.current.scrollLeft += e.deltaY;
  };

  return (
    <div className="relative md:my-16  md:bg-gradient-to-t from-main to-main bg-[length:100%_75%] bg-no-repeat bg-center flex flex-col md:flex-row md:ml-[20%] md:w-[80%] ">
      <h1 className="hidden md:flex items-center px-5 py-3 text-2xl font-bold text-white md:text-5xl">
        Top Universities with us
      </h1>
      <div className="md:hidden block">
        <Heading heading={'Our Top Universites'} />
      </div>
      <div className="md:overflow-hidden overflow-x-auto hide-scroll-bar min-w-0">
        <div className="md:animate-carousel flex">
          {data &&
            data.map((univ) => {
              return <UniversityCard usedFor={usedFor} props={univ} />;
            })}
        </div>
      </div>
    </div>
  );
};

const data = [
  {
    id: 1,
    name: 'Harvard University',
    location: 'Cambridge, USA',
    img: harvard,
  },
  {
    id: 2,
    name: 'Oxford University',
    location: 'Oxford, GBR',
    img: oxford,
  },
  {
    id: 3,
    name: 'Stanford University',
    location: 'Stanford, USA',
    img: stanford,
  },
  {
    id: 4,
    name: 'University of Toronto',
    location: 'Toronto, CAN',
    img: toronto,
  },
  {
    id: 5,
    name: 'University of Cambridge',
    location: 'Cambridge, GBR',
    img: cambridge,
  },
];

// <div className="relative my-20 ">
//   <div className="h-44  bg-main md:ml-44 rounded-lg my-10 hidden md:block">
//     <h1 className="text-white  md:text-5xl text-2xl font-bold p-5 w-[300px]">
//       Top Universities with us
//     </h1>
//   </div>
//   <div className="md:hidden block">
//     <Heading heading={"Our Top Universites"} />
//   </div>
//   <div
//     title="Scroll"
//     ref={hold}
//     onWheel={handelwheel}
//     className={`${
//       usedFor === "institutions" ? "top-[-60px]" : "top-[-30px]"
//     } md:absolute md:w-1/2 flex  right-0 overflow-x-auto hide-scroll-bar snap-x snap-mandatory snap-center cursor-w-resize `}
//   >
//     <UniversityCard usedFor={usedFor} />
//     <UniversityCard usedFor={usedFor} />
//     <UniversityCard usedFor={usedFor} />
//     <UniversityCard usedFor={usedFor} />
//     <UniversityCard usedFor={usedFor} />
//     <UniversityCard usedFor={usedFor} />
//     <UniversityCard usedFor={usedFor} />
//   </div>
// </div>
export default Universities;
