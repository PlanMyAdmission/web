import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ContentSection = ({
  id,
  content,
  features = [],
  btn1 = "Register",
  btn2 = "Learn More",
  video,
  forInstitutions = false,
}) => {
  const navigate = useNavigate();
  const [scrollTo, setScrollTo] = useState(false);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight - 1150,
      behavior: "smooth",
    });
  };

  return (
    <section
      id={id}
      className="w-full bg-light py-10 md:py-14"
    >
      <div className="flex flex-col md:flex-row justify-between max-w-7xl mx-auto px-5 md:px-0 gap-10">
        {/* Text Section */}
        <div className="flex-1">
          <p className="text-gray-800 text-sm md:text-base leading-relaxed mb-4">
            {content}
          </p>
          <ul className="list-disc space-y-2 md:px-8 marker:text-main text-sm text-gray-700">
            {features.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 md:px-8">
            <button
              disabled={forInstitutions}
              className={`px-4 py-2 rounded-md text-white sm:w-full ${
                forInstitutions
                  ? "bg-main cursor-not-allowed opacity-70"
                  : "bg-main hover:bg-opacity-90"
              }`}
              onClick={() => {
                if (!forInstitutions) navigate("/register");
              }}
            >
              {btn1}
            </button>
            <button
              className="px-4 py-2 rounded-md border border-main text-main hover:bg-light sm:w-full"
              onClick={scrollToBottom}
            >
              {btn2}
            </button>
          </div>
        </div>

        {/* Video Section */}
        {video && (
          <div className="flex-1">
            <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden shadow-sm">
              <iframe
                src={video}
                title="Plan My Admission"
                className="w-full h-full rounded-md"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContentSection;
