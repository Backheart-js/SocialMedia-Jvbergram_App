import React from 'react'
import Header from '../components/Header'
import './OnlyHeaderLayout.scss'

function OnlyHeaderLayout({ children }) {
  return (
    <div>
        <Header />
        <div className="">
            {children}
        </div>
    </div>
  )
}

export default OnlyHeaderLayout