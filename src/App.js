import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuthListener } from "~/hooks";
import { publicRouter } from "./config/routerConfig";
import DefaultLayout from "./layouts/DefaultLayout";
import OnlyHeaderLayout from "./layouts/OnlyHeaderLayout";
import LoadingPage from "./pages/LoadingPage/LoadingPage";


function App() {
  const { user, loading } = useAuthListener();

  console.log(user);

  return loading ? 
  (
    <LoadingPage />
  )
  :
  (
    <Router>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          {publicRouter.map((router, index) => {
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
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
