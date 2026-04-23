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
import UserProfile from "./pages/UserProfile/UserProfile";

// Admin
import AdminLayout   from "./pages/Admin/AdminLayout";
import Dashboard     from "./pages/Admin/Dashboard";
import Users         from "./pages/Admin/Users";
import Technicians   from "./pages/Admin/Technicians";
import AdminBookings from "./pages/Admin/Bookings";
import AdminReviews  from "./pages/Admin/Reviews";
import Reports       from "./pages/Admin/Reports";
import Settings      from "./pages/Admin/Settings";

// Worker
import WorkerLayout   from "./pages/TechnicanDashboard/WorkerLayout";
import WorkerDashboard from "./pages/TechnicanDashboard/Dashboard";
import WorkerBookings  from "./pages/TechnicanDashboard/Bookings";
import WorkerReviews   from "./pages/TechnicanDashboard/Reviews";
import WorkerReports   from "./pages/TechnicanDashboard/Reports";
import WorkerSettings  from "./pages/TechnicanDashboard/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true,               element: <Home />           },
      { path: "services",          element: <Services />       },
      { path: "workers",           element: <Workers />        },
      { path: "worker-profile/:id",element: <WorkerProfile />  },
      {
        path: "user-profile",
        element: <ProtectedRoute><UserProfile /></ProtectedRoute>,
      },
      {
      path: "booking/:workerId",
      element: (
        <ProtectedRoute>
          <Booking />
        </ProtectedRoute>
      ),
    },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login",          element: <Login />          },
      { path: "Signup",         element: <Signup />         },
      { path: "ForgotPassword", element: <ForgotPassword /> },
      { path: "ResetPassword",  element: <ResetPassword />  },
    ],
  },
{ path: "booking/:workerId", element: <ProtectedRoute><Booking /></ProtectedRoute> }  ,
{
    path: "admin",
    element: (
      <ProtectedRoute role={["admin", "superadmin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,           element: <Dashboard />     },
      { path: "users",         element: <Users />         },
      { path: "technicians",   element: <Technicians />   },
      { path: "bookings",      element: <AdminBookings /> },
      { path: "reviews",       element: <AdminReviews />  },
      { path: "reports",       element: <Reports />       },
      { path: "settings",      element: <Settings />      },
    ],
  },
  {
    path: "technical",
    element: (
      <ProtectedRoute role="worker">
        <WorkerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,        element: <WorkerDashboard /> },
      { path: "bookings",   element: <WorkerBookings />  },
      { path: "reviews",    element: <WorkerReviews />   },
      { path: "reports",    element: <WorkerReports />   },
      { path: "settings",   element: <WorkerSettings />  },
    ],
  },
]);

export default router;