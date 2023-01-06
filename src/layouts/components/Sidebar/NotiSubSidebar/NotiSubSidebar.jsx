import React from 'react'
import './NotiSubSidebar.scss';

function NotiSubSidebar() {
  return (
    <div className='notiSubSidebar__wrapper'>
      <p className="notiSubSidebar__title">Thông báo</p>
      <div className="notiSubSidebar__body">
        <section className="notiSubSidebar__section">
          <p className="notiSubSidebar__subtitle">Tuần này</p>
          <ul className="notiSubSidebar__list">
            {/* List thông báo ở đây */}
          </ul>
        </section>
        <section className="notiSubSidebar__section">
          <p className="notiSubSidebar__subtitle">Tháng này</p>
          <ul className="notiSubSidebar__list">
            {/* List thông báo ở đây */}
          </ul>
        </section>
        <section className="notiSubSidebar__section">
          <p className="notiSubSidebar__subtitle">Trước đó</p>
          <ul className="notiSubSidebar__list">
            {/* List thông báo ở đây */}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default NotiSubSidebar