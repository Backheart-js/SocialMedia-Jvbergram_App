import React, { useContext, useEffect, useState } from "react";
import Button from "~/components/Button";
import Suggestion from "~/components/Suggestion";
import Timeline from "~/components/Timeline";
import UserLabel from "~/components/UserLabel";
import { FirebaseContext } from "~/context/firebase";
import { UserContext } from "~/context/user";
import { getRandomPost, getUser } from "~/services/firebaseServices";
import _ from 'lodash';

import "./Home.scss";

function Home() {
  const userLoggedIn = useContext(UserContext);
  const { firebase } = useContext(FirebaseContext);
  const [posts, setPosts] = useState(null);
  const [photosWithUserInfoState, setPhotosWithUserInfoState] = useState(null);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  const handleReload = () => {
    setPosts(photosWithUserInfoState);
    setShowUpdateButton(false);
  };

  useEffect(() => {
    let unsubscribe;
    const getTimeline = async () => {
      let randomPost = await getRandomPost(userLoggedIn.userId, userLoggedIn.following);
      unsubscribe = firebase
        .firestore()
        .collection("posts")
        .where(
          "userId",
          "in",
          userLoggedIn.following.concat(userLoggedIn.userId)
        ) //Lấy posts của mình và following
        .onSnapshot(async (snapshot) => {
          //Snapshot sẽ kiểm tra trạng thái trong firestore nếu có thay đổi
          
          const postFromFollowingUser = snapshot.docs.map((doc) => {
            return { docId: doc.id, ...doc.data() };
          });

          // const mergedMap = new Map([...randomPost, ...postFromFollowingUser].map(obj => [obj.docId, obj]));
          // const newPosts = [...mergedMap.values()];
          const newPosts = [...randomPost, ...postFromFollowingUser]

          const photosWithUserInfo = await Promise.all(
            newPosts.map(async (photo) => {
              let youLikedThisPost = false;
              if (photo.likes.includes(userLoggedIn.userId)) {
                youLikedThisPost = true;
              }
              const ownerPost = await getUser({
                userId: [photo.userId],
              });
              const { avatarUrl, username } = ownerPost[0];
              return {
                avatarUrl,
                username,
                ...photo,
                youLikedThisPost,
              };
            })
          );

          photosWithUserInfo.sort((a, b) => b.dateCreated - a.dateCreated);

          setPosts(photosWithUserInfo);
        });
    };

    getTimeline();
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title = "Jvbergram";
  }, []);

  return (
    <div className="md:py-8 mx-auto lg:w-[820px] w-[470px]">
      <div className="grid grid-cols-12 gap-0 lg:gap-8">
        <div className="lg:col-span-7 col-span-12 relative">
          <div className="mt-4">
            <Timeline posts={posts} />
          </div>
          {showUpdateButton && (
            <Button className={"reloadTimeLine-btn"} onClick={handleReload}>
              Bài viết mới
            </Button>
          )}
        </div>
        <div className="col-span-5 lg:block hidden">
          <div className="my-4 flex justify-between">
            <UserLabel
              avatarUrl={userLoggedIn?.avatarUrl}
              username={userLoggedIn?.username}
              fullname={userLoggedIn?.fullname}
            />
            <Button
              className={
                "text-[13px] py-2 pl-2 text-blue-primary hover:text-blue-bold"
              }
              onClick={() => firebase.auth().signOut()}
            >
              Đăng xuất
            </Button>
          </div>
          <div className="suggestion__wrapper">
            <div className="suggestion__title-wrapper flex justify-between">
              <span className="text-[13px] text-gray-500 font-semibold">
                Gợi ý cho bạn
              </span>
              <a
                href={"/explore/people"}
                className="text-xs font-semibold hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Xem tất cả
              </a>
            </div>
            <div className="suggestion__body-min mt-5">
              <Suggestion
                userId={userLoggedIn.userId}
                following={userLoggedIn.following}
                min
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
