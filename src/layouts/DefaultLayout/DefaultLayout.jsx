import React, { useCallback, useState, useEffect, createContext } from "react";
import PropTypes from "prop-types";
import "./DefaultLayout.scss";
import Sidebar from "../components/Sidebar";
import Modal from "~/components/Modal";
import { useAuthListener } from "~/hooks";
import { getUserById } from "~/services/firebaseServices";

export const UserContext = createContext()

function DefaultLayout({ children }) {
  const [openModal, setopenModal] = useState(false)
  const { user } = useAuthListener();
  const [userInfo, setUserInfo] = useState({});


  const handleOpenModal = useCallback(() => {
    setopenModal(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[openModal])
  const handleCloseModal = useCallback(() => {
    setopenModal(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal])

  useEffect(() => {
    const getUser = async () => {
      const response = await getUserById(user.uid); //phương thức từ firebaseService
      const [userObj] = response;
      setUserInfo(userObj); //1 Object
    };

    user !== null && getUser();
  
  }, [user])

  return (
    <UserContext.Provider value={userInfo}>
      <div>
        <Sidebar openModalFunc={handleOpenModal} />
        <main id="content">
          <div className="pt-8 mx-auto w-[820px]">{children}</div>
        </main>
        {
          openModal && <Modal open={openModal} close={handleCloseModal} center animationDuration={200}/>
        }
      </div>
    </UserContext.Provider>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DefaultLayout;
