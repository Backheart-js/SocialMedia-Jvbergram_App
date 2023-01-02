import React from 'react';
import './LoginLayout.scss';

function LoginLayout({ children }) {
  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
        {
            children
        }
    </div>
  )
}

export default LoginLayout