import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Comments.scss";
import CommentTextField from "./CommentTextField";

function Comments({ docId, allComments = [], userId, commentFieldRef }) {
  //Comment preview hiển thị với những cmt của user
  const [userCommentList, setUserCommentList] = useState([]);
  const [allCommentsQuantity, setAllCommentsQuantity] = useState(allComments.length)

  useEffect(() => {
    const userComments = allComments.filter((comment, index) => {
      return comment.userId === userId && index <= 1;
    });

    setUserCommentList(userComments);
  }, []);

  return (
    <div>
      {allCommentsQuantity >= 1 && (
        <button className="mb-1">
          <span className="text-gray-500 text-sm font-normal hover:text-gray-700">
            Xem{allCommentsQuantity > 1 ? " tất cả" : ""} {allCommentsQuantity}{" "}
            bình luận
          </span>
        </button>
      )}
      {userCommentList.length > 0 &&
        userCommentList.map((userComment, index) => {
          return (
            <div
              className="userComment__wrapper flex justify-between"
              key={index}
            >
              <div>
                <Link
                  className="font-semibold text-sm mr-1"
                  to={`/profile/${userComment.displayName}`}
                >
                  {userComment.displayName}
                </Link>
                <span className="text-[15px] font-normal">
                  {userComment.content}
                </span>
              </div>
              <button className="">
                <FontAwesomeIcon className="text-xs" icon={faHeart} />
              </button>
            </div>
          )
        })}
      <CommentTextField docId={docId} commentFieldRef={commentFieldRef} setUserCommentList={setUserCommentList} setAllCommentsQuantity={setAllCommentsQuantity}/>
    </div>
  );
}

export default Comments;
