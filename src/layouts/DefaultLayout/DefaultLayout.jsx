import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./DefaultLayout.scss";
import Sidebar from "../components/Sidebar";
import Modal from "~/components/Modal";
import { useAuthListener } from "~/hooks";
import { getUserById } from "~/services/firebaseServices";
import { useDispatch } from "react-redux";
import modalSlice from "~/redux/slice/modalSlide";
import { UserContext } from "~/context/user";


function DefaultLayout({ children }) {
  const [openModal, setOpenModal] = useState(false);
  const { user } = useAuthListener();
  const [userInfo, setUserInfo] = useState({});
  const dispatch = useDispatch()

  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);
  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

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
        <Sidebar openModalFunc={handleOpenModal} />
        <main id="content">
          <div className="pt-8 mx-auto w-[820px]">{children}</div>
        </main>
        {openModal && <Modal close={handleCloseModal} />}
      </div>
    </UserContext.Provider>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DefaultLayout;
