'use client';

import React, { useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Heading from '@components/common/Heading';
import { defaultFAQ } from '@/components/pricing/data.js';

const renderAnswer = (answer) => {
  if (!answer) {
    return null;
  }

  return answer
    .split(/<br\s*\/?>/i)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment, index) => (
      <p key={`${segment}-${index}`} className={index > 0 ? 'mt-2' : ''}>
        {segment}
      </p>
    ));
};

const AccordionItem = ({ item, isOpen, onToggle }) => {
  return (
    <div className="flex justify-center mx-2">
      <div className="m-2 md:px-5 pl-2 py-3 bg-light sm:w-3/4 w-full mx-auto rounded-lg">
        <h2
          className="font-semibold flex justify-between items-center cursor-pointer px-2 md:px-0"
          onClick={onToggle}
        >
          {item.question}
          <span>
            {isOpen ? (
              <ExpandLessIcon fontSize="large" />
            ) : (
              <ExpandMoreIcon fontSize="large" />
            )}
          </span>
        </h2>
        {isOpen && (
          <div className="mt-2 px-2 md:px-0 text-sm transition-all ease-in duration-300">
            {renderAnswer(item.answer)}
            {item.points && (
              <ul className="list-decimal list-inside mt-2 space-y-1">
                {item.points.map((point, idx) => (
                  <li key={idx}>
                    <span className="font-medium text-main"></span>
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
const FAQ = ({ data }) => {
  const [activeId, setActiveId] = useState(null);
  const toggleAccordion = (id) => {
    setActiveId((prevId) => (prevId === id ? null : id));
  };
  if (!data) data = defaultFAQ;
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
