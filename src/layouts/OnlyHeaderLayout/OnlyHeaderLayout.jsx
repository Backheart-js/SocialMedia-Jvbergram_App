import React from 'react'
import { useSelector } from 'react-redux';
import Modal from '~/components/Modal';
import Header from '../components/Header'
import './OnlyHeaderLayout.scss'

function OnlyHeaderLayout({ children }) {
  const { isOpen, ...payload } = useSelector((state) => state.modal);

  return (
    <div>
        <Header />
        <main className="bg-main-bg min-h-screen h-full mt-[60px]">
            {children}
        </main>
        {isOpen && <Modal payload={payload} />}

    </div>
  )
}

export default OnlyHeaderLayout