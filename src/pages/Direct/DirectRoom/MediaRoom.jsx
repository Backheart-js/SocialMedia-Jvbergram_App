import { faImages } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { VIEWIMAGE } from '~/constants/modalTypes';
import modalSlice from '~/redux/slice/modalSlide';
import './MediaRoom.scss';

function MediaRoom({conversation}) {
    const [chatImage, setChatImage] = useState([])
    const dispatch = useDispatch();
  const handleOpenViewImage = (imageLink, fullname, time) => {
    dispatch(
      modalSlice.actions.openModal({
        type: VIEWIMAGE,
        imageLink,
        fullname,
        time,
      })
    );
  };

    useEffect(() => {
      conversation.forEach((chat) => {
        if (chat.image) {
            setChatImage(prev => [...prev, chat])
        }
      })
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    

  return chatImage.length === 0 ?
    <div className="flex flex-col items-center justify-center mx-10 h-full">
        <div className="">
            <FontAwesomeIcon icon={faImages} className={"text-6xl text-gray-700 dark:text-[#FAFAFA]"} />
        </div>
        <div className='mt-4'><p className=' font-semibold text-gray-600 dark:text-[#FAFAFA]'>Chưa có ảnh nào trong đoạn hội thoại</p></div>
    </div>
  :
  <div className='grid grid-cols-4 gap-1 my-2 overflow-auto'>
    {
        chatImage.map((imageInfo) => (
            <button className="mediaRoom__btn" key={imageInfo.messageId} onClick={() => handleOpenViewImage(imageInfo.image, "", imageInfo.date)}>
                <div className="mediaRoom__img" 
                    style={{ backgroundImage: `url(${imageInfo.image})`}}
                ></div>
            </button>
        ))
    }
  </div>

}

export default MediaRoom