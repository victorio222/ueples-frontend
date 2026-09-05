import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  // Helper to read the cookie value
  // const getCookie = (name: string) => {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop()?.split(";").shift();
  //   return null;
  // };

  const userId = localStorage.getItem("user_id");

  // If no user_id is found in the session cookie, redirect to signin
  if (!userId) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;