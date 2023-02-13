import React from 'react';
import { Outlet } from 'react-router-dom';
import SettingSidebar from './SettingSidebar';
import './Setting.scss';

function Setting() {

  return (
    <div className='setting__wrapper xl:px-[160px] lg:px-[120px] md:px-[10px] pt-[30px] pb-[50px] lg:pt-[50px] lg:pb-[80px]'>
        <div className='setting__box dark:border-[#262626] dark:bg-black'>
            <SettingSidebar />
            <main className='settingContent__wrapper'>
                <Outlet />
            </main>
        </div>
    </div>
  )
}

export default Setting