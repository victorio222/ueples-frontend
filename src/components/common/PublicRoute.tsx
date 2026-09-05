import { Navigate, Outlet } from "react-router";
// import { getCookie } from "../../utils/auth";

const PublicRoute = () => {
  const userId = localStorage.getItem("user_id");
  // If user is already logged in, don't let them see Sign In/Sign Up
  return userId ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;