import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useDispatch } from "react-redux";
import modalSlice from "~/redux/slice/modalSlide";
import CreateNewPost from "./ModalContent/CreateNewPost";
import { CREATE_POST, DELETE_POST, UNFOLLOW, UPDATE_AVATAR } from "~/constants/modalTypes";
import DeletePost from "./ModalContent/DeletePost";
import UnFollow from "./ModalContent/UnFollow";
import "./Modal.scss";
import UpdateAvatar from "./ModalContent/UpdateAvatar";

function Modal({ payload }) {
  const [imagePreviewLink, setImagePreviewLink] = useState([]);
  const [captionValue, setCaptionValue] = useState("");
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(modalSlice.actions.closeModal())
  }

  const handleCloseModalWithCondition = () => {
    if (imagePreviewLink.length > 0 || captionValue.length > 0) {
      if (window.confirm("Bạn có chắc muốn rời đi không?")) {
        closeModal();
      } else {
        return;
      }
    } else {
      closeModal();
    }
  };

  return (
    <div className={`modal`}>
      <FontAwesomeIcon
        className="modal__close-icon"
        icon={faXmark}
        onClick={handleCloseModalWithCondition}
      />
      {
        (payload.type === CREATE_POST && <CreateNewPost closeModal={closeModal} />) 
        ||
        (payload.type === DELETE_POST && <DeletePost closeModal={closeModal} postId={payload.postId} imagesUrl={payload.imagesUrl} redirectToProfile={payload.redirectToProfile}/>) 
        ||
        (payload.type === UNFOLLOW && <UnFollow closeModal={closeModal} currentUserId={payload.currentUserId} followingUserInfo={payload.followingUserInfo} setUnfollowFunc={payload.setIsFollowing}/>)
        ||
        (payload.type === UPDATE_AVATAR && <UpdateAvatar closeModal={closeModal} currentUserId={payload.currentUserId} avatarUrl={payload.avatarUrl}/>)
      }
    </div>
  );
}

export default Modal;
