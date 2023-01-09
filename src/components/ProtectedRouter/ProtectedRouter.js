import { Navigate } from "react-router-dom"

function ProtectedRouter({ user, children }) {
    //Chưa Login hoặc tài khoản chưa verify thì sẽ bị đá ra trang Login
    if (!user) {
        return <Navigate to="/login" replace />
    }
    else if (!user.emailVerified) {
        return <Navigate to="/notify" replace />
    }
    return children
}

export default ProtectedRouter