import React from 'react';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import PsychologyIcon from '@mui/icons-material/Psychology';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const content = [
  {
    icon: <SchoolIcon className="text-main" fontSize="large" />,
    heading: '10+ Years Experts',
    subtext: 'Plan Your Overseas Journey',
  },
  {
    icon: <PublicIcon className="text-main" fontSize="large" />,
    heading: '1500+ Universities',
    subtext: '95%+ Visa Success Rate',
  },
  {
    icon: <PsychologyIcon className="text-main" fontSize="large" />,
    heading: 'AI + Human',
    subtext: 'To Ensure Your Success',
  },
  {
    icon: <VerifiedUserIcon className="text-main" fontSize="large" />,
    heading: 'Zero Service Charges',
    subtext: "Till NOV'2023",
  },
];

const TechnologyPoweredBy = () => {
  return (
    <div className="w-full bg-white border-t border-gray-200 py-8 px-4 md:py-12">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {content.map((item, idx) => (
          <div
            key={idx}
            className="bg-light rounded-lg p-4 shadow-sm hover:shadow-md transition duration-200 flex flex-col items-center text-center"
          >
            <div className="mb-2">{item.icon}</div>
            <h3 className="text-sm md:text-base font-semibold text-main">
              {item.heading}
            </h3>
            <p className="text-[11px] md:text-sm text-gray-600 mt-1">
              {item.subtext}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnologyPoweredBy;
