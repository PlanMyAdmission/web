'use client';

import React, { useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { defaultUniversityFAQ } from '@/lib/seo/faqs.js';

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

const AccordionItem = ({ item, itemId, isOpen, onToggle }) => {
  const panelId = `faq-panel-${itemId}`;
  const buttonId = `faq-button-${itemId}`;

  return (
    <div className="flex justify-center mx-2">
      <div className="m-2 md:px-5 pl-2 py-3 bg-light sm:w-3/4 w-full mx-auto rounded-lg">
        <h3>
          <button
            id={buttonId}
            type="button"
            className="font-semibold flex justify-between items-center gap-4 cursor-pointer px-2 md:px-0 w-full text-left"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={onToggle}
          >
            <span>{item.question}</span>
            <span className="shrink-0">
              {isOpen ? (
                <ExpandLessIcon fontSize="large" />
              ) : (
                <ExpandMoreIcon fontSize="large" />
              )}
            </span>
          </button>
        </h3>
        {isOpen && (
          <div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="mt-2 px-2 md:px-0 text-sm transition-all ease-in duration-300"
          >
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
const FAQ = ({
  data,
  heading = 'Frequently Asked University Questions',
  sectionId = 'university-faqs',
  className = '',
}) => {
  const [activeId, setActiveId] = useState(null);
  const items = data?.length ? data : defaultUniversityFAQ;
  const toggleAccordion = (id) => {
    setActiveId((prevId) => (prevId === id ? null : id));
  };

  return (
    <section
      id={sectionId}
      className={`md:mb-20 mb-8 ${className}`}
      aria-labelledby={`${sectionId}-heading`}
    >
      <h2
        id={`${sectionId}-heading`}
        className="flex items-center flex-col text-center md:text-[45px] text-2xl md:pb-[50px] p-10 font-bold"
      >
        {heading}
        <span className="border-b-4 md:ml-4 ml-3 border-b-main md:w-[98px] w-[50px] md:py-2 py-1 mb-[10px]"></span>
      </h2>
      {items.map((item, index) => {
        const itemId = item.id || `${sectionId}-${index}`;

        return (
          <AccordionItem
            key={itemId}
            item={item}
            itemId={itemId}
            isOpen={activeId === itemId}
            onToggle={() => toggleAccordion(itemId)}
          />
        );
      })}
    </section>
  );
};
export default FAQ;
