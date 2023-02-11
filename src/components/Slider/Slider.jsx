import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slider.scss";

function HeroSlider({children, ...props}) {
  return (
    <Slider
        {...props}
    >   
        {children}
    </Slider>
  )
}

export default HeroSlider