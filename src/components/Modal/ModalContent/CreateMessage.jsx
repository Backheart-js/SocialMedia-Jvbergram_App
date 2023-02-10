import React, { useContext, useState } from "react";
import Button from "~/components/Button";
import Loader from "~/components/Loader";
import Notification from "~/components/Notification/Notification";
import { UserContext } from "~/context/user";
import { createNewMessage } from "~/services/firebaseServices";
import SearchMessage from "../components/SearchMessage";
import "../Modal.scss";

function CreateMessage({ closeModal }) {
  const loggedInUser = useContext(UserContext);
  const [userSelected, setUserSelected] = useState([]);
  const [content, setContent] = useState("");
  const [showNoti, setShowNoti] = useState(false)

  const isDisabled = content && userSelected.length > 0

  const handleCreateNewMessage = async () => {
    const receiverIds = userSelected.map((user) => user.userId);
    const receiverUsername = userSelected.map((user) => user.username);

    try {
      await createNewMessage(loggedInUser.userId, loggedInUser.username, receiverIds, receiverUsername, content);
      closeModal()
    }
    catch (err) {
      console.log(err);
      setShowNoti(true)
    }

  };

  return (
    <div className="modal__box-wrapper py-4 w-[400px]">
      <div className="">
        <header className="createMessageModal__header-wrapper flex justify-between px-4 pb-2">
          <div className="w-10"></div>
          <div className="">
            <span className="font-semibold">Tin nhắn mới</span>
          </div>
          <div className="">
            <Button disabled={!isDisabled} className={`createMessageModal__sent-btn ${!isDisabled ? "disabled" : ""}`} btnWhite onClick={handleCreateNewMessage}>
              Gửi
            </Button>
          </div>
        </header>
        <main className="createMessageModal__body-wrapper">
          <div className="createMessageModal__content-wrapper">
            <textarea
              className="createMessageModal__content-input px-4 py-2"
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
      <Notification content={"Đã xảy ra lỗi, vui lòng thử lại"} isShowing={showNoti} setShowing={setShowNoti}/>
    </div>
  );
}

export default CreateMessage;
