import React, { useEffect } from 'react'
import './Notification.scss'

function Notification({ content, isShowing, setShowing }) {
  useEffect(() => {
    if (isShowing) {
      const timeoutId = setTimeout(() => {
        setShowing(false);
      }, 4000);

      return () => clearTimeout(timeoutId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowing]);

  return (
    <div className={`notification ${isShowing ? "show" : ""}`}>
      <p className="text-white font-semibold text-[13px]">
        {content}
      </p>
    </div>
  );
}


export default Notification