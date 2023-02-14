import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../Direct.scss";
import { FirebaseContext } from "~/context/firebase";
import { UserContext } from "~/context/user";
import Message from "./Message";
import {
  updateSeenMessage,
} from "~/services/firebaseServices";
import { useSelector } from "react-redux";
import Avatar from "~/components/Avatar/Avatar";
import { RotatingLines } from "react-loader-spinner";
import DirectInput from "./DirectInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import UserLabel from "~/components/UserLabel";
import MediaRoom from "./MediaRoom";

function DirectRoom() {
  const { chatroomId } = useParams();
  const loggedInUser = useContext(UserContext);
  const { firebase } = useContext(FirebaseContext);
  const chatroomList = useSelector((state) => state.chatRoomList);
  const [allConversation, setAllConversation] = useState(null);
  const [displayMessages, setDisplayMessages] = useState([]);
  const [limit, setLimit] = useState(10);
  const [loadDataFirstTime, setLoadDataFirstTime] = useState(false);
  const [toggleInfo, setToggleInfo] = useState(false);
  const [showFileMedia, setShowFileMedia] = useState(false)

  const conversationInfo = chatroomList.find(
    (eachRoom) => eachRoom.chatroomId === chatroomId
  );

  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const textareaRef = useRef(null);

  function loadMoreMessages() {
    setLimit((prev) => prev + 20);
  }

  useEffect(() => {
    if (conversationInfo && contentRef.current) {
      contentRef.current.style.height = `calc(${wrapperRef.current.offsetHeight}px - 60px - ${textareaRef.current.offsetHeight}px)`;
    }

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
            conversationInfo?.virtualRoom ||
              (await updateSeenMessage(snapshot.id, loggedInUser.userId));
              data && data.reverse();

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
        setToggleInfo(false);
        setShowFileMedia(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroomId]);

  useEffect(() => {
    document.title = "Jvbergram - Direct";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !conversationInfo ? (
    <></>
  ) : (
    <div ref={wrapperRef} className="drRoom__wrapper">
      <div className="drRoom__header dark:border-b-[#262626]">
        <Link
          to={`/${conversationInfo.partnerInfo?.username}`}
          className={`h-full items-center ${toggleInfo ? "hidden" : "flex"}`}
        >
          <div className="">
            <Avatar
              avatarUrl={conversationInfo.partnerInfo?.avatarUrl}
              size={"xs"}
            />
          </div>
          <div className="ml-2">
            <p className="text-sm font-semibold dark:text-[#FAFAFA]">
              {conversationInfo.partnerInfo?.fullname}
            </p>
          </div>
        </Link>
        <div className={`${toggleInfo ? "block" : "hidden"} w-[60px]`}></div>
        <div className={`w-[60px] ${toggleInfo ? "block" : "hidden"}`}>
          <p className="font-semibold dark:text-[#FAFAFA]">Chi tiết</p>
        </div>
        <div className="flex items-center">
          <button
            className="p-2 flex justify-center items-center"
            onClick={() => setToggleInfo((prev) => !prev)}
          >
            {toggleInfo ? (
              <FontAwesomeIcon
                icon={faCircleInfo}
                className={"icon text-[24px] text-[#262626]"}
              />
            ) : (
              <svg
                aria-label="Xem chi tiết cuộc trò chuyện"
                className="icon"
                color="#262626"
                fill="#262626"
                height={24}
                role="img"
                viewBox="0 0 24 24"
                width={24}
              >
                <circle
                  cx="12.001"
                  cy="12.005"
                  fill="none"
                  r="10.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
                <circle cx="11.819" cy="7.709" r="1.25" />
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  x1="10.569"
                  x2="13.432"
                  y1="16.777"
                  y2="16.777"
                />
                <polyline
                  fill="none"
                  points="10.569 11.05 12 11.05 12 16.777"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      {toggleInfo ? (
          <div className="py-4 flex flex-col flex-grow">
            <div className="detail__chat-wrapper">
              <UserLabel
                username={conversationInfo.partnerInfo?.username}
                fullname={conversationInfo.partnerInfo?.fullname}
                avatarUrl={conversationInfo.partnerInfo?.avatarUrl}
              />
            </div>
            <div className="detail__chat-wrapper">
              <div className="">
                <button className="detail__chat-option-btn flex items-center" onClick={() => setShowFileMedia(prev => !prev)}>
                  <div className="w-6 mr-2 flex justify-center">
                    <svg
                      aria-label="Thêm ảnh hoặc video"
                      className="icon"
                      color="#262626"
                      fill="#262626"
                      height={24}
                      role="img"
                      viewBox="0 0 24 24"
                      width={24}
                    >
                      <path
                        d="M6.549 5.013A1.557 1.557 0 1 0 8.106 6.57a1.557 1.557 0 0 0-1.557-1.557Z"
                        fillRule="evenodd"
                      />
                      <path
                        d="m2 18.605 3.901-3.9a.908.908 0 0 1 1.284 0l2.807 2.806a.908.908 0 0 0 1.283 0l5.534-5.534a.908.908 0 0 1 1.283 0l3.905 3.905"
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                      <path
                        d="M18.44 2.004A3.56 3.56 0 0 1 22 5.564h0v12.873a3.56 3.56 0 0 1-3.56 3.56H5.568a3.56 3.56 0 0 1-3.56-3.56V5.563a3.56 3.56 0 0 1 3.56-3.56Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <span className="dark:text-[#FAFAFA] text-sm font-normal">
                    File phương tiện
                  </span>
                </button>
                <button className="detail__chat-option-btn flex items-center">
                  <div className="w-6 mr-2 flex justify-center"><FontAwesomeIcon icon={faMagnifyingGlass} className={"icon text-[20px]"} /></div>
                  <span className="dark:text-[#FAFAFA] text-sm font-normal">
                    Tìm kiếm đoạn hội thoại
                  </span>
                </button>
                <button className="detail__chat-option-btn flex items-center">
                  <span className="text-highlight-dropdown text-sm font-medium ml-1">
                    Xóa đoạn chat
                  </span>
                </button>
              </div>
            </div>
            {
              showFileMedia ?
                <div className="detail__chat-wrapper flex-grow max-h-[371px] overflow-y-auto">
                  <MediaRoom conversation={allConversation} />
                </div>
              :
                <></>
            }
          </div>
        
      ) : (
        <>
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
                  avatarUrl={conversationInfo.partnerInfo?.avatarUrl}
                  username={conversationInfo.partnerInfo?.username}
                  fullname={
                    message.sender === loggedInUser.userId
                      ? loggedInUser.fullname
                      : conversationInfo.partnerInfo?.fullname
                  }
                  createdTime={conversationInfo.date}
                  key={message.messageId}
                />
              ))
            )}
          </div>
          <div ref={textareaRef} className="drRoom__chatInput-wrapper">
            <DirectInput
              isNewMessage={allConversation?.length === 0}
              conversationInfo={conversationInfo}
              contentRef={contentRef}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default DirectRoom;
