import React from "react";
import Heading from "../../higherOrderComponents/Heading";
import Testimonials from "./Testimonials";
import Human from "../../assets/Human.svg";
import bgArrow from "../../assets/bgArrow.svg";
import Carousel from "react-elastic-carousel";
import Reviews from "./Reviews";
import Bhavesh from "../../assets/homeAssets/Bhavesh .jpg";
import Mansi from "../../assets/homeAssets/Mansi .jpg";
import Deepanshi from "../../assets/homeAssets/Deepanshi .jpg";
import Mitransh from "../../assets/homeAssets/Mitransh .jpg";

// const Data = [
//   {
//     name: "Full Name",
//     designation: "Lorem,ipsum dite",
//     content:
//       "With plan my admission I found everything I need for applying in one single place. It saved me a lot of time from searching for information on.",
//     image: { Human },
//   },
// ];

const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2 },
];

const dataYT = [
  {
    id: 1,
    link: "https://youtube.com/embed/vpnCunS28oM?si=-1OZxFaUGRK6deS"
  },
  {
    id: 2,
    link: "https://youtube.com/embed/M7cM1c2qKmA?si=3Ms4uijruIriGJRe"
  },
  {
    id: 3,
    link: "https://youtube.com/embed/6Jcq9jwOya8?si=fMS5AbWo_L4hlLit"
  },
  {
    id: 4,
    link: "https://youtube.com/embed/Evyzp-rBRuA?si=Nc3wf64fVRnNfP4V"
  },
]

const dataTestimo = [
  {
    id: 1,
    content: "PlanMyAdmission has been truly exceptional, with a seamless visa process, exceptional coaching from Nitin, and outstanding support from their loan and accounts team.",
    author: "Mansi Soni",
    univ: "University of North Texas",
    img: Mansi,
  },
  {
    id: 2,
    content: "Glad that I made the timely decision to choose PlanMyAdmission Their personalized approach to each student helps turn dreams into reality, with a team that is both motivating and supportive.",
    author: "Mitransh Saini",
    univ: "Angel Ruskin University",
    img: Mitransh,
  },
  {
    id: 3,
    content: "No doubt The process was both efficient and hassle-free. Thanks to the coach, everything became more accessible. Leverage Edu's visa support and mock interviews not only boosted my confidence but also enhanced my responses.",
    author: "Bhavesh Mathur",
    univ: "University of Bristol",
    img: Bhavesh,
  },
  {
    id: 4,
    content: "Team at PlanMyAdmission is so easy to work with. They're always available, keep me in the loop, and everything goes smoothly. I'm really happy with them!",
    author: "Deepanshi",
    univ: "University of Greenwich",
    img: Deepanshi,
  },

]

const SuccessStories = () => {
  return (
    <div className="bg-light ">
      <Heading heading="Success Stories" />
      <Reviews />
      <Heading heading="Testimonials" />
      <div className="relative">
        <img
          src={bgArrow}
          alt=""
          className="hidden lg:block absolute w-full -top-20"
        />
        <div className="hidden sm:block">
          <section className="flex items-center justify-center z-20">
            <Carousel
              style={{ width: "80vw" }}
              className="z-30 crousel"
              breakPoints={breakPoints}
            >

              {dataTestimo && dataTestimo.map((item) => {
                return <Item props={item} />
              })}
              {/* <Item />
              <Item />
              <Item />
              <Item /> */}
            </Carousel>
          </section>
        </div>
        <div className="sm:hidden">
          <section className="flex items-center justify-center z-20">
            <Carousel
              style={{ width: "100vw" }}
              className="z-30"
              breakPoints={breakPoints}
            >
              {dataTestimo && dataTestimo.map((item) => {
                return <Item props={item} />
              })}
            </Carousel>
          </section>
        </div>

        {/* <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 justify-center items-center  lg:py-20 py-10 z-20 mx-auto max-w-7xl overflow-hidden"> */}
        {/* <div className="flex flex-col md:flex-row justify-center items-center gap-5 max-w-7xl mx-auto lg:pt-20 px-10 py-10 z-20">
          <YouTube />
          <YouTube />
          <YouTube />
          <YouTube />
        </div> */}
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto lg:py-20 py-10 px-20 z-20">
          {dataYT && dataYT.map((item) => {
            return <YouTube props={item} />
          })}
        </div>
      </div>
    </div>
  );
};


const YouTube = ({ props }) => {
  return (
    // <div className="z-20 flex-1">
    //   <div className="aspect-w-9 aspect-h-16">
    //     <iframe
    //       src="https://www.youtube.com/embed/AqAKTCU2Zvo"
    //       title="Start SOP early || Tips to Write SOP || #shorts #studyabroad #statementofpurpose"
    //       frameBorder="0"
    //       className="rounded-md "
    //     ></iframe>
    //   </div>
    <>
      {console.log(props.link)}
      <div className="aspect-w-9 aspect-h-16 relative">
        <iframe
          src={props.link}
          title="#shorts #studyabroad #statementofpurpose"
          frameBorder="0"
          className="rounded-md "
        ></iframe>
        {/* <div className="bg-gradient-to-t from-blurpink to-transparent p-3 text-white relative translate-y-5/2 rounded-md h-10 ">
          Full Name
        </div> */}
      </div>
    </>
  );
};

const Item = ({ props }) => {
  return (
    <>
      <Testimonials props={props} />
    </>
  );
};
export default SuccessStories;
