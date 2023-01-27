import React from 'react'
import Header from '../components/Header'
import './OnlyHeaderLayout.scss'

function OnlyHeaderLayout({ children }) {
  return (
    <div>
        <Header />
        <main className="bg-main-bg min-h-screen h-full mt-[60px]">
            {children}
        </main>
    </div>
  )
}

export default OnlyHeaderLayout