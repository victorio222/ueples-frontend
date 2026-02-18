import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const userId = localStorage.getItem("user_id");

  // If no user_id is found, redirect to signin
  if (!userId) {
    return <Navigate to="/signin" replace />;
  }

  // If user exists, render the child routes (via Outlet)
  return <Outlet />;
};

export default ProtectedRoute;