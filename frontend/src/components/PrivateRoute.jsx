import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth(); // Add `loading` to context if not present

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton className="w-10 h-10 rounded-full" />
        <span className="ml-3 text-muted-foreground">Checking auth...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return (
      <Navigate
        to={user.role === "admin" ? "/dashboard" : "/telecaller"}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoute;
