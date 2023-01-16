import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuthListener } from "~/hooks"
import { publicRouter } from "./config/routerConfig";
import DefaultLayout from "./layouts/DefaultLayout";

function App() {
  const { user } = useAuthListener()
  // console.log(user);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
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
                  <Layout>
                    {router.protect ? (
                      <ProtectedRoute user={user}>
                        <Page />
                      </ProtectedRoute>
                    ) : (
                      <Page />
                    )}
                  </Layout>
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
