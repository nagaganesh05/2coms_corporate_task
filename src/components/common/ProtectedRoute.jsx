import { Navigate, useLocation } from "react-router-dom";
import useStore from "../../store/useStore";

// Guards routes by authentication and (optionally) role.
function ProtectedRoute({ children, roles }) {
  const role = useStore((s) => s.role);
  const location = useLocation();

  if (!role) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
