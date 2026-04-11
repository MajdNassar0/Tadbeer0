import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import AuthLayout from "./layout/AuthLayout";
import Booking from "./pages/Booking/Booking";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Services from "./pages/Services/Services";
import Workers from "./pages/Workers/Workers";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import WorkerProfile from "./pages/WorkerProfile/WorkerProfile";
import Admin from "./pages/Admin/Admin";
import TechnicanDashboard from "./pages/TechnicanDashboard/TechnicanDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "workers",
        element: <Workers />,
      },
      {
        path: "worker-profile/:id",
        element: <WorkerProfile />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "Signup",
        element: <Signup />,
      },
      {
        path: "ForgotPassword",
        element: <ForgotPassword />,
      },
      {
        path: "ResetPassword",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "Booking",
    element: (
      <ProtectedRoute>
        <Booking />
      </ProtectedRoute>
    ),
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute role={["admin", "superadmin"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "technical",
    element: (
      <ProtectedRoute role="worker">
        <TechnicanDashboard />
      </ProtectedRoute>
    ),
  },
]);

export default router;