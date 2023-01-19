import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./DefaultLayout.scss";
import Sidebar from "../components/Sidebar";
import Modal from "~/components/Modal";
import { useAuthListener } from "~/hooks";
import { getUser } from "~/services/firebaseServices";
import { useSelector } from "react-redux";
import { UserContext } from "~/context/user";
import { modalSelector } from "~/redux/selector";
import LoadingPage from "~/pages/LoadingPage/LoadingPage";


function DefaultLayout({ children }) {
  const { user } = useAuthListener();
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const { isOpen, ...payload } = useSelector(modalSelector)

  useEffect(() => {
    const getData = async () => {
      const response = await getUser({
        userId: user.uid
      }); //phương thức từ firebaseService
      const [userObj] = response;
      setCurrentUserInfo(userObj); //1 Object
    };
    
    user !== null && getData();
  }, [user]);
  console.log(currentUserInfo);

  return !currentUserInfo ? 
  (<LoadingPage />)
  :
  (
    <UserContext.Provider value={currentUserInfo}>
      <div>
        <Sidebar />
        <main id="content" className="bg-[#fafafa] min-h-screen h-full">
            {children}
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
