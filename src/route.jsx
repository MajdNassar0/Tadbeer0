import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Login from"./pages/Login/Login";
import Home from"./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import AuthLayout from "./layout/AuthLayout";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword"
import ResetPassword from "./pages/ResetPassword/ResetPassword";

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
]);
export default router