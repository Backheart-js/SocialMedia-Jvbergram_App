import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

import UserLabel from "../UserLabel";
import "./Post.scss";
import PostInteractive from "./PostInteractive";
import Dropdown from "../Dropdown/Dropdown";
import { UserContext } from "~/context/user";
import { useDispatch } from "react-redux";
import modalSlice from "~/redux/slice/modalSlide";
import { DELETE_POST, UNFOLLOW } from "~/constants/modalTypes";
import Comments from "./Comments";
import formatDate from "~/utils/formatDate";
import HeroSlider from "../Slider/Slider";
import { openNoti } from "~/redux/slice/notificationSlice";
import Caption from "../Caption/Caption";
import { updateCurrentUserFolling, updateFollower, updateLikePost } from "~/services/firebaseServices";
import LayoutDropHeart from "../LayoutDropHeart/LayoutDropHeart";

function Post({ data = {} }) {
  const navigate = useNavigate();
  const { userId: currentUserId, following: currentUserFollowing } = useContext(UserContext);
  const dispatch = useDispatch();
  const [toggleOptionDropdown, setToggleOptionDropdown] = useState(false);
  const [isFolling, setisFolling] = useState(currentUserFollowing.includes(data.userId))
  const [toggleLike, setToggleLike] = useState(data.youLikedThisPost);
  const [likesQuantity, setLikesQuantity] = useState(data.likes.length);
  const [showLikeIcon, setShowLikeIcon] = useState(false)
  const commentFieldRef = useRef(null);
  const commentBtn = useRef(null);
  const imageRef = useRef(null)

  const handleCloseDropdown = () => {
    setToggleOptionDropdown(false);
  };

  const handleOpenDeletePostModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        type: DELETE_POST,
        postId: data.docId,
        imagesUrl: data.photos,
      })
    );
    setToggleOptionDropdown(false)
  };

  const handleUnFollowOtherUser = (currentUserId, profileInfo) => {
    setToggleOptionDropdown(false)
    dispatch(
      modalSlice.actions.openModal({
        type: UNFOLLOW,
        currentUserId,
        followingUserInfo: profileInfo,
      })
    );
  };

  const handleFollowOtherUser = async (currentUserId, profileId) => {
    await updateCurrentUserFolling(currentUserId, profileId, false)
    await updateFollower(currentUserId, profileId, false)
    setisFolling(true)
  }

  const handleGoToPost = () => {
    navigate(`/p/${data.docId}`);
  };

  const handleCopyUrl = async () => {
    const link = `${window.location.origin}/p/${data.docId}`;
    try {
      await navigator.clipboard.writeText(link);
      dispatch(openNoti({content: "???? l??u ???????ng d???n v??o b??? nh??? t???m"}))
    } catch (err) {
      dispatch(openNoti({content: "???? x???y ra l???i!"}))
    }
    setToggleOptionDropdown(false)
  };

  useEffect(() => {
    const handleFocusOnComment = () => {
      commentFieldRef.current.focus();
    };

    commentBtn.current.addEventListener("click", handleFocusOnComment);
  }, []);

  return (
    <div className="post__container dark:border-[#262626] py-3 dark:bg-black">
      <div className="flex justify-between items-center px-3 mb-3">
        <div className="flex items-center">
          <UserLabel
            avatarUrl={data.avatarUrl}
            username={data.username}
            size={"small"}
          />
          <Tippy
            content={moment(data.dateCreated).format("DD/MM/YYYY")}
            placement="bottom-end"
            delay={["400", "200"]}
            arrow={false}
          >
            <span className="post__dateCreated text-gray-500 dark:text-gray-400 text-[14px] select-none">
              {formatDate(data.dateCreated)}
            </span>
          </Tippy>
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
                    <button className="post__option-dropdown-btn text-highlight-dropdown font-semibold">
                      Ch???nh s???a
                    </button>
                  </li>
                  <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
                    <button
                      className="post__option-dropdown-btn text-highlight-dropdown font-semibold"
                      onClick={handleOpenDeletePostModal}
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
                    <button
                      className="post__option-dropdown-btn dark:text-[#FAFAFA]"
                      onClick={handleGoToPost}
                    >
                      ??i t???i b??i vi???t
                    </button>
                  </li>
                  <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
                    <button
                      className="post__option-dropdown-btn dark:text-[#FAFAFA]"
                      onClick={handleCopyUrl}
                    >
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
                    <button className="post__option-dropdown-btn text-highlight-dropdown font-semibold">
                      B??o c??o
                    </button>
                  </li>
                  <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
                    {/* <button
                      className="post__option-dropdown-btn text-highlight-dropdown font-semibold"
                      onClick={() =>
                        handleUnFollowOtherUser(currentUserId, {
                          avatar: data.avatarUrl,
                          username: data.username,
                          userId: data.userId,
                        })
                      }
                    >
                      {
                        currentUserFollowing.includes(data.userId) ?
                          <span className="">
                            B??? theo d??i
                          </span>
                        :
                          <span className="">
                            Theo d??i
                          </span>
                      }
                    </button> */}
                    {
                      isFolling ?
                        (
                          <button className="post__option-dropdown-btn text-highlight-dropdown font-semibold"
                          onClick={() =>
                            handleUnFollowOtherUser(currentUserId, {
                              avatar: data.avatarUrl,
                              username: data.username,
                              userId: data.userId,
                            })
                          }>
                            B??? theo d??i
                          </button>
                        )
                      :
                      (
                        <button className="post__option-dropdown-btn text-highlight-dropdown font-semibold"
                        onClick={() =>
                          handleFollowOtherUser(currentUserId, data.userId)
                        }>
                          Theo d??i
                        </button>
                      )
                    }
                  </li>
                  <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
                    <button className="post__option-dropdown-btn dark:text-[#FAFAFA]">
                      Th??m v??o m???c y??u th??ch
                    </button>
                  </li>
                  <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
                    <button
                      className="post__option-dropdown-btn dark:text-[#FAFAFA]"
                      onClick={handleGoToPost}
                    >
                      ??i t???i b??i vi???t
                    </button>
                  </li>
                  <li className="post__option-dropdown--item dark:hover:bg-[#121212]">
                    <button
                      className="post__option-dropdown-btn dark:text-[#FAFAFA]"
                      onClick={handleCopyUrl}
                    >
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
            className="post__option-button"
            onClick={() => {
              setToggleOptionDropdown((prev) => !prev);
            }}
          >
            <FontAwesomeIcon icon={faEllipsis} className={"dark:text-[#FAFAFA]"}/>
          </button>
        </Dropdown>
      </div>

      <div ref={imageRef} className="bg-black relative" onDoubleClick={() => {
        setShowLikeIcon(true);
        if (!toggleLike) {
          updateLikePost(data.docId, currentUserId, false);
          setToggleLike(true);
          setLikesQuantity(prev => prev+1)
        }
      }}>
        <HeroSlider speed={300} infinite={false} arrow>
          {data.photos.map((photo, i) => (
            <div className="post__photo-bg" key={i}>
              <img src={photo} alt="" className="post-photo-img"/>
            </div>
          ))}
        </HeroSlider>
        
        <LayoutDropHeart isShow={showLikeIcon} setShow={setShowLikeIcon} />
      </div>

      <div className="mt-3 px-3">
        <PostInteractive
          commentBtnRef={commentBtn}
          docId={data.docId}
          isLike={toggleLike}
          setLike={setToggleLike}
          likesQuantity={likesQuantity}
          setLikesQuantity={setLikesQuantity}
          comments={data.comments}
        ></PostInteractive>
        <div className="mt-2"><Caption username={data.username} content={data.caption} /></div>
        <Comments
          docId={data.docId}
          allComments={data.comments}
          userId={currentUserId}
          commentFieldRef={commentFieldRef}
        />
      </div>
    </div>
  );
}

export default memo(Post);
