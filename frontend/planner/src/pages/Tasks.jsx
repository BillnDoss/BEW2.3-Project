import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const getAllTasks = async (userToken) => {
            try {
                const userToken = localStorage.getItem("token");
                console.log(userToken);
                if (userToken == null) throw new Error("User Token is unavailable");

                const response = await api.get("/tasks", {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setTasks(response.data);
            } catch (error) {
                console.log(error);
                localStorage.removeItem("token");
                navigate("/");
            }
        };
        getAllTasks();
    }, []);

    useEffect(() => {
        console.log(tasks);
    }, [tasks]);

    return (
        <>
            <h1>Tasks</h1>
            <h3>Here are your current tasks: </h3>
            {tasks.map((task) => (
                <div key={task._id}>
                    <h2>{task.title}</h2>
                    <p>{task.description}</p>
                    <p>{task.dueDate}</p>
                    {/* Add a badge with button colour depending on status here as well */}
                    <p>{task.priority}</p>
                    {/* Add a badge with button colour depending on status */}
                    <p>{task.status}</p>
                </div>
            ))}
        </>
    );
}

export default Tasks;
