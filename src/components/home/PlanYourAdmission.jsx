import React from "react";
import Heading from "../../higherOrderComponents/Heading";
import ContentSection from "../../higherOrderComponents/ContentSection";

const PlanYourAdmission = ({ props }) => {
  return (
    <div className="bg-light py-8">
      {/* underline with heading */}
      <Heading heading="Plan Your Admission with us" />
      <ContentSection {...data} props={props} />
    </div>
  );
};

const data = {
  id: 1,
  content:
    "Start your study abroad journey and Let our expert Plan & Secure your admission. PMA based out of Mumbai is an emerging AI Platform is team of overseas education expert that plans you overseas education & help you get into the best universities in the world.",
  features: [
    "Propritory AI Platform to recommend best suited university based on you profile with 95% accuracy rate.",
    "10+ year expert mentor to support one on one till admission is secured.",
    "Generative AI assisted process.",
  ],
  btn1: "Register Now",
  btn2: "Book Your Consultation",
  video: "https://www.youtube.com/embed/0Qoct60N6lY",
  forInstitutions: false,
};

export default PlanYourAdmission;
