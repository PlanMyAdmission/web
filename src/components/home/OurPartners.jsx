import React from "react";
import MicroSoft from "../../assets/Microsoft.png";
import google from "../../assets/google.svg";

const OurPartners = () => {
  return (
    <section className="w-full   border-t border-gray-200 py-4 px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
        <p className="text-sm sm:text-base font-bold text-gray-700">
          In collaboration with:
        </p>

        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={google}
            alt="Google Logo"
            className="h-6 sm:h-8 object-contain"
          />
          <img
            src={MicroSoft}
            alt="Microsoft Logo"
            className="h-6 sm:h-8 object-contain"
          />
        </div>

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
