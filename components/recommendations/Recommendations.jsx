'use client';

import React, { useState } from 'react';
import RecommendationsMain from '@/components/recommendations/RecommendationsMain.jsx';
import { trackEvent } from '@lib/analytics.js';

const Recommendations = () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      {!show && (
        <div className="bg-light flex items-center justify-center flex-col p-10 my-10 h-96">
          <p className=" p-2 text-center">
            Generate Recommendations based on your profile
          </p>
          <button
            className="bg-main text-white text-center px-7 rounded-sm py-1.5 hover:bg-white hover:outline outline-main hover:text-main transition duration-200"
            onClick={() => {
              trackEvent('recommendations_tool_open', {
                surface: 'recommendations_page',
              });
              setShow(!show);
            }}
          >
            Generate
          </button>
        </div>
      )}
      {show && <RecommendationsMain />}
    </div>
  );
};
export default Recommendations;
