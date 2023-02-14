import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "~/assets/logo";
import { FirebaseContext } from "~/context/firebase";
import loginImgs from "./images";
import "./Login.scss";

function Login() {
  const { firebase } = useContext(FirebaseContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const passwordRef = useRef(null)

  const isDisable = email === '' || password === '';

  const handleCheckbox = (e) => {
    if (e.target.checked) {
      passwordRef.current.setAttribute('type', 'text')
    }
    else {
      passwordRef.current.setAttribute('type', 'password')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigate('/');

    } catch (error) {
      setEmail('');
      setPassword('');
      setError('Email hoặc mật khẩu không đúng, vui lòng thử lại');
    }
  }

  useEffect(() => {
    document.title = "Jvbergram - Login";

  }, []);

  return (
    <div className="flex lg:w-[850px] lg:h-[600px] h-[560px] bg-white rounded-lg overflow-hidden">
      <div className="login__bg-wrapper hidden md:block">
        <img
          src={loginImgs.bg}
          alt="Login thumnail"
          className="login__bg-img rounded-lg"
        />
      </div>
      <div className="login__right">
        <div className="login__logo-wrapper flex justify-center items-center">
          <div className="w-[240px] ml-10 mt-5"><img src={logo.logo_black} alt="" className="" /></div>
        </div>
        <form onSubmit={handleLogin} className="login__form">
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
            ref={passwordRef}
            value={password}
            placeholder="password"
            type="password"
            className="login__input bg-gray-200"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div className="remember-password w-full flex mt-3">
            <input type="checkbox" id="remember-checkbox" onClick={handleCheckbox}/>
            <label className="ml-2 select-none" htmlFor="remember-checkbox">Hiện mật khẩu</label>
          </div>
          <button disabled={isDisable} className={`login__submit ${isDisable ? 'opacity-70' : 'hover:bg-[#3dbdd6] hover:cursor-pointer'}`}>Đăng nhập</button>
          <div className="flex justify-between items-center w-full mt-5">
            <div className="login__line"></div>
            <div className="">Hoặc</div>
            <div className="login__line"></div>
          </div>
          <div className="other-options-login flex justify-between mt-4 text-center font-medium">
            Đăng nhập bằng Facebook hoặc Google (Đang phát triển)
          </div>
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
        <div className="signup__option-wrapper flex justify-center text-sm">
          <span className="">Bạn chưa có tài khoản ư?</span>
          <a href="/signup" className="ml-2 text-blue-600 font-semibold">
            Đăng ký
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
