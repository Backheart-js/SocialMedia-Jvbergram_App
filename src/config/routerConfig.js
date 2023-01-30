import { lazy } from "react";
import ProtectedLoginAndSignupRouter from "~/helpers/ProtectedLoginAndSignupRouter";
import ProtectedUserRouter from "~/helpers/ProtectedRouter";
import ProtectedVerifyRouter from "~/helpers/ProtectedVerifyRouter";
import LoginLayout from "~/layouts/LoginLayout";


const Login = lazy(() => import("~/pages/Login/Login"));
const Signup = lazy(() => import("~/pages/Signup/Signup"));
const VerifyAccount = lazy(() => import("~/pages/VerifyAccount/VerifyAccount"));
const ResetPassword = lazy(() => import("~/pages/ResetPassword/ResetPassword"));

const Home = lazy(() => import("~/pages/Home/Home"));
const SuggestionPage = lazy(() => import("~/pages/SuggestionPage/SuggestionPage"));
const Direct = lazy(() => import("~/pages/Direct/Direct"));
const PostPage = lazy(() => import("~/pages/PostPage/PostPage"));
const Profile = lazy(() => import("~/pages/Profile/Profile"));
const NotFound = lazy(() => import("~/pages/NotFound/NotFound"));

export const publicRouter = [
  { path: "/login", component: Login, layout: LoginLayout, protect: ProtectedLoginAndSignupRouter },
  { path: "/signup", component: Signup, layout: LoginLayout, protect: ProtectedLoginAndSignupRouter },
  { path: "/notify", component: VerifyAccount, layout: LoginLayout, protect: ProtectedVerifyRouter },
  { path: "/reset-password", component: ResetPassword, layout: LoginLayout, protect: ProtectedVerifyRouter },

  { path: "/", component: Home, protect: ProtectedUserRouter },
  { path: "/direct", component: Direct, protect: ProtectedUserRouter },
  { path: "/explore/people", component: SuggestionPage, protect: ProtectedUserRouter  },
  { path: "/p/:docId", component: PostPage, protect: ProtectedUserRouter },
  { path: "/profile/:username", component: Profile },
  { path: "*", component: NotFound },
];
