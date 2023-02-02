import React, { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Avatar from "~/components/Avatar/Avatar";
import Loader from "~/components/Loader";
import {
  updateCurrentUserFolling,
  updateFollower,
} from "~/services/firebaseServices";
import "../Modal.scss";

function UnFollow({ closeModal, currentUserId, followingUserInfo, setUnfollowFunc }) {
  console.log(currentUserId);
  console.log(followingUserInfo);
  const [loadingDisplay, setLoadingDisplay] = useState(false);

  const handleUnFollowOtherUser = async () => {
    setLoadingDisplay(true);
    try {
      await updateCurrentUserFolling(
        currentUserId,
        followingUserInfo.userId,
        true
      );
      await updateFollower(currentUserId, followingUserInfo.userId, true);

      closeModal();
      setUnfollowFunc(false)
    } catch (error) {
      setLoadingDisplay(false);
      console.log(error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="modal__box-wrapper flex flex-col items-center min-w-[400px] min-h-[200px] pt-5 select-none">
      <Link
        to={`/profile/${followingUserInfo.username}`}
        className="mb-5"
        onClick={closeModal}
      >
        <Avatar avatarUrl={followingUserInfo.avatar} size={"medium"} />
      </Link>
      <p className="text-sm font-medium">
        Bỏ theo dõi {followingUserInfo.username}
      </p>
      <ul className="mt-4 w-full">
        <li className="modal__delete-item text-[#ED4956]">
          <button
            className="py-3 w-full text-base font-bold"
            onClick={handleUnFollowOtherUser}
          >
            Bỏ theo dõi
          </button>
        </li>
        <li className="modal__delete-item">
          <button
            className="py-3 w-full text-sm font-medium"
            onClick={closeModal}
          >
            Hủy
          </button>
        </li>
      </ul>
      <Loader
        type={RotatingLines}
        display={loadingDisplay}
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible={true}
      />
    </div>
  );
}

export default UnFollow;
