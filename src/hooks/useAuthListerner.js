import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { FirebaseContext } from "~/context/firebase";
import { rememberPasswordSelector } from "~/redux/selector";

// const isRememberPassword = useSelector(rememberPasswordSelector);
export default function useAuthListener() {
  const { firebase } = useContext(FirebaseContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      console.log(authUser);
      if (authUser) {
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
