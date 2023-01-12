import { Navigate } from "react-router-dom"

function IsLoginProtectedRouter({user, children}) {  //Cái này sai, cần xem lại sau
    //Đã login: Nếu truy cập Login/Signup Page qua URL thì sẽ điều hướng về trang chủ

    if (!!user) {
        return <Navigate to="/" replace />
    }
    return children
}

export default IsLoginProtectedRouter