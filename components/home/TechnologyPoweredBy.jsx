import React from 'react';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import PsychologyIcon from '@mui/icons-material/Psychology';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
const defaultContent = [
  {
    icon: <SchoolIcon className="text-main" fontSize="large" />,
    heading: '10+ Years of Expertise',
    subtext:
      'Trusted counsellors with over a decade of experience, supported by AI technology.',
  },
  {
    icon: <PublicIcon className="text-main" fontSize="large" />,
    heading: '1500+ Universities Worldwide',
    subtext:
      'Access to 900+ trusted university partnerships through our extensive network.',
  },
  {
    icon: <PsychologyIcon className="text-main" fontSize="large" />,
    heading: 'Personalized Guidance Until Success',
    subtext:
      'Tailored expert support from application to admission. We cater to Limited seats, hurry up!',
  },
  {
    icon: <VerifiedUserIcon className="text-main" fontSize="large" />,
    heading: 'Student Self-Served AI Portal',
    subtext: 'Empower your admissions journey with our intuitive AI platform.',
  },
];
const iconMap = [
  <SchoolIcon key="school" className="text-main" fontSize="large" />,
  <PublicIcon key="public" className="text-main" fontSize="large" />,
  <PsychologyIcon key="psychology" className="text-main" fontSize="large" />,
  <VerifiedUserIcon key="verified" className="text-main" fontSize="large" />,
];

const TechnologyPoweredBy = ({ items = defaultContent }) => {
  return (
    <div className="w-full bg-white border-t border-gray-200 py-8 px-4 md:py-12">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {items.map((item, idx) => (
          <div
            key={`${item.heading}-${idx}`}
            className="bg-light rounded-lg p-4 shadow-sm hover:shadow-md transition duration-200 flex flex-col items-center text-center"
          >
            <div className="mb-2">{item.icon || iconMap[idx] || iconMap[0]}</div>
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
