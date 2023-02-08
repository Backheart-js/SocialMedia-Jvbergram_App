import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Avatar from "~/components/Avatar/Avatar";
import { CREATE_MESSAGE } from "~/constants/modalTypes";
import { FirebaseContext } from "~/context/firebase";
import { UserContext } from "~/context/user";
import conversationSlice from "~/redux/slice/conversationSlice";
import modalSlice from "~/redux/slice/modalSlide";
import { getUser } from "~/services/firebaseServices";
import "../Direct.scss";

function DirectSidebar() {
  // const { chatroomId } = useParams();
  const dispatch = useDispatch();
  const chatRooms = useSelector(state => state.chatRoomList)
  const loggedInUser = useContext(UserContext);
  const { firebase } = useContext(FirebaseContext);
  // const { chatroomId: chatroomIdList } = loggedInUser;

  // const [chatRooms, setChatRooms] = useState(null);
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
        avatarUrl: data.partnerInfo.avatarUrl,
        fullname: data.partnerInfo.fullname,
        partnerId: data.partnerInfo.userId,
        username: data.partnerInfo.username,
        chatroomId: data.chatroomId,
      })
    );
  };

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
                handleSelectChatRoom(chatRoom);
              }}
            >
              <div className="flex-shrink-0">
                <Avatar avatarUrl={chatRoom.partnerInfo.avatarUrl} size={"medium"} />
              </div>
              <div className="drSidebar__name-wrapper">
                <p className="drSidebar__name-text">{chatRoom.partnerInfo.fullname}</p>
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
