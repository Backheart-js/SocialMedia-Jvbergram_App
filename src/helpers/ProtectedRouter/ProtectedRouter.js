import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LoadingPage from '~/pages/LoadingPage/LoadingPage';

function ProtectedUserRouter({ user, children }) {
    console.log('Bắt đầu đi vào protectedUserRouter');
    const navigate = useNavigate()
    const [isLoaded, setIsLoaded] = useState(false);
    const location = useLocation();

    console.log("Đã load xong? " + isLoaded);

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
        console.log('rơi vào location');
        setIsLoaded(true);
    }, [location]);


    if (!isLoaded) {
        return <LoadingPage />
    } else {
        return <>{children}</>
    }
}

export default ProtectedUserRouter