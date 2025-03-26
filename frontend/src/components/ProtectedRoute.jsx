import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();

  if (user === null) {
    return <Loading/>;  // Or show a spinner or placeholder here
  }

  return user ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;