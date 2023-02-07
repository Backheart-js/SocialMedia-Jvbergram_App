import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { FirebaseContext } from '~/context/firebase';
import { UserContext } from '~/context/user';
import conversationSlice from '~/redux/slice/conversationSlice';
import { getUser } from '~/services/firebaseServices';
import "./Direct.scss"
import DirectSidebar from './DirectSidebar/DirectSidebar';

function Direct() {
  const { chatroomId } = useParams();
  const dispatch = useDispatch();
  const { firebase } = useContext(FirebaseContext);
  const { userId: loggedInUsersId } = useContext(UserContext);

  const [dataLoading, setdataLoading] = useState(true)

  useEffect(() => {
    document.title = "Hộp thư - Direct";

    chatroomId && 
    (async function(){
      await firebase.firestore().collection("chatRooms").doc(chatroomId).onSnapshot(async snapshot => {
        const partnerId = snapshot.data().combinedId.replace(loggedInUsersId, "")
        const partnerInfo = await getUser({
          userId: [partnerId]
        })
        dispatch(conversationSlice.actions.add({
          avatarUrl: partnerInfo[0].avatarUrl,
          fullname: partnerInfo[0].fullname,
          partnerId,
          chatroomId: chatroomId,
          username: partnerInfo[0].username
        }))
      })
    })()
    setdataLoading(false)
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  return dataLoading ?
    (
      <div className="direct__wrapper">
        <div className="direct__box lg:max-w-[935px]">
          
        </div>
      </div>
    )
  : (
    <div className='direct__wrapper'>
      <div className="direct__box lg:max-w-[935px]">
        <DirectSidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default Direct