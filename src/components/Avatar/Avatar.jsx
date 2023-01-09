import React from 'react'
import PropTypes from 'prop-types';

function Avatar({ avatarUrl = {} }) {
  // console.log(avatarUrl);
  const { default: avatarDefault, current } = avatarUrl;
  return (
    <img src={current || avatarDefault} alt="" className="rounded-full select-none" />
  )
}

Avatar.propTypes = {
    avatarUrl: PropTypes.object.isRequired
}

export default Avatar