import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../pages/Layout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Endorsement from "../pages/Endorsement";
import Education from "../pages/Education";
import WorkExperience from "../pages/WorkExperience";
import Chat from "../pages/Chat";

const browserRouter = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/endorse",
        element: <Endorsement />,
      },
      {
        path: "/education",
        element: <Education />,
      },
      {
        path: "/work-exp",
        element: <WorkExperience />,
      },
      {
        path: "/*",
        element: <NotFound />,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={browserRouter} />;
};

export default AppRouter;
