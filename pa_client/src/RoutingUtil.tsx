import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Task from "./pages/Task";
import Option from "./pages/Options";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/Task",
    element: <Task />,
  },
  {
    path: "/Option",
    element: <Option />,
  }
]);

export default router;