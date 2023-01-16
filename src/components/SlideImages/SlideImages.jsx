import React, { useState } from "react";
import Slider from "react-slick";
import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";

// import "~slick-carousel/slick/slick.css";
// import "~slick-carousel/slick/slick-theme.css";

import "./SlideImages.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

function SlideImages({ imagesList, ...props }) {
  const [currentIndex, setCurrentIndex] = useState(0);
    const [xPos, setXPos] = useState(0);
const [yPos, setYPos] = useState(0);


  return (
    // <Slider {...props}>
    //   {imagesList.map((image, index) => (
    //     <div className="slide-image-wrapper" key={index}>
    //       <img src={image} alt="" className="slide-image" />
    //     </div>
    //   ))}
    // </Slider>
    <div className="slider-container mt-4">
      <div className="slider__image-wrapper">
          {imagesList.map((image, index) => {
            return (
              <img
                key={index}
                src={image}
                alt=""
                className={index === currentIndex ? "slider-img" : "hidden"}
              />
            );
          })}
      </div>
      <button
        className={`slider-button prev ${currentIndex===0 ? "hidden" : "flex"}`}
        onClick={() => {
            setCurrentIndex(currentIndex - 1)
        }}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <button
        className={`slider-button next ${currentIndex===imagesList.length - 1 ? "hidden" : "flex"}`}
        onClick={() => setCurrentIndex(currentIndex + 1)}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  );
}

export default SlideImages;
