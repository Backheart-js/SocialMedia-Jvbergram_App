import { faBookmark, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faFillHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { FirebaseContext } from "~/context/firebase";
import { UserContext } from "~/context/user";
import { updateLikePost } from "~/services/firebaseServices";

import "./PostInteractive.scss";

function PostInteractive({
  commentBtnRef,
  docId,
  likes,
  youLikedThisPost,
}) {
  const { userId } = useContext(UserContext);

  const [toggleLike, setToggleLike] = useState(youLikedThisPost);
  const [likesQuantity, setLikesQuantity] = useState(likes.length);

  

  const handleToggleLiked = async () => {
    try {
      setToggleLike((prev) => !prev);
      setLikesQuantity((likes) => (!toggleLike ? likes + 1 : likes - 1));
      await updateLikePost(docId, userId, toggleLike);
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <div className="postInteractive__icon-wrapper flex justify-between">
        <div className="postInteractive__icon-mainFunc">
          {toggleLike ? (
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
                className="postInteractive__icon icon"
              />
            </button>
          )}
          <button ref={commentBtnRef} className="postInteractive__button">
            <svg
              aria-label="Bình luận"
              className="postInteractive__icon icon"
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
              className="postInteractive__icon icon"
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
              className="postInteractive__icon icon"
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
