import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { FirebaseContext } from '~/context/firebase';
import { UserContext } from '~/context/user';
import conversationSlice from '~/redux/slice/conversationSlice';
import chatRoomListSlice from "~/redux/slice/chatRoomListSlice";
import { getUser } from '~/services/firebaseServices';
import "./Direct.scss"
import DirectSidebar from './DirectSidebar/DirectSidebar';

function Direct() {
  const chatroomList = useSelector((state) => state.chatRoomList);

  // const conversationInfo = chatroomList.find(
  //   (eachRoom) => eachRoom.chatroomId === chatroomId
  // );


  useEffect(() => {
    document.title = "Hộp thư - Direct";

  }, []);
  
  return (
    <div className='direct__wrapper'>
      <div className="direct__box dark:border-[#262626] lg:max-w-[935px] dark:bg-black">
        <DirectSidebar />
        {
          chatroomList && <Outlet />
        }
      </div>
    </div>
  )
}

export default Direct