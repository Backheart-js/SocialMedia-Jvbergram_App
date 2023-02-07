import React from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

import "./Avatar.scss";

function Avatar({ avatarUrl, size = "small" }) {
  return !avatarUrl ? (
    <Skeleton count={1} circle className={`avatart__${size}`}/>
  ) : (
    <div className={`avatar__wrapper avatar__${size}`}>
      <div className="pb-[100%] bg-center bg-cover bg-no-repeat w-full" style={{ backgroundImage: `url(${avatarUrl.current || avatarUrl.default})` }}></div>
    </div>
  );
}

Avatar.propTypes = {
  avatarUrl: PropTypes.object.isRequired,
};

export default Avatar;
