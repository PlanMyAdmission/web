import {React, useState} from "react";
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

import Testimony1 from "../../assets/testimonies/PlanMyAdmission -1.png";
import Testimony2 from "../../assets/testimonies/PlanMyAdmission -2.png";
import Testimony3 from "../../assets/testimonies/PlanMyAdmission -3.png";
import Testimony4 from "../../assets/testimonies/PlanMyAdmission -4.png";



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
    thumbnail: Testimony1,
    link: "https://firebasestorage.googleapis.com/v0/b/abroad-studies.appspot.com/o/testimonials%2FPlanMyAdmission%20-1.mp4?alt=media&token=a08295c7-6864-4985-ba53-200165452c02"
  },
  {
    id: 2,
    thumbnail: Testimony2,
    link: "https://firebasestorage.googleapis.com/v0/b/abroad-studies.appspot.com/o/testimonials%2FPlanMyAdmission%20-2.mp4?alt=media&token=0e431a07-9cf3-4094-abb6-924d6c6b4738"
  },
  {
    id: 3,
    thumbnail: Testimony3,

    link: "https://firebasestorage.googleapis.com/v0/b/abroad-studies.appspot.com/o/testimonials%2FPlanMyAdmission%20-3.mp4?alt=media&token=01e090cc-aae4-4d0f-9d8d-9e4e644a4f40"
  },
  {
    id: 4,
    thumbnail: Testimony4,

    link: "https://firebasestorage.googleapis.com/v0/b/abroad-studies.appspot.com/o/testimonials%2FPlanMyAdmission%20-4.mp4?alt=media&token=8475eae3-eb40-4c49-a59c-22f7ca80d419"
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
    content: "Team at PlanMyAdmission is so easy to work with. They're always available, keep me in the loop, and everything goes smoothly. I'm really happy with them!",
    author: "Deepanshi",
    univ: "University of Greenwich",
    img: Deepanshi,
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
    content: "Glad that I made the timely decision to choose PlanMyAdmission Their personalized approach to each student helps turn dreams into reality, with a team that is both motivating and supportive.",
    author: "Mitransh Saini",
    univ: "Angel Ruskin University",
    img: Mitransh,
  },
  {
    id: 5,
    content: "Reflecting on my journey, I recall the uncertain beginnings of my overseas education process, having previously felt unsupported and unsure. That changed with the guidance I received through Plan My Admission. From day one, I was met with unwavering commitment and empathy, transforming my outlook and giving me the confidence to pursue my dreams. The support extended beyond professional advice—it included personal encouragement and dedicated listening, even during moments of frustration. Over eight months, this steadfast guidance helped me navigate tough decisions and finally secure admission to a top university in the USA. Looking back, I firmly believe this achievement would not have been possible without their expertise and heartfelt support.",
    author: "Riddhi Singh Rathore"
  },
  {
    id: 6,
    content: "After facing confusion and repeated doubt in the admission process, finding Plan My Admission proved to be a turning point. The team assisted me at every step, from shaping my resume and Statement of Purpose to timely solutions for every query and concern. Their consistent availability gave me peace of mind, and the genuine care made me feel understood and valued. Through their expert advice, I was able to submit strong applications and ultimately secure admission at one of the best colleges matching my ambitions. I am grateful for their guidance and can confidently recommend their services to anyone looking for personalized and reliable support in higher education.",
    author:"Hema Jangir"
  },
  {
    id: 7,
    content:"My experience with Plan My Admission began with the daunting process of applying for master’s programs abroad. With their expertise, I received personalized counseling, proactive guidance on my applications, and thorough support during the visa process. Even complex procedures felt manageable thanks to their clear advice and ongoing encouragement. Regular follow-ups, helpful resources, and skilled mentoring made every stage less overwhelming, leading to successful admission in the right college and swift visa approval. I highly recommend their support to anyone planning to study abroad and needing expert help for their higher education journey.",
    author:"Ashish Giri"
  }



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
          <section className="flex items-center justify-center z-20 px-4">
            <Carousel
              style={{ width: "80vw", maxWidth: "1200px" }}
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
        <section className="flex items-stretch justify-center z-20 px-4">
            <Carousel
              style={{ width: "calc(100vw - 2rem)" }}
              className="z-30 flex items-stretch justify-center z-20"
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
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto lg:py-20 py-10 sm:px-20 px-4 z-20">
          {dataYT && dataYT.map((item) => {
            return <YouTube props={item} />
          })}
        </div>
      </div>
    </div>
  );
};
const YouTube = ({ props }) => {
  const [play, setPlay] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto aspect-[9/16] relative rounded-xl overflow-hidden bg-black shadow-md">
      {play ? (
        <video
          src={props.link}
          controls
          autoPlay
          className="w-full h-full object-cover"
          preload="metadata"
        />
      ) : (
        <>
          {/* Thumbnail Image */}
          <img
            src={props.thumbnail}
            alt="Video Thumbnail"
            className="w-full h-full object-cover"
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setPlay(true)}
              className="flex items-center justify-center h-16 w-16 bg-main/70 hover:bg-main transition rounded-full shadow-xl border-2 border-white/30"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
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
