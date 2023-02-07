import React from "react";
import { Link } from "react-router-dom";
import Avatar from "~/components/Avatar/Avatar";
import "./Message.scss";

function Message({ content, avatarUrl, username, loggedInUser, ...props }) {
  return (
    <div
      className={`message-wrapper ${loggedInUser ? "mine" : "partner"}`}
      {...props}
    >
      {loggedInUser || (
        <div className="message__avatar-wrapper">
          <Link to={`/profile/${username}`} className="message__avatar-box">
            <Avatar avatarUrl={avatarUrl} size="sx" />
          </Link>
        </div>
      )}
      <div className="message-bubble">
        <p className="message-content">{content}</p>
      </div>
    </div>
  );
}

export default Message;
