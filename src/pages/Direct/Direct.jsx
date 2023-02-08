import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { FirebaseContext } from '~/context/firebase';
import { UserContext } from '~/context/user';
import conversationSlice from '~/redux/slice/conversationSlice';
import chatRoomListSlice from "~/redux/slice/chatRoomListSlice";
import { getUser } from '~/services/firebaseServices';
import "./Direct.scss"
import DirectSidebar from './DirectSidebar/DirectSidebar';

function Direct() {
  const { chatroomId } = useParams();
  const dispatch = useDispatch();
  const loggedInUser = useContext(UserContext);
  const { firebase } = useContext(FirebaseContext);
  // const { userId: loggedInUsersId } = useContext(UserContext);
  
  // const [chatRooms, setChatRooms] = useState(null);
  const [dataLoading, setdataLoading] = useState(true)

  useEffect(() => {
    document.title = "Hộp thư - Direct";

    // const unsubscribe = async () => {
    //   let chatRoomWithUserInfo = [];
    //   await firebase
    //     .firestore()
    //     .collection("userChats")
    //     .doc(loggedInUser.userId)
    //     .onSnapshot(async (snapshot) => {
    //       const roomData = Object.entries(snapshot.data());
    //       const promises = roomData.map(async (data) => {
    //         const partnerInfo = await getUser({ //return an array contain user information
    //           userId: [data[1].partnerId]
    //         })
    //         return {
    //           chatroomId: data[0],
    //           ...data[1],
    //           partnerInfo: partnerInfo[0],
    //         }
    //       })
    //       chatRoomWithUserInfo = await Promise.all(promises);
    //       chatRoomWithUserInfo.sort((a, b) => b.date - a.date);
    //       dispatch(chatRoomListSlice.actions.add(chatRoomWithUserInfo));
    //       setdataLoading(false)
    //     });        
    // };
    // unsubscribe();

    // return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  return (
    <div className='direct__wrapper'>
      <div className="direct__box lg:max-w-[935px]">
        <DirectSidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default Direct