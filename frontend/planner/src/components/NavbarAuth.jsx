import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import Navbar from "./Navbar";
import api from "../utils/api";

function AdminAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError(true);
            setLoading(false);
            return;
        }

        api.get("/users/:id", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error(error);

                localStorage.removeItem("token");
                localStorage.removeItem("role");

                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error || !user) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <Navbar user={user} />
            <Outlet />
        </>
    );
}

export default AdminAuth;
