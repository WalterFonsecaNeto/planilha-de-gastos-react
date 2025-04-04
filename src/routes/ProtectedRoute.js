import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const userId = localStorage.getItem("userId"); // Verifica se o usuário está logado

  return userId ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
