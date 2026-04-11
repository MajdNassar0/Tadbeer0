import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!user) return <Navigate to="/auth/login" />;

  const userRole = user.role?.trim().toLowerCase();

  if (role) {
    if (Array.isArray(role)) {
      if (!role.map(r => r.toLowerCase()).includes(userRole)) {
        return <Navigate to="/" />; // Not allowed
      }
    } else {
      if (userRole !== role.toLowerCase()) return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;