import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Avatar from "~/components/Avatar/Avatar";
import Button from "~/components/Button";
import { UPDATE_AVATAR } from "~/constants/modalTypes";
import { UserContext } from "~/context/user";
import modalSlice from "~/redux/slice/modalSlide";
import { openNoti } from "~/redux/slice/notificationSlice";
import { updateUserInfo } from "~/services/firebaseServices";
import "../Setting.scss";
var _ = require("lodash");

function Account() {
  const loggedInUser = useContext(UserContext);
  const [originalInformation, setOriginalInformation] = useState({
    avatar: loggedInUser.avatarUrl,
    fullname: loggedInUser.fullname,
    birthday: loggedInUser.birthday,
    gender: loggedInUser.gender,
    story: loggedInUser.story
  })
  const [userData, setUserData] = useState(originalInformation)
  const dispatch = useDispatch();

  let disabledUpdate = _.isEqual(originalInformation, userData)

  const openUpdateAvatarModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        type: UPDATE_AVATAR,
        currentUserId: loggedInUser.userId,
        avatarUrl: loggedInUser.avatarUrl,
      })
    );
  };
  
  const handleUpdateInfo = () => {
    updateUserInfo(loggedInUser.userId, userData); 
    dispatch(openNoti({content: `Đã cập nhật thông tin cá nhân`}))
    setOriginalInformation(userData)
  }

  useEffect(() => {
    document.title = "Cài đặt người dùng"
    
  }, [])

  return (
    <div className="">
      <div className="setting__avatar-wrapper setting__field-wrapper flex-col md:flex-row">
        <div className="setting__leftside setting__avatar-img-wrapper">
          <Avatar avatarUrl={userData.avatar} />
        </div>
        <div className="setting__rightside setting__avatar-func-wrapper">
          <p className="font-medium text-gray-800 dark:text-gray-100 md:mt-1">
            {loggedInUser.username}
          </p>
          <Button
            className={"text-[13px] dark:bg-transparent"}
            btnWhite
            onClick={openUpdateAvatarModal}
          >
            Thay đổi ảnh đại diện
          </Button>
        </div>
      </div>
      <div className="setting__fullname-wrapper setting__field-wrapper flex-col md:flex-row flex items-start">
        <div className="setting__leftside">
          <p className="font-medium text-gray-800 dark:text-gray-100 md:mt-1">Tên đầy đủ</p>
        </div>
        <div className="setting__rightside">
          <input
            value={userData.fullname}
            type="text"
            className="setting__fullname-input setting__input xl:min-w-[250px] lg:min-w-[260px] sm:min-w-[280px] min-w-[200px] dark:bg-[#262626] dark:text-[#FAFAFA] dark:border-[#262626]"
            onChange={(e) => setUserData(prev => {
              return {
                ...prev,
                fullname: e.target.value
              }
            })}
          />
          <p className="setting__subnote">
            Thông tin này sẽ xuất hiện trên trang cá nhân của bạn
          </p>
        </div>
      </div>
      <div className="setting__birthday-wrapper setting__field-wrapper flex-col md:flex-row flex items-start">
        <div className="setting__leftside">
          <p className="font-medium text-gray-800 dark:text-gray-100 md:mt-1">Ngày sinh</p>
        </div>
        <div className="setting__rightside">
          <input
            value={userData.birthday}
            type="date"
            className="setting__birthday-input setting__input xl:min-w-[250px] lg:min-w-[260px] sm:min-w-[280px] min-w-[200px] dark:bg-[#262626] dark:text-[#FAFAFA] dark:border-[#262626]"
            onChange={(e) => setUserData(prev => {
              return {
                ...prev,
                birthday: e.target.value
              }
            })}
          />
        </div>
      </div>
      <div className="setting__story-wrapper setting__field-wrapper flex-col md:flex-row flex items-start">
        <div className="setting__leftside">
          <p className="font-medium text-gray-800 dark:text-gray-100 md:mt-1">Tiểu sử</p>
        </div>
        <div className="setting__rightside">
          <textarea
            value={userData.story}
            type="text"
            className="setting__story-input setting__input"
            onChange={(e) => setUserData(prev => {
              return {
                ...prev,
                story: e.target.value
              }
            })}
          />
          <p className="setting__subnote">
            {userData.story.length} / 50
          </p>
        </div>
      </div>
      <div className="setting__gender-wrapper setting__field-wrapper flex-col md:flex-row flex items-start">
        <div className="setting__leftside">
          <p className="font-medium text-gray-800 dark:text-gray-100 md:mt-1">Giới tính</p>
        </div>
        <div className="setting__rightside">
          <select
            className="setting__input xl:min-w-[250px] lg:min-w-[260px] sm:min-w-[280px] min-w-[200px] dark:bg-[#262626] dark:text-[#FAFAFA] dark:border-[#262626]"
            value={userData.gender}
            name=""
            id=""
            onChange={(e) => setUserData(prev => {
              return {
                ...prev,
                gender: +e.target.value
              }
            })}
          >
            <option value={0} className="dark:text-[#FAFAFA] dark:bg-[#262626]">
              Nam
            </option>
            <option value={1} className="dark:text-[#FAFAFA] dark:bg-[#262626]">
              Nữ
            </option>
            <option value={2} className="dark:text-[#FAFAFA] dark:bg-[#262626]">
              Không muốn tiết lộ
            </option>
          </select>

          <p className="setting__subnote">
            Thông tin này sẽ không hiển thị trên trang cá nhân của bạn
          </p>
        </div>
      </div>
      <div className="setting__gender-wrapper setting__field-wrapper flex-col md:flex-row flex items-start">
        <div className="setting__leftside">
        </div>
        <div className="setting__rightside">
          <Button disabled={disabledUpdate} className={`px-3 py-1 text-[#FAFAFA] bg-blue-primary hover:bg-blue-bold ${disabledUpdate ? "opacity-50 hover:bg-blue-primary" : ""}`}  onClick={handleUpdateInfo}>Lưu</Button>
        </div>
      </div>
    </div>
  );
}

export default Account;
