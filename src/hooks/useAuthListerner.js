import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { firebaseSelector } from "~/redux/selector";

export default function useAuthListener() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("authUser"))
  );
  const { firebase } = useSelector(firebaseSelector);

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged((authUser) => { 
      //onAuthStateChanged Xác thực người dùng đang đăng nhập hay không (yes: trả về thông tin User || no: trả về null)
      console.log(authUser);
      if (authUser) {
        localStorage.setItem("authUser", JSON.stringify(authUser));
        setUser(authUser);
      } else {
        localStorage.removeItem("authUser");
        setUser(null);
      }
    });

    return () => listener();
  }, [firebase]);

  return { user };
}
