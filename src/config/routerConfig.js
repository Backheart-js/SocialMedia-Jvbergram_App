import { lazy } from 'react';

import LoginLayout from "~/layouts/LoginLayout";

const Login = lazy(() => import('~/pages/Login/Login'));
const Signup = lazy(() => import('~/pages/Signup/Signup'));
const Home = lazy(() => import('~/pages/Home/Home'));
const NotFound = lazy(() => import('~/pages/NotFound/NotFound'));

export const publicRouter = [
    {path: '/login', component: Login, layout: LoginLayout},
    {path: '/signup', component: Signup, layout: LoginLayout},

    {path: '/', component: Home},
    {path: '*', component: NotFound},
]