import React, { useContext, useState } from "react";
import logo from "~/assets/logo";
import { FirebaseContext } from "~/context/firebase";
import "~/pages/Login/Login.scss";
import "../Modal.scss"

function LoginModal({closeModal}) {
    const { firebase } = useContext(FirebaseContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const isDisable = email === '' || password === '';

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
          await firebase.auth().signInWithEmailAndPassword(email, password);
          closeModal();
        } catch (error) {
          setEmail('');
          setPassword('');
          setError('Email hoặc mật khẩu không đúng, vui lòng thử lại');
        }
      }

    return (
        <div className="modal__box-wrapper dark:bg-[#262626] py-4 w-[400px] max-h-[600px] min-h-[300px] mb-10">
            <div className="login__logo-wrapper flex justify-center items-center">
              <div className="w-[240px] ml-10">
                <img src={logo.logo_black} alt="" className="" />
              </div>
            </div>
        <form onSubmit={handleLogin} className="flex flex-col items-center pb-20 px-16">
          <input
            value={email}
            placeholder="useremail@email.com..."
            type="email"
            className="login__input bg-gray-200"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            value={password}
            placeholder="password"
            type="password"
            className="login__input bg-gray-200"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button disabled={isDisable} className={`login__submit ${isDisable ? 'opacity-70' : 'hover:bg-[#3dbdd6] hover:cursor-pointer'}`}>Đăng nhập</button>
          
          {error ? (
            <p className="text-red-600 text-base text-center mt-3">{error}</p>
          ) : (
            <></>
          )}
          <div className="forgot-password mt-3">
            <a href="/reset-password" className="text-sm text-blue-900">
              Quên mật khẩu?
            </a>
          </div>
        </form>
        <div className="signup__modal-wrapper dark:border-b-[#363636] flex justify-center text-sm">
          <span className="">Bạn chưa có tài khoản ư?</span>
          <a href="/signup" className="ml-2 text-blue-600 font-semibold">
            Đăng ký
          </a>
        </div>
        </div>
    )
}

export default LoginModal;
