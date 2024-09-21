import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const BranchProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
