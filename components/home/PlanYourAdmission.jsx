import React from 'react';
import Heading from '@components/higherOrderComponents/Heading';
import ContentSection from '@components/higherOrderComponents/ContentSection';
const defaultData = {
  id: 1,
  content:
    'At Plan My Admission (PMA), our foundation is built on deep experience—our mentors and counselors bring over a decade of hands-on expertise helping students achieve their global education dreams.',
  features: [
    'We follow an AI-first approach with a human touch, harnessing advanced technology to smartly identify the best university options while ensuring real experts guide every choice.',
    'Our commitment to personalized one-on-one guidance means we work with only a select number of students, guaranteeing every applicant receives dedicated support from planning through admission.',
    'Real student success stories are at the heart of PMA. Time and again, our tailored blend of technology and mentorship has helped aspiring scholars secure admits at top universities worldwide. Your best-fit university is just a clear plan away.',
  ],
  btn4: 'AI University Matchmaker',
  btn3: 'AI Personal Admission Coach',
  btn1: 'Register Now',
  btn2: 'Book Your Free Consultation',
  video: 'https://www.youtube.com/embed/0Qoct60N6lY',
  forInstitutions: false,
};

const PlanYourAdmission = ({ contentData = defaultData }) => {
  return (
    <div className="bg-light py-8">
      <Heading
        heading={contentData.heading || 'Plan Your Overseas Admission with us'}
      />
      <ContentSection {...contentData} />
    </div>
  );
};
export default PlanYourAdmission;
