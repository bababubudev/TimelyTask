import { createBrowserRouter } from "react-router-dom";
import TaskPage from "../pages/TaskPage";
import Option from "../pages/OptionsPage";
import DetailPage from "../pages/DetailsPage";

export const routes = [
  { path: "/", label: "Tasks" },
  { path: "/summary", label: "Details" },
  { path: "/option", label: "Options" }
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <TaskPage />,
  },
  {
    path: "/summary",
    element: <DetailPage />,
  },
  {
    path: "/summary/:id",
    element: <DetailPage />,
  },
  {
    path: "/option",
    element: <Option />,
  }
]);