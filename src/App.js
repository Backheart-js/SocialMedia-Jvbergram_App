import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { publicRouter } from "./config/routerConfig";
import DefaultLayout from "./layouts/DefaultLayout";

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {publicRouter.map((router, index) => {
            const Layout = router.layout || DefaultLayout;
            const Page = router.component;
  
            return (
              <Route
                key={index}
                path={router.path}
                element={
                  <Layout>
                    <Page />
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
