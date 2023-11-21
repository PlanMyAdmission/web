import React, { useRef, useState } from "react";
import ArticleCard from "../../higherOrderComponents/ArticleCard";
import { Link } from "react-router-dom";

const ArticlesSection = () => {
  // const article = useRef(null);
  const elementRef = useRef(null);

  // const handelwheel = (e) => {
  //   article.current.scrollLeft += 5 * e.deltaY;
  // };
  const [arrowDisable, setArrowDisable] = useState(true);
  // const unsplashed = "https://source.unsplash.com/200x200/";

  const handleHorizantalScroll = (element, speed, distance, step) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      element.scrollLeft += step;
      scrollAmount += Math.abs(step);
      if (scrollAmount >= distance) {
        clearInterval(slideTimer);
      }
      if (element.scrollLeft === 0) {
        setArrowDisable(true);
      } else {
        setArrowDisable(false);
      }
    }, speed);
  };
  // const breakPoints = [
  //   { width: 1, itemsToShow: 1 },
  //   { width: 550, itemsToShow: 2 },
  //   { width: 700, itemsToShow: 2 },
  // ];

  return (
    <div className="flex md:flex-row flex-col items-center md:items-start flex-nowrap my-20 mx-2  2xl:justify-center ">
      <div className="md:w-1/3 w-full mx-4 lg:px-5 md:mx-5 items-center justify-center">
        <h1 className="font-bold md:text-5xl text-2xl md:text-left text-center leading-10 md:p-5 p-3">
          Articles to help you prepare
        </h1>
        <div className="md:border-b-4  border-b-main w-1/5 ml-5 mb-5 items-center flex justify-center md:block"></div>
        <p className="md:px-5 md:py-4 my-4   px-4 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
          ducimus quis ipsam beatae eius perferendis officiis et assumenda
          consectetur officia!
        </p>
        <Link to="blogs">
          <button className="bg-main md:block hidden text-white font-semibold px-5 py-2 md:mt-8 mx-5 rounded-md whitespace-nowrap">
            Explore more Resources &rarr;
          </button>
        </Link>
      </div>
      <div className="flex-flex-col">
        <main
          id="item"
          ref={elementRef}
          onWheel={() => {

          }}
          className="  md:flex hidden  sm:items-center  justify-safe md:overflow-x-scroll z-2 gap-6 "
        >
          <ArticleCard />
          <ArticleCard />
          <ArticleCard />
          <ArticleCard />
          <ArticleCard />
        </main>
        {/* <div class="button-container hidden md:flex flex-row justify-evenly mt-4 text-2xl font-bold">
          <button
            onClick={() => {
              handleHorizantalScroll(elementRef.current, 25, 100, -10);
            }}
            className="border-2 border-main bg-light p-1 hover:text-white hover:bg-main"
            disabled={arrowDisable}
          >
            &larr;
          </button>
          <button
            onClick={() => {
              handleHorizantalScroll(elementRef.current, 25, 100, 10);
            }}
            className="border-2 border-main bg-light p-1 hover:text-white hover:bg-main"
          >
            &rarr;
          </button>
        </div> */}
      </div>
      <div className="md:hidden flex flex-col mx-3">
        <ArticleCard />
        <ArticleCard />
      </div>

      <Link to="blogs">
        <button className="bg-main block md:hidden text-white font-semibold px-5 py-2  md:mt-8 mx-5 rounded-md ">Explore more Resources &rarr;
        </button>
      </Link>
    </div>

  );
};

export default ArticlesSection;

// (function() {
//   function scrollHorizontally(e) {
//       e = window.event || e;
//       var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
//       document.getElementById('yourDiv').scrollLeft -= (delta * 40); // Multiplied by 40
//       e.preventDefault();
//   }
//   if (document.getElementById('yourDiv').addEventListener) {
//       // IE9, Chrome, Safari, Opera
//       document.getElementById('yourDiv').addEventListener('mousewheel', scrollHorizontally, false);
//       // Firefox
//       document.getElementById('yourDiv').addEventListener('DOMMouseScroll', scrollHorizontally, false);
//   } else {
//       // IE 6/7/8
//       document.getElementById('yourDiv').attachEvent('onmousewheel', scrollHorizontally);
//   }
// })();
