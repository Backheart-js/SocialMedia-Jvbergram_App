import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { FirebaseContext } from "~/context/firebase";
import { rememberPasswordSelector } from "~/redux/selector";

export default function useAuthListener() {
  const { firebase } = useContext(FirebaseContext);
  const isRememberPassword = useSelector(rememberPasswordSelector);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log("auth changed");
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser && authUser.emailVerified) {
        localStorage.setItem("authUser", JSON.stringify(authUser))
        setUser(authUser);
        setLoading(false);
      } else {
        localStorage.removeItem("authUser");
        setUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase]);

  return { user, loading };
}
