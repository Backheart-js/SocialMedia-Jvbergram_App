import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Suggestion from '~/components/Suggestion';
import Timeline from '~/components/Timeline';
import UserLabel from '~/components/UserLabel';
import { FirebaseContext } from '~/context/firebase';
import { UserContext } from "~/context/user";
import { getUser } from '~/services/firebaseServices';

import './Home.scss'

function Home() {
  const userInfo = useContext(UserContext);
  const { firebase } = useContext(FirebaseContext);
  const [posts, setPosts] = useState(null);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  console.log('Home');

  useEffect(() => {
    let unsubscribe;
    const getTimeline = async () => {
        unsubscribe = firebase.firestore()
        .collection("posts")
        .where("userId", "in", userInfo.following.concat(userInfo.userId))
        .onSnapshot(async (snapshot) => { //Snapshot sẽ kiểm tra trạng thái trong firestore nếu có thay đổi
            let newPosts = snapshot.docs.map((doc) => {
                return { docId: doc.id, ...doc.data() };
            });
            const photosWithUserInfo = await Promise.all(
            newPosts.map(async (photo) => {
                let youLikedThisPost = false;
                if (photo.likes.userId.includes(userInfo.userId)) {
                youLikedThisPost = true;
                }
                const ownerPost = await getUser({
                  userId: photo.userId
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
  }, [])


  useEffect(() => {
    document.title = "Jvbergram"
  }, [])

  return (
    <div className='pt-8 mx-auto w-[820px]'>
      <div className='grid grid-cols-12 gap-8'>
        <div className="col-span-7">
          <div className="mt-4">
            <Timeline posts={posts} />
          </div>
        </div>
        <div className="col-span-5">
          <div className="my-4"><UserLabel avatarUrl={userInfo?.avatarUrl} username={userInfo?.username} fullname={userInfo?.fullname} /></div>
          <div className="suggestion__wrapper">
            <div className="suggestion__title-wrapper flex justify-between">
              <span className='text-sm text-gray-500 font-medium'>
                Gợi ý cho bạn
              </span>
              <Link to={"/explore/people"} className="text-xs font-semibold hover:text-gray-500">
                Xem tất cả
              </Link>
            </div>
            <div className="suggestion__body-min mt-2">
              <Suggestion uid={userInfo.userId} following={userInfo.following}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home