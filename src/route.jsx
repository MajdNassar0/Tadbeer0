import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Login from"./pages/Login/Login";
import Home from"./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import AuthLayout from "./layout/AuthLayout";
<<<<<<< HEAD
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Booking from "./pages/Booking/Booking";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Services from "./pages/Services/Services";
=======
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword"
import ResetPassword from "./pages/ResetPassword/ResetPassword";

>>>>>>> origin/feat/Reset-Password
const router = createBrowserRouter([
  {
    path: "/",
    element:<MainLayout/>,
    children:[
        {
            index:true ,
            element:<Home />
        },
    ]
  },
  {
    path: "/auth",
    element:<AuthLayout/>,
    children:[
        {
            path:"login",
            element:<Login />
        },{
            path:"Signup",
            element:<Signup />
        },{
            path:"ForgotPassword",
            element:<ForgotPassword />
        },{
            path:"ResetPassword",
            element:<ResetPassword />
        }
    ]
  },
  {path: "Booking",
        element: (
          <ProtectedRoute >
            <Booking />
          </ProtectedRoute>
        ),
    },
    {
  path: "/services",
  element: <MainLayout />, // or AuthLayout if intended
  children: [
    {
      index: true,
      element: <Services />,
    },
  ],
}
]);
export default router