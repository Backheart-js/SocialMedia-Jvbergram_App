import React, { useContext } from 'react'
import Avatar from '~/components/Avatar'
import { UserContext } from '~/context/user'
import '../Direct.scss'

function DirectSidebar() {
    const loggedInUser = useContext(UserContext)

  return (
    <div className='drSidbar__wrapper'>
        <div className="drSidebar__header-wrapper">
            {loggedInUser.username}
        </div>
        <ul className="drSidebar__list">
            <li className="drSidebar__item">
                <Avatar avatarUrl={loggedInUser.avatarUrl} size={"medium"} />
                <div className="drSidebar__name-wrapper">
                    <p className="drSidebar__name-text">
                        {loggedInUser.fullname}
                    </p>
                    <p className="drSidebar__name-currentMessage">
                        Đoạn tin nhắn gần nhất
                    </p>
                </div>
            </li>
            <li className="drSidebar__item">
                <Avatar avatarUrl={loggedInUser.avatarUrl} size={"medium"} />
                <div className="drSidebar__name-wrapper">
                    <p className="drSidebar__name-text">
                        {loggedInUser.fullname}
                    </p>
                    <p className="drSidebar__name-currentMessage">
                        Đoạn tin nhắn gần nhất
                    </p>
                </div>
            </li>
            <li className="drSidebar__item">
                <Avatar avatarUrl={loggedInUser.avatarUrl} size={"medium"} />
                <div className="drSidebar__name-wrapper">
                    <p className="drSidebar__name-text">
                        {loggedInUser.fullname}
                    </p>
                    <p className="drSidebar__name-currentMessage">
                        Đoạn tin nhắn gần nhất
                    </p>
                </div>
            </li>
            <li className="drSidebar__item">
                <Avatar avatarUrl={loggedInUser.avatarUrl} size={"medium"} />
                <div className="drSidebar__name-wrapper">
                    <p className="drSidebar__name-text">
                        {loggedInUser.fullname}
                    </p>
                    <p className="drSidebar__name-currentMessage">
                        Đoạn tin nhắn gần nhất
                    </p>
                </div>
            </li>
            
        </ul>
    </div>
  )
}

export default DirectSidebar