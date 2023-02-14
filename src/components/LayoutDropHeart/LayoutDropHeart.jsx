import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import "./LayoutDropHeart.scss";

function LayoutDropHeart({ isShow, setShow }) {
    useEffect(() => {
        if (isShow) {
          const timer = setTimeout(() => {
            setShow(false);
          }, 1000);
          return () => {
            clearTimeout(timer);
          };
        }
      }, [isShow, setShow]);

    

  return (
    <div className="absolute drop__heart-wrapper">
      {isShow && <FontAwesomeIcon className="heart__icon" icon={faHeart} />}
    </div>
  );
}

export default LayoutDropHeart;
