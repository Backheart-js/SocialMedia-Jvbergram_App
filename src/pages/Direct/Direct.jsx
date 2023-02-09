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

  useEffect(() => {
    document.title = "Hộp thư - Direct";

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