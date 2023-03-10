import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Dropdown from "~/components/Dropdown/Dropdown";
import CommentTextField from "~/components/Post/Comments/CommentTextField";
import PostInteractive from "~/components/Post/PostInteractive";
import UserLabel from "~/components/UserLabel";
import { DELETE_POST, LOGIN, UNFOLLOW } from "~/constants/modalTypes";
import { UserContext } from "~/context/user";
import modalSlice from "~/redux/slice/modalSlide";
import {
  getPostWithOwnerById,
  updateCurrentUserFolling,
  updateFollower,
  updateLikePost,
} from "~/services/firebaseServices";
import sortComments from "~/utils/sortComment";
import CommentDetail from "./CommentDetail/CommentDetail";
import "./PostPage.scss";
import "~/components/Post/Post.scss";
import { setFollowing } from "~/redux/slice/profileSlice";
import { openNoti } from "~/redux/slice/notificationSlice";
import HeroSlider from "~/components/Slider/Slider";
import { useAuthListener } from "~/hooks";
import LayoutDropHeart from "~/components/LayoutDropHeart/LayoutDropHeart";
import formatDate from "~/utils/formatDate";

function PostPage() {
  const { docId } = useParams();
  const { userId: currentUserId, following: currentUserFollowing } =
    useContext(UserContext) || {
      userId: null,
      following: null
    };
  const { user } = useAuthListener();
  const isFollowing = useSelector(state => state.profile.isFollowing)
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [toggleOptionDropdown, setToggleOptionDropdown] = useState(false);
  const [userCommentList, setUserCommentList] = useState([]);
  const [toggleLike, setToggleLike] = useState(false);
  const [showLikeIcon, setShowLikeIcon] = useState(false)
  const [likesQuantity, setLikesQuantity] = useState(0);
  const commentFieldRef = useRef(null);
  const commentBtn = useRef(null);

  const handleCloseDropdown = () => {
    setToggleOptionDropdown(false);
  };
  const handleOpenDeletePostModal = (ownerUsername) => {
    setToggleOptionDropdown(false);
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
    setToggleOptionDropdown(false);

    if (user) {
      await updateCurrentUserFolling(currentUserId, profileId, false);
      await updateFollower(currentUserId, profileId, false);
      dispatch(setFollowing(true))
    } else {
      openLoginModal();
    }
  };
  const handleUnFollowOtherUser = (currentUserId, profileInfo) => {
    setToggleOptionDropdown(false);
    if (user) {
      dispatch(
        modalSlice.actions.openModal({
          type: UNFOLLOW,
          currentUserId,
          followingUserInfo: profileInfo,
        })
      );
    } else {
      openLoginModal();
    }
  };

  const handleCopyUrl = async () => {
    const link = `${window.location.origin}/p/${docId}`;
    try {
      await navigator.clipboard.writeText(link);
      dispatch(openNoti({content: `???? l??u ???????ng d???n v??o b??? nh??? t???m`}))

    } catch (err) {
      dispatch(openNoti({content: `???? c?? l???i x???y ra, vui l??ng th??? l???i`}))
    }
    setToggleOptionDropdown(false);
  }
  const openLoginModal = () => {
    dispatch(modalSlice.actions.openModal({
      type: LOGIN
    }))
  }

  useEffect(() => {

    const getData = async () => {
      const response = await getPostWithOwnerById(docId);
      document.title = `${response.fullname} tr??n Jvbergram`; 
      let youLikedThisPost = false;
      if (response.likes.includes(currentUserId)) {
        youLikedThisPost = true;
      }
      setToggleLike(youLikedThisPost)
      setLikesQuantity(response.likes.length)

      currentUserId !== response.userId &&
        dispatch(setFollowing(currentUserFollowing?.includes(response.userId) || false))
      setData({
        ...response,
        youLikedThisPost,
      });
      setUserCommentList(sortComments(response.comments)); //s???p x???p comment theo th???i gian t??? m???i nh???t ?????n c?? nh???t
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
    <div className={`flex justify-center items-center mx-auto lg:min-w-[800px] lg:max-w-[950px] ${user ? "pt-10" : "pt-5"}`}>
      <div className="postPage__wrapper dark:border-[#262626] flex bg-white dark:bg-black">
        <div className="max-w-[590px] min-w-[480px]">
          <div className="bg-black relative" onDoubleClick={() => {
            if (user) {
              setShowLikeIcon(true);
              if (!toggleLike) {
                updateLikePost(docId, currentUserId, false);
                setToggleLike(true);
                setLikesQuantity(prev => prev+1)
              }
            }
      }}>
            <HeroSlider speed={300} infinite={false} arrow>
              {data.photos.map((photo, i) => (
                <div className="postpage__photo-bg" key={i}>
                  <img src={photo} alt="" className="postpage__photo-img"/>
                </div>
              ))}
            </HeroSlider>

            <LayoutDropHeart isShow={showLikeIcon} setShow={setShowLikeIcon} />
          </div>
        </div>
        <div className="postPage__right dark:border-l-[#262626] relative flex flex-col w-[360px] h-[610px]">
          <div className="postPage__owner-wrapper dark:border-b-[#262626]">
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
                    <span className="isfollowing text-sm hover:text-gray-500 dark:text-[#FAFAFA]">
                      ??ang theo d??i
                    </span>{" "}
                  </button>
                ) : (
                  <button
                    className="postPage__follow-state"
                    onClick={() => {
                      user ? 
                        handleFollowOtherUser(currentUserId, data.userId)
                      :
                      openLoginModal()
                    }
                    }
                  >
                    <span className="notfollowing text-sm text-blue-primary hover:text-blue-bold">
                      Theo d??i
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
                      <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
                        <button className="post__option-dropdown-btn text-[#ED4956] font-semibold">
                          Ch???nh s???a
                        </button>
                      </li>
                      <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
                        <button
                          className="post__option-dropdown-btn text-[#ED4956] font-semibold"
                          onClick={() =>
                            handleOpenDeletePostModal(data.username)
                          }
                        >
                          X??a b??i vi???t
                        </button>
                      </li>
                      <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
                        <button className="post__option-dropdown-btn dark:text-[#FAFAFA]">
                          Th??m v??o m???c y??u th??ch
                        </button>
                      </li>
                      <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
                        <button className="post__option-dropdown-btn dark:text-[#FAFAFA]" onClick={handleCopyUrl}>
                          Sao ch??p li??n k???t
                        </button>
                      </li>
                      <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
                        <button
                          className="post__option-dropdown-btn dark:text-[#FAFAFA]"
                          onClick={() => {
                            setToggleOptionDropdown(false);
                          }}
                        >
                          H???y
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
                        <button className="post__option-dropdown-btn text-[#ED4956] font-semibold">
                          B??o c??o
                        </button>
                      </li>
                      <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
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
                            B??? theo d??i
                          </button>
                        ) : (
                          <button
                            className="post__option-dropdown-btn text-[#ED4956] font-semibold"
                            onClick={() =>
                              handleFollowOtherUser(currentUserId, data.userId)
                            }
                          >
                            Theo d??i
                          </button>
                        )}
                      </li>
                      {
                        user && 
                      <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
                        <button className="post__option-dropdown-btn dark:text-[#FAFAFA]">
                          Th??m v??o m???c y??u th??ch
                        </button>
                      </li>
                      }
                      <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
                        <button className="post__option-dropdown-btn dark:text-[#FAFAFA]" onClick={handleCopyUrl}>
                          Sao ch??p li??n k???t
                        </button>
                      </li>
                      <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
                        <button
                          className="post__option-dropdown-btn dark:text-[#FAFAFA]"
                          onClick={() => {
                            setToggleOptionDropdown(false);
                          }}
                        >
                          H???y
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              }
            >
              <button
                className="postpage__option-button dark:text-[#FAFAFA]"
                onClick={() => {
                  setToggleOptionDropdown((prev) => !prev);
                }}
              >
                <FontAwesomeIcon className="dark:text-[#FAFAFA]" icon={faEllipsis} />
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
          <div className="postPage__bottom dark:border-t-[#262626]">
            <div className="postPage__interactive-wrapper">
              <PostInteractive
                commentBtnRef={commentBtn}
                docId={docId}
                isLike={toggleLike}
                setLike={setToggleLike}
                likesQuantity={likesQuantity}
                setLikesQuantity={setLikesQuantity}
                isGuest={!user}
              ></PostInteractive>
              <div className="mt-2 text-[13px] text-gray-600 dark:text-gray-300">
                {formatDate(data.dateCreated)} ago
              </div>
            </div>
            {
              user ?
            <div className="postPage__comment-input dark:border-t-[#262626]">
              <CommentTextField
                docId={docId}
                commentFieldRef={commentFieldRef}
                setUserCommentList={setUserCommentList}
              />
            </div>
              
              :
              <div className="postPage__comment-input dark:border-t-[#262626] flex justify-center items-center mt-2">
                <button className="text-blue-primary font-semibold text-sm" onClick={openLoginModal}>????ng nh???p</button>
                <span className="text-sm ml-1 font-medium text-gray-800">????? b??nh lu???n n???i dung n??y</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
