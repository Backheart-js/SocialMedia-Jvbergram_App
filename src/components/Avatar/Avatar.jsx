import React from "react";
import PropTypes from "prop-types";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

function Avatar({ avatarUrl }) {
  const { default: avatarDefault, current } = avatarUrl;

  return avatarUrl === {} ? (
    <SkeletonTheme color="#ccc">
      <Skeleton circle={true} />
    </SkeletonTheme>
  ) : (
    <img
      src={current || avatarDefault}
      alt=""
      className="rounded-full select-none"
    />
  );
}

Avatar.propTypes = {
  avatarUrl: PropTypes.object.isRequired,
};

export default Avatar;
