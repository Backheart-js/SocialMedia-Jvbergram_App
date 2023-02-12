import React, { useState } from 'react'
import PropTypes from 'prop-types';

import '../Modal.scss'
import logo from '~/assets/logo';
import { deletePost } from '~/services/firebaseServices';
import Loader from '~/components/Loader';
import { RotatingLines } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

function DeletePost({ closeModal, postId, imagesUrl, redirectToProfile }) {
    const [loadingDisplay, setLoadingDisplay] = useState(false);
    const navigate = useNavigate();

    const handleDeletePost = async () => {
        setLoadingDisplay(true);
        try {
            await deletePost(postId, imagesUrl);
            
            closeModal();

            redirectToProfile && navigate(`${redirectToProfile}`);
        } catch (error) {
            setLoadingDisplay(false)
            alert("Có lỗi xảy ra, vui lòng thử lại!")
        }
    }

  return (
    <div className='modal__box-wrapper flex flex-col items-center min-w-[400px] min-h-[370px] pt-5 select-none'>
        <div className="delete__logo-wrapper mt-2 mb-4">
            <img src={logo.delete_option_1} alt="" className="" />
        </div>
        <p className="text-sm font-medium dark:text-[#FAFAFA]">
            Bạn có chắc muốn xóa bài viết này?
        </p>
        <ul className="mt-6 w-full">
            <li className="modal__delete-item text-[#ED4956]">
                <button className="py-3 w-full text-base font-bold" onClick={handleDeletePost}>Xóa</button>
            </li>
            <li className="modal__delete-item">
                <button className="py-3 w-full text-sm font-medium dark:text-[#FAFAFA]" onClick={closeModal}>Hủy</button>
            </li>
        </ul>
        <Loader
          type={RotatingLines}
          display={loadingDisplay}
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
    </div>
  )
}

DeletePost.propTypes = {
    closeModal: PropTypes.func,
    postId: PropTypes.string.isRequired,
    imagesUrl: PropTypes.array.isRequired
}

export default DeletePost