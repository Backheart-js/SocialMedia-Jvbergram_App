import { faBookmark, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faFillHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { LOGIN } from "~/constants/modalTypes";
import { UserContext } from "~/context/user";
import modalSlice from "~/redux/slice/modalSlide";
import { updateLikePost } from "~/services/firebaseServices";

import "./PostInteractive.scss";

function PostInteractive({
  commentBtnRef,
  docId,
  isLike,
  setLike,
  likesQuantity,
  setLikesQuantity,
  isGuest
}) {
  const dispatch = useDispatch()
  const { userId } = useContext(UserContext) || {userId: null};

  

  const handleToggleLiked = async () => {
    if (isGuest) {
      openLoginModal()
    }
    else {
      try {
        setLike((prev) => !prev);
        setLikesQuantity((likes) => (!isLike ? likes + 1 : likes - 1));
        await updateLikePost(docId, userId, isLike);
      } catch (error) {
        throw error;
      }
    }
  };

  const openLoginModal = () => {
    dispatch(modalSlice.actions.openModal({
      type: LOGIN
    }))
  }

  return (
    <>
      <div className="postInteractive__icon-wrapper flex justify-between">
        <div className="postInteractive__icon-mainFunc">
          {isLike ? (
            <button
              className="postInteractive__button"
              onClick={handleToggleLiked}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleToggleLiked();
                }
              }}
            >
              <FontAwesomeIcon
                icon={faFillHeart}
                className="postInteractive__icon-red"
              />
            </button>
          ) : (
            <button
              className="postInteractive__button"
              onClick={handleToggleLiked}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleToggleLiked();
                }
              }}
            >
              <FontAwesomeIcon
                icon={faHeart}
                className="postInteractive__icon dark:text-[#FAFAFA]"
              />
            </button>
          )}
          <button ref={commentBtnRef} className="postInteractive__button">
            <svg
              aria-label="Bình luận"
              className="postInteractive__icon dark:text-[#FAFAFA]"
              color="#262626"
              fill="#262626"
              height={24}
              role="img"
              viewBox="0 0 24 24"
              width={24}
            >
              <path
                d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
          <button className="postInteractive__button">
            <svg
              aria-label="Chia sẻ bài viết"
              className="postInteractive__icon dark:text-[#FAFAFA]"
              color="#262626"
              fill="#262626"
              height={24}
              role="img"
              viewBox="0 0 24 24"
              width={24}
            >
              <line
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth={2}
                x1={22}
                x2="9.218"
                y1={3}
                y2="10.083"
              />
              <polygon
                fill="none"
                points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        </div>
        <div className="postInteractive__icon-addToList">
          <button className="postInteractive__button">
            <FontAwesomeIcon
              icon={faBookmark}
              className="postInteractive__icon dark:text-[#FAFAFA]"
            />
          </button>
        </div>
      </div>
      {likesQuantity > 0 && (
        <div className="postInteractive__likeQuantity-wrapper mt-2">
          <button>
            <span className="text-sm font-semibold dark:text-[#FAFAFA]">
              {likesQuantity} lượt thích
            </span>
          </button>
        </div>
      )}
    </>
  );
}

export default PostInteractive;
