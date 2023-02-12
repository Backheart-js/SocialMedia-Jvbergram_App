import Tippy from '@tippyjs/react/headless'
import React from 'react'
import SearchInput from './SearchInput'

function SearchSubSidebar() {
  return (
    <div className='flex flex-col'>
        <div className="search__func-wrapper">
            <p className="text-2xl font-medium mb-8 select-none dark:text-[#FAFAFA]">Tìm kiếm</p>
            <SearchInput />
        </div>
        <div className="search__history-wrapper">
            <div className="flex justify-between">
                <span className="font-medium text-base select-none dark:text-[#FAFAFA]">Gần đây</span>
                <button className="text-blue-primary text-sm font-medium hover:text-blue-bold">Xóa tất cả</button>
            </div>
        </div>
    </div>
  )
}

export default SearchSubSidebar