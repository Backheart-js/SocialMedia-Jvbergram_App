import { lazy } from "react";
import ProtectedLoginAndSignupRouter from "~/helpers/ProtectedLoginAndSignupRouter";
import ProtectedUserRouter from "~/helpers/ProtectedRouter";
import ProtectedVerifyRouter from "~/helpers/ProtectedVerifyRouter";

import LoginLayout from "~/layouts/LoginLayout";
import Suggestion from "~/pages/Suggestion/Suggestion";
import VerifyAccount from "~/pages/VerifyAccount/VerifyAccount";

const Login = lazy(() => import("~/pages/Login/Login"));
const Signup = lazy(() => import("~/pages/Signup/Signup"));
const Home = lazy(() => import("~/pages/Home/Home"));
const Direct = lazy(() => import("~/pages/Direct/Direct"));
const Profile = lazy(() => import("~/pages/Profile/Profile"));
const NotFound = lazy(() => import("~/pages/NotFound/NotFound"));

export const publicRouter = [
  { path: "/login", component: Login, layout: LoginLayout, protect: ProtectedLoginAndSignupRouter },
  { path: "/signup", component: Signup, layout: LoginLayout, protect: ProtectedLoginAndSignupRouter },
  { path: "/notify", component: VerifyAccount, layout: LoginLayout, protect: ProtectedVerifyRouter },

  { path: "/", component: Home, protect: ProtectedUserRouter },
  { path: "/direct", component: Direct, protect: ProtectedUserRouter },
  { path: "/explore/people", component: Suggestion,  },
  { path: "/profile/:username", component: Profile },
  { path: "*", component: NotFound },
];
