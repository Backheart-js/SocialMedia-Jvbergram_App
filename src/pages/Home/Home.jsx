import React, { useContext } from 'react'
import { UserContext } from '~/layouts/DefaultLayout/DefaultLayout'

import './Home.scss'

function Home() {
  const userInfo = useContext(UserContext);

  return (
    <div className='grid grid-cols-12 gap-5'>
      <div className="col-span-7">Home</div>
      <div className="col-span-5">
        
      </div>
    </div>
  )
}

export default Home