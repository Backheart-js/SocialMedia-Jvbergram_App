import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Modal from "~/components/Modal";
import { useAuthListener } from "~/hooks";
import { getUser } from "~/services/firebaseServices";
import { useSelector } from "react-redux";
import { UserContext } from "~/context/user";
import LoadingPage from "~/pages/LoadingPage/LoadingPage";
import { Outlet } from "react-router-dom";

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
        <main
          id="content"
          className="bg-main-bg dark:bg-dark-bg min-h-screen h-full md:ml-[80px] xl:ml-[245px]"
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
