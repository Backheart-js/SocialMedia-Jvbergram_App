import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Dropdown from "~/components/Dropdown/Dropdown";
import CommentTextField from "~/components/Post/Comments/CommentTextField";
import PostInteractive from "~/components/Post/PostInteractive";
import SlideImages from "~/components/SlideImages";
import UserLabel from "~/components/UserLabel";
import { DELETE_POST, UNFOLLOW } from "~/constants/modalTypes";
import { UserContext } from "~/context/user";
import modalSlice from "~/redux/slice/modalSlide";
import {
  getPostWithOwnerById,
  updateCurrentUserFolling,
  updateFollower,
} from "~/services/firebaseServices";
import CommentDetail from "./CommentDetail/CommentDetail";
import "./PostPage.scss";

function PostPage() {
  const { docId } = useParams();
  const { userId: currentUserId, following: currentUserFollowing } =
    useContext(UserContext);
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [toggleOptionDropdown, setToggleOptionDropdown] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const commentFieldRef = useRef(null);
  const commentBtn = useRef(null);

  const handleCloseDropdown = () => {
    setToggleOptionDropdown(false);
  };
  const handleOpenDeletePostModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        type: DELETE_POST,
        postId: docId,
        imagesUrl: data.photos,
      })
    );
  };

  const handleFollowOtherUser = async (currentUserId, profileId) => {
    await updateCurrentUserFolling(currentUserId, profileId, false);
    await updateFollower(currentUserId, profileId, false);
    setIsFollowing(true);
  };
  const handleUnFollowOtherUser = (currentUserId, profileInfo) => {
    dispatch(
      modalSlice.actions.openModal({
        type: UNFOLLOW,
        currentUserId,
        followingUserInfo: profileInfo,
      })
    );
  };

  useEffect(() => {
    const getData = async () => {
      const response = await getPostWithOwnerById(docId);
      console.log(response);

      let youLikedThisPost = false;
      if (response.likes.userId.includes(currentUserId)) {
        youLikedThisPost = true;
      }

      currentUserId !== response.userId &&
        setIsFollowing(currentUserFollowing.includes(response.userId));
      setData({
        ...response,
        youLikedThisPost,
      });
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const handleFocusOnComment = () => {
      commentFieldRef.current.focus();
    };

    commentBtn.current &&
      commentBtn.current.addEventListener("click", handleFocusOnComment);
  }, []);

  return !data ? (
    <Skeleton count={1} width={975} height={500} />
  ) : (
    <div className="pt-10 mx-auto lg:min-w-[935px] lg:max-w-[950px]">
      <div className="postPage__wrapper flex bg-white">
        <div className="w-[590px] h-[590px]">
          <SlideImages imagesList={data.photos} />
        </div>
        <div className="relative flex flex-col justify-between flex-grow">
          <div className="postPage__owner-wrapper">
            <div className="flex">
              <UserLabel
                avatarUrl={data.avatarUrl}
                username={data.username}
                size={"small"}
              />
              {currentUserId !== data.userId &&
                (isFollowing ? (
                  <button
                    className="postPage__follow-state"
                    onClick={() =>
                      handleUnFollowOtherUser(currentUserId, {
                        avatar: data.avatarUrl,
                        userId: data.userId,
                        username: data.username,
                      })
                    }
                  >
                    <span className="isfollowing hover:text-gray-500">
                      Đang theo dõi
                    </span>{" "}
                  </button>
                ) : (
                  <button
                    className="postPage__follow-state"
                    onClick={() =>
                      handleFollowOtherUser(currentUserId, data.userId)
                    }
                  >
                    <span className="notfollowing text-blue-primary hover:text-blue-bold">
                      Theo dõi
                    </span>
                  </button>
                ))}
            </div>
            <Dropdown
              interactive={true}
              visible={toggleOptionDropdown}
              onClickOutside={handleCloseDropdown}
              placement="bottom-start"
              content={
                <ul className="py-2">
                  {data.userId === currentUserId ? (
                    <>
                      <li className="post__option-dropdown--item">
                        <button className="post__option-dropdown-btn text-[#ED4956] font-semibold">
                          Chỉnh sửa
                        </button>
                      </li>
                      <li className="post__option-dropdown--item">
                        <button
                          className="post__option-dropdown-btn text-[#ED4956] font-semibold"
                          onClick={handleOpenDeletePostModal}
                        >
                          Xóa bài viết
                        </button>
                      </li>
                      <li className="post__option-dropdown--item">
                        <button className="post__option-dropdown-btn">
                          Thêm vào mục yêu thích
                        </button>
                      </li>
                      <li className="post__option-dropdown--item">
                        <button className="post__option-dropdown-btn">
                          Sao chép liên kết
                        </button>
                      </li>
                      <li className="post__option-dropdown--item">
                        <button
                          className="post__option-dropdown-btn"
                          onClick={() => {
                            setToggleOptionDropdown(false);
                          }}
                        >
                          Hủy
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="post__option-dropdown--item">
                        <button className="post__option-dropdown-btn text-[#ED4956] font-semibold">
                          Báo cáo
                        </button>
                      </li>
                      <li className="post__option-dropdown--item">
                        <button className="post__option-dropdown-btn text-[#ED4956] font-semibold">
                          Bỏ theo dõi
                        </button>
                      </li>
                      <li className="post__option-dropdown--item">
                        <button className="post__option-dropdown-btn">
                          Thêm vào mục yêu thích
                        </button>
                      </li>
                      <li className="post__option-dropdown--item">
                        <button className="post__option-dropdown-btn">
                          Sao chép liên kết
                        </button>
                      </li>
                      <li className="post__option-dropdown--item">
                        <button
                          className="post__option-dropdown-btn"
                          onClick={() => {
                            setToggleOptionDropdown(false);
                          }}
                        >
                          Hủy
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              }
            >
              <button
                className="post__option-button"
                onClick={() => {
                  setToggleOptionDropdown((prev) => !prev);
                }}
              >
                <FontAwesomeIcon icon={faEllipsis} />
              </button>
            </Dropdown>
          </div>
          <div className="postPage__comment-wrapper">
            <CommentDetail postId={docId} />
          </div>
          <div className="postPage__bottom">
            <div className="postPage__interactive-wrapper">
              <PostInteractive
                commentBtnRef={commentBtn}
                docId={docId}
                likes={data.likes}
                youLikedThisPost={data.youLikedThisPost}
              ></PostInteractive>
            </div>
            <div className="postPage__comment-input">
              <CommentTextField
                docId={docId}
                commentFieldRef={commentFieldRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
