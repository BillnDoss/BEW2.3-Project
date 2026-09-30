import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Navbar from "./Navbar";
import api from "../utils/api";

function AdminAuth() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        api.get("/users/:id", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Navbar user={user} />
            {/* This is a placeholder for different child pages */}
            <Outlet />
        </>
    );
}

export default AdminAuth;
