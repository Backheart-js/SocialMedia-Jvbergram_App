import { faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import Dropdown from "~/components/Dropdown/Dropdown";
import UserLabel from "~/components/UserLabel";
import { useDebounce } from "~/hooks";
import { searchUserByFullname } from "~/services/firebaseServices";

import "./SearchSubSidebar.scss";

function SearchInput() {
  const [searchValue, setSearchValue] = useState("");
  const [showResult, setShowResult] = useState(true);
  const [resultValue, setResultValue] = useState([]);

  const debounce = useDebounce(searchValue, 700);

  const inputRef = useRef(null);

  useEffect(() => {
    const searchUser = async () => {
        const response = await searchUserByFullname(debounce)
        console.log(response);
        setResultValue(response);
    }

    debounce.length > 0 && searchUser()

    return () => {
      setResultValue([])
    }

  }, [debounce]);

  console.log(resultValue);

  return (
    <Dropdown
      visible={showResult && resultValue.length > 0 && searchValue.length > 0}
      onClickOutside={() => setShowResult(false)}
      interactive
      className={"result-width"}
      content={
        <ul className="py-4 search__result-list">
          {resultValue.map((result, index) => (
            <li className="search__result-item" key={index}>
              <UserLabel avatarUrl={result.avatarUrl} username={result.username} fullname={result.fullname} size={"small"}/>
            </li>
          ))}
        </ul>
      }
    >
      <form className="search__input-wrapper">
        <svg
          aria-label="Tìm kiếm"
          className="search__input-icon--left"
          color="#8e8e8e"
          fill="#8e8e8e"
          height={16}
          role="img"
          viewBox="0 0 24 24"
          width={16}
        >
          <path
            d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
          <line
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            x1="16.511"
            x2={22}
            y1="16.511"
            y2={22}
          />
        </svg>
        <input
          ref={inputRef}
          value={searchValue}
          placeholder="Tìm kiếm"
          type="text"
          className="search__input bg-gray-100"
          onFocus={() => {
            setShowResult(true);
          }}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {!!searchValue && (
          <button
            className="clear-searchInput-btn px-2 py-1"
            onClick={() => {
              setSearchValue("");
              inputRef.current.focus();
            }}
          >
            <FontAwesomeIcon className={` `} icon={faCircleXmark} />
          </button>
        )}
        <FontAwesomeIcon
          className={`search__input-icon--spinner hidden`}
          icon={faSpinner}
        />
      </form>
    </Dropdown>
  );
}

export default SearchInput;
