import { useNavigate } from "react-router-dom"
import { useAuthListener } from "~/hooks"

function ProtectedRouter({ children }) {
    const { user } = useAuthListener()
    const navigate = useNavigate();

    if (user === null) {
        return navigate('/login');
    }
    return children
}

export default ProtectedRouter