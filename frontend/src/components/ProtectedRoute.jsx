import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading/>;
  }

  return user ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;