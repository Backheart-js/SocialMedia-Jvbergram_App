import React from 'react'
import logo from '~/assets/logo'
import "./LoadingPage.scss"

function LoadingPage() {
  return (
    <div className='fixed inset-0 flex justify-center items-center bg-white'>
        <img src={logo.default} alt="" className="loading-img" />
    </div>
  )
}

export default LoadingPage