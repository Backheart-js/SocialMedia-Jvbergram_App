import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import Dropdown from '~/components/Dropdown/Dropdown'

import './SearchSubSidebar.scss'

function SearchInput() {
    const [searchValue, setSearchValue] = useState('')
    const [showResult, setShowResult] = useState(true)
    const [resultValue, setResultValue] = useState([])

    const handleSearchValueChange = (e) => {
        setSearchValue(e.target.value);
    }

    const handleClickoutsideDropdown = () => {
        setShowResult(false);
    }

  return (
    <Dropdown
        visible={showResult && resultValue.length > 0}
        onClickOutside={handleClickoutsideDropdown}
        interactive={true}
        className={'result-width'}
        content={
            <ul className='py-4 search__result-list'>
                {resultValue.map((result,index) => (
                    <li className='search__result-item' key={index}>
                        {result}
                    </li>
                ))}
            </ul>
        }
    >
        <form className="search__input-wrapper">
            <input value={searchValue} placeholder="Tìm kiếm" type="text" className="search__input bg-gray-100" onClick={() => {setShowResult(true)}} onChange={handleSearchValueChange}/>
            <FontAwesomeIcon className='search__input-icon' icon={faSpinner} />
            <FontAwesomeIcon className='search__input-icon' icon={faCircleXmark} />
        </form>
    </Dropdown>
  )
}

export default SearchInput