import React from 'react'
import { verifyAccout } from '~/services/firebaseServices';

function VerifyAccount() {
  return (
    <div>
        <p className="">Vui lòng xác mình tài khoản rồi đăng nhập lại</p>
        <p className="">
            Chưa nhận được email xác minh? 
            <button className="underline" onClick={verifyAccout}>
                Gửi lại
            </button>
        </p>
        
        <a href="/login" className="">Đăng nhập</a>
    </div>

  )
}

export default VerifyAccount