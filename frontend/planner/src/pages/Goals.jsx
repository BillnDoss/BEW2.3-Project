import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";

function Goals() {
    const [goals, setGoals] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const getAllGoals = async (userToken) => {
            try {
                const userToken = localStorage.getItem("token");
                console.log(userToken);
                if (userToken == null) throw new Error("User Token is unavailable");

                const response = await api.get("/goals", {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setGoals(response.data);
            } catch (error) {
                console.log(error);
                localStorage.removeItem("token");
                navigate("/");
            }
        };
        getAllGoals();
    }, []);

    useEffect(() => {
        console.log(goals);
    }, [goals]);
    return (
        <>
            <h1>Goals</h1>
            <p>Here are your currently set Goals: </p>
            {goals.map((goal) => (
                <div key={goal._id}>
                    <h2>{goal.title}</h2>
                    <p>{goal.description}</p>
                    <p>{goal.targetDate}</p>
                    {/* Turn this into a progress bar */}
                    <p>{goal.progress}</p>
                    {/* Add a badge with button colour depending on status */}
                    <p>{goal.status}</p>
                </div>
            ))}
        </>
    );
}

export default Goals;
