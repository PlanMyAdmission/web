import React from "react";
import Header from "../../higherOrderComponents/Header";
import Heading from "../../higherOrderComponents/Heading";
import ArticleImage from "../../assets/homeAssets/ArticleImage.svg";
import Timeline from "./Timeline";

const HowItWorks = () => {
  return (
    <div>
      <Header heading={"How it works"} />
      <Heading heading="Simplifying Application Process" />
      <Section />
      <Heading heading="How to get Started" />
      <Timeline />
    </div>
  );
};

const Section = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-evenly max-w-6xl px-2 sm:px-5 md:mx-auto md:mb-20 mb-10 mx-5">
      <p className="md:px-10 md:mx-10 w-full py-10 ">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum minima
        magni aliquid voluptates facere maxime aliquam distinctio quidem?
        Quibusdam exercitationem autem tenetur voluptatem dicta nemo assumenda
        rerum iusto inventore veritatis ipsa doloribus adipisci natus soluta
        earum, minus itaque repellendus nobis quisquam non nulla optio.
        Obcaecati aspernatur architecto possimus ad odit.
      </p>
      <img
        src={ArticleImage}
        alt="image"
        className="h-[250px] object-cover object-center"
      />
    </div>
  );
};
export default HowItWorks;
