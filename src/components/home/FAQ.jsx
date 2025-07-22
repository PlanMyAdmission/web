import React, { useState } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Heading from "../../higherOrderComponents/Heading";

const data = [
  {
    id: 1,
    question: "What is PlanMyAdmission?",
    answer:
      "PlanMyAdmission is a premier overseas education edtech company formed to help you achieve your dream of studying abroad. Powered by AI and a team of experts, we provide comprehensive support throughout the university application process, saving you time and money.",
  },
  {
    id: 2,
    question: "Why should I choose PlanMyAdmission?",
    answer:
      "With over 250,000 courses and 3,000 universities to choose from, PlanMyAdmission makes it easy for students to find their dream university. Our platform also boasts a community of over 100,000 students and we have helped over 10,000 students study abroad. Additionally, our team of experienced education counselors has a combined experience of 50+ years ensuring personalized assistance for each student. Our successful track record includes sending students to top universities like Stanford University, Carnegie Mellon University, and Pennsylvania State University. Don't just take our word for it, read what our students have to say in their testimonials. Unlike any other overseas consultancy, we have unique AI technology that helps our students save time and money while they apply to top universities in the world.",
  },
  {
    id: 3,
    question: "What are the services offered by Planmyadmission?",
    points: [
      "Free initial counseling session for studying overseas.",
      "Personalized career counseling to help you make the best decision for your future.",
      "A dedicated student counselor who will guide you throughout your study abroad journey.",
      "24x7 support to address all your study abroad queries.",
      "A vibrant community of over 100,000 students aspiring to study abroad after 12th grade or graduation.",
      "Access to exclusive webinars conducted by our experienced study abroad counselors.",
      "Choose from 10 popular study destinations and over 4,000 courses.",
      "Quick and personalized university recommendations to help you make the best choice.",
      "Online preparation for study abroad exams such as GRE and TOEFL.",
      "Advanced AI technology to evaluate your application documents, including SOP, LOR, and Resume.",
      "Assistance in applying for scholarships, loans, and other financial aid.",
      "Preparation for university and visa interviews with instant constructive feedback.",
    ],
  },
  {
    id: 4,
    question: "What are the best countries to study abroad?",
    answer:
      "Top study abroad countries: Study in USA | Study in UK | Study in Canada | Study in Germany | Study in Australia | Study in New Zealand",
  },
  {
    id: 5,
    question: "What are the top universities in the world to study abroad?",
    answer:
      "Top study abroad universities: Harvard University | Oxford University | Stanford University | University of Toronto | Cambridge University | Conestoga College | Centennial College | Columbia University | Seneca College | University of British Columbia",
  },
  {
    id: 6,
    question: "What are the best courses abroad?",
    answer:
      "Top courses abroad: Architecture | Business & Management | Chemistry | Computer Science | Design | Economics | Engineering | Journalism | Law | Mathematics | Medicine | Physics | Psychology | Public Administration | Statistics",
  },
  {
    id: 7,
    question: "What study abroad programs are offered by you?",
    answer:
      "We help students apply to all the countries and courses mentioned above, and more.",
  },
];

const AccordionItem = ({ item, isOpen, onToggle }) => {
  return (
    <div className="flex justify-center mx-2">
      <div className="m-2 md:px-5 pl-2 py-3 bg-light sm:w-3/4 w-full mx-auto rounded-lg">
        <h2
          className="font-semibold flex justify-between items-center cursor-pointer px-2 md:px-0"
          onClick={onToggle}
        >
          {item.question}
          <span>{isOpen ? <ExpandLessIcon fontSize="large" /> : <ExpandMoreIcon fontSize="large" />}</span>
        </h2>
        {isOpen && (
          <div className="mt-2 px-2 md:px-0 text-sm transition-all ease-in duration-300">
            {item.answer && <p>{item.answer}</p>}
            {item.points && (
              <ul className="list-decimal list-inside mt-2 space-y-1">
                {item.points.map((point, idx) => (
                  <li key={idx}>
                    <span className="font-medium text-main">{idx + 1}. </span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const FAQ = () => {
  const [activeId, setActiveId] = useState(null);

  const toggleAccordion = (id) => {
    setActiveId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="md:mb-20 mb-8">
      <Heading heading="Frequently Asked Questions" />
      {data.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={activeId === item.id}
          onToggle={() => toggleAccordion(item.id)}
        />
      ))}
    </div>
  );
};

export default FAQ;
