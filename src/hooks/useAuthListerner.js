import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { firebaseSelector, rememberPasswordSelector } from "~/redux/selector";

export default function useAuthListener() {
  const { firebase } = useSelector(firebaseSelector);
  const isRememberPassword = useSelector(rememberPasswordSelector);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      console.log(authUser);
      if (authUser && authUser.emailVerified) {
        isRememberPassword
          ? localStorage.setItem("authUser", JSON.stringify(authUser))
          : sessionStorage.setItem("authUser", JSON.stringify(authUser));
        setUser(authUser);
        setLoading(false);
      } else {
        localStorage.removeItem("authUser");
        sessionStorage.removeItem("authUser");
        setUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [firebase]);

  return { user, loading };
}
