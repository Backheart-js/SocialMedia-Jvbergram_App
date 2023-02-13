import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import SuggestionProfile from "~/components/Suggestion/SuggestionProfile";
import { UserContext } from "~/context/user";
import { getUser } from "~/services/firebaseServices";
import quickSortUserIdList from "~/utils/sortUserInFollowerModal";
import "../Modal.scss";

function FollowersModal({ followType, userIdList, fullname }) {
  const { username } = useParams();
  const loggedInUser = useContext(UserContext);

  const isLoggedInUser = username === loggedInUser.username;

  return (
    <div className="modal__box-wrapper dark:bg-[#262626] py-4 w-[400px] max-h-[450px] min-h-[300px]">
      <div className="">
        {followType === "followers" ? (
          <>
            <header className="createMessageModal__header-wrapper flex justify-center px-4 pb-2">
              <div className="">
                <span className="font-semibold">Người theo dõi</span>
              </div>
            </header>
            <main className="followModal__main py-4 px-4">
              {isLoggedInUser ? (
                <CurrentUserFollow
                  type={followType}
                  userIdList={userIdList}
                  loggedInUser={loggedInUser}
                />
              ) : (
                <OtherUserFollow
                  type={followType}
                  userIdList={userIdList}
                  loggedInUser={loggedInUser}
                />
              )}
            </main>
          </>
        ) : (
          <>
            <header className="createMessageModal__header-wrapper flex justify-center px-4 pb-2">
              <div className="">
                <span className="font-semibold">Đang theo dõi</span>
              </div>
            </header>
            <main className="followModal__main py-4 px-4">
              {isLoggedInUser ? (
                <CurrentUserFollow
                  type={followType}
                  userIdList={userIdList}
                  loggedInUser={loggedInUser}
                />
              ) : (
                <OtherUserFollow
                  type={followType}
                  userIdList={userIdList}
                  fullname={fullname}
                  loggedInUser={loggedInUser}
                />
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default FollowersModal;

function CurrentUserFollow({ type, userIdList }) {
  const [userInfoList, setuserInfoList] = useState(null);

  useEffect(() => {
    userIdList.length > 0
      ? (async function () {
          const userInfo = await getUser({
            userId: userIdList,
          });
          setuserInfoList(userInfo);
        })()
      : setuserInfoList([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !userInfoList ? (
    <div className="h-[210px] w-full flex justify-center items-center">
      <RotatingLines
        display
        strokeColor="gray"
        strokeWidth="5"
        animationDuration="0.75"
        width="30"
        visible
      />
    </div>
  ) : (
    <div>
      {type === "followers" ? (
        userInfoList.length > 0 ? (
          userInfoList.map((userInfo, index) => (
            <SuggestionProfile
              profile={userInfo}
              isDeleteFollower
              key={index}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-[240px] w-full">
            <div className="flex justify-center items-center rounded-full border-gray-800 border-[3px] w-[90px] h-[90px]">
              <FontAwesomeIcon
                icon={faPlus}
                className={"text-[30px] text-gray-800"}
              />
              <FontAwesomeIcon
                icon={faUser}
                className={"text-[36px] text-gray-800"}
              />
            </div>
            <p className="text-sm font-medium text-center text-gray-700 w-[80%] mt-4">
              Bạn sẽ thấy tất cả những người theo dõi mình ở đây
            </p>
          </div>
        )
      ) : userInfoList.length > 0 ? (
        userInfoList.map((userInfo, index) => (
          <SuggestionProfile profile={userInfo} followState key={index} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-[240px] w-full">
        
          <div className="flex flex-col items-center justify-center h-[240px] w-full">
            <div className="flex justify-center items-center rounded-full border-gray-800 border-[3px] w-[90px] h-[90px]">
              <FontAwesomeIcon
                icon={faPlus}
                className={"text-[30px] text-gray-800"}
              />
              <FontAwesomeIcon
                icon={faUser}
                className={"text-[36px] text-gray-800"}
              />
            </div>
            <p className="text-sm font-medium text-center text-gray-700 w-[80%] mt-4">
              Bạn chưa theo dõi ai
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function OtherUserFollow({ type, userIdList, loggedInUser, fullname }) {
  const [userInfoList, setuserInfoList] = useState(null);
  const isContainLoggedInUserId = userIdList.includes(loggedInUser.userId);
  const emptyFollow = userIdList.length === 0;

  useEffect(() => {
    if (!emptyFollow) {
      (async function () {
        const infoList = await getUser({
          userId: userIdList,
        });
        const newList = quickSortUserIdList(
          loggedInUser.following,
          loggedInUser.userId,
          infoList
        );
        let filterList = [];
        if (isContainLoggedInUserId) {
          filterList = newList.data.map((userData, index) => {
            if (index === 0) {
              return {
                isLoggedInUser: true,
                ...userData,
              };
            } else {
              return {
                isFollowing: index <= newList.countFollowing,
                ...userData,
              };
            }
          });
        } else {
          filterList = newList.data.map((userData, index) => {
            return {
              isFollowing: index < newList.countFollowing,
              ...userData,
            };
          });
        }
        setuserInfoList(filterList);
      })();
    } else {
      setuserInfoList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !userInfoList ? (
    <div className="h-[210px] w-full flex justify-center items-center">
      <RotatingLines
        display
        strokeColor="gray"
        strokeWidth="5"
        animationDuration="0.75"
        width="30"
        visible
      />
    </div>
  ) : (
    <div>
      {!emptyFollow ? (
        <div className="">
          {userInfoList.map((userInfo, index) => (
            <SuggestionProfile
              profile={userInfo}
              isLoggedInUser={userInfo.isLoggedInUser}
              followState={userInfo.isFollowing}
              key={index}
            />
          ))}
        </div>
      ) : type === "followers" ? (
        <div className="flex flex-col items-center justify-center h-[240px] w-full">
          <div className="flex justify-center items-center rounded-full border-gray-800 border-[3px] w-[90px] h-[90px]">
            <FontAwesomeIcon
              icon={faPlus}
              className={"text-[30px] text-gray-800"}
            />
            <FontAwesomeIcon
              icon={faUser}
              className={"text-[36px] text-gray-800"}
            />
          </div>
          <p className="text-sm font-medium text-center text-gray-700 w-[80%] mt-4">
            {fullname} hiện chưa có người theo dõi
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[240px] w-full">
          <div className="flex justify-center items-center rounded-full border-gray-800 border-[3px] w-[90px] h-[90px]">
            <FontAwesomeIcon
              icon={faPlus}
              className={"text-[30px] text-gray-800"}
            />
            <FontAwesomeIcon
              icon={faUser}
              className={"text-[36px] text-gray-800"}
            />
          </div>
          <p className="text-sm font-medium text-center text-gray-700 w-[80%] mt-4">
            {fullname} chưa theo dõi ai
          </p>
        </div>
      )}
    </div>
  );
}
