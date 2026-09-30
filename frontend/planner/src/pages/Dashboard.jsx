import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [goals, setGoals] = useState([]);
    const [reminders, setReminders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getAllData = async () => {
            try {
                const userToken = localStorage.getItem("token");
                console.log(userToken);
                if (userToken == null) throw new Error("User Token is unavailable");
                const config = {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                };
                const [usersResponse, tasksResponse, goalsResponse, remindersResponse] = await Promise.all([api.get("/users", config), api.get("/tasks", config), api.get("/goals", config), api.get("/reminders", config)]);

                setUsers(usersResponse.data);
                setTasks(tasksResponse.data);
                setGoals(goalsResponse.data);
                setReminders(remindersResponse.data);
            } catch (error) {
                console.log(error);
                localStorage.removeItem("token");
                navigate("/");
            }
        };
        getAllData();
    }, [navigate]);
    return (
        <>
            <h1>Dashboard</h1>

            {users.map((user) => {
                const Tasks = tasks.filter((task) => String(task.userId) === String(user._id));
                const Goals = goals.filter((goal) => String(goal.userId) === String(user._id));
                const Reminders = reminders.filter((reminder) => String(reminder.userId) === String(user._id));

                return (
                    <div key={user._id}>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                        <p>Role: {user.role}</p>

                        <h3>Tasks</h3>

                        {Tasks.length === 0 ? (
                            <p>No tasks found.</p>
                        ) : (
                            Tasks.map((task) => (
                                <div key={task._id}>
                                    <h4>{task.title}</h4>
                                    <p>{task.description}</p>
                                    <p>Priority: {task.priority}</p>
                                    <p>Status: {task.status}</p>
                                    <p>
                                        Due: {" "}
                                        <strong>
                                            {new Date(task.dueDate).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </strong>
                                    </p>
                                </div>
                            ))
                        )}

                        <h3>Goals</h3>

                        {Goals.length === 0 ? (
                            <p>No goals found.</p>
                        ) : (
                            Goals.map((goal) => (
                                <div key={goal._id}>
                                    <h4>{goal.title}</h4>
                                    <p>{goal.description}</p>
                                    <p>Progress: {goal.progress}%</p>
                                    <p>Status: {goal.status}</p>
                                    <p>
                                        Achieve By: {" "}
                                        <strong>
                                            {new Date(goal.targetDate).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </strong>
                                    </p>
                                </div>
                            ))
                        )}

                        <h3>Reminders</h3>

                        {Reminders.length === 0 ? (
                            <p>No reminders found.</p>
                        ) : (
                            Reminders.map((reminder) => (
                                <div key={reminder._id}>
                                    <h4>{reminder.title}</h4>
                                    <p>{reminder.description}</p>
                                    <p>Status: {reminder.status}</p>
                                </div>
                            ))
                        )}

                        <hr />
                    </div>
                );
            })}
        </>
    );
}
export default Dashboard;
