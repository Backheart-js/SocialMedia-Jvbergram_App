import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuthListener } from "~/hooks";
import { publicRouter } from "./config/routerConfig";
import DefaultLayout from "./layouts/DefaultLayout";
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
            const Layout = router.layout || DefaultLayout;
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
              />
            );
          })}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
