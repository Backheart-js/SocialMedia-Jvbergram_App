import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '~/components/Button'
import { EMAIL_REGEX } from '~/constants/Regex'
import { FirebaseContext } from '~/context/firebase'
import './ResetPassword.scss'

function ResetPassword() {
  const { firebase } = useContext(FirebaseContext)
  const [sentVerifyEmail, setSentVerifyEmail] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [emailValue, setEmailValue] = useState('')

  const isDisabled = !EMAIL_REGEX.test(emailValue);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    try {
      await firebase.auth().sendPasswordResetEmail(emailValue);
      setSentVerifyEmail(true)
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi, vui lòng thử lại!")
    }    
  
  }

  useEffect(() => {
    document.title = 'Đặt lại mật khẩu'
  }, [])
  

  return (
    <div className='flex flex-col items-center sm:w-[340px] rounded-lg bg-white px-8 pb-4 pt-4'>
      <div className="forgotPassword__icon-wrapper">
        <FontAwesomeIcon icon={faLock} className="forgotPassword__icon"/>
      </div>
      {
        sentVerifyEmail ?
          <>
            <p className="forgotPassword__title">Đã gửi email xác thực</p>
        <div className="forgotPassword__subtitle">
          Vui lòng kiểm tra email xác nhận và đặt lại mật khẩu mới. <br/> Nếu chưa nhận được vui lòng gửi lại!
        </div>
        <button className="forgotPassword__resent-btn">
          Gửi lại
        </button>
          </>
        :
        
          <>
            <p className="forgotPassword__title">Gặp sự cố khi đăng nhập?</p>
        <div className="forgotPassword__subtitle">
          Nhập Email của bạn và chúng tôi sẽ gửi một email xác thực
        </div>
        <form className='forgotPassword__form' onSubmit={handleSubmitForm}>
          <input value={emailValue} type="email" className="forgotPassword__input dark:border-[#262626]" placeholder='Email của người dùng' onChange={(e) => setEmailValue(e.target.value)}/>
          <Button disabled={isDisabled} className={`forgotPassword__btn ${isDisabled ? 'disabled' : ''}`} btnPrimary>
            Gửi email xác thực
          </Button>
          {
            errorMessage && 
            <span className='forgotPassword-error'>
              {errorMessage}
            </span>
          }
        </form>
          </>
        
      }
      <div className="forgotPassword__bottom-wrapper">
        <Link to={"/login"}>Quay lại đăng nhập</Link>
      </div>
    </div>
  )
}

export default ResetPassword