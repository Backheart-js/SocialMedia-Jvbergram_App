import Tippy from '@tippyjs/react/headless'
import React from 'react'
import SearchInput from './SearchInput'

function SearchSubSidebar() {
  return (
    <div className='flex flex-col'>
        <div className="search__func-wrapper">
            <p className="text-2xl font-medium mb-8 select-none">Tìm kiếm</p>
            <SearchInput />
        </div>
        <div className="search__history-wrapper">
            <div className="flex justify-between">
                <span className="font-medium text-base select-none">Gần đây</span>
                <button className="text-blue-600 text-sm font-medium hover:text-gray-800">Xóa tất cả</button>
            </div>
        </div>
    </div>
  )
}

export default SearchSubSidebar