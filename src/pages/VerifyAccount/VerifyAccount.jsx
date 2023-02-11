import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "~/components/Button";
import { openNoti } from "~/redux/slice/notificationSlice";
import { verifyAccout } from "~/services/firebaseServices";

function VerifyAccount() {
  const dispatch = useDispatch()
  const [countdown, setCountdown] = useState(60);
  const [showButton, setShowButton] = useState(false);
  let intervalId = useRef(null);

  const handleResentBtn = () => {
    verifyAccout();
    setCountdown(60);
    setShowButton(false);
    dispatch(openNoti({content: `Đã gửi email xác nhận`}))

  }

  useEffect(() => {
    if (countdown > 0) {
      intervalId.current = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      clearInterval(intervalId.current);
      setShowButton(true);
    }

    return () => {
      clearInterval(intervalId.current);
    };
  }, [countdown]);

  useEffect(() => {
    verifyAccout();

  }, [])


  return (
    <div className="relative xl:w-[500px] md:w-[450px] w-[400px] bg-white rounded py-4 px-6 flex flex-col items-center">
      <div className="">
        <lottie-player
          src="https://assets6.lottiefiles.com/packages/lf20_PAtvr0.json"
          background="transparent"
          speed="1"
          style={{
            width: "300px",
            height: "300px",
          }}
          autoplay
          loop
        ></lottie-player>
      </div>
      <p className="font-semibold text-gray-800 text-center">
        Vui lòng xác mình tài khoản rồi đăng nhập lại
      </p>
      <p className="font-medium text-gray-700 text-sm my-2">
        Chưa nhận được email xác minh?
      </p>
      <div className="flex justify-center items-center text-gray-700 font-semibold w-[50px] h-[50px] rounded-full">
        <p className="text-lg">{countdown}</p>
      </div>
      <button disabled={!showButton} className={`px-4 py-2 underline font-semibold ${!showButton ? "text-gray-500 cursor-default" : ""}`} onClick={handleResentBtn}>
        Gửi lại
      </button>

      <a href="/login" className="mt-20">
        <Button className={"text-[13px] font-semibold"} btnWhite>
          Quay lại đăng nhập
        </Button>
      </a>

    </div>
  );
}

export default VerifyAccount;
