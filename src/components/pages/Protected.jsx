// src/components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const Protected = ({ adminOnly = false }) => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const token = localStorage.getItem("userToken");

  if (!user || !token) {
    return <Navigate to="/not-found" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/not-found" />;
  }

  return <Outlet />;
};

export default Protected;
