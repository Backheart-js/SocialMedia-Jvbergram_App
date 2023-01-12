import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { firebaseSelector, rememberPasswordSelector } from "~/redux/selector";

export default function useAuthListener() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("authUser")) || JSON.parse(sessionStorage.getItem("authUser"))
  );
  const { firebase } = useSelector(firebaseSelector);
  const isRememberPassword = useSelector(rememberPasswordSelector)
    
  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged((authUser) => { 
      //onAuthStateChanged Xác thực người dùng đang đăng nhập hay không (yes: trả về thông tin User || no: trả về null)
      if (authUser && authUser.emailVerified) { //Auth đã được verify mới lọt vào
        if (isRememberPassword) {
          localStorage.setItem("authUser", JSON.stringify(authUser));
        }
        else {
          sessionStorage.setItem("authUser", JSON.stringify(authUser));
        }
        setUser(authUser);
      } else {
        localStorage.removeItem("authUser");
        sessionStorage.removeItem("authUser");
        setUser(null);
      }
    });

    return () => listener();
  }, [firebase]);

  return { user };  
}
