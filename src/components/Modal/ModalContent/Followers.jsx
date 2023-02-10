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

function FollowersModal({ followType, userIdList }) {
  const { username } = useParams();
  const loggedInUser = useContext(UserContext);

  const isLoggedInUser = username === loggedInUser.username;

  function sortList(loggedInUserFollowing, followList) {
    console.log(followList);
    console.log(loggedInUserFollowing);
    /*
      Hàm này được sử dụng khi xem List follow của user khác. Check xem userId trong list đã 
      có trong list following của mình chưa, nếu có rồi thì đẩy lên đầu mảng
    */
    let result = [];
    let countDuplicates = 0;
    let map = {};

    for (let i = 0; i < followList.length; i++) {
      if (map[followList[i]]) {
        map[followList[i]]++;
      } else {
        map[followList[i]] = 1;
      }
    }

    for (let i = 0; i < followList.length; i++) {
      if (loggedInUserFollowing.includes(followList[i])) {
        if (followList[i] === loggedInUser.userId) {
          continue;
        }
        result.unshift(followList[i]);
        countDuplicates += map[followList[i]] - 1;
      }
    }

    for (let i = 0; i < followList.length; i++) {
      if (!loggedInUserFollowing.includes(followList[i])) {
        result.push(followList[i]);
        countDuplicates += map[followList[i]] - 1;
      }
    }

    return [result, countDuplicates];
  }

  useEffect(() => {
    let processList;

    if (!isLoggedInUser) {
      processList = sortList(loggedInUser.following, userIdList);
    }

    // console.log(countFollowingUser);
    // userIdList.length > 0
    //   ? (async function () {
    //       const userInfo = await getUser({
    //         userId: userIdList,
    //       });
    //       setuserInfoList(userInfo);
    //     })()
    //   : setuserInfoList([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="modal__box-wrapper py-4 w-[400px] max-h-[450px] min-h-[300px]">
      <div className="">
        {followType === "followers" ? (
          <>
            <header className="createMessageModal__header-wrapper flex justify-center px-4 pb-2">
              <div className="">
                <span className="font-semibold">Người theo dõi</span>
              </div>
            </header>
            <main className="followModal__main py-4 px-4">
              {/* {userInfoList ? (
                isLoggedInUser ? (
                  userIdList.length ? (
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
                ) : userIdList.length ? (
                  userInfoList.map((userInfo, index) => (
                    <SuggestionProfile
                      profile={userInfo}
                      followState
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
                      Bạn sẽ thấy tất cả những người theo dõi {username} ở đây
                    </p>
                  </div>
                )
              ) : (
                <div
                  className={
                    "absolute flex justify-center items-center inset-0"
                  }
                >
                  <RotatingLines
                    display
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="30"
                    visible
                  ></RotatingLines>
                </div>
              )} */}
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
              {/* {userInfoList ? (
                isLoggedInUser ? (
                  userIdList.length ? (
                    userInfoList.map((userInfo, index) => (
                      <SuggestionProfile
                        profile={userInfo}
                        followState
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
                        Bạn chưa theo dõi ai
                      </p>
                    </div>
                  )
                ) : userIdList.length ? (
                  userInfoList.map((userInfo, index) => (
                    <SuggestionProfile
                      profile={userInfo}
                      followState
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
                      Bạn chưa theo dõi ai
                    </p>
                  </div>
                )
              ) : (
                <div
                  className={
                    "absolute flex justify-center items-center inset-0"
                  }
                >
                  <RotatingLines
                    display
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="30"
                    visible
                  ></RotatingLines>
                </div>
              )} */}
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
        )}
      </div>
    </div>
  );
}

export default FollowersModal;

function CurrentUserFollow({ type, userIdList, loggedInUser }) {
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
    <></>
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
      )}
    </div>
  );
}

function OtherUserFollow({ type, userIdList, loggedInUser }) {
  const [userInfoList, setuserInfoList] = useState(null);
  const isContainLoggedInUserId = userIdList.includes(loggedInUser.userId)

  const newList = quickSortUserIdList(loggedInUser.following, loggedInUser.userId, userIdList)
  // console.log(newList)
  
  useEffect(() => {

  }, []);

  return !userInfoList ? 
  <></>
  :
  <div>

  </div>
  ;
}
