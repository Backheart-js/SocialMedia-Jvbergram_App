import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../Direct.scss";
import { FirebaseContext } from "~/context/firebase";
import { UserContext } from "~/context/user";
import Message from "./Message";
import {
  deleteEmptyChatRoom,
  updateSeenMessage,
} from "~/services/firebaseServices";
import { useSelector } from "react-redux";
import Avatar from "~/components/Avatar/Avatar";
import { RotatingLines } from "react-loader-spinner";
import DirectInput from "./DirectInput";

function DirectRoom() {
  const { chatroomId } = useParams();
  const loggedInUser = useContext(UserContext);
  const { firebase } = useContext(FirebaseContext);
  const chatroomList = useSelector((state) => state.chatRoomList);
  const [allConversation, setAllConversation] = useState(null);
  const [displayMessages, setDisplayMessages] = useState([]);
  const [limit, setLimit] = useState(10);
  const [loadDataFirstTime, setLoadDataFirstTime] = useState(false);

  const conversationInfo = chatroomList.find(
    (eachRoom) => eachRoom.chatroomId === chatroomId
  );

  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const textareaRef = useRef(null);
  const contentboxRef = useRef(null);

  

  function loadMoreMessages() {
    setLimit((prev) => prev + 20);
  }

  useEffect(() => {
    if (conversationInfo) {
      contentRef.current.style.height = `calc(${wrapperRef.current.offsetHeight}px - 60px - ${textareaRef.current.offsetHeight}px)`;
    }
    // contentRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allConversation]);

  useEffect(() => {
    let unsubscribe;
    if (conversationInfo) {
      (async function () {
        unsubscribe = firebase
          .firestore()
          .collection("conversations")
          .doc(chatroomId)
          .onSnapshot(async (snapshot) => {
            const data = snapshot.data()?.messages;
            conversationInfo?.virtualRoom || await updateSeenMessage(snapshot.id, loggedInUser.userId);
            data.sort((a, b) => b.date - a.date);

            setAllConversation(data ? data : []);
            setLoadDataFirstTime(true);
          });
      })();
    }

    return () => {
      if (conversationInfo) {
        unsubscribe();
        setAllConversation(null);
        setDisplayMessages([]);
        setLimit(10);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroomId]);

  useEffect(() => {
    document.title = "Jvbergram - Direct";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(allConversation)
  return !conversationInfo ? (
    <></>
  ) : (
    <div ref={wrapperRef} className="drRoom__wrapper">
      <div className="drRoom__header">
        <Link
          to={`/${conversationInfo.partnerInfo.username}`}
          className="flex h-full items-center"
        >
          <div className="">
            <Avatar avatarUrl={conversationInfo.partnerInfo.avatarUrl} size={"xs"} />
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">{conversationInfo.partnerInfo.fullname}</p>
          </div>
        </Link>
        <div className="">
          
        </div>
      </div>
      <div ref={contentRef} className="drRoom_content-wrapper flex-grow-1">
        {!allConversation ? (
          <div className="absolute flex justify-center items-center inset-0">
            <RotatingLines
              display
              className={""}
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="30"
              visible
            />
          </div>
        ) : (
          allConversation.map((message) => (
            <Message
              content={message?.content}
              image={message?.image}
              heartIcon={message?.heartIcon}
              loggedInUser={message.sender === loggedInUser.userId}
              avatarUrl={conversationInfo.partnerInfo.avatarUrl}
              username={conversationInfo.partnerInfo.username}
              fullname={message.sender === loggedInUser.userId ? loggedInUser.fullname : conversationInfo.partnerInfo.fullname}
              createdTime={conversationInfo.date}
              key={message.messageId}
            />
          ))
        )}
      </div>
      <div ref={textareaRef} className="drRoom__chatInput-wrapper">
        <DirectInput isNewMessage={allConversation?.length === 0} conversationInfo={conversationInfo} contentRef={contentRef}/>
      </div>
    </div>
  );
}

export default DirectRoom;
