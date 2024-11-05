import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/HomePage";
import Task from "../pages/TaskPage";
import Option from "../pages/OptionsPage";

export const routes = [
  { path: "/", label: "Home" },
  { path: "/task", label: "Task" },
  { path: "/option", label: "Options" }
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/task",
    element: <Task />,
  },
  {
    path: "/task/:id",
    element: <Task />,
  },
  {
    path: "/option",
    element: <Option />,
  }
]);