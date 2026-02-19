import React from 'react';
const MicroSoft = '/images/Microsoft.png';
const google = '/images/google.svg';
const OurPartners = () => {
  return (
    <section className="w-full   border-t border-gray-200 py-4 px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
        <p className="text-sm sm:text-base font-bold text-gray-700">
          In collaboration with:
        </p>

        {}

        <p className="text-sm sm:text-base font-semibold text-main mt-1 sm:mt-0">
          Coursefinder.ai
        </p>
        <p className="text-sm sm:text-base font-semibold text-main mt-1 sm:mt-0">
          + Powered by PMA AI Tools
        </p>
      </div>
    </section>
  );
};
export default OurPartners;
