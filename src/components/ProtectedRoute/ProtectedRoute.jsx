import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const location = useLocation();

  // Get data safely
  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // 🔴 Not logged in
  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 🟡 If no role required → allow access
  if (!role) {
    return children;
  }

  // 🟠 If role required but user missing
  const userRole = user?.role?.toLowerCase();

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  // 🔵 Role check (supports string or array)
  if (Array.isArray(role)) {
    const allowedRoles = role.map(r => r.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  } else {
    if (userRole !== role.toLowerCase()) {
      return <Navigate to="/" replace />;
    }
  }

  // 🟢 Authorized
  return children;
};

export default ProtectedRoute;