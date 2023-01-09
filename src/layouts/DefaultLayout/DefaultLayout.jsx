import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import "./DefaultLayout.scss";
import Sidebar from "../components/Sidebar";
import Modal from "~/components/Modal";

function DefaultLayout({ children }) {
  const [openModal, setopenModal] = useState(false)

  const handleOpenModal = useCallback(() => {
    setopenModal(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[openModal])
  const handleCloseModal = useCallback(() => {
    setopenModal(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal])

  return (
    <div>
      <Sidebar openModalFunc={handleOpenModal} />
      <main id="content">
        <div className="pt-8 mx-auto w-[820px]">{children}</div>
      </main>
      {
        openModal && <Modal open={openModal} close={handleCloseModal} center animationDuration={200}/>
      }
    </div>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DefaultLayout;
