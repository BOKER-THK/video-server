import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import App from "./routes/App.jsx";
import Upload from "./routes/Upload.jsx";
import Watch from "./routes/Watch.jsx";

const myRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/upload",
    element: <Upload />,
  },

  {
    path: "/watch/:videoName",
    element: <Watch />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={myRouter} />
  </React.StrictMode>
);
