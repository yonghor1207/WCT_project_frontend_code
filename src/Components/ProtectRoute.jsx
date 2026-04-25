import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If allowedRoles is specified, check if user's role is allowed
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Redirect to their appropriate dashboard based on role
        if (user?.role === "admin") {
            return <Navigate to="/dashboard" replace />;
        } else if (user?.role === "teacher") {
            return <Navigate to="/teacher-dashboard" replace />;
        } else if (user?.role === "student") {
            return <Navigate to="/student-dashboard" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
