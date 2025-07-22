import React from "react";
import image1 from "../../assets/diff11.jpg";
import image2 from "../../assets/diff2.jpg";
import image3 from "../../assets/diff3.jpg";

const contentSections = [
  {
    title: "Get Personalized Course Recommendations from 300,000+ Global Programs",
    description: "Our AI-powered engine analyzes your background and preferences to help you discover the most relevant study abroad programs tailored just for you.",
    image: image1,
  },
  {
    title: "Boost Your Applications with Our Generative AI Writing Mentor",
    description: "Craft compelling statements of purpose, essays, and resumes with real-time suggestions and edits powered by cutting-edge generative AI.",
    image: image3,
  },
  {
    title: "Guidance from Experts with 10+ Years of Experience",
    description: "Get mentorship from seasoned professionals who’ve helped thousands of students successfully gain admission into top universities across the world.",
    image: image2,
  },
];

const HowpmaIsDifferent = () => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-center text-3xl md:text-4xl font-bold mb-8">
          How PMA is Different
          <div className="mx-auto mt-2 h-1 w-16 bg-main"></div>
        </h1>

        <div className="space-y-12">
          {contentSections.map((section, idx) => (
            <SectionBlock
              key={idx}
              title={section.title}
              description={section.description}
              image={section.image}
              reverse={idx % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const SectionBlock = ({ title, description, image, reverse }) => {
  return (
    <div
      className={`flex flex-col-reverse md:flex-row ${
        reverse ? "md:flex-row-reverse" : ""
      } items-center gap-8`}
    >
      {/* Text Section */}
      <div className="md:w-1/2">
        <h2 className="text-xl md:text-2xl font-semibold mb-3">{title}</h2>
        <p className="text-gray-700 text-base">{description}</p>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src={image}
          alt="Section"
          className="w-full max-w-[300px] md:max-w-[320px] lg:max-w-[360px] rounded-md object-contain shadow-sm"
        />
      </div>
    </div>
  );
};

export default HowpmaIsDifferent;
