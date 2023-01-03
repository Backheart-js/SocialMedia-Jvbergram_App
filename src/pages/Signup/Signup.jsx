import React, { useReducer, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  checkUserNameExist,
} from "~/services/firebaseServices";
import { firebase } from "~/lib/firebase";
import "./Signup.scss";

const initSignup = {
  email: "",
  fullname: "",
  username: "",
  password: "",
};

const SET_EMAIL = "email";
const SET_FULLNAME = "fullname";
const SET_USERNAME = "username";
const SET_PASSWORD = "password";

const setData = (type, payload) => {
  return {
    type,
    payload,
  };
};

const reducer = (state, action) => {
  return {
    ...state,
    [action.type]: action.payload,
  };
};

function Signup() {
  const [state, dispatch] = useReducer(reducer, initSignup);
  const [error, setError] = useState('')
  const navigate = useNavigate();
  const isDisable =
    state.email === "" ||
    state.fullname === "" ||
    state.username === "" ||
    state.password === "";

  const signupWithEmailAndPassword = async function (info, email, password) {
    //Chức năng đăng nhập với Email/Pass
    try {
      const res = await firebase
        .auth()
        .createUserWithEmailAndPassword(email.toLowerCase(), password); //Tạo 1 auth mới lên firebase
      const user = res.user; //Response trả về thông tin của auth vừa tạo
      await firebase.firestore().collection("users").add({
        //Đồng thời tạo 1 bản ghi dữ liệu mới vào users
        userId: user.uid,
        fullname: info.fullname,
        username: info.username,
        email: email.toLowerCase(),
        dateCreated: Date.now(),
        followers: [],
        following: [],
      });
      navigate("/");
    } catch (err) {
      setError('Email đã được sử dụng, vui lòng sử dụng email khác!')
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const usernameIsExist = await checkUserNameExist(state.username);

    if (usernameIsExist) {
      setError('Tên người dùng đã được sử dụng');
    } else {
      signupWithEmailAndPassword(state, state.email, state.password);
    }
  };

  useEffect(() => {
    document.title = "Jvbergram - Signup";
  }, []);

  return (
    <div
      id="signup__wrapper"
      className="flex flex-col items-center sm:w-[340px] rounded-lg bg-white px-10 pb-10 pt-4"
    >
      <div className="signup__logo h-[100px]">Logo</div>
      <div className="other-options-signup">Đăng nhập bằng FB hoặc Google</div>
      <div className="flex justify-between items-center w-full mt-3">
        <div className="login__line"></div>
        <div className="">Hoặc</div>
        <div className="login__line"></div>
      </div>
      <form onSubmit={handleSignup} className="signup__form">
        <input
          value={state.email}
          type="email"
          placeholder="Email"
          className="login__input bg-gray-200"
          onChange={(e) => dispatch(setData(SET_EMAIL, e.target.value))}
        />
        <input
          value={state.fullname}
          type="text"
          placeholder="Tên đầy đủ"
          className="login__input bg-gray-200"
          onChange={(e) => dispatch(setData(SET_FULLNAME, e.target.value))}
        />
        <input
          value={state.username}
          type="text"
          placeholder="Tên người dùng"
          className="login__input bg-gray-200"
          onChange={(e) => dispatch(setData(SET_USERNAME, e.target.value))}
        />
        <input
          value={state.password}
          type="password"
          placeholder="Mật khẩu"
          className="login__input bg-gray-200"
          onChange={(e) => dispatch(setData(SET_PASSWORD, e.target.value))}
        />
        {
          error ? 
          <p className="text-sm text-red-600 text-center mt-3">
            {error}
          </p> :
          <></>
        }
        <button
          disabled={isDisable}
          className={`login__submit ${
            isDisable ? "opacity-70" : "hover:bg-[#3dbdd6] hover:cursor-pointer"
          }`}
        >
          Đăng ký
        </button>
      </form>
      <div className="login__options-wrapper text-sm">
        <span className="">Đã có tài khoản?</span>
        <NavLink to="/login" className="ml-2 text-blue-600 font-semibold">
          Đăng nhập
        </NavLink>
      </div>
    </div>
  );
}

export default Signup;
