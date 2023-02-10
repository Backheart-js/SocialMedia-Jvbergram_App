import React from "react";
import { Link } from "react-router-dom";
import Avatar from "~/components/Avatar/Avatar";
import "./Message.scss";

function Message({ content, image, avatarUrl, username, loggedInUser, ...props }) {
  return (
    <div
      className={`message-wrapper ${loggedInUser ? "mine" : "partner"}`}
      {...props}
    >
      {loggedInUser || (
        <div className="message__avatar-wrapper">
          <Link to={`${username}`} className="message__avatar-box">
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
          <div className="message-image"><img src={image} alt="" className="rounded-xl" /></div>
        }
    </div>
  );
}

export default Message;
