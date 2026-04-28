'use client';

import React, { useState } from 'react';
import ContentSection from '@/components/common/ContentSection';
import data from '@/components/for-institutions/featureData.js';
const Features = ({ sections = data }) => {
  const style =
    'py-2 px-2 font-semibold focus:bg-white active:bg-white  focus:outline-none outline-none mx-2 my-1 w-full rounded-md transition-all duration-500 ease-in-out  ';
  const [show, setShow] = useState(0);
  return (
    <div>
      <div className="bg-light md:max-w-5xl md:mx-auto flex justify-start rounded-md overflow-x-auto  hide-scroll-bar whitespace-nowrap snap-x ">
        {sections.map((section, index) => (
          <button
            key={`${section.tabLabel || section.id || index}`}
            autoFocus={index === 0}
            className={style}
            onClick={() => setShow(index)}
          >
            {section.tabLabel || `Section ${index + 1}`}
          </button>
        ))}
      </div>
      <div className="my-20">
        {sections[show] && (
          <ContentSection
            className=" transition-all duration-1000 ease-in"
            {...sections[show]}
          />
        )}
      </div>
    </div>
  );
};
export default Features;
