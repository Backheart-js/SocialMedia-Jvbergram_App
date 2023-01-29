import React from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

import "./Avatar.scss";

function Avatar({ avatarUrl, size = "small" }) {
  return !avatarUrl ? (
    <Skeleton count={1} circle={true} className={`avatart__${size}`}/>
  ) : (
    <div className={`avatar__wrapper avatar__${size}`}>
      <img
        src={avatarUrl.current || avatarUrl.default}
        alt=""
        className={`select-none`}
      />
    </div>
  );
}

Avatar.propTypes = {
  avatarUrl: PropTypes.object.isRequired,
};

export default Avatar;
