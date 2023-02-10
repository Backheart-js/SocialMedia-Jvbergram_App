import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "~/components/Avatar/Avatar";
import { VIEWIMAGE } from "~/constants/modalTypes";
import modalSlice from "~/redux/slice/modalSlide";
import "./Message.scss";

function Message({ content, image, avatarUrl, username, fullname, loggedInUser, createdTime, ...props }) {
  const dispatch = useDispatch()
  
  const handleOpenViewImage = (imageLink, username, time) => {
    dispatch(modalSlice.actions.openModal({
      type: VIEWIMAGE,
      imageLink,
      username,
      time
    }))
  }

  return (
    <div
      className={`message-wrapper ${loggedInUser ? "mine" : "partner"}`}
      {...props}
    >
      {loggedInUser || (
        <div className="message__avatar-wrapper">
          <Link to={`/${username}`} className="message__avatar-box">
            <Avatar avatarUrl={avatarUrl} size="sx" />
          </Link>
        </div>
      )}
        {
          content ? 
            <div className="message-bubble">
              <p className="message-content">{content}</p>
            </div>
          :
          <div className="message-image"><img src={image} alt="" className="rounded-xl" onClick={() => handleOpenViewImage(image,fullname,createdTime)}/></div>
        }
    </div>
  );
}

export default Message;
