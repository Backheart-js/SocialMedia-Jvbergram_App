import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '~/assets/logo';
import "./Setting.scss";

function SettingSidebar() {
  return (
    <div className='settingSidebar__wrapper dark:border-[#262626]'>
        <div className="settingSidebar__header-wrapper dark:border-b-[#262626]">
            <div className="settingSidebar__logo-wrapper">
                <a href="/setting" className="sidebarSetting__logo">
                    <img src={logo.logo_black} alt="" className="w-[80%] dark:hidden" />
                  <img src={logo.logo_white} alt="" className="w-[80%] hidden dark:block" />
                </a>
            </div>
            <div className="settingSidebar__desc-wrapper">
                <p className="mb-2 text-sm text-gray-700 dark:text-gray-200 font-semibold">
                    Trung tâm cài đặt
                </p>
                <p className="text-gray-600 text-[13px] dark:text-gray-300 font-normal">
                    Quản lý phần cài đặt về tài khoản và trải nghiệm ứng dụng của bạn.
                </p>
            </div>
        </div>
        <div className="settingSidebar__option">
            <ul className="settingSidebar__option-list">
            <li className="settingSidebar__option-item">
                    <NavLink to={"/setting/original"} className="settingSidebar__option-link dark:text-[#FAFAFA] dark:hover:text-[#FAFAFA] dark:hover:bg-[#121212]">
                        Cài đặt chung
                    </NavLink>
                </li>
                <li className="settingSidebar__option-item">
                    <NavLink to={"/setting/account"} className="settingSidebar__option-link dark:text-[#FAFAFA] dark:hover:text-[#FAFAFA] dark:hover:bg-[#121212]">
                        Thông tin cá nhân
                    </NavLink>
                </li>
                <li className="settingSidebar__option-item">
                    <NavLink to={"/setting/password"} className="settingSidebar__option-link dark:text-[#FAFAFA] dark:hover:text-[#FAFAFA] dark:hover:bg-[#121212]">
                        Mật khẩu
                    </NavLink>
                </li>
                <li className="settingSidebar__option-item">
                    <NavLink to={"/setting/email"} className="settingSidebar__option-link dark:text-[#FAFAFA] dark:hover:text-[#FAFAFA] dark:hover:bg-[#121212]">
                        Email
                    </NavLink>
                </li>
            </ul>
        </div>
    </div>
  )
}

export default SettingSidebar