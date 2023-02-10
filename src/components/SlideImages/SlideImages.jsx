import React, { useState } from "react";

import "./SlideImages.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

function SlideImages({ imagesList, ...props }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="slider-container" {...props}>
      {/* <div className="slider__image-wrapper"> */}
        {imagesList.map((image, index) => (
            <div
              className={`${
                index === currentIndex ? "block" : "hidden"
              } slider__image-bg`}
              style={{ backgroundImage: `url(${image})` }}
              key={index}
            ></div>
          ))}
      {/* </div> */}
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
