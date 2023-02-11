import React from "react";
import moment from "moment";
import "../Modal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function ViewImage({ closeModal, imageLink, fullname, time }) {

  return (
    <div
      className="viewImage__bg inset-0"
      style={{ backgroundImage: `url(${imageLink})` }}
    >
      <div className="viewImage__overlay inset-0">
        <div className="flex justify-center items-center h-full">
          <img
            src={imageLink}
            alt=""
            className="max-w-[80vh] max-h-[90vh] h-auto"
          />
        </div>
        <div className="viewImage__Info-wrapper">
          <p className="text-gray-300 font-semibold text-sm mb-1">{fullname}</p>
          <p className="text-gray-300 font-semibold text-sm">Đã gửi: {moment(time).format("DD/MM/YYYY")}</p>
        </div>
        <button className="viewImage-close-btn absolute top-3 right-5 flex justify-center items-center rounded-full w-9 h-9 bg-gray-600" onClick={closeModal}>
          <FontAwesomeIcon className="text-gray-200 text-xl" icon={faXmark} />
        </button>
      </div>
    </div>
  );
}

export default ViewImage;
