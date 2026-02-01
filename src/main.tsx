import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import App from "./App";
import HomePage from "./pages/HomePage";
import HuntApp from "./hunt/HuntApp";
import StageRoute from "./hunt/StageRoute";
import { ENTRY_SLUG } from "./hunt/stages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },

      {
        path: "hunt",
        element: <HuntApp />,
        children: [
          { index: true, element: <Navigate to={ENTRY_SLUG} replace /> },
          { path: ":slug", element: <StageRoute /> },
        ],
      },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
