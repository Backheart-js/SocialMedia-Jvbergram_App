import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Dropdown from "~/components/Dropdown/Dropdown";
import UserLabel from "~/components/UserLabel";
import { useDebounce } from "~/hooks";
import { searchUserByFullname } from "~/services/firebaseServices";
import "../Modal.scss";

function SearchMessage({ userSelected, setUserSelected }) {
    const chatRoomList = useSelector(state => state.chatRoomList);

    const [searchValue, setSearchValue] = useState('')
    const [showResult, setShowResult] = useState(true);
    const [searchResult, setSearchResult] = useState([])
    
    const debounce = useDebounce(searchValue, 700);

    const handleSelectUser = (user) => {
        const index = userSelected.findIndex((selected) => selected.userId === user.userId) //Check xem user đã có trong mảng chưa
        if (index >= 0) { //Có rồi thì xóa
          console.log('gỡ')
            setUserSelected(userSelected.filter((selected) => selected.userId !== user.userId));
        } else { //Chưa có thì thêm vào
        setUserSelected([...userSelected, user]);
        }
    }
    console.log(userSelected)
    console.log(chatRoomList)
    const removeUserSelected = (index) => {
        setUserSelected(userSelected.filter((selected, i) => i !== index));
    }

    useEffect(() => {
        const searchUser = async () => {
        const response = await searchUserByFullname(debounce)
        setSearchResult(response)
      }
      
      debounce.length > 0 && searchUser();
      
      return () => {
        setSearchResult([])
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounce])
    
    console.log()
  return (
    <>
      <div className="createMessageModal__search-wrapper px-4 my-2">
        <div className="pr-3">
          <span className="font-semibold text-sm">Tới:</span>
        </div>
        <Dropdown
            visible={showResult && searchResult.length > 0 && searchValue.length > 0}
            interactive
            placement="bottom-end"
            className="w-[370px]"
            content={
                <ul className="search__result-modal-list py-2">
                    {searchResult.map((user) => (
                        <li className="search__result-modal-item px-2 py-2" key={user.userId}>
                            <UserLabel avatarUrl={user.avatarUrl} fullname={user.fullname} username={user.username} size="small"/>
                            <input checked={userSelected.some(uselect => uselect.userId === user.userId)} className="modal-select-checkbox" type="checkbox" onChange={() => handleSelectUser({
                              userId: user.userId,
                              username: user.username
                            })}/>
                        </li>
                    ))}
                </ul>
            }
        >
          <div className="createMessageModal__search-input flex flex-wrap flex-grow">
            {
                userSelected.map((userSelected, index) => (
                    <div className="userSelected-label pl-3 pr-2 py-1 flex justify-center items-center" key={index}>
                        <span className="text-sm select-none text-blue-bold">{userSelected.username}</span>
                        <button className="px-2 flex justify-center items-center" onClick={() => removeUserSelected(index)}>
                            <FontAwesomeIcon className="text-blue-bold" icon={faXmark} />
                        </button>
                    </div>
                ))
            }
            <input value={searchValue} type="text" className="createMessage__search-input" placeholder="Tìm kiếm" onChange={e => setSearchValue(e.target.value)}/>
          </div>
        </Dropdown>
      </div>
      {
        chatRoomList.length > 0 &&
        <div className="createMessageModal__suggestion-wrapper px-4">
          <div className=""><p className="font-semibold text-sm">Gợi ý</p></div>
          <ul className="mt-2">
            {
              chatRoomList.map(chatRoom => (
                <li className="flex justify-between items-center py-2" key={chatRoom.chatroomId}>
                    <UserLabel avatarUrl={chatRoom.partnerInfo.avatarUrl} fullname={chatRoom.partnerInfo.fullname} username={chatRoom.partnerInfo.username} size="small"/>
                    <input checked={userSelected.some(user => user.userId === chatRoom.partnerInfo.userId)} className="modal-select-checkbox" type="checkbox" onChange={() => handleSelectUser({
                      userId: chatRoom.partnerInfo.userId,
                      username: chatRoom.partnerInfo.username
                    })}/>
                </li>
              ))
            }
          </ul>
        </div>
      }
    </>
  );
}

export default SearchMessage;
