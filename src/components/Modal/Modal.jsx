import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useDispatch } from "react-redux";
import modalSlice from "~/redux/slice/modalSlide";
import CreateNewPost from "./ModalContent/CreateNewPost";
import {
  CREATE_MESSAGE,
  CREATE_POST,
  DELETE_POST,
  FOLLOW_LIST,
  LOGIN,
  UNFOLLOW,
  UPDATE_AVATAR,
  VIEWIMAGE,
} from "~/constants/modalTypes";
import DeletePost from "./ModalContent/DeletePost";
import UnFollow from "./ModalContent/UnFollow";
import "./Modal.scss";
import UpdateAvatar from "./ModalContent/UpdateAvatar";
import { setFollowing } from "~/redux/slice/profileSlice";
import CreateMessage from "./ModalContent/CreateMessage";
import FollowersModal from "./ModalContent/Followers";
import LoginModal from "./ModalContent/Login";
import ViewImage from "./ModalContent/ViewImage";
import useOnClickOutside from "~/hooks/useClickOutside";

function Modal({ payload }) {
  const [imagePreviewLink, setImagePreviewLink] = useState([]);
  const [captionValue, setCaptionValue] = useState("");
  const [messageContent, setMessageContent] = useState("")
  const dispatch = useDispatch();

  const modalRef = useRef()

  const unFollowingUser = () => {
    dispatch(setFollowing(false));
  };
  const closeModal = () => {
    dispatch(modalSlice.actions.closeModal());
  };

  useOnClickOutside([modalRef], () => {
    if (payload.type === CREATE_POST) {
      if (imagePreviewLink.length > 0 || captionValue.length > 0) {
        if (window.confirm('Nếu rời đi bạn sẽ mất những gì vừa chỉnh sửa')) {
          closeModal();
        }
      } else {
        closeModal();
      }
    } else if (payload.type === CREATE_MESSAGE) {
      if (messageContent.length > 0) {
        if(window.confirm("Nếu rời đi bạn sẽ mất những gì vừa chỉnh sửa")) {
          closeModal();
        }
      } else {
        closeModal();
      }
    } else {
      closeModal();
    }

  })

  const handleCloseModalWithCondition = () => {
    // if (imagePreviewLink.length > 0 || captionValue.length > 0) {
    //   if (window.confirm("Bạn có chắc muốn rời đi không?")) {
    //     closeModal();
    //   } else {
    //     return;
    //   }
    // } else {
    //   closeModal();
    // }
  };

  const handleClickEsc = (e) => {
    if (e.code === "Escape") {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("keyup", handleClickEsc);

    return () => {
      document.removeEventListener("keyup", handleClickEsc);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`modal`}>
      <FontAwesomeIcon
        className="modal__close-icon dark:text-[#FAFAFA]"
        icon={faXmark}
        onClick={handleCloseModalWithCondition}
      />
      <div ref={modalRef} className="modal__content">
        {(payload.type === CREATE_POST && (
          <CreateNewPost closeModal={closeModal} imagePreviewLink={imagePreviewLink} captionValue={captionValue} setImagePreviewLink={setImagePreviewLink} setCaptionValue={setCaptionValue} />
        )) ||
          (payload.type === DELETE_POST && (
            <DeletePost
              closeModal={closeModal}
              postId={payload.postId}
              imagesUrl={payload.imagesUrl}
              redirectToProfile={payload.redirectToProfile}
            />
          )) ||
          (payload.type === UNFOLLOW && (
            <UnFollow
              closeModal={closeModal}
              currentUserId={payload.currentUserId}
              followingUserInfo={payload.followingUserInfo}
              setUnfollowFunc={unFollowingUser}
            />
          )) ||
          (payload.type === UPDATE_AVATAR && (
            <UpdateAvatar
              closeModal={closeModal}
              currentUserId={payload.currentUserId}
              avatarUrl={payload.avatarUrl}
            />
          )) ||
          (payload.type === CREATE_MESSAGE && (
            <CreateMessage closeModal={closeModal} content={messageContent} setContent={setMessageContent}/>
          )) ||
          (payload.type === FOLLOW_LIST && (
            <FollowersModal
              closeModal={closeModal}
              followType={payload.followType}
              userIdList={payload.userIdList}
              fullname={payload.fullname}
            />
          )) ||
          (payload.type === LOGIN && <LoginModal closeModal={closeModal} />) ||
          (payload.type === VIEWIMAGE && (
            <ViewImage
              closeModal={closeModal}
              imageLink={payload.imageLink}
              fullname={payload.fullname}
              time={payload.time}
            />
          ))}
      </div>
    </div>
  );
}

export default Modal;
