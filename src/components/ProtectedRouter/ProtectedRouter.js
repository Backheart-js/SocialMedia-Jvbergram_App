import { Navigate } from "react-router-dom"

function ProtectedRouter({ isLogin, children }) {
    //Chưa Login thì sẽ bị đá ra trang Login
    if (!isLogin) {
        return <Navigate to="/login" replace />
    }
    return children
}

export default ProtectedRouter