import React, { useEffect, useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RotatingLines } from "react-loader-spinner";
import { v4 } from "uuid";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

import Avatar from "~/components/Avatar/Avatar";
import Loader from "~/components/Loader";
import "../Modal.scss";
import { updateAvatar } from "~/services/firebaseServices";

function UpdateAvatar({ closeModal, currentUserId, avatarUrl }) {
  const [imagePreviewLink, setImagePreviewLink] = useState(null);
  const [image, setImage] = useState(null);
  const [loadingDisplay, setLoadingDisplay] = useState(false);

  const handleChangeImage = (e) => {
    const [file] = e.target.files;
    // console.log(file);
    setImagePreviewLink(URL.createObjectURL(file));
    setImage(file);
  };

  const updateNewAvatarFirestore = async (imageFile) => {
    const storage = getStorage();
    const metadata = {
      contentType: "image/*",
    };

    const storageRef = ref(storage, `avatars/${imageFile.name}-${v4()}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile, metadata);

    uploadTask.on('state_changed',
    (snapshot) => {
      switch (snapshot.state) {
        case "paused":
          break;
        case "running":
          break;
        default:
      }
    },
    (error) => {
      switch (error.code) {
        case "storage/unauthorized":
          break;
        case "storage/canceled":
          break;
        case "storage/unknown":
          break;
        default:
      }
    },
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
      const newAvataUrl = avatarUrl.current ? {
        ...avatarUrl,
        current: downloadURL,
        history: [...avatarUrl.history, avatarUrl.current ]
      } : {
        ...avatarUrl,
        current: downloadURL,
        history: [...avatarUrl.history, downloadURL ]
      }

      await updateAvatar(currentUserId, newAvataUrl) //Lấy url trả về từ Storage và update tại firestore
      closeModal();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  }
);
  }

  const handleUpdateAvatar = async () => {
    setLoadingDisplay(true);
    try {
      await updateNewAvatarFirestore(image)
    } catch (error) {
      setLoadingDisplay(false);
      alert(error.message);
    }
  };

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imagePreviewLink)
    };
  }, [imagePreviewLink]);

  return (
    <div className={`modal__box-wrapper py-4 px-5 w-[500px]`}>
      <div className="modal__title-wrapper">
        <p className="text-lg font-semibold text-center">Thêm ảnh đại diện</p>
      </div>
      <div className="modal__body-wrapper">
        <div className="modal__avatar-area--wrapper pt-4 pb-2">
          {!imagePreviewLink ? (
            <div className="modal__image-area--nonImg h-[300px]">
              <svg
                aria-label="Biểu tượng thể hiện file phương tiện, chẳng hạn như hình ảnh hoặc video"
                className="_ab6-"
                color="#262626"
                fill="#262626"
                height="77"
                role="img"
                viewBox="0 0 97.6 77.3"
                width="96"
              >
                <path
                  d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                  fill="currentColor"
                ></path>
                <path
                  d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                  fill="currentColor"
                ></path>
                <path
                  d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                  fill="currentColor"
                ></path>
              </svg>
              <span className="mt-4 font-medium text-base">
                Kéo thả ảnh vào đây
              </span>
              <div className="modal__select-wrapper mt-4">
                <input
                  id="modal__select-file"
                  className="hidden"
                  type="file"
                  onChange={handleChangeImage}
                  accept="image/*"
                />
                <label
                  htmlFor="modal__select-file"
                  className="modal__select-label"
                >
                  Chọn từ máy tính
                </label>
              </div>
            </div>
          ) : (
            <div className="modal__avatar-area--haveImage">
              <Avatar
                avatarUrl={{ current: imagePreviewLink }}
                size="preview"
              />
              <div className="flex w-full justify-center mt-4">
                <input
                    id="modal__select-file"
                    className="hidden"
                    type="file"
                    onChange={handleChangeImage}
                    accept="image/*"
                  />
                  <label
                    htmlFor="modal__select-file"
                    className="modal__avatar-change-btn"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Chọn ảnh
                  </label>
              </div>
            </div>
          )}
        </div>
        {avatarUrl?.history.length > 0 && (
          <div className="modal__avatar-store-wrapper"></div>
        )}
      </div>
      <div className="modal__footer-wrapper mt-4">
        <button
          disabled={!image}
          className={`modal__footer-btn ${!image ? "modal__btn-disabled" : ""}`}
          onClick={() => {
            handleUpdateAvatar(image);
          }}
        >
          Cập nhật
        </button>
      </div>
      <Loader
        type={RotatingLines}
        display={loadingDisplay}
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible
      />
    </div>
  );
}

export default UpdateAvatar;
