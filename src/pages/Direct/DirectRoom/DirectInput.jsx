import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
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
  const dispatch = useDispatch()
  const { chatroomId } = useParams();
  const loggedInUser = useContext(UserContext);
  const [messageValue, setMessageValue] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [sentProcessing, setsentProcessing] = useState(false);
  const [toggleDropdownEmoji, setToggleDropdownEmoji] = useState(false)

  const handleChangeImage = (e) => {
    const [file] = e.target.files;
    if (INPUT_IMAGE_REGEX.test(file.name)) {
      setPreviewImage(URL.createObjectURL(file));
      setImage(file);
      setMessageValue("");
    } else {
      dispatch(openNoti({content: `Định dạng file không hợp lệ`}))
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
  };

  const handleSentMessage = async () => {
    if (!messageValue.trim()) {
      //Khoảng trắng
      return;
    }
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
    setMessageValue("");
  };

  const handleSentHeartIcon = async () => {
    if (isNewMessage) {
      const newMessage = {
        messageId: v4(),
        heartIcon:true,
        sender: loggedInUser.userId,
        date: Date.now(), //Không dùng được timestamp vì firebase không cho dùng trong array
      };
      const newRoomId = await createNewChatRoom(
        loggedInUser.userId,
        loggedInUser.username,
        conversationInfo.partnerInfo.userId,
        conversationInfo.partnerInfo.username,
        {heartIcon: true}
      );
      await createNewConversation(newRoomId, newMessage);
    }
    else {
      await sentHeartIcon(
        chatroomId,
        conversationInfo.partnerInfo.userId,
        loggedInUser.userId
      );
    }
  }

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
          content={
            <DropdownEmoji setValue={setMessageValue}/>
          }
        >
          <button
            disabled={previewImage}
            className="flex justify-center items-center px-3 py-2"
            onClick={() => setToggleDropdownEmoji(prev => !prev)}
          >
            <svg
              aria-label="Biểu tượng cảm xúc"
              className="_ab6-"
              color="#262626"
              fill="#262626"
              height={24}
              role="img"
              viewBox="0 0 24 24"
              width={24}
            >
              <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z" />
            </svg>
          </button>
        </Dropdown>
      </div>
      <div className="chatInput__textarea-wrapper">
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
                    className={"text-xs text-gray-100"}
                  />
                </button>
              )}
            </div>
          </div>
        ) : (
          <textarea
            value={messageValue}
            name=""
            className="chatInput__textarea"
            placeholder="Nhập tin..."
            onInput={(e) => autoGrowTextarea(e)}
            onChange={(e) => {
              setMessageValue(e.target.value.trimStart());
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (image) {
                  handleSentImage();
                } else {
                  handleSentMessage();
                }
                contentRef.current.scrollIntoView({behavior: 'smooth'});
              }
            }}
          ></textarea>
        )}
      </div>
      <div className="chatInput__sentFunc">
        {messageValue.length > 0 || previewImage ? (
          <Button
            className={"px-4 py-2"}
            btnWhite
            onClick={() => {
              if (image) {
                handleSentImage();
              } else {
                handleSentMessage();
              }
              contentRef.current.scrollIntoView({behavior: 'smooth'});
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
                className="_ab6-"
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
            <button className="flex justify-center items-center px-2 py-2" onClick={handleSentHeartIcon}>
              <svg
                aria-label="Thích"
                className="_ab6-"
                color="#262626"
                fill="#262626"
                height={24}
                role="img"
                viewBox="0 0 24 24"
                width={24}
              >
                <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DirectInput;
