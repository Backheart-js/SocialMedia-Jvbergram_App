import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

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

export default ProtectedUserRouter