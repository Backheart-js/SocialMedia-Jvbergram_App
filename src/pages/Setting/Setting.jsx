import React from 'react';
import { Outlet } from 'react-router-dom';
import SettingSidebar from './SettingSidebar';
import './Setting.scss';

function Setting() {

  return (
    <div className='setting__wrapper'>
        <div className='setting__box dark:bg-black'>
            <SettingSidebar />
            <main className='settingContent__wrapper'>
                <Outlet />
            </main>
        </div>
    </div>
  )
}

export default Setting