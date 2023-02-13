import React from 'react';
import './NotFound.scss'

function NotFound() {
  return (
    <div className='w-full min-h-screen'>
      <div className="notFound-box w-[500px] h-[550px] flex justify-center mx-auto">
        <h3 className="text-3xl font-medium dark:text-[#FAFAFA]">
          Không tìm thấy trang
        </h3>
      </div>
    </div>
  )
}

export default NotFound