import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import Suggestion from '~/components/Suggestion';
import Timeline from '~/components/Timeline';
import UserLabel from '~/components/UserLabel';
import { UserContext } from '~/layouts/DefaultLayout/DefaultLayout'

import './Home.scss'

function Home() {
  const userInfo = useContext(UserContext);
  // console.log(userInfo);
  return (
    <div className='grid grid-cols-12 gap-8'>
      <div className="col-span-7">
        <div className="mt-4">
          <Timeline />
        </div>
      </div>
      <div className="col-span-5">
        <div className="my-4"><UserLabel avatarUrl={userInfo?.avatarUrl} username={userInfo?.username} fullname={userInfo?.fullname} /></div>
        <div className="suggestion__wrapper">
          <div className="suggestion__title-wrapper flex justify-between">
            <span className='text-sm text-gray-500 font-medium'>
              Gợi ý cho bạn
            </span>
            <Link to={"/explore/people"} className="text-xs font-semibold hover:text-gray-500">
              Xem tất cả
            </Link>
          </div>
          <div className="suggestion__body-min mt-2">
            <Suggestion uid={userInfo.userId} following={userInfo.following}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home