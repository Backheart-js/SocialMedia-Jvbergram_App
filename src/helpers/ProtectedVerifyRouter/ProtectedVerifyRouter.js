import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function ProtectedVerifyRouter({ user, children }) {
    const navigate = useNavigate()
    const [isLoaded, setIsLoaded] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if(user && user.emailVerified) {
            navigate('/')
        }
    }, [user]);

    useEffect(() => {
        setIsLoaded(true);
    }, [location]);

    if (!isLoaded) {
        return <div>Loading...</div>
    } else {
        return <>{children}</>
    }
}

export default ProtectedVerifyRouter