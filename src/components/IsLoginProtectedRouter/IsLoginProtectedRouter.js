import { Navigate } from "react-router-dom"

function IsLoginProtectedRouter({isLogin, children}) {
    //Đã login: Nếu truy cập Login/Signup Page qua URL thì sẽ điều hướng về trang chủ
    if (isLogin) {
        return <Navigate to="/" replace />
    }
    return children
}

export default IsLoginProtectedRouter