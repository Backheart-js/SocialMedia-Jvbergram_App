import React, { useContext, useState } from "react";
import { UserContext } from "~/context/user";
import {
  updateCurrentUserFolling,
  updateFollower,
} from "~/services/firebaseServices";
import Button from "../Button";
import UserLabel from "../UserLabel";
import "./Suggestion.scss";

function SuggestionProfile({ profile, min, ...props }) {
    const { userId:LoggedInUserId } = useContext(UserContext)
  const [isFollowing, setisFollowing] = useState(false);

  const handleFollowing = async (currentUserId, profileId) => {
    setisFollowing(true);
    await updateCurrentUserFolling(currentUserId, profileId, false);
    await updateFollower(currentUserId, profileId, false);
  };
  const handleUnFollowing = async (currentUserId, profileId) => {
    setisFollowing(false);
    await updateCurrentUserFolling(currentUserId, profileId, true);
    await updateFollower(currentUserId, profileId, true);
  };

  return (
    <div
      className={`suggestion__profile-wrapper${min ? "-min" : ""} flex justify-between items-center w-full`}
      {...props}
    >
      <UserLabel
        avatarUrl={profile.avatarUrl}
        username={profile.username}
        fullname={profile.fullname}
        size={"small"}
        key={profile.userId}
      />
      {isFollowing ? (
        min ?
        <Button
          className={"text-[13px] py-2 pl-2 hover:text-gray-600"}
          onClick={() => handleUnFollowing(LoggedInUserId, profile.userId)}
        >
          Đang theo dõi
        </Button> :
        <Button
        className={"text-[13px] py-2 px-3 bg-gray-100 hover:bg-gray-200"}
        onClick={() => handleUnFollowing(LoggedInUserId, profile.userId)}
      >
        Đang theo dõi
      </Button>
      ) : (
        min ? 
        <Button
          className={
            "text-[13px] py-2 pl-2 text-blue-primary hover:text-blue-bold"
          }
          onClick={() => handleFollowing(LoggedInUserId, profile.userId)}
        >
          Theo dõi
        </Button> :
        <Button
        className={
          "text-[13px] py-2 px-5"
        }
        btnPrimary
        onClick={() => handleFollowing(LoggedInUserId, profile.userId)}
      >
        Theo dõi
      </Button>
      )}
    </div>
  );
}

export default SuggestionProfile;
