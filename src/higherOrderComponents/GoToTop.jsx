import React, { useState, useEffect } from "react";

const GoToTop = () => {
  const [visible, setVisible] = useState(false);

  const listenToScroll = () => {
    let heightToHidden = 20;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    winScroll > heightToHidden ? setVisible(true) : setVisible(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  const MoveToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {visible && (
        <button
          className="fixed bottom-10 right-5 md:right-10  shadow-xl bg-light text-main font-bold rounded-full w-10 h-10 z-999 animate-bounce"
          onClick={MoveToTop}
        >
          &uarr;
        </button>
      )}
    </div>
  );
};

export default GoToTop;
