import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faClone, faFileImage } from "@fortawesome/free-regular-svg-icons";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { v4 } from "uuid";
import { createNewPost } from "~/services/firebaseServices";
import { useAuthListener } from "~/hooks";
import { RotatingLines } from "react-loader-spinner";
import Loader from "~/components/Loader";
import { autoGrowTextarea } from "~/utils/autoGrowTextarea";
import "../Modal.scss";
import { INPUT_IMAGE_REGEX } from "~/constants/Regex";
import useOnClickOutside from "~/hooks/useClickOutside";
import { useDispatch } from "react-redux";
import { openNoti } from "~/redux/slice/notificationSlice";
import HeroSlider from "~/components/Slider/Slider";

function CreateNewPost({ closeModal }) {
  const [imagePreviewLink, setImagePreviewLink] = useState([]); //List ảnh preview
  const [imageList, setImageList] = useState([]); //List ảnh đẩy lên Storage
  const [orderPreview, setOrderPreview] = useState(-1);
  const [captionValue, setCaptionValue] = useState("");
  const [loadingDisplay, setLoadingDisplay] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuthListener();
  const dispatch = useDispatch()
  const dropdownRef = useRef(null)

  useOnClickOutside(dropdownRef, () => setShowDropdown(false))

  const handlePreviewImage = (filesInput) => {
    const files = Object.values(filesInput); //Vì input để multi nên trả về 1 Array ảnh
    const newFilesWithPreview = files.map((file) => {
      return URL.createObjectURL(file);
    });

    setImagePreviewLink((prev) => [...prev, ...newFilesWithPreview]);
  };

  const handleChangeImage = (e) => {
    const files = e.target.files;
    const validatedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const newImg = files[i];
      if (INPUT_IMAGE_REGEX.test(newImg.name)) {
        validatedFiles.push(newImg);
        setImageList((prev) => [...prev, newImg]);
      }
      else {
        dispatch(openNoti({content: `File ${newImg.name} không hợp lệ`}))
      }
    }
    handlePreviewImage(validatedFiles);
    e.target.value = null;
  };

  async function uploadFilesToStorage(files) {
    const storage = getStorage();
    const promises = [];
    let urls = [];
    /** @type {any} */
    const metadata = {
      contentType: "image/*",
    };

    files.forEach((file) => {
      const randomId = v4();
      const storageRef = ref(storage, `images/${file.name}-${randomId}`);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      promises.push(uploadTask);

      uploadTask.on(
        "state_changed",
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
        }
      );
    });
    // Wait for all upload tasks to complete
    await Promise.all(promises);

    // Get the download URLs for each storage reference
    for (const uploadTask of promises) {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      urls.push(downloadURL);
    }
    return urls;
  }

  const handleUploadImage = async (files, caption) => {
    setLoadingDisplay(true);
    try {
      const fileURLs = await uploadFilesToStorage(files);
      await createNewPost(fileURLs, user.uid, caption);
      closeModal();
    } catch (error) {
      alert("Lỗi! Vui lòng thử lại");
    } finally {
      setLoadingDisplay(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImageList(imageList.filter((_, i) => i !== index));
    setImagePreviewLink(imagePreviewLink.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      // Fix lỗi xóa URL trong local
      imagePreviewLink.forEach((imageLink) => {
        URL.revokeObjectURL(imageLink);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setOrderPreview(imagePreviewLink.length - 1);
  }, [imagePreviewLink.length]);

  return (
    <div
      className={`modal__box-wrapper py-4 px-5 ${
        imagePreviewLink.length > 0 ? "w-[550px]" : "w-[500px]"
      }`}
    >
      <div className="modal__title-wrapper">
        <p className="text-lg font-semibold text-center">Tạo bài viết mới</p>
      </div>
      <div className="modal__body-wrapper">
        <div className="modal__user-wrapper">
          <div className="modal__user-avatar"></div>
          <div className="modal__user-name"></div>
        </div>
        <div className="modal__caption pr-2 pb-2">
          <textarea
            value={captionValue}
            className="modal__caption-input"
            placeholder="Viết chú thích..."
            onInput={(e) => autoGrowTextarea(e)}
            onChange={(e) => {
              setCaptionValue(e.target.value);
            }}
          ></textarea>
          <div className="modal__image-area--wrapper">
            {imagePreviewLink.length === 0 ? (
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
                    multiple
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
              <div className="modal__image-area--haveImage">
                {imagePreviewLink.map((imageLink, index) => (
                  <div
                    className={`modal__image-preview ${
                      orderPreview === index ? "block" : "hidden"
                    }`}
                    style={{ backgroundImage: `url(${imageLink})` }}
                    key={index}
                  ></div>
                ))}
                <div className="modal__image-area-overlay">
                  <div>
                    <input
                      id="modal__select-file"
                      multiple
                      className="hidden"
                      type="file"
                      onChange={handleChangeImage}
                      accept="image/*"
                    />
                    <label
                      htmlFor="modal__select-file"
                      className="modal__select-label"
                    >
                      <FontAwesomeIcon icon={faFileImage} />
                      <span className="ml-1 font-semibold">Thêm ảnh</span>
                    </label>
                  </div>
                  <div className="absolute top-3 right-4" name="delete image">
                    <button
                      className="flex justify-center items-center w-8 h-8 rounded-full text-gray-50 bg-gray-600"
                      onClick={() => handleRemoveImage(orderPreview)}
                    >
                      <FontAwesomeIcon icon={faXmark} className={"text-lg"} />
                    </button>
                  </div>
                  {imagePreviewLink.length > 1 && (
                    <div className="absolute bottom-4 right-4">
                      <button
                        className="flex justify-center items-center w-8 h-8 rounded-full text-gray-800 bg-white"
                        onClick={() => setShowDropdown((prev) => !prev)}
                      >
                        <FontAwesomeIcon icon={faClone} />
                      </button>
                      <div 
                        ref={dropdownRef}
                        className={`selectImg__dropdown ${
                          showDropdown ? "flex" : "hidden"
                        }`}
                      >
                        <HeroSlider 
                          speed={500}
                          slidesToShow={4}
                          slidesToScroll={1}
                        >
                          {imagePreviewLink.map((imageLink, index) => (
                            // <button
                            //   className="modal__image-preview-sub-btn"
                            //   onClick={() => setOrderPreview(index)}
                            //   key={index}
                            // >
                            // </button>
                              <div
                                className={`modal__image-preview-sub`}
                                style={{ backgroundImage: `url(${imageLink})` }}
                              >
                                {orderPreview !== index && (
                                  <div className={"overlay"} />
                                )}
                              </div>
                          ))}
                        </HeroSlider>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="modal__footer-wrapper">
        <button
          disabled={imageList.length === 0}
          className={`modal__footer-btn ${
            imageList.length === 0 ? "modal__btn-disabled" : ""
          }`}
          onClick={() => {
            handleUploadImage(imageList, captionValue);
          }}
        >
          Đăng
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

export default CreateNewPost;
