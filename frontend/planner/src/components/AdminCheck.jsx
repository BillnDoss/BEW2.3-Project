import { Navigate, Outlet } from "react-router";

function AdminRole() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/" />;
    }

    if (role !== "admin") {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}

export default AdminRole;
