import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";

function Overview() {
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        api.get("/users/:id", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                setUsername(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    if (!username) {
        return <p>Loading...</p>;
    }
    

    return (
        <>
            <h1>Welcome back, {username.name}</h1>
        </>
    );
}

export default Overview;
