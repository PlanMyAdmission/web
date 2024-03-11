import React, { useState, useEffect } from "react";

const ScrollDown = () => {
  const [visible, setVisible] = useState(false);
  const listenToScroll = () => {
    let heightToHidden = 20;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    winScroll < heightToHidden ? setVisible(true) : setVisible(false);
    // setVisible(true);
  };

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  return (
    <>
      {visible && (
        <>
          <div className="div1"></div>
          <div className="div2"></div>
        </>
      )}
    </>
  );
};

export default ScrollDown;
