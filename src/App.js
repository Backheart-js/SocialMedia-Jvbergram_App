import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuthListener } from "~/hooks";
import ProtectedLoginAndSignupRouter from "./helpers/ProtectedLoginAndSignupRouter";
import ProtectedUserRouter from "./helpers/ProtectedRouter/ProtectedRouter";
import ProtectedVerifyRouter from "./helpers/ProtectedVerifyRouter";
import LoadingPage from "./pages/LoadingPage/LoadingPage";
import DirectRoom from "./pages/Direct/DirectRoom/DirectRoom";

const LoginLayout = lazy(() => import("~/layouts/LoginLayout/LoginLayout"));
const DefaultLayout = lazy(() =>
  import("~/layouts/DefaultLayout/DefaultLayout")
);
const OnlyHeaderLayout = lazy(() =>
  import("~/layouts/OnlyHeaderLayout/OnlyHeaderLayout")
);
const Login = lazy(() => import("~/pages/Login/Login"));
const Signup = lazy(() => import("~/pages/Signup/Signup"));
const VerifyAccount = lazy(() => import("~/pages/VerifyAccount/VerifyAccount"));
const ResetPassword = lazy(() => import("~/pages/ResetPassword/ResetPassword"));
const Home = lazy(() => import("~/pages/Home/Home"));
const SuggestionPage = lazy(() =>
  import("~/pages/SuggestionPage/SuggestionPage")
);
const Direct = lazy(() => import("~/pages/Direct/Direct"));
const CreateDirect = lazy(() => import("~/pages/Direct/CreateDirect"));
const PostPage = lazy(() => import("~/pages/PostPage/PostPage"));
const Profile = lazy(() => import("~/pages/Profile/Profile"));
const Setting = lazy(() => import("~/pages/Setting/Setting"));
const SettingAccount = lazy(() =>
  import("~/pages/Setting/SettingOption/Account")
);
const NotFound = lazy(() => import("~/pages/NotFound/NotFound"));

function App() {
  const { user, loading } = useAuthListener();
  const Layout = user ? DefaultLayout : OnlyHeaderLayout;
  return loading ? (
    <LoadingPage />
  ) : (
    <Router>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          {/* {publicRouter.map((router, index) => {
            const Layout = router.layout || (user ? DefaultLayout : OnlyHeaderLayout);
            const ProtectedRoute = router.protect;
            const Page = router.component;

            return (
              <Route
                key={index}
                path={router.path}
                element={
                  <>
                    {router.protect ? (
                      <ProtectedRoute user={user}>
                        <Layout>
                          <Page />
                        </Layout>
                      </ProtectedRoute>
                    ) : (
                      <Layout>
                        <Page />
                      </Layout>
                    )}
                  </>
                }
              >
                {
                  router.nestedRoute && router.nestedRoute.map((nestedRoute, index) => {
                    const Childlayout = nestedRoute.component;
                    return <Route key={index} path={nestedRoute.path} element={<Childlayout/>}></Route>
                  })
                }
              </Route>
            );
          })}
          <Route path={} */}
          <Route path="/" element={<LoginLayout />}>
            <Route
              path="login"
              element={
                <ProtectedLoginAndSignupRouter user={user}>
                  <Login />
                </ProtectedLoginAndSignupRouter>
              }
            />
            <Route
              path="signup"
              element={
                <ProtectedLoginAndSignupRouter user={user}>
                  <Signup />
                </ProtectedLoginAndSignupRouter>
              }
            />
            <Route
              path="notify"
              element={
                <ProtectedVerifyRouter user={user}>
                  <VerifyAccount />
                </ProtectedVerifyRouter>
              }
            />
            <Route
              path="reset-password"
              element={
                <ProtectedVerifyRouter user={user}>
                  <ResetPassword />
                </ProtectedVerifyRouter>
              }
            />
          </Route>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <ProtectedUserRouter user={user}>
                  <Home />
                </ProtectedUserRouter>
              }
            />
            <Route
              path="direct"
              element={
                <ProtectedUserRouter user={user}>
                  <Direct />
                </ProtectedUserRouter>
              }
            >
              <Route path="inbox" element={<CreateDirect />} />
              <Route path=":chatroomId" element={<DirectRoom />} />
            </Route>
            <Route
              path="explore/people"
              element={
                <ProtectedUserRouter user={user}>
                  <SuggestionPage />
                </ProtectedUserRouter>
              }
            />
            <Route
              path="p/:docId"
              element={
                <ProtectedUserRouter user={user}>
                  <PostPage />
                </ProtectedUserRouter>
              }
            />
            <Route
              path="setting"
              element={
                <ProtectedUserRouter user={user}>
                  <Setting />
                </ProtectedUserRouter>
              }
            >
              <Route path="account" element={<SettingAccount />} />
            </Route>
            <Route path=":username" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
