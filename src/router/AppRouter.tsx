import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../pages/Layout";
import Home from "../pages/Home";

const browserRouter = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={browserRouter} />;
};

export default AppRouter;
