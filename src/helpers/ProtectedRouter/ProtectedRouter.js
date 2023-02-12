import { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '~/context/user';
import LoadingPage from '~/pages/LoadingPage/LoadingPage';

function ProtectedUserRouter({ user, children }) {
    const navigate = useNavigate()
    const loggedInUser = useContext(UserContext);
    const [isLoaded, setIsLoaded] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if(!user) {
            navigate('/login')
        }
        else if (user.emailVerified === false) {
            navigate('/notify')
        }

        if (loggedInUser?.firstTime) {
            navigate('/new-member')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        setIsLoaded(true);
    }, [location]);


    if (isLoaded && user) { //Có user và đã chạy effect xong thì mới cho vào, không thì đợi load
        return <>{children}</>
    } else {
        return <LoadingPage />
    }
}

export default ProtectedUserRouter