// import { Navigate, Outlet } from "react-router";

// const ProtectedRoute = () => {
//   const userId = localStorage.getItem("user_id");

//   // If no user_id is found, redirect to signin
//   if (!userId) {
//     return <Navigate to="/signin" replace />;
//   }

//   // If user exists, render the child routes (via Outlet)
//   return <Outlet />;
// };

// export default ProtectedRoute;








import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  // Helper to read the cookie value
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  const userId = getCookie("user_id");

  // If no user_id is found in the session cookie, redirect to signin
  if (!userId) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;