import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { firebaseSelector, rememberPasswordSelector } from "~/redux/selector";

export default function useAuthListener() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { firebase } = useSelector(firebaseSelector);
  const isRememberPassword = useSelector(rememberPasswordSelector);

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser && authUser.emailVerified) {
        isRememberPassword
          ? localStorage.setItem("authUser", JSON.stringify(authUser))
          : sessionStorage.setItem("authUser", JSON.stringify(authUser));
        setUser(authUser);
      } else {
        localStorage.removeItem("authUser");
        sessionStorage.removeItem("authUser");
        setUser(null);
      }
      setLoading(false);
    });

    return () => listener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if (!loading) {
  //   return { loading };
  // }

  return { user };
}
