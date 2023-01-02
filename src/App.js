import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { publicRouter } from "./config/routerConfig";
import DefaultLayout from "./layouts/DefaultLayout";

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
