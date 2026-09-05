import { Navigate, Outlet } from "react-router";
// import { getCookie } from "../../utils/auth";

interface RoleGatewayProps {
  allowedRoles: string[];
}

const RoleGateway = ({ allowedRoles }: RoleGatewayProps) => {
  const userRole = localStorage.getItem("user_role");

  // If the user's role isn't in the allowed list, send them home
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleGateway;