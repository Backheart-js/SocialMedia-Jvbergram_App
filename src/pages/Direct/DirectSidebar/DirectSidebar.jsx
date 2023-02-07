import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faAngleDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import Avatar from "~/components/Avatar/Avatar";
import { CREATE_MESSAGE } from "~/constants/modalTypes";
import { FirebaseContext } from "~/context/firebase";
import { UserContext } from "~/context/user";
import chatRoomListSlice from "~/redux/slice/chatRoomListSlice";
import conversationSlice from "~/redux/slice/conversationSlice";
import modalSlice from "~/redux/slice/modalSlide";
import { getUser } from "~/services/firebaseServices";
import "../Direct.scss";

function DirectSidebar() {
  // const { chatroomId } = useParams();
  const dispatch = useDispatch();

  const loggedInUser = useContext(UserContext);
  const { firebase } = useContext(FirebaseContext);
  const { chatroomId: chatroomIdList } = loggedInUser;

  const [chatRooms, setChatRooms] = useState(null);

  const handleCreateMessageModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        type: CREATE_MESSAGE,
        currentUserId: loggedInUser.userId,
      })
    );
  };

  const handleSelectChatRoom = (data) => {
    dispatch(
      conversationSlice.actions.add({
        avatarUrl: data.avatarUrl,
        fullname: data.fullname,
        partnerId: data.partnerId,
        chatroomId: data.chatroomId,
        username: data.username,
      })
    );
  };

  useEffect(() => {
    const unsubscribe = async () => {
      if (chatroomIdList.length === 0) {
        setChatRooms([]);
      }
      else {
        let chatRoomWithUserInfo = [];
        const promises = chatroomIdList.map(async (id) => {
          const unsub = firebase
            .firestore()
            .collection("chatRooms")
            .doc(id)
            .onSnapshot(async (snapshot) => {
              const roomData = snapshot.data();
  
              const userId = roomData.combinedId.replace(loggedInUser.userId, "");
              const userInfo = await getUser({
                userId: [userId],
              });
              const { avatarUrl, fullname, username } = userInfo[0];
              chatRoomWithUserInfo = chatRoomWithUserInfo.filter(
                (chatroom) => chatroom.chatroomId !== id
              );
              chatRoomWithUserInfo.push({
                chatroomId: id,
                ...roomData,
                partnerId: userId,
                avatarUrl,
                fullname,
                username,
              });
              chatRoomWithUserInfo.sort((a, b) => b.date - a.date);
              dispatch(chatRoomListSlice.actions.add(chatRoomWithUserInfo));
              setChatRooms(chatRoomWithUserInfo ? chatRoomWithUserInfo : []);
            });
          return unsub;
        });
  
        await Promise.all(promises);
      }

    };

    unsubscribe();

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="drSidbar__wrapper">
      <div className="drSidebar__header-wrapper">
        <div className="flex items-center justify-end h-full">
          <div className="w-[60px]"></div>
          <div className="flex items-center justify-center flex-grow">
            <p className="font-medium text-base">{loggedInUser.username}</p>
          </div>
          <div className="w-[60px] flex justify-end">
            <button className="p-2" onClick={handleCreateMessageModal}>
              <FontAwesomeIcon className="text-[22px]" icon={faPenToSquare} />
            </button>
          </div>
        </div>
      </div>
      {!chatRooms ? (
        <div className="my-2 py-2 px-5">
          <div className="flex">
            <Skeleton circle width={54} height={54} />
            <div className="flex flex-col justify-center ml-2">
              <Skeleton width={80} height={20} />
              <Skeleton width={120} height={20} className={"mt-2"} />
            </div>
          </div>
          <div className="flex mt-3">
            <Skeleton circle width={54} height={54} />
            <div className="flex flex-col justify-center ml-2">
              <Skeleton width={80} height={20} />
              <Skeleton width={120} height={20} className={"mt-2"} />
            </div>
          </div>
          <div className="flex mt-3">
            <Skeleton circle width={54} height={54} />
            <div className="flex flex-col justify-center ml-2">
              <Skeleton width={80} height={20} />
              <Skeleton width={120} height={20} className={"mt-2"} />
            </div>
          </div>
        </div>
      ) : (
        <ul className="drSidebar__list">
          {chatRooms.map((chatRoom) => (
            <NavLink
              to={`/direct/${chatRoom.chatroomId}`}
              className="drSidebar__item"
              key={chatRoom.chatroomId}
              onClick={() => {
                handleSelectChatRoom({
                  avatarUrl: chatRoom.avatarUrl,
                  fullname: chatRoom.fullname,
                  partnerId: chatRoom.partnerId,
                  chatroomId: chatRoom.chatroomId,
                  username: chatRoom.username,
                });
              }}
            >
              <div className="flex-shrink-0">
                <Avatar avatarUrl={chatRoom.avatarUrl} size={"medium"} />
              </div>
              <div className="drSidebar__name-wrapper">
                <p className="drSidebar__name-text">{chatRoom.fullname}</p>
                <p className="drSidebar__name-currentMessage">
                  {chatRoom.lastMessage}
                </p>
              </div>
            </NavLink>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DirectSidebar;
