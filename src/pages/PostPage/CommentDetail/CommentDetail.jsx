import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "~/components/Avatar/Avatar";
import Dropdown from "~/components/Dropdown/Dropdown";
import { UserContext } from "~/context/user";
import { deleteComment, getUser } from "~/services/firebaseServices";
import formatDate from "~/utils/formatDate";
import "./CommentDetail.scss";
import { memo } from "react";
import Loader from "~/components/Loader";
import { RotatingLines } from "react-loader-spinner";

function CommentDetail({
  postId,
  avatarUrl,
  username,
  ownerCaption,
  commentList,
}) {
  const [countCommentDisplay, setCountCommentDisplay] = useState(10);
  const [countPrevComments, setCountPrevComments] = useState(0);
  const [commentWithUserInfo, setCommentWithUserInfo] = useState(null);
  const [loadingComment, setLoadingComment] = useState(false);

  const userLoggedIn = useContext(UserContext);

  const handleSeemoreComment = () => {
    setLoadingComment(true);
    setCountPrevComments(countCommentDisplay);
    setCountCommentDisplay((prev) => prev + 10);
  };

  const handleDeleteComment = async (commentId) => {
    const newCommentListAfterDelete = commentWithUserInfo.filter(
      (comment) => comment.commentId !== commentId
    );
    try {
      await deleteComment(postId, commentId);
      setCommentWithUserInfo(newCommentListAfterDelete);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!commentWithUserInfo) {
      return;
    } else {
      //Tránh sideEffect này xảy ra trong lần đầu
      const newComment = commentList[commentList.length - 1];
      try {
        const getNewCommentWithInfo = async () => {
          const [userInfo] = await getUser({ userId: [newComment.userId] });
          const newCommentWithInfo = {
            ...newComment,
            ...userInfo,
          };

          setCommentWithUserInfo((prev) => [newCommentWithInfo, ...prev]);
        };

        newComment && getNewCommentWithInfo();
      } catch (error) {
        console.error(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentList]);

  useEffect(() => {
    const commentDisplaying = commentList.slice(0, countCommentDisplay);
    const newCommentLoaded = commentDisplaying.slice(countPrevComments);
    /* 
    Mỗi khi người dùng load thêm comment, chỉ lấy chỗ cmt mới đc load gửi lên firebase để lấy dữ liệu người dùng
    Ít cmt thì không sao nhưng vài nghìn cmt thì gửi lên firebase sẽ rất lâu
    */
    try {
      const getCommentWithInfo = async () => {
        const newDataPromises = newCommentLoaded.map(async (comment) => {
          const [userInfo] = await getUser({ userId: [comment.userId] });
          return {
            ...comment,
            ...userInfo,
          };
        });

        const newData = await Promise.all(newDataPromises);

        commentWithUserInfo
          ? setCommentWithUserInfo((prev) => [...prev, ...newData])
          : setCommentWithUserInfo([...newData]);
        setLoadingComment(false);
      };
      getCommentWithInfo();
    } catch (error) {
      console.error(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countCommentDisplay]);

  return !commentWithUserInfo ? 
    <div className="h-full flex justify-center items-center">
      <li className="w-full list-none	flex items-center justify-center">
        <RotatingLines
          display
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="30"
          visible
        />
      </li>
    </div>
  : (
    <>
      <div className="flex pr-2 pb-4">
        <div className="comment__avatar">
          <Avatar avatarUrl={avatarUrl} size="small" />
        </div>
        <div className="comment__name-and-content">
          <div className="comment__name-and-content--wrapper">
            <Link to={`/profile/${username}`} className="text-sm font-semibold">
              {username}
            </Link>
            <span className="comment__content-text text-gray-700">
              {ownerCaption}
            </span>
          </div>
        </div>
      </div>
      {commentWithUserInfo && (
        <div className="commentDetail__list">
          {commentWithUserInfo.map((comment) => (
            <CommentItem
              commentData={comment}
              commentOfLoggedInUser={comment.userId === userLoggedIn.userId}
              onDelete={handleDeleteComment}
              key={comment.commentId}
            />
          ))}
          {countCommentDisplay < commentList.length &&
            (loadingComment ? (
              <li className="w-full list-none	flex items-center justify-center">
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="20"
                  display
                  visible
                />
              </li>
            ) : (
              <button
                className="font-semibold text-[13px] text-gray-800"
                onClick={handleSeemoreComment}
              >
                Xem thêm bình luận
              </button>
            ))}
        </div>
      )}
    </>
  );
}

export default memo(CommentDetail);

function CommentItem({
  commentData,
  commentOfLoggedInUser,
  onDelete,
  ...props
}) {
  const [toggleCommentDropdown, setToggleCommentDropdown] = useState(false);

  return (
    <li className="commentDetail__item" {...props}>
      <div className="flex items-start justify-between">
        <div className="flex pr-1">
          <div className="comment__avatar">
            <Avatar avatarUrl={commentData.avatarUrl} size="small" />
          </div>
          <div className="comment__name-and-content">
            <div className="comment__name-and-content--wrapper">
              <Link
                to={`/profile/${commentData.username}`}
                className="text-sm font-semibold"
              >
                {commentData.username}
              </Link>
              <span className="comment__content-text text-gray-700">
                {commentData.content}
              </span>
            </div>
            <div className="comment__func-wrapper">
              <span className="text-[13px] text-gray-500">
                {formatDate(commentData.dateCreated)}
              </span>
              {commentData.likes.length > 0 && (
                <span className="text-[13px] text-gray-500 font-semibold">
                  {commentData.like} lượt thích
                </span>
              )}
              <Dropdown
                interactive={true}
                visible={toggleCommentDropdown}
                onClickOutside={() => setToggleCommentDropdown(false)}
                placement="bottom-start"
                content={
                  <ul>
                    {commentOfLoggedInUser ? (
                      <li className="">
                        <button
                          className="text-highlight-dropdown text-[14px] font-semibold w-full py-2 hover:bg-main-bg"
                          onClick={() => onDelete(commentData.commentId)}
                        >
                          Xóa bình luận
                        </button>
                      </li>
                    ) : (
                      <>
                        <li className="">
                          <button className="text-highlight-dropdown text-[14px] font-semibold w-full py-2 hover:bg-main-bg">
                            Báo cáo
                          </button>
                        </li>
                      </>
                    )}
                    <li className="">
                      <button
                        className=" text-[14px] font-semibold w-full py-2 hover:bg-main-bg"
                        onClick={() => setToggleCommentDropdown(false)}
                      >
                        Hủy
                      </button>
                    </li>
                  </ul>
                }
              >
                <button
                  className="comment__func-btn"
                  onClick={() => setToggleCommentDropdown((prev) => !prev)}
                >
                  <FontAwesomeIcon
                    className="comment__func-icon"
                    icon={faEllipsis}
                  />
                </button>
              </Dropdown>
            </div>
          </div>
        </div>
        <button className="pl-2">
          <FontAwesomeIcon className="text-xs" icon={faHeart} />
        </button>
      </div>
    </li>
  );
}
