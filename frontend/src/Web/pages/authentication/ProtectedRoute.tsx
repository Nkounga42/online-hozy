import type { JSX } from "react";
// import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // const isAuthenticated = !!localStorage.getItem("token"); // vérifie l'auth
  // const location = useLocation();

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  return children;
}
