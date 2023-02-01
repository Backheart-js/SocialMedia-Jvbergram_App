import React, { useState } from "react";
import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";

// import "~slick-carousel/slick/slick.css";
// import "~slick-carousel/slick/slick-theme.css";

import "./SlideImages.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

function SlideImages({ imagesList, ...props }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="slider-container" {...props}>
      <div className="slider__image-wrapper min-h-[400px]">
        {imagesList.map((image, index) => (
            <div
              className={`${
                index === currentIndex ? "slider-img" : "hidden"
              } pb-[100%] bg-center bg-contain bg-no-repeat w-full`}
              style={{ backgroundImage: `url(${image})` }}
              key={index}
            ></div>
          ))}
      </div>
      <button
        className={`slider-button prev ${
          currentIndex === 0 ? "hidden" : "flex"
        }`}
        onClick={() => {
          setCurrentIndex(currentIndex - 1);
        }}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <button
        className={`slider-button next ${
          currentIndex === imagesList.length - 1 ? "hidden" : "flex"
        }`}
        onClick={() => setCurrentIndex(currentIndex + 1)}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  );
}

export default SlideImages;
