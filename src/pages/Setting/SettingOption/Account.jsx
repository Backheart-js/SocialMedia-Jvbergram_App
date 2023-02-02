import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Avatar from "~/components/Avatar/Avatar";
import Button from "~/components/Button";
import { UPDATE_AVATAR } from "~/constants/modalTypes";
import { UserContext } from "~/context/user";
import modalSlice from "~/redux/slice/modalSlide";
import { updateUserInfo } from "~/services/firebaseServices";
import "../Setting.scss";

function Account() {
  const loggedInUser = useContext(UserContext);
  const [avatar, setAvatar] = useState(loggedInUser.avatarUrl);
  const [userData, setUserData] = useState({
    fullname: loggedInUser.fullname,
    birthday: loggedInUser.birthday,
    gender: loggedInUser.gender
  })
  const dispatch = useDispatch();

  const openUpdateAvatarModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        type: UPDATE_AVATAR,
        currentUserId: loggedInUser.userId,
        avatarUrl: avatar
      })
    );
  };

  useEffect(() => {}, []);

  console.log(userData);

  return (
    <div className="">
      <div className="setting__avatar-wrapper setting__field-wrapper">
        <div className="setting__leftside setting__avatar-img-wrapper">
          <Avatar avatarUrl={avatar} />
        </div>
        <div className="setting__rightside setting__avatar-func-wrapper">
          <p className="font-medium text-gray-800 md:mt-1">
            {loggedInUser.username}
          </p>
          <Button
            className={"text-[13px]"}
            btnWhite
            onClick={openUpdateAvatarModal}
          >
            Thay đổi ảnh đại diện
          </Button>
        </div>
      </div>
      <div className="setting__fullname-wrapper setting__field-wrapper flex items-start">
        <div className="setting__leftside">
          <p className="font-medium text-gray-800 md:mt-1">Tên đầy đủ</p>
        </div>
        <div className="setting__rightside">
          <input
            value={userData.fullname}
            type="text"
            className="setting__fullname-input setting__input"
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
      <div className="setting__birthday-wrapper setting__field-wrapper flex items-start">
        <div className="setting__leftside">
          <p className="font-medium text-gray-800 md:mt-1">Ngày sinh</p>
        </div>
        <div className="setting__rightside">
          <input
            value={userData.birthday}
            type="date"
            className="setting__birthday-input setting__input"
            onChange={(e) => setUserData(prev => {
              return {
                ...prev,
                birthday: e.target.value
              }
            })}
          />
        </div>
      </div>
      <div className="setting__gender-wrapper setting__field-wrapper flex items-start">
        <div className="setting__leftside">
          <p className="font-medium text-gray-800 md:mt-1">Giới tính</p>
        </div>
        <div className="setting__rightside">
          <select
            className="setting__input"
            name=""
            id=""
            onChange={(e) => setUserData(prev => {
              return {
                ...prev,
                gender: +e.target.value
              }
            })}
          >
            <option value={0} className="">
              Nam
            </option>
            <option value={1} className="">
              Nữ
            </option>
            <option value={2} className="">
              Không muốn tiết lộ
            </option>
          </select>

          <p className="setting__subnote">
            Thông tin này sẽ không hiển thị trên trang cá nhân của bạn
          </p>
        </div>
      </div>
      <div className="setting__gender-wrapper setting__field-wrapper flex items-start">
        <div className="setting__leftside">
        </div>
        <div className="setting__rightside">
          <Button className={"px-3 py-1"} btnPrimary onClick={() => updateUserInfo(loggedInUser.userId, userData)}>Lưu</Button>
        </div>
      </div>
    </div>
  );
}

export default Account;