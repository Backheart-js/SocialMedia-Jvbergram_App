import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Modal from "~/components/Modal";
import { useAuthListener } from "~/hooks";
import { getUser } from "~/services/firebaseServices";
import { useSelector } from "react-redux";
import { UserContext } from "~/context/user";
import LoadingPage from "~/pages/LoadingPage/LoadingPage";
import { Outlet } from "react-router-dom";
import logo from "~/assets/logo";
import SearchInput from "../components/Sidebar/SearchSubSidebar/SearchInput";

function DefaultLayout() {
  const { user } = useAuthListener();
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const { isOpen, ...payload } = useSelector((state) => state.modal);
  const { darkMode } = useSelector(state => state.theme)

  useEffect(() => { 
    const getData = async () => {
      const response = await getUser({
        userId: [user.uid],
      }); //phương thức từ firebaseService
      const [userObj] = response;
      setUserLoggedIn(userObj); //1 Object
    };

    user !== null && getData();
  }, [user]);


  return !userLoggedIn ? (
    <LoadingPage />
  ) : (
    <UserContext.Provider value={userLoggedIn}>
      {
        !userLoggedIn.firstTime ? (<div className={darkMode ? "dark" : ""}>
        <Sidebar />
        <aside className="flex items-center justify-between pr-10 pl-5 fixed top-0 inset-x-0 md:hidden h-[60px] bg-white md:bg-black z-10 border-b-[#dadde1] border-b-[1px] border-solid">
          <a href="/" className="">
            <img src={logo.logo_white} alt="" className="hidden dark:block w-[180px]" />
            <img src={logo.logo_black} alt="" className="dark:hidden w-[180px]" />
          </a>
          <div className="">
            <SearchInput />
          </div>
        </aside>
        <main
          id="content"
          className="bg-main-bg dark:bg-dark-bg min-h-screen h-full md:ml-[80px] xl:ml-[245px] mt-[60px] md:mt-[unset]"
        >
          <Outlet />
        </main>
        {isOpen && <Modal payload={payload} />}
      </div>) : (
        <Outlet />
      )
      }
    </UserContext.Provider>
  );
}

export default DefaultLayout;
