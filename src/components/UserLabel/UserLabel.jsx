import React, { memo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./UserLabel.scss";
import { useDispatch } from "react-redux";
import modalSlice from "~/redux/slice/modalSlide";

function UserLabel({ avatarUrl, username, fullname = "", size = "medium", ...props }) {
  const dispatch = useDispatch()

  const handleCloseModal = () => {
    dispatch(modalSlice.actions.closeModal());
  }

  return !avatarUrl || !username ? (
    <Skeleton count={1} height={56} />
  ) : (
    <Link
      to={`/${username}`}
      className={`flex items-center userComp-${size} w-fit`}
      onClick={handleCloseModal}
      {...props}
    >
      <div className={`avatar-${size} avatar-wrapper`}>
        <img
          src={avatarUrl.current || avatarUrl.default}
          alt=""
          className="avatar-img"
        />
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-[14px] font-semibold dark:text-[#FAFAFA]">{username}</span>
        {fullname !== "" && (
          <span className={`userLabel__name-${size} text-gray-500 dark:text-gray-400 font-medium`}>
            {fullname}
          </span>
        )}
      </div>
    </Link>
  );
}

UserLabel.propTypes = {
  avatarUrl: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  fullname: PropTypes.string,
};

export default memo(UserLabel);
