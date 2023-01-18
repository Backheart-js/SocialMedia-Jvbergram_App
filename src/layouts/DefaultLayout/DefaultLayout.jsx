import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./DefaultLayout.scss";
import Sidebar from "../components/Sidebar";
import Modal from "~/components/Modal";
import { useAuthListener } from "~/hooks";
import { getUserById } from "~/services/firebaseServices";
import { useSelector } from "react-redux";
import { UserContext } from "~/context/user";
import { modalSelector } from "~/redux/selector";


function DefaultLayout({ children }) {
  const { user } = useAuthListener();
  const [userInfo, setUserInfo] = useState({});
  const { isOpen, ...payload } = useSelector(modalSelector)

  useEffect(() => {
    const getUser = async () => {
      const response = await getUserById(user.uid); //phương thức từ firebaseService
      const [userObj] = response;
      setUserInfo(userObj); //1 Object
    };

    user !== null && getUser();
  }, [user]);
  
  return (
    <UserContext.Provider value={userInfo}>
      <div>
        <Sidebar />
        <main id="content">
          <div className="pt-8 mx-auto w-[820px]">{children}</div>
        </main>
        {isOpen && <Modal payload={payload} />}
      </div>
    </UserContext.Provider>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DefaultLayout;
