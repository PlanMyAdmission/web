import React from "react";
import person1 from "../../assets/homeAssets/deepakbhatia.jpeg";
import person2 from "../../assets/homeAssets/Shagunbansal.jpeg";
import person3 from "../../assets/homeAssets/virensood.jpeg";
import person4 from "../../assets/homeAssets/Ritikasingh.jpeg";
import StarRateIcon from "@mui/icons-material/StarRate";
import Carousel from "react-elastic-carousel";
import Girl2 from "../../assets/homeAssets/Girl2.svg";
// import { useState } from "react";

class Content extends React.Component {
  render() {
    const handelLeft = () => {
      this.carousel.slidePrev();
    };
    const handelRight = () => {
      this.carousel.slideNext();
    };
    return (
      <Carousel
        ref={(ref) => (this.carousel = ref)}
        showArrows={false}
        itemsToShow={1}
      >
        <Reviews
          {...Data[0]}
          onShowLeft={handelLeft}
          onShowRight={handelRight}
        />
        <Reviews
          {...Data[1]}
          onShowLeft={handelLeft}
          onShowRight={handelRight}
        />
        <Reviews
          {...Data[2]}
          onShowLeft={handelLeft}
          onShowRight={handelRight}
        />
        <Reviews
          {...Data[3]}
          onShowLeft={handelLeft}
          onShowRight={handelRight}
        />
      </Carousel>
    );
  }
}
const Reviews = ({
  gyan,
  author,
  university,
  onShowRight,
  onShowLeft,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-10">
      <article className="flex flex-wrap items-start pb-24 sm:pb-32">

        {/* Testimonial Card */}
        <div className="bg-white basis-80 grow-[5] relative -mb-32 mt-10 -ml-4 sm:-ml-20 p-6 sm:p-8 lg:p-10 rounded-lg sm:[clip-path:polygon(0_theme(spacing.2),100%_0,calc(100%-theme(spacing.8))_calc(100%-theme(spacing.4)),theme(spacing.8)_94%)] shadow-md">
          <p className="text-main flex">
            {[...Array(5)].map((_, i) => (
              <StarRateIcon key={i} fontSize="small" />
            ))}
          </p>

          <figure>
            <blockquote className="pt-3 text-gray-700 text-sm sm:text-base leading-relaxed">
              {gyan}
            </blockquote>

            <figcaption className="mt-6 sm:pl-10">
              <cite className="not-italic sm:flex sm:justify-between">
                <div>
                  <b className="block text-lg sm:text-xl relative">
                    <span className="absolute top-0 right-[calc(100%+4px)]">-</span>
                    {author}
                  </b>
                  <span className="text-main text-sm">{university}</span>
                </div>

                <div className="flex py-4 sm:pt-0 sm:ml-4">
                  <button
                    className="text-white bg-main py-1 px-2 mr-2 rounded-sm"
                    onClick={onShowLeft}
                  >
                    &larr;
                  </button>
                  <button
                    className="text-white bg-main py-1 px-2 rounded-sm"
                    onClick={onShowRight}
                  >
                    &rarr;
                  </button>
                </div>
              </cite>
            </figcaption>
          </figure>
        </div>
      </article>
    </div>
  );
};

const Data = [
  {
    gyan: "PlanMyAdmission is an exciting and supportive platform with a fantastic team dedicated to helping students pursue their studies abroad. I found their assistance to be very helpful, and they were always ready to answer not only my questions but also those of my parents. Choosing to take their counseling was one of the best decisions I made. Thanks to their guidance, I successfully secured admission and a visa for my Bachelor of Science in Accounting program at Central Queensland University in Australia.",
    author: "Viren Sood",
    university: "Central Queensland University in Australia.",
    image: person3,
  },
  {
    gyan: "Had a wonderful journey with PlanMyAdmission and I attribute much of that to Mr. Deepak. He played a pivotal role in my counseling, always available to offer guidance throughout the entire process. Not only does he possess great knowledge about studying abroad, but his expertise in visa matters made a significant impact. Thanks to his help, I successfully secured admission to Long Island University - C W Post, USA for my Master's in Biology. Thank you!",
    author: "Ritika Singh",
    university: "Long Island University ",
    image: person4,
  },

  {
    gyan: "My experience with PlanMyAdmission was truly  transformative. Their expert guidance, personalized support, and dedicated mentorship played a pivotal role in helping me achieve my dream of studying abroad. Thanks to their assistance, I not only secured acceptance letters from top universities but also valuable scholarships, making my educational aspirations a reality. I'm immensely grateful for their unwavering commitment to my success.",
    author: "Deepak Bhatia",
    university: "University of Glasgow",
    image: person1,
  },


  {
    gyan: "I want to express my sincere thanks and appreciation for the outstanding help I received from PlanMyAdmission during my entire journey. Their in-depth knowledge of the UK higher education system was evident at every stage. Thanks to PlanMyAdmission, my dream of studying abroad is now a reality. Their rock-solid support and guidance have been invaluable. Grateful to the entire team.",
    author: "Shagun bansal",
    university: "University of Bristol- UK",
    image: person2,
  },
];
export default Content;
