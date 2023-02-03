import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LoadingPage from '~/pages/LoadingPage/LoadingPage';

function ProtectedUserRouter({ user, children }) {
    const navigate = useNavigate()
    const [isLoaded, setIsLoaded] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if(!user) {
            navigate('/login')
        }
        else if (user.emailVerified === false) {
            navigate('/notify')
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