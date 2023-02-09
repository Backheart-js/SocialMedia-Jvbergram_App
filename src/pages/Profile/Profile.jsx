import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import Avatar from "~/components/Avatar/Avatar";
import { FOLLOW_LIST, LOGIN, UNFOLLOW } from "~/constants/modalTypes";
import { UserContext } from "~/context/user";
import { useAuthListener } from "~/hooks";
import modalSlice from "~/redux/slice/modalSlide";
import {
  checkChatRoom,
  createNewChatRoom,
  createNewConversation,
  getPostOfUser,
  getUser,
  updateCurrentUserFolling,
  updateFollower,
} from "~/services/firebaseServices";
import "./Profile.scss";
import {
  setFollowing,
  setPostsCollection,
  setProfile,
  resetProfile,
} from "~/redux/slice/profileSlice";
import Loader from "~/components/Loader";
import { RotatingLines } from "react-loader-spinner";

function Profile() {
  const { profile, postsCollection, isFollowing } = useSelector(
    (state) => state.profile
  );
  const { username } = useParams();
  const reduxDispatch = useDispatch();
  const { user } = useAuthListener();
  const userLoggedIn = useContext(UserContext);
  const navigate = useNavigate();


  const [checkDirectLoading, setCheckDirectLoading] = useState(false);

  const handleFollowOtherUser = async (currentUserId, profileId) => {
    try {
      await updateCurrentUserFolling(currentUserId, profileId, false);
      await updateFollower(currentUserId, profileId, false);
      reduxDispatch(setFollowing(true));
    } catch (e) {}
  };
  const handleUnFollowOtherUser = (currentUserId, profileInfo) => {
    reduxDispatch(
      modalSlice.actions.openModal({
        type: UNFOLLOW,
        currentUserId,
        followingUserInfo: profileInfo,
      })
    );
  };
  const navigateToDirect = async (profileUsername, profileId) => {
    setCheckDirectLoading(true);
    try {
      const chatRoomSnapshot = await checkChatRoom(userLoggedIn.userId, [
        profileId,
      ]);
      console.log(chatRoomSnapshot);
      if (!chatRoomSnapshot[0].exists) {
        //Chưa nhắn tin với người này -> Tạo chatroom mới

        const newChatRoomId = await createNewChatRoom(
          userLoggedIn.userId,
          userLoggedIn.username,
          profileId,
          profileUsername,
          ""
        ); //Chuỗi rỗng vì tạo chatroom chưa có tin nhắn
        await createNewConversation(newChatRoomId);

        setCheckDirectLoading(false);
        navigate(`/direct/${newChatRoomId}`);
      } else {
        setCheckDirectLoading(false);
        navigate(`/direct/${chatRoomSnapshot[0].id}`);
      }
    } catch (err) {}
  };

  const navigateToPost = (postId) => {
    if (user) {
      navigate(`/p/${postId}`);
    } else {
      openLoginModal()
    }
  }

  const openLoginModal = () => {
    reduxDispatch(modalSlice.actions.openModal({
      type: LOGIN
    }))
  }

  const openFollowModal = (followType, userIdList) => {
    reduxDispatch(modalSlice.actions.openModal({
      type: FOLLOW_LIST,
      followType,
      userIdList
    }));
  }

  useEffect(() => {
    document.title = "Trang cá nhân";

    return () => {
      reduxDispatch(resetProfile());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async function () {
      const [userInfo] = await getUser({
        username: [username],
      });
      // if (userInfo.length === 0) {
      // } check không tìm thấy người dùng

      const posts = await getPostOfUser(userInfo.userId);
      posts.sort((a, b) => b.dateCreated - a.dateCreated); //sắp xếp theo thời gian

      reduxDispatch(setProfile(userInfo));
      reduxDispatch(
        setFollowing(userLoggedIn?.following.includes(userInfo.userId))
      );
      reduxDispatch(setPostsCollection(posts));
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return (
    (!profile && !postsCollection) || (
      <div className="pt-10 mx-auto lg:w-[935px]">
        <div className="profile__top-wrapper grid grid-cols-12 lg:h-[200px] pb-6">
          <div className="col-span-4 flex justify-center items-center">
            <Avatar avatarUrl={profile.avatarUrl} size={"big"} />
          </div>
          <div className="col-span-8 flex flex-col items-start justify-center">
            <div className="profile__info-wrapper flex">
              <div className="min-w-[120px] select-none">
                <span className="font-medium text-[20px]">
                  {profile.username}
                </span>
              </div>
              {user?.uid === profile.userId ? (
                <Link to={"/setting/account"} className="flex items-center justify-center mx-6 h-8 w-52 rounded-lg bg-gray-100 hover:bg-gray-200">
                  <span className="text-sm font-semibold">
                    Chỉnh sửa trang cá nhân
                  </span>
                </Link>
              ) : isFollowing ? (
                <button
                  className="flex items-center justify-center ml-8 h-8 w-40 rounded-lg bg-gray-100 hover:bg-gray-200"
                  onClick={() =>
                    handleUnFollowOtherUser(userLoggedIn.userId, {
                      avatar: profile.avatarUrl,
                      userId: profile.userId,
                      username: profile.username,
                    })
                  }
                >
                  <span className="text-sm font-semibold">Đang theo dõi</span>
                </button>
              ) : (
                <button
                  className="flex items-center justify-center ml-8 h-8 w-24 rounded-lg bg-[#0095f6] hover:bg-[#118ab2]"
                  onClick={() =>{
                    user ?
                    handleFollowOtherUser(userLoggedIn.userId, profile.userId) : openLoginModal()
                  }
                  }
                >
                  <span className="text-sm font-semibold text-white">
                    Theo dõi
                  </span>
                </button>
              )}
              {/* <button>
              <svg
                aria-label="Tùy chọn"
                className="_ab6-"
                color="#262626"
                fill="#262626"
                height={24}
                role="img"
                viewBox="0 0 24 24"
                width={24}
              >
                <circle
                  cx={12}
                  cy={12}
                  fill="none"
                  r="8.635"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
                <path
                  d="M14.232 3.656a1.269 1.269 0 0 1-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 0 1-.796.66m-.001 16.688a1.269 1.269 0 0 1 .796.66l.505.996h1.862l.505-.996a1.269 1.269 0 0 1 .796-.66M3.656 9.768a1.269 1.269 0 0 1-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 0 1 .66.796m16.688-.001a1.269 1.269 0 0 1 .66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 0 1-.66-.796M7.678 4.522a1.269 1.269 0 0 1-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 0 1-.096 1.03m11.8 11.799a1.269 1.269 0 0 1 1.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 0 1 .096-1.03m-14.956.001a1.269 1.269 0 0 1 .096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 0 1 1.03.096m11.799-11.8a1.269 1.269 0 0 1-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 0 1-1.03-.096"
                  fill="none"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button> */}
              {user?.uid === profile.userId ? (
                <></>
              ) : (
                <button
                  className="relative flex items-center justify-center h-8 ml-2 w-24 rounded-lg bg-gray-100 hover:bg-gray-200"
                  onClick={() =>
                    user ? navigateToDirect(profile.username, profile.userId) : openLoginModal()
                  }
                >
                  {checkDirectLoading ? (
                    <Loader 
                    type={RotatingLines}
                    display
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="20"
                    visible={true}
                    />
                  ) : (
                    <span className="text-sm font-semibold">Nhắn tin</span>
                  )}
                </button>
              )}
            </div>
            <div className="profile__info-wrapper flex">
              <div className="profile__info-2">
                <span className="text-sm font-medium">
                  {postsCollection.length} bài viết
                </span>
              </div>
              <div className="profile__info-2">
                <button className="w-full text-sm font-medium" onClick={()=>openFollowModal("followers", profile.followers)}>
                  {profile.followers.length} người theo dõi
                </button>
              </div>
              <div className="profile__info-2">
                <button className="w-full text-sm font-medium" onClick={()=>openFollowModal("following", profile.following)}>
                  Đang theo dõi {profile.following.length} người dùng
                </button>
              </div>
            </div>
            <div className="profile__info-wrapper">
              <p className="text-sm font-semibold">{profile.fullname}</p>
              <p className="text-sm font-normal">
                {profile.story}
              </p>
            </div>
          </div>
        </div>
        <div className="profile__bottom-wrapper mt-6">
          {postsCollection.length === 0 ? (
            <div className="flex justify-center items-center">
              <span>Hiện chưa có bài viết nào</span>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-8">
              {postsCollection.map((post) => (
                <button className="post__wrapper col-span-4" key={post.docId} onClick={() =>navigateToPost(post.docId)}>
                  <div className="post__wrapper-link">
                    <div
                      className="bg-center bg-cover bg-no-repeat pb-[100%]"
                      style={{ backgroundImage: `url(${post.photos[0]})` }}
                      title={`Ảnh từ bài đăng của ${profile.fullname}`}
                    ></div>
                    <div className="post__layout">
                      <div className="post_interactive-wrapper flex justify-between text-white w-[45%]">
                        <div className="flex justify-center items-center">
                          <FontAwesomeIcon className="text-xl" icon={faHeart} />
                          <span className="font-semibold text-lg ml-2">
                            {post.likes.length}
                          </span>
                        </div>
                        <div className="flex justify-center items-center ">
                          <FontAwesomeIcon
                            className="text-xl"
                            icon={faComment}
                          />
                          <span className="font-semibold text-lg ml-2">
                            {post.comments.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default Profile;
