import React, { useState } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Heading from "../../higherOrderComponents/Heading";

const data = [
  {
    id: 1,
    question:
      "What is PlanMyAdmission?",
    answer:
      "PlanMyAdmission is a premier overseas education edtech company formed to help you achieve your dream of studying abroad. Powered by AI and a team of experts, we provide comprehensive support throughout the university application process, saving you time and money.",
  },
  {
    id: 2,
    question:
      "Why should I choose PlanMyAdmission?",
    answer:
      "With over 250,000 courses and 3,000 universities to choose from, PlanMyAdmission makes it easy for students to find their dream university. Our platform also boasts a community of over 100,000 students and we have helped over 10,000 students study abroad. Additionally, our team of experienced education counselors has a combined experience of 50+ years ensuring personalized assistance for each student. Our successful track record includes sending students to top universities like Stanford University, Carnegie Mellon University, and Pennsylvania State University. Don't just take our word for it, read what our students have to say in their testimonials. Unlike any other overseas consultancy, we have unique AI technology that helps our students save time and money while they apply to top universities in the world.",
  },
  {
    id: 3,
    question:
      "What are the services offered by Planmyadmission? ",
    answer: "",
    p1: "Free initial counseling session for studying overseas. ",
    p2: "Personalized career counseling to help you make the best decision for your future.",
    p3: "A dedicated student counselor who will guide you throughout your study abroad journey.",
    p4: "24x7 support to address all your study abroad queries.",
    p5: "A vibrant community of over 100, 000 students aspiring to study abroad after 12th grade or graduation.",
    p6: "Access to exclusive webinars conducted by our experienced study abroad counselors.",
    p7: "Choose from 10 popular study destinations and over 4, 000 courses.",
    p8: "Quick and personalized university recommendations to help you make the best choice.",
    p9: "Online preparation for study abroad exams such as GRE and TOEFL.",
    p10: "Advanced AI technology to evaluate your application documents, including SOP, LOR, and Resume.",
    p11: "Assistance in applying for scholarships, loans, and other financial aid.",
    p12: "Preparation for university and visa interviews with instant constructive feedback.",
  },
  {
    id: 4,
    question:
      "What are the best countries to study abroad?",
    answer:
      "Top study abroad countries: Study in USA | Study in UK | Study in Canada | Study in Germany | Study in Australia | Study in New Zealand",
  },
  {
    id: 5,
    question:
      "What are the top universities in the world to study abroad?",
    answer:
      "Top study abroad universities: Harvard University | Oxford University | Stanford University | University of Toronto | Cambridge University | Conestoga College | Centennial College | Columbia University | Seneca College | University of British Columbia",
  },
  {
    id: 6,
    question:
      "What are the best courses abroad?",
    answer:
      "Top courses abroad: Architecture | Business & Management | Chemistry | Computer Science | Design | Economics | Engineering | Journalism | Law | Mathematics | Medicine | Physics | Psychology | Public Administration | Statistics",
  },
  {
    id: 7,
    question:
      "What study abroad programs are offered by you?",
    answer:
      "We help students apply to all the countries and courses mentioned above, and more.",
  },
];

const Accordian = ({ question, answer, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12 }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex justify-center mx-2">
      <div className="m-2 md:px-5  pl-2 py-3 bg-light sm:w-3/4 w-full mx-auto rounded-lg ">
        <h1
          className="sm:font-bold font-semibold flex justify-between items-center cursor-pointer px-2 md:px-0"
          onClick={() => setShow(!show)}
        >
          {question}
          <span className="cursor-pointer">
            {show ? (
              <ExpandLessIcon fontSize="large" />
            ) : (
              <ExpandMoreIcon fontSize="large" />
            )}
          </span>
        </h1>
        <div className="overflow-hidden mr-10 px-2 md:px-0 text-sm">
          {
            answer != "" ?
              <p
                className={
                  show
                    ? "pt-2 transition-all ease-in duration-100  h-full "
                    : "pt-0 transition-all ease-in h-0"
                }
              >
                {show && answer}
              </p> :

              <p
                className={
                  show
                    ? "pt-2 transition-all ease-in duration-100  h-full "
                    : "pt-0 transition-all ease-in h-0"
                }
              >
                {show && <ul>
                  <li><label className="text-main font-bold">1. </label>{p1}</li>
                  <li><label className="text-main font-bold">2. </label>{p2}</li>
                  <li><label className="text-main font-bold">3. </label>{p3}</li>
                  <li><label className="text-main font-bold">4. </label>{p4}</li>
                  <li><label className="text-main font-bold">5. </label>{p5}</li>
                  <li><label className="text-main font-bold">6. </label>{p6}</li>
                  <li><label className="text-main font-bold">7. </label>{p7}</li>
                  <li><label className="text-main font-bold">8. </label>{p8}</li>
                  <li><label className="text-main font-bold">9. </label>{p9}</li>
                  <li><label className="text-main font-bold">10. </label>{p10}</li>
                  <li><label className="text-main font-bold">11. </label>{p11}</li>
                  <li><label className="text-main font-bold">12. </label>{p12}</li>
                </ul>}
              </p>
          }
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="md:mb-20 mb-8">
      <Heading heading="Frequently Asked Questions" />
      {data.map((item) => {
        const { id } = item;
        return <Accordian key={id} {...item} />;
      })}
    </div>
  );
};

export default FAQ;
