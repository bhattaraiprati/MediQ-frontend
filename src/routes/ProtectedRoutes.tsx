import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRoutesProps {
  allowedRoles: string[];
}

const ProtectedRoutes = ({ allowedRoles }: ProtectedRoutesProps) => {
  const { user, isAuthenticated, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return null;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Role check
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
