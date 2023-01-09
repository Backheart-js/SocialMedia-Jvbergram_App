import { lazy } from 'react';
import IsLoginProtectedRouter from '~/components/IsLoginProtectedRouter';
import ProtectedRouter from '~/components/ProtectedRouter';

import LoginLayout from "~/layouts/LoginLayout";
import VerifyAccount from '~/pages/VerifyAccount/VerifyAccount';

const Login = lazy(() => import('~/pages/Login/Login'));
const Signup = lazy(() => import('~/pages/Signup/Signup'));
const Home = lazy(() => import('~/pages/Home/Home'));
const Direct = lazy(() => import('~/pages/Direct/Direct'));
const Profile = lazy(() => import('~/pages/Profile/Profile'));
const NotFound = lazy(() => import('~/pages/NotFound/NotFound'));

export const publicRouter = [
    {path: '/login', component: Login, layout: LoginLayout, protect: IsLoginProtectedRouter},
    {path: '/signup', component: Signup, layout: LoginLayout, protect: IsLoginProtectedRouter},
    {path: '/notify', component: VerifyAccount, layout: LoginLayout, protect: IsLoginProtectedRouter},

    {path: '/', component: Home, protect: ProtectedRouter},
    {path: '/direct', component: Direct},
    {path: '/profile/:username', component: Profile},
    {path: '*', component: NotFound},
]