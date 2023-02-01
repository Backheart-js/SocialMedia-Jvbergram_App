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
import sortComments from "~/utils/sortComment";
import CommentDetail from "./CommentDetail/CommentDetail";
import "./PostPage.scss";
import "~/components/Post/Post.scss";

function PostPage() {
  const { docId } = useParams();
  const { userId: currentUserId, following: currentUserFollowing } =
    useContext(UserContext);
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [toggleOptionDropdown, setToggleOptionDropdown] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userCommentList, setUserCommentList] = useState([]);
  const commentFieldRef = useRef(null);
  const commentBtn = useRef(null);

  const handleCloseDropdown = () => {
    setToggleOptionDropdown(false);
  };
  const handleOpenDeletePostModal = (ownerUsername) => {
    dispatch(
      modalSlice.actions.openModal({
        type: DELETE_POST,
        postId: docId,
        imagesUrl: data.photos,
        redirectToProfile: ownerUsername,
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
        setIsFollowing: setIsFollowing
      })
    );
  };

  useEffect(() => {
    const getData = async () => {
      const response = await getPostWithOwnerById(docId);

      let youLikedThisPost = false;
      if (response.likes.includes(currentUserId)) {
        youLikedThisPost = true;
      }

      currentUserId !== response.userId &&
        setIsFollowing(currentUserFollowing.includes(response.userId));
      setData({
        ...response,
        youLikedThisPost,
      });
      setUserCommentList(sortComments(response.comments)); //sắp xếp comment theo thời gian từ mới nhất đến cũ nhất
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
    <div className="h-[580px] w-[950px] flex pt-10 mx-auto">
      <div className="h-full">
        <Skeleton count={1} width={580} height={580} />
      </div>
      <div className="h-full ml-6">
        <div className="flex">
          <div className="">
            <Skeleton circle height={42} width={42} />
          </div>
          <div className="ml-3">
            <Skeleton height={16} width={150} />
            <Skeleton height={16} width={100} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex">
            <div className="">
              <Skeleton circle height={42} width={42} />
            </div>
            <div className="ml-3">
              <Skeleton height={16} width={150} />
              <Skeleton height={16} width={100} />
            </div>
          </div>
        </div>
        <div className=""></div>
      </div>
    </div>
  ) : (
    <div className="pt-10 mx-auto lg:min-w-[935px] lg:max-w-[950px]">
      <div className="postPage__wrapper flex bg-white">
        <div className="w-[590px] h-[590px]">
          <SlideImages imagesList={data.photos} />
        </div>
        <div className="relative flex flex-col flex-grow w-[334px]">
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
                    <span className="isfollowing text-sm hover:text-gray-500">
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
                    <span className="notfollowing text-sm text-blue-primary hover:text-blue-bold">
                      Theo dõi
                    </span>
                  </button>
                ))}
            </div>
            <Dropdown
              interactive={true}
              visible={toggleOptionDropdown}
              onClickOutside={handleCloseDropdown}
              placement="bottom"
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
                          onClick={() =>
                            handleOpenDeletePostModal(data.username)
                          }
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
                        {isFollowing ? (
                          <button
                            className="post__option-dropdown-btn text-[#ED4956] font-semibold"
                            onClick={() =>
                              handleUnFollowOtherUser(currentUserId, {
                                avatar: data.avatarUrl,
                                userId: data.userId,
                                username: data.username,
                              })
                            }
                          >
                            Bỏ theo dõi
                          </button>
                        ) : (
                          <button
                            className="post__option-dropdown-btn text-[#ED4956] font-semibold"
                            onClick={() =>
                              handleFollowOtherUser(currentUserId, data.userId)
                            }
                          >
                            Theo dõi
                          </button>
                        )}
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
            <CommentDetail
              postId={docId}
              avatarUrl={data.avatarUrl}
              username={data.username}
              ownerCaption={data.caption}
              commentList={userCommentList}
            />
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
                setUserCommentList={setUserCommentList}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
