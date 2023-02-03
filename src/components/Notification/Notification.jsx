import React from 'react'
import './Notification.scss'

function Notification({ content, isShowing }) {
  return (
    <div className={`notification ${isShowing ? "show" : ""}`}>
        <p className="text-white font-semibold text-[13px]">
            { content }
        </p>
    </div>
  )
}

export default Notification