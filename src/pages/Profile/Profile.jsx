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
import chatRoomListSlice from "~/redux/slice/chatRoomListSlice";

function Profile() {
  const { profile, postsCollection, isFollowing } = useSelector(
    (state) => state.profile
  );
  const { username } = useParams();
  const reduxDispatch = useDispatch();
  const { user } = useAuthListener();
  const userLoggedIn = useContext(UserContext);
  const navigate = useNavigate();
  const [notFound, setNotFound] = useState(false);

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
      if (!chatRoomSnapshot[0].exists) {
        //Chưa nhắn tin với người này -> Tạo chatroom mới
        const combinedId =
          userLoggedIn.userId > profileId
            ? userLoggedIn.userId.concat(profileId)
            : profileId.concat(userLoggedIn.userId);
        const newRoom = {
          chatroomId: combinedId,
          lastMessage: "",
          date: Date.now(),
          partnerId: profileId,
          username: profileUsername,
          seen: { status: true, time: Date.now() },
          lastSender: userLoggedIn.userId,
          partnerInfo: profile,
          virtualRoom: true,
        };
        reduxDispatch(chatRoomListSlice.actions.createNewRoom(newRoom));
        setCheckDirectLoading(false);
        navigate(`/direct/${combinedId}`);
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
      openLoginModal();
    }
  };

  const openLoginModal = () => {
    reduxDispatch(
      modalSlice.actions.openModal({
        type: LOGIN,
      })
    );
  };

  const openFollowModal = (followType, userIdList, fullname) => {
    user
      ? reduxDispatch(
          modalSlice.actions.openModal({
            type: FOLLOW_LIST,
            followType,
            userIdList,
            fullname,
          })
        )
      : openLoginModal();
  };

  useEffect(() => {
    document.title = "Trang cá nhân";

    return () => {
      reduxDispatch(resetProfile());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  useEffect(() => {
    (async function () {
      const [userInfo] = await getUser({
        username: [username],
      });
      if (!userInfo) {
        setNotFound(true);
      } else {
        const posts = await getPostOfUser(userInfo.userId);
        posts.sort((a, b) => b.dateCreated - a.dateCreated); //sắp xếp theo thời gian

        reduxDispatch(setProfile(userInfo));
        reduxDispatch(
          setFollowing(userLoggedIn?.following.includes(userInfo.userId))
        );
        reduxDispatch(setPostsCollection(posts));
      }
      // check không tìm thấy người dùng
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return notFound ? (
    <div className="pt-12 text-center">
      <div className="">
        <p className="font-semibold text-2xl">
          Rất tiếc, trang này hiện không khả dụng.
        </p>
      </div>
      <div className="mt-5">
        <span className="font-medium">
          Liên kết bạn theo dõi có thể bị hỏng hoặc trang này có thể đã bị gỡ.
        </span>
        <a href="/" className="ml-1 text-sm text-blue-primary">
          Quay lại Jvbergram
        </a>
      </div>
    </div>
  ) : (
    (!profile && !postsCollection) || (
      <div className="pt-10 mx-auto lg:w-[935px]">
        <>
          <div className="profile__top-wrapper dark:border-b-[#262626] grid grid-cols-12 lg:min-h-[200px] pb-6">
            <div className="col-span-4 flex justify-center items-center">
              <Avatar avatarUrl={profile.avatarUrl} size={"big"} />
            </div>
            <div className="col-span-8 flex flex-col items-start justify-center">
              <div className="profile__info-wrapper hidden md:flex">
                <div className="min-w-[120px] select-none">
                  <span className="font-medium text-[20px] dark:text-[#FAFAFA]">
                    {profile.username}
                  </span>
                </div>
                {user?.uid === profile.userId ? (
                  <Link
                    to={"/setting/account"}
                    className="flex items-center justify-center mx-6 h-8 w-52 rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
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
                    onClick={() => {
                      user
                        ? handleFollowOtherUser(
                            userLoggedIn.userId,
                            profile.userId
                          )
                        : openLoginModal();
                    }}
                  >
                    <span className="text-sm font-semibold text-white">
                      Theo dõi
                    </span>
                  </button>
                )}
                {user?.uid === profile.userId ? (
                  <></>
                ) : (
                  <button
                    className="relative flex items-center justify-center h-8 ml-2 w-24 rounded-lg bg-gray-100 hover:bg-gray-200"
                    onClick={() =>
                      user
                        ? navigateToDirect(profile.username, profile.userId)
                        : openLoginModal()
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
                  <span className="text-sm font-medium dark:text-[#FAFAFA]">
                    {postsCollection.length} bài viết
                  </span>
                </div>
                <div className="profile__info-2">
                  <button
                    className="w-full text-sm font-medium dark:text-[#FAFAFA]"
                    onClick={() =>
                      openFollowModal("followers", profile.followers)
                    }
                  >
                    {profile.followers.length} người theo dõi
                  </button>
                </div>
                <div className="profile__info-2">
                  <button
                    className="w-full text-sm font-medium dark:text-[#FAFAFA]"
                    onClick={() =>
                      openFollowModal(
                        "following",
                        profile.following,
                        profile.fullname
                      )
                    }
                  >
                    Đang theo dõi {profile.following.length} người dùng
                  </button>
                </div>
              </div>
              <div className="profile__info-wrapper hidden md:block">
                <p className="text-sm font-semibold dark:text-[#FAFAFA]">
                  {profile.fullname}
                </p>
                <pre className="text-sm font-normal dark:text-gray-300">
                  {profile.story}
                </pre>
              </div>
            </div>
          </div>
          <div className="">

          </div>
        </>
        <div className="profile__bottom-wrapper mt-6">
          {postsCollection.length === 0 ? (
            <div className="flex justify-center items-center">
              <span className="dark:text-[#FAFAFA]">
                Hiện chưa có bài viết nào
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-8">
              {postsCollection.map((post) => (
                <button
                  className="post__wrapper dark:border-b-[#262626] col-span-4"
                  key={post.docId}
                  onClick={() => navigateToPost(post.docId)}
                >
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
