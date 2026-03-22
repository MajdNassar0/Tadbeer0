import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // check token

  if (!token) {
    return <Navigate to="/auth/login" replace />; // redirect if not logged in
  }

  return children;
};

export default ProtectedRoute;