import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./Home.jsx";
import App from "./App.jsx";
import Results from "./Results.jsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/app",
    element: <App />,
  },

  {
    path: "/results",
    element: <Results />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
);
