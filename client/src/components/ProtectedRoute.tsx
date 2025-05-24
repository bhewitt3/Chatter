import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

const ProtectedRoute = ({children}: {children: ReactNode}) => {
    const {user, isLoading } = useAuth();

    if (isLoading) return <p>Loading...</p>;

    if (!user) return <Navigate to="/login" replace />;

    return <>{children}</>;
}

export default ProtectedRoute;
