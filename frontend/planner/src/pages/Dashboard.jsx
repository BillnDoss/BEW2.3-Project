import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";

function Dashboard() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getAllUsers = async (userToken) => {
            try {
                const userToken = localStorage.getItem("token");
                console.log(userToken);
                if (userToken == null) throw new Error("User Token is unavailable");

                const response = await api.get("/users/", {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.log(error);
                localStorage.removeItem("token");
                navigate("/");
            }
        };
        getAllUsers();
    }, []);

    useEffect(() => {
        console.log(users);
    }, [users]);
    return (
        <>
            <h1>Dashboard</h1>
            {/* Wrap this all in a box */}
            {users.map((user) => (
                <div key={user._id}>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    {/* Give badge depending on role */}
                    <p>{user.role}</p>
                </div>
            ))}
        </>
    );
}
export default Dashboard;
