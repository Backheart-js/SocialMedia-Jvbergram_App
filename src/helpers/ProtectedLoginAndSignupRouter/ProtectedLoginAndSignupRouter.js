import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function ProtectedLoginAndSignupRouter({ user, children }) {
    const navigate = useNavigate()
    const [isLoaded, setIsLoaded] = useState(false);
    const location = useLocation();

    var referrer = document.referrer;
    var previousRoute = referrer.substring(referrer.indexOf('/', referrer.indexOf('://') + 3));
    console.log(user);


    useEffect(() => {
        if (previousRoute === '/notify') {
            return;
        }
        else if(user && user.emailVerified) {
            navigate('/')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export default ProtectedLoginAndSignupRouter