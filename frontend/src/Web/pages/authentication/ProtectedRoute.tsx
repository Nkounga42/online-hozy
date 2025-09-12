import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "../../services/authService";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        authService.clearAuthData();
      }
    };

    checkAuth();
  }, []);

  // Afficher un loader pendant la vérification
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-3">
        <span className="loading loading-spinner loading-lg"></span> Chargement...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
