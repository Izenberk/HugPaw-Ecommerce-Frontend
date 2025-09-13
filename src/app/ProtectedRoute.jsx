import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-6">🐈🐕 HugPaw is Checking 🐈🐕</div>;
  if (!isLoggedIn)
    return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
}
