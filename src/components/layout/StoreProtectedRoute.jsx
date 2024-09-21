import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const StoreProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export const AuthenticatedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === "admin") {
    return <Navigate to="/store" />;
  } else if (user?.role === "branch_manager") {
    return <Navigate to="/branch" />;
  }

  return children;
};
