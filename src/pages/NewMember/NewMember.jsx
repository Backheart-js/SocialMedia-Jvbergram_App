import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useContext, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import avatars from "~/assets/avatar";
import Avatar from "~/components/Avatar/Avatar";
import Button from "~/components/Button";
import Suggestion from "~/components/Suggestion";
import { FirebaseContext } from "~/context/firebase";
import { UserContext } from "~/context/user";
import { openNoti } from "~/redux/slice/notificationSlice";
import {
  updateAvatar,
  updateFirstTime,
  updateUserInfo,
} from "~/services/firebaseServices";
import "./NewMember.scss";

function NewMember() {
  const { firebase } = useContext(FirebaseContext);
  const loggedInUser = useContext(UserContext);
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [previewImageLink, setpreviewImageLink] = useState(null);
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState({
    fullname: loggedInUser.fullname,
    birthday: loggedInUser.birthday,
    gender: loggedInUser.gender,
    story: loggedInUser.story,
  });
  const [uploadingData, setUploadingData] = useState(false);

  let enabled =
    (step === 1 && userData.fullname && userData.birthday) ||
    (step === 2 && image) || (step === 3);

  const handleUpdateInfo = async () => {
    await updateUserInfo(loggedInUser.userId, userData);
    dispatch(openNoti({ content: `Đã cập nhật thông tin cá nhân` }));
  };
  const updateNewAvatarFirestore = async (imageFile) => {
    const storage = getStorage();
    const metadata = {
      contentType: "image/*",
    };

    const storageRef = ref(storage, `avatars/${imageFile.name}-${v4()}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile, metadata);

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
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          let newAvataUrl = {
            ...loggedInUser.avatarUrl,
            current: downloadURL,
            history: [downloadURL],
          };

          await updateAvatar(loggedInUser.userId, newAvataUrl); //Lấy url trả về từ Storage và update tại firestore
          setUploadingData(false);
          setStep(step + 1);
        });
      }
    );
  };

  const handleNextStep = async () => {
    setUploadingData(true);
    if (step === 1) {
      await handleUpdateInfo();
      setUploadingData(false);
      setStep(step + 1);
    } else if (step === 2) {
      await updateNewAvatarFirestore(image);
    } else if (step === 3) {
      await updateFirstTime(loggedInUser.userId);
      setUploadingData(false);
    //   navigate("/");
        window.location.href = "/"
    }
  };
  const handleBackStep = () => {
    setStep(step - 1);
  };
  const handleIgnoreStep = () => {
    setStep(step + 1);
  };

  const handleChangeImage = (e) => {
    const [file] = e.target.files;
    setpreviewImageLink(URL.createObjectURL(file));
    setImage(file);
    e.target.value = null;
  };
  const handleClearImage = () => {
    setImage(null);
    setpreviewImageLink(null);
  };

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="newMem__box pb-4">
        <div
          className={`newMen__top pb-3 px-4 pt-4 flex justify-between`}
        >
          {step > 1 ? (
            <Button className={"px-3 py-1"} onClick={handleBackStep}>
              Quay lại
            </Button>
          ) : (
            <Button className={"px-3 py-1"} onClick={() => firebase.auth().signOut()}>
              Đăng xuất
            </Button>
          )}
          <div className="flex items-center">
            {step === 2 && (
              <Button
                className={"px-3 py-1 font-medium"}
                btnWhite
                onClick={handleIgnoreStep}
              >
                Bỏ quả
              </Button>
            )}
            <Button
              disabled={!enabled}
              className={"px-3 py-1 font-semibold"}
              btnPrimary
              onClick={handleNextStep}
            >
              {uploadingData ? (
                <div className="flex justify-center items-center">
                  <RotatingLines
                    display
                    strokeColor="white"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="25"
                    visible
                  />
                </div>
              ) : step === 3 ? (
                "Hoàn tất"
              ) : (
                "Tiếp tục"
              )}
            </Button>
          </div>
        </div>
        <div className="newMen__content pt-5">
          {(step === 1 && (
            <div className="">
              <header className="text-center">
                <p className="font-medium text-xl">
                  Cập nhật thông tin của bạn
                </p>
              </header>
              <main className="mt-10 px-16">
                <div className="setting__fullname-wrapper setting__field-wrapper flex items-start">
                  <div className="setting__leftside">
                    <p className="font-medium text-gray-800 dark:text-gray-100 md:mt-1">
                      Tên đầy đủ
                    </p>
                  </div>
                  <div className="setting__rightside">
                    <input
                      value={userData.fullname}
                      type="text"
                      className="setting__fullname-input setting__input"
                      onChange={(e) =>
                        setUserData((prev) => {
                          return {
                            ...prev,
                            fullname: e.target.value,
                          };
                        })
                      }
                    />
                    <p className="setting__subnote">
                      Thông tin này sẽ xuất hiện trên trang cá nhân của bạn
                    </p>
                  </div>
                </div>
                <div className="setting__birthday-wrapper setting__field-wrapper flex items-start">
                  <div className="setting__leftside">
                    <p className="font-medium text-gray-800 dark:text-gray-100 md:mt-1">
                      Ngày sinh
                    </p>
                  </div>
                  <div className="setting__rightside">
                    <input
                      value={userData.birthday}
                      type="date"
                      className="setting__birthday-input setting__input"
                      onChange={(e) =>
                        setUserData((prev) => {
                          return {
                            ...prev,
                            birthday: e.target.value,
                          };
                        })
                      }
                    />
                  </div>
                </div>
                <div className="setting__story-wrapper setting__field-wrapper flex items-start">
                  <div className="setting__leftside">
                    <p className="font-medium text-gray-800 dark:text-gray-100 md:mt-1">
                      Tiểu sử
                    </p>
                  </div>
                  <div className="setting__rightside">
                    <textarea
                      value={userData.story}
                      type="text"
                      className="setting__story-input setting__input"
                      onChange={(e) =>
                        setUserData((prev) => {
                          return {
                            ...prev,
                            story: e.target.value,
                          };
                        })
                      }
                    />
                    <p className="setting__subnote">
                      {userData.story.length} / 50
                    </p>
                  </div>
                </div>
                <div className="setting__gender-wrapper setting__field-wrapper flex items-start">
                  <div className="setting__leftside">
                    <p className="font-medium text-gray-800 dark:text-gray-100 md:mt-1">
                      Giới tính
                    </p>
                  </div>
                  <div className="setting__rightside">
                    <select
                      className="setting__input"
                      value={userData.gender}
                      name=""
                      id=""
                      onChange={(e) =>
                        setUserData((prev) => {
                          return {
                            ...prev,
                            gender: +e.target.value,
                          };
                        })
                      }
                    >
                      <option
                        value={0}
                        className="dark:text-[#FAFAFA] dark:bg-[#262626]"
                      >
                        Nam
                      </option>
                      <option
                        value={1}
                        className="dark:text-[#FAFAFA] dark:bg-[#262626]"
                      >
                        Nữ
                      </option>
                      <option
                        value={2}
                        className="dark:text-[#FAFAFA] dark:bg-[#262626]"
                      >
                        Không muốn tiết lộ
                      </option>
                    </select>

                    <p className="setting__subnote">
                      Thông tin này sẽ không hiển thị trên trang cá nhân của bạn
                    </p>
                  </div>
                </div>
              </main>
            </div>
          )) ||
            (step === 2 && (
              <div className="">
                <header className="text-center">
                  <p className="font-medium text-xl">
                    Cập nhật ảnh đại diện của bạn
                  </p>
                </header>
                <main className="flex flex-col items-center mt-10 px-16">
                  <Avatar
                    avatarUrl={{ current: previewImageLink || avatars.default }}
                    size="preview"
                  />
                  <div className="modal__select-wrapper mt-10 flex justify-center">
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
                    {previewImageLink && (
                      <Button
                        className={"ml-4 px-3 py-1"}
                        onClick={handleClearImage}
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                </main>
              </div>
            )) ||
            (step === 3 && (
              <div className={`${step === 3 || "hidden"}`}>
                <header className="text-center">
                  <p className="font-medium text-xl">
                    Những người bạn có thể biết
                  </p>
                </header>
                <main className="mt-10 px-16">
                  <Suggestion
                    userId={loggedInUser.userId}
                    following={loggedInUser.following}
                  />
                </main>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default NewMember;
