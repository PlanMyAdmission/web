import React from 'react';
const Header = ({ heading }) => {
  return (
    <h1 className="flex flex-1 md:gap-20 sm:gap-8 gap-5 lg:text-6xl md:text-5xl sm:text-4xl text-2xl pl-5 font-bold uppercase tracking-tight my-20 md:pl-28 whitespace-nowrap">
      {heading}
      <span className="grow bg-main"></span>
    </h1>
  );
};
export default Header;
{
}
