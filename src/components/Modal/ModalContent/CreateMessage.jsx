import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "~/components/Button";
import { UserContext } from "~/context/user";
import { openNoti } from "~/redux/slice/notificationSlice";
import { createNewMessage } from "~/services/firebaseServices";
import SearchMessage from "../components/SearchMessage";
import "../Modal.scss";

function CreateMessage({ closeModal, content, setContent }) {
  const dispatch = useDispatch()

  const loggedInUser = useContext(UserContext);
  const [userSelected, setUserSelected] = useState([]);

  const isDisabled = content && userSelected.length > 0

  const handleCreateNewMessage = async () => {
    const receiverIds = userSelected.map((user) => user.userId);
    const receiverUsername = userSelected.map((user) => user.username);

    try {
      await createNewMessage(loggedInUser.userId, loggedInUser.username, receiverIds, receiverUsername, content);
      closeModal()
    }
    catch (err) {
      dispatch(openNoti({content: `Đã xảy ra lỗi, vui lòng thử lại`}))

    }

  };

  return (
    <div className="modal__box-wrapper py-4 w-[400px] dark:bg-[#262626]">
      <div className="">
        <header className="createMessageModal__header-wrapper  flex justify-between px-4 pb-2 dark:border-b-[#363636]">
          <div className="w-10"></div>
          <div className="dark:text-[#FAFAFA]">
            <span className="font-semibold">Tin nhắn mới</span>
          </div>
          <div className="">
            <Button disabled={!isDisabled} className={`createMessageModal__sent-btn dark:bg-transparent ${!isDisabled ? "disabled" : ""}`} btnWhite onClick={handleCreateNewMessage}>
              Gửi
            </Button>
          </div>
        </header>
        <main className="createMessageModal__body-wrapper">
          <div className="createMessageModal__content-wrapper">
            <textarea
              className="createMessageModal__content-input dark:border-b-[#363636] px-4 py-2 dark:bg-transparent dark:text-[#FAFAFA]"
              name=""
              id=""
              placeholder="Nội dung..."
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          <SearchMessage
            userSelected={userSelected}
            setUserSelected={setUserSelected}
          />
        </main>
      </div>
    </div>
  );
}

export default CreateMessage;
