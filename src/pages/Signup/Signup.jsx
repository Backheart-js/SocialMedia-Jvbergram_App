import React, { useReducer, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  checkUserNameExist,
  updateFollower,
} from "~/services/firebaseServices";
import { firebase } from "~/lib/firebase";
import "./Signup.scss";
import { EMAIL_REGEX, PASSWORD_REGEX } from "~/constants/Regex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faCircleXmark,
  faEye,
} from "@fortawesome/free-regular-svg-icons";
import avatars from "~/assets/avatar";
import logo from "~/assets/logo";

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
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const cfPasswordRef = useRef(null);

  const [state, dispatch] = useReducer(reducer, initSignup);
  const [error, setError] = useState("");
  const [cfpassword, setCfpassword] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [cfpasswordValid, setCfpasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showCfPassword, setShowCfPassword] = useState(false);

  const navigate = useNavigate();
  const isDisable =
    state.email === "" ||
    state.fullname === "" ||
    state.username === "" ||
    state.password === "" ||
    !passwordValid ||
    !cfpasswordValid ||
    !(state.password === cfpassword);

  const signupWithEmailAndPassword = async function (info, email, password) {
    //Chức năng đăng nhập với Email/Pass
    try {
      const response = await firebase
        .auth()
        .createUserWithEmailAndPassword(email.toLowerCase(), password); //Tạo 1 auth mới lên firebase
      // if (response.user)
      const user = response.user; //Response trả về thông tin của auth vừa tạo
      await firebase
        .firestore()
        .collection("users")
        .add({
          //Đồng thời tạo 1 bản ghi dữ liệu mới vào users
          userId: user.uid,
          fullname: info.fullname,
          username: info.username.toLowerCase(),
          gender: 0, //0: male, 1: female, 2: Không tiết lộ
          birthday: "",
          story: "",
          avatarUrl: {
            default: avatars.default,
            history: [],
            current: "",
          },
          emailAdress: email.toLowerCase(),
          dateCreated: Date.now(),
          followers: [],
          following: ["SCx4yqNoa6OxMWcYTVYvkFsodNF2"],
          firstTime: true,
        });
      await firebase.firestore().collection("userChats").doc(user.uid).set({});
      await updateFollower(user.uid, "SCx4yqNoa6OxMWcYTVYvkFsodNF2", false);
      navigate("/notify"); //Move on đến trang thông báo xác thực email
    } catch (err) {
      setError("Email đã được sử dụng, vui lòng sử dụng email khác!");
    }
  };

  const handleShowPw = () => {
    setShowPassword((prev) => !prev);
    if (showPassword) {
      passwordInputRef.current.setAttribute("type", "password");
    } else {
      passwordInputRef.current.setAttribute("type", "text");
    }
  };
  const handleShowCfPw = () => {
    setShowCfPassword((prev) => !prev);
    if (showCfPassword) {
      cfPasswordRef.current.setAttribute("type", "password");
    } else {
      cfPasswordRef.current.setAttribute("type", "text");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const usernameIsExist = await checkUserNameExist(state.username);

    if (usernameIsExist) {
      setError("Tên người dùng đã được sử dụng");
    } else {
      signupWithEmailAndPassword(state, state.email, state.password);
    }
  };

  useEffect(() => {
    document.title = "Jvbergram - Signup";

    emailInputRef.current.addEventListener("blur", () => {
      if (EMAIL_REGEX.test(emailInputRef.current.value)) {
        setEmailValid(true);
      } else {
        setEmailValid(false);
      }
    });
    emailInputRef.current.addEventListener("focus", () => {
      setEmailValid(true);
    });

    passwordInputRef.current.addEventListener("blur", () => {
      if (PASSWORD_REGEX.test(passwordInputRef.current.value)) {
        setPasswordValid(true);
      } else {
        setPasswordValid(false);
      }
    });
  }, []);

  console.log(passwordValid)

  return (
    <div
      id="signup__wrapper"
      className="flex flex-col items-center w-[340px] rounded-lg bg-white px-10 pb-10 pt-4"
    >
      <div className="signup__logo h-[100px]">
        <img src={logo.logo_black} alt="" className="ml-10" />
      </div>
      <div className="other-options-signup">
        Đăng nhập bằng Facebook hoặc Google (Đang phát triển)
      </div>
      <div className="flex justify-between items-center w-full mt-3">
        <div className="login__line"></div>
        <div className="">Hoặc</div>
        <div className="login__line"></div>
      </div>
      <form onSubmit={handleSignup} className="signup__form">
        <div className="signup__input-wrapper">
          <input
            ref={emailInputRef}
            value={state.email}
            type="email"
            placeholder="Email"
            className="signup__input bg-gray-200"
            onChange={(e) => dispatch(setData(SET_EMAIL, e.target.value))}
          />
          {emailValid || (
            <p className="text-[13px] text-red-600 font-medium">Email không đúng định dạng</p>
          )}
        </div>
        <div className="signup__input-wrapper">
          <input
            value={state.fullname}
            type="text"
            placeholder="Tên đầy đủ"
            className="signup__input bg-gray-200"
            onChange={(e) => dispatch(setData(SET_FULLNAME, e.target.value))}
          />
        </div>
        <div className="signup__input-wrapper">
          <input
            value={state.username}
            type="text"
            placeholder="Tên người dùng"
            className="signup__input bg-gray-200"
            onChange={(e) => dispatch(setData(SET_USERNAME, e.target.value))}
          />
        </div>
        <div className="signup__input-wrapper">
          <div className="relative">
            <input
              ref={passwordInputRef}
              value={state.password}
              type="password"
              placeholder="Mật khẩu"
              className="signup__input bg-gray-200"
              onChange={(e) => dispatch(setData(SET_PASSWORD, e.target.value))}
            />
            <div className="absolute top-[50%] right-0 translate-y-[-50%] flex items-center w-[40px] h-[35px] justify-end pr-2">
              {state.password.length > 0 && (
                <div>
                  <FontAwesomeIcon
                    icon={faEye}
                    className={"showPass-btn"}
                    onClick={handleShowPw}
                  />
                </div>
              )}
              {state.password.length === 0 && (
                <FontAwesomeIcon
                  title="Độ dài mật khẩu từ 8 - 24 kí tự, chứa ít nhất 1 số và 1 chữ cái"
                  className="signup__input-icon signup__icon-info"
                  icon={faCircleQuestion}
                />
              )}
            </div>
          </div>
          {
            passwordValid ||
            <div className="">
              <span className="text-[13px] text-red-600 font-medium text-center mt-3">
              Độ dài mật khẩu từ 8 - 24 kí tự, chứa ít nhất 1 số và 1 chữ cái
              </span>
            </div>
          }
        </div>
        <div className="signup__input-wrapper">
          <div className="relative">
            <input
              ref={cfPasswordRef}
              value={cfpassword}
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="signup__input bg-gray-200"
              onChange={(e) => {
                setCfpassword(e.target.value);
              }}
              onBlur={() => setCfpasswordValid(cfpassword === state.password)}
            />
            <div className="absolute top-[50%] right-0 translate-y-[-50%] flex items-center w-[40px] h-[35px] justify-end pr-2">
              {cfpassword.length > 0 && (
                <FontAwesomeIcon
                  icon={faEye}
                  className={"showPass-btn"}
                  onClick={handleShowCfPw}
                />
              )}
            </div>
          </div>
          {
            cfpasswordValid ||
            <div className="">
              <p className="text-[13px] text-red-600 font-medium">Mật khẩu không khớp</p>
            </div>
          }
        </div>
        {error ? (
          <p className="text-sm text-red-600 font-semibold text-center mt-3">{error}</p>
        ) : (
          <></>
        )}
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
        <Link to="/login" className="ml-2 text-blue-600 font-semibold">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}

export default Signup;
