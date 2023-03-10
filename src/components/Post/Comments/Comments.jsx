import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Comments.scss";
import CommentTextField from "./CommentTextField";
import '../Post.scss'
import Caption from "~/components/Caption/Caption";

function Comments({ docId, allComments = [], userId, commentFieldRef }) {
  //Comment preview hiển thị với những cmt của user
  const [userCommentList, setUserCommentList] = useState([]);
  const [allCommentsQuantity, setAllCommentsQuantity] = useState(allComments.length)

  useEffect(() => {
    const userComments = allComments.filter((comment, index) => {
      return comment.userId === userId && index <= 1;
    });

    setUserCommentList(userComments);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="w-full">
      {allCommentsQuantity >= 1 && (
        <Link to={`/p/${docId}`} className="">
          <span className="text-gray-500 text-sm font-normal hover:text-gray-700 dark:text-gray-400">
            Xem{allCommentsQuantity > 1 ? " tất cả" : ""} {allCommentsQuantity}{" "}
            bình luận
          </span>
        </Link>
      )}
      {userCommentList.length > 0 &&
        userCommentList.map((userComment, index) => {
          return (
            <div
              className="userComment__wrapper flex justify-between w-full mt-1"
              key={index}
            >
              <div className="">
                <Caption username={userComment.displayName} content={userComment.content} />
              </div>
              <button className="pl-2">
                <FontAwesomeIcon className="text-xs dark:text-[#FAFAFA]" icon={faHeart} />
              </button>
            </div>
          )
        })}
      <CommentTextField docId={docId} commentFieldRef={commentFieldRef} setUserCommentList={setUserCommentList} setAllCommentsQuantity={setAllCommentsQuantity}/>
    </div>
  );
}

export default Comments;
