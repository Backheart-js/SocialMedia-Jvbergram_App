import {
  faBookmark,
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as faFillHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserContext } from "~/layouts/DefaultLayout/DefaultLayout";
import { firebaseSelector } from "~/redux/selector";

import "./PostInteractive.scss";

function PostInteractive({
  docId,
  likes,
  youLikedThisPost,
  comments,
  children,
}) {
  const { userId } = useContext(UserContext);

  const [toggleLike, setToggleLike] = useState(youLikedThisPost);
  const [likesQuantity, setLikesQuantity] = useState(likes.userId.length);
  const { firebase } = useSelector(firebaseSelector);

  const handleToggleLiked = async () => {
    setToggleLike((prev) => !prev);
    setLikesQuantity((likes) => (!toggleLike ? likes + 1 : likes - 1));

    try {
      await firebase
        .firestore()
        .collection("posts")
        .doc(docId)
        .update({
          likes: {
            userId: !toggleLike ? [...likes.userId, userId] : [...likes.userId].filter(id => id !== userId),
          },
        });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {}, []);
  console.log(likes.userId.length);
  return (
    <div className="mt-3">
      <div className="postInteractive__icon-wrapper flex justify-between">
        <div className="postInteractive__icon-mainFunc">
          {toggleLike ? (
            <button
              className="postInteractive__button"
              onClick={handleToggleLiked}
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
            >
              <FontAwesomeIcon
                icon={faHeart}
                className="postInteractive__icon"
              />
            </button>
          )}
          <button className="postInteractive__button">
            <FontAwesomeIcon
              icon={faComment}
              className="postInteractive__icon"
            />
          </button>
          <button className="postInteractive__button">
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="postInteractive__icon"
            />
          </button>
        </div>
        <div className="postInteractive__icon-addToList">
          <button className="postInteractive__button">
            <FontAwesomeIcon
              icon={faBookmark}
              className="postInteractive__icon"
            />
          </button>
        </div>
      </div>
      {likesQuantity > 0 && (
        <div className="postInteractive__likeQuantity-wrapper mt-2">
          <span className="text-sm font-semibold">{likesQuantity} lượt thích</span>
        </div>
      )}
      {children}
    </div>
  );
}

export default PostInteractive;
