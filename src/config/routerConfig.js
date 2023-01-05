import { lazy } from 'react';

import LoginLayout from "~/layouts/LoginLayout";

const Login = lazy(() => import('~/pages/Login/Login'));
const Signup = lazy(() => import('~/pages/Signup/Signup'));
const Home = lazy(() => import('~/pages/Home/Home'));
const Direct = lazy(() => import('~/pages/Direct/Direct'));
const Profile = lazy(() => import('~/pages/Profile/Profile'));
const NotFound = lazy(() => import('~/pages/NotFound/NotFound'));

export const publicRouter = [
    {path: '/login', component: Login, layout: LoginLayout},
    {path: '/signup', component: Signup, layout: LoginLayout},

    {path: '/', component: Home, protect: true},
    {path: '/direct', component: Direct},
    {path: '/profile/:username', component: Profile},
    {path: '*', component: NotFound},
]