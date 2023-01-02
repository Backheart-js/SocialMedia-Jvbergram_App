import LoginLayout from "~/layouts/LoginLayout";
import Home from "~/pages/Home/Home";
import Login from "~/pages/Login/Login";
import NotFound from "~/pages/NotFound/NotFound";
import Signup from "~/pages/Signup/Signup";

export const publicRouter = [
    {path: '/login', component: Login, layout: LoginLayout},
    {path: '/signup', component: Signup, layout: LoginLayout},

    {path: '/', component: Home},
    {path: '*', component: NotFound},
]