import { faFaceSmile, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import Button from "~/components/Button";
import Dropdown from "~/components/Dropdown/Dropdown";
import DropdownEmoji from "~/components/Emoji/Emoji";
import { INPUT_IMAGE_REGEX } from "~/constants/Regex";
import { UserContext } from "~/context/user";
import { openNoti } from "~/redux/slice/notificationSlice";
import {
  createNewChatRoom,
  createNewConversation,
  sentHeartIcon,
  sentMessage,
  sentMessageImage,
} from "~/services/firebaseServices";
import { autoGrowTextarea } from "~/utils/autoGrowTextarea";

function DirectInput({ isNewMessage, conversationInfo, contentRef }) {
  const dispatch = useDispatch();
  const { chatroomId } = useParams();
  const loggedInUser = useContext(UserContext);
  const [messageValue, setMessageValue] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [sentProcessing, setsentProcessing] = useState(false);
  const [toggleDropdownEmoji, setToggleDropdownEmoji] = useState(false);

  const inputRef = useRef(null);
  const handleChangeImage = (e) => {
    const [file] = e.target.files;
    if (INPUT_IMAGE_REGEX.test(file.name)) {
      setPreviewImage(URL.createObjectURL(file));
      setImage(file);
      setMessageValue("");
    } else {
      dispatch(openNoti({ content: `Định dạng file không hợp lệ` }));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewImage(null);
  };

  const handleSentImage = async () => {
    setsentProcessing(true);
    if (isNewMessage) {
      const newRoomId = await createNewChatRoom(
        loggedInUser.userId,
        loggedInUser.username,
        conversationInfo.partnerInfo.userId,
        conversationInfo.partnerInfo.username,
        ""
      );
      await createNewConversation(newRoomId);
      await sentMessageImage(
        chatroomId,
        image,
        conversationInfo.partnerInfo.userId,
        loggedInUser.userId,
        () => {
          setsentProcessing(false);
          handleRemoveImage();
        }
      );
    } else {
      await sentMessageImage(
        chatroomId,
        image,
        conversationInfo.partnerInfo.userId,
        loggedInUser.userId,
        () => {
          setsentProcessing(false);
          handleRemoveImage();
        }
      );
    }
    contentRef.current.firstChild.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  };

  const handleSentMessage = async () => {
    if (!messageValue.trim()) {
      //Khoảng trắng
      return;
    }
    try {
      if (isNewMessage) {
        const newMessage = {
          messageId: v4(),
          content: messageValue,
          sender: loggedInUser.userId,
          date: Date.now(), //Không dùng được timestamp vì firebase không cho dùng trong array
        };
        const newRoomId = await createNewChatRoom(
          loggedInUser.userId,
          loggedInUser.username,
          conversationInfo.partnerInfo.userId,
          conversationInfo.partnerInfo.username,
          messageValue
        );
        await createNewConversation(newRoomId, newMessage);
      } else {
        await sentMessage(
          chatroomId,
          messageValue,
          conversationInfo.partnerInfo.userId,
          loggedInUser.userId
        );
      }
      contentRef.current.firstChild.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
      setMessageValue("");
      inputRef.current.style.height = "34px";
    } catch (error) {
      dispatch(openNoti("Đã xảy ra lỗi, vui lòng thử lại sau!"));
    }
  };

  const handleSentHeartIcon = async () => {
    if (isNewMessage) {
      const newMessage = {
        messageId: v4(),
        heartIcon: true,
        sender: loggedInUser.userId,
        date: Date.now(), //Không dùng được timestamp vì firebase không cho dùng trong array
      };
      const newRoomId = await createNewChatRoom(
        loggedInUser.userId,
        loggedInUser.username,
        conversationInfo.partnerInfo.userId,
        conversationInfo.partnerInfo.username,
        { heartIcon: true }
      );
      await createNewConversation(newRoomId, newMessage);
    } else {
      await sentHeartIcon(
        chatroomId,
        conversationInfo.partnerInfo.userId,
        loggedInUser.userId
      );
    }
    contentRef.current.firstChild.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  };

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  return (
    <div className="chatInput__wrapper">
      <div className="chatInput__icon">
        <Dropdown
          visible={toggleDropdownEmoji}
          interactive
          placement="top-start"
          className="w-[335px] h-[325px]"
          onClickOutside={() => setToggleDropdownEmoji(false)}
          content={<DropdownEmoji setValue={setMessageValue} />}
        >
          <button
            disabled={previewImage}
            className="flex justify-center items-center px-3 py-2"
            onClick={() => setToggleDropdownEmoji((prev) => !prev)}
          >
            <FontAwesomeIcon
              icon={faFaceSmile}
              className="text-2xl text-[#262626] icon"
            />
          </button>
        </Dropdown>
      </div>
      <div className="chatInput__textarea-wrapper relative">
        {previewImage ? (
          <div className="w-full py-4 pl-2">
            <div className="relative w-fit">
              <img
                src={previewImage}
                alt=""
                className="h-[80px] w-auto rounded-xl"
              />

              {sentProcessing ? (
                <div className="absolute flex justify-center items-center inset-0">
                  <RotatingLines
                    display
                    strokeColor="white"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="30"
                    visible
                  />
                </div>
              ) : (
                <button
                  className="absolute flex justify-center items-center top-[-4px] right-[-4px] w-4 h-4 rounded-full bg-gray-700"
                  onClick={handleRemoveImage}
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className={"text-xs text-gray-100 icon"}
                  />
                </button>
              )}
            </div>
          </div>
        ) : (
          <textarea
            ref={inputRef}
            value={messageValue}
            className="chatInput__textarea dark:text-[#FAFAFA]"
            placeholder="Nhập tin..."
            onInput={(e) => autoGrowTextarea(e)}
            onChange={(e) => {
              setMessageValue(e.target.value.trimStart());
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                handleSentMessage();
              }
            }}
          ></textarea>
        )}
      </div>
      <div className="chatInput__sentFunc">
        {messageValue.length > 0 || previewImage ? (
          <Button
            className={"px-4 py-2 dark:bg-transparent"}
            btnWhite
            onClick={() => {
              if (image) {
                handleSentImage();
              } else {
                handleSentMessage();
              }
            }}
          >
            Gửi
          </Button>
        ) : (
          <div className="flex">
            <input
              id="message-sentFile"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChangeImage}
            />
            <label
              htmlFor="message-sentFile"
              className="flex justify-center items-center px-2 py-2 cursor-pointer"
            >
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
            </label>
            <button
              className="flex justify-center items-center px-2 py-2"
              onClick={handleSentHeartIcon}
            >
              <FontAwesomeIcon
                icon={faHeart}
                className={"text-2xl text-[#262626] icon"}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(DirectInput);
