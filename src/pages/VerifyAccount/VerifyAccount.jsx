import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { verifyAccout } from '~/services/firebaseServices';

function VerifyAccount() {
  useEffect(() => {
    verifyAccout();
  
  }, [])
  

  return (
    <div>
        <p className="">Vui lòng xác mình tài khoản rồi đăng nhập lại</p>
        <p className="">
            Chưa nhận được email xác minh? 
            <button className="underline" onClick={verifyAccout}>
                Gửi lại
            </button>
        </p>
        
        <Link to="/login" className="">Đăng nhập</Link>
    </div>

  )
}

export default VerifyAccount