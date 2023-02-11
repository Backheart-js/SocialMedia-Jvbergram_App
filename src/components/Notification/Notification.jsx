import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { closeNoti } from '~/redux/slice/notificationSlice';
import './Notification.scss'

function Notification() {
  const notiState = useSelector(state => state.notification)
  const dispatch = useDispatch()
  useEffect(() => {
    if (notiState.isOpen) {
      const timeoutId = setTimeout(() => {
        dispatch(closeNoti())
      }, 4000);

      return () => clearTimeout(timeoutId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notiState.isOpen]);

  return (
    <div className={`notification ${notiState.isOpen ? "show" : ""}`}>
      <p className="text-white font-semibold text-[13px]">
        {notiState.content}
      </p>
    </div>
  );
}


export default Notification