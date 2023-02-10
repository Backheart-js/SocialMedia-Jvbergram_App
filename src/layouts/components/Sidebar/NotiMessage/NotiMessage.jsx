import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FirebaseContext } from "~/context/firebase";
import { UserContext } from "~/context/user";
import chatRoomListSlice from "~/redux/slice/chatRoomListSlice";
import { getUser } from "~/services/firebaseServices";
import "../Sidebar.scss";

function NotiMessage() {
  const dispatch = useDispatch();
  const loggedInUser = useContext(UserContext);
  const { firebase } = useContext(FirebaseContext);
  const [countUnseenMessage, setCountUnseenMessage] = useState(0);

  useEffect(() => {
    const unsubscribe = async () => {
      let chatRoomWithUserInfo = [];
      await firebase
        .firestore()
        .collection("userChats")
        .doc(loggedInUser.userId)
        .onSnapshot(async (snapshot) => {
          const roomData = Object.entries(snapshot.data());
          const promises = roomData.map(async (data) => {
            const partnerInfo = await getUser({
              //return an array contain user information
              userId: [data[1].partnerId],
            });
            if (!data[1].seen.status) {
              setCountUnseenMessage((prev) => prev + 1);
            }
            return {
              chatroomId: data[0],
              ...data[1],
              partnerInfo: partnerInfo[0],
            };
          });
          setCountUnseenMessage(0)
          chatRoomWithUserInfo = await Promise.all(promises);
          chatRoomWithUserInfo.sort((a, b) => b.date - a.date);
          dispatch(chatRoomListSlice.actions.add(chatRoomWithUserInfo));
        });
    };
    unsubscribe();

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="sidebarMain__item-message-wrapper">
      <FontAwesomeIcon icon={faPaperPlane} className="sidebarMain__item-icon" />
      {countUnseenMessage ? <div className="quantity-unseenMessage"><span className="">{countUnseenMessage}</span></div> : <></>}
    </div>
  );
}

export default NotiMessage;
