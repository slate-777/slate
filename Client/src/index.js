import { createRoot } from "react-dom/client";
import App from './components/Dashboard/App';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Login from './components/Auth/Login';
import LandingPage from './components/Landing/LandingPage';
import './styles.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/landing",
    element: <LandingPage />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />
  },
  {
    path: "/dashboard",
    element: <App />
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);