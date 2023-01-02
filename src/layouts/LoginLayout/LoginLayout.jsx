import React from 'react';
import './LoginLayout.scss';

function LoginLayout({ children }) {
  return (
    <div className='app'>
        {
            children
        }
    </div>
  )
}

export default LoginLayout