import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ProtectedRoute({ children, admin = false }) {
  const { usuario, ehAdmin, carregando } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (admin && !carregando && !ehAdmin) return <Navigate to="/" replace />;
  return children;
}
