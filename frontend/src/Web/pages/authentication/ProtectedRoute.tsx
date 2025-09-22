import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../../services/userService";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useUser();
  const location = useLocation();

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-3">
        <span className="loading loading-spinner loading-lg"></span> Chargement...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
