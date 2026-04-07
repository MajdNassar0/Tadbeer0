import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/auth/login" />;

  if (role && user.role?.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;