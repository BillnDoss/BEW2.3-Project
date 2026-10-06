import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";

function Overview() {
    const [username, setUsername] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [goals, setGoals] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const getOverviewData = async () => {
            try {
                const userToken = localStorage.getItem("token");

                if (!userToken) {
                    throw new Error("User Token is unavailable");
                }

                const response = {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                };

                const userResponse = await api.get("/users/:id", response);
                setUsername(userResponse.data);

                const tasksResponse = await api.get("/tasks/userTasks", response);
                setTasks(tasksResponse.data);

                const goalsResponse = await api.get("/goals/userGoals", response);
                setGoals(goalsResponse.data);

                const remindersResponse = await api.get("/reminders/userReminders", response);
                setReminders(remindersResponse.data);
            } catch (error) {
                console.error("Failed to load overview:", error);

                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        getOverviewData();
    }, [navigate]);

    if (loading) {
        return <p>Loading...</p>;
    }

    // Renders only incomplete Tasks, Goals and Reminders
    const currentTasks = tasks.filter((task) => task.status !== "Completed");
    const currentGoals = goals.filter((goal) => goal.status !== "Completed" && goal.progress < 100);
    const currentReminders = reminders.filter((reminder) => reminder.status !== "Completed");

    return (
        <div>
            <h1>Welcome back, {username?.name}!</h1>
            <hr />

            <h2>Summary</h2>

            <div>
                <h3>Tasks</h3>
                <p>{currentTasks.length} current tasks</p>
            </div>

            <div>
                <h3>Goals</h3>
                <p>{currentGoals.length} current goals</p>
            </div>

            <div>
                <h3>Reminders</h3>
                <p>{currentReminders.length} current reminders</p>
            </div>

            <hr />
            <h2>Current Tasks</h2>

            {currentTasks.length === 0 ? (
                <p>No current tasks.</p>
            ) : (
                currentTasks.slice(0, 5).map((task) => (
                    <div key={task._id}>
                        <h3>{task.title}</h3>

                        <p>{task.description}</p>

                        <p>Status: {task.status}</p>

                        <p>Priority: {task.priority}</p>

                        <p>
                            Due date:{" "}
                            {new Date(task.dueDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>

                        <hr />
                    </div>
                ))
            )}

            {currentTasks.length > 5 && <button onClick={() => navigate("/tasks")}>View all tasks</button>}

            <hr />
            <h2>Current Goals</h2>

            {currentGoals.length === 0 ? (
                <p>No current goals.</p>
            ) : (
                currentGoals.slice(0, 5).map((goal) => (
                    <div key={goal._id}>
                        <h3>{goal.title}</h3>

                        <p>{goal.description}</p>

                        <p>Status: {goal.status}</p>

                        <p>Progress: {goal.progress}%</p>

                        <p>
                            Target date:{" "}
                            {new Date(goal.targetDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>

                        <hr />
                    </div>
                ))
            )}

            {currentGoals.length > 5 && <button onClick={() => navigate("/goals")}>View all goals</button>}

            <hr />
            <h2>Current Reminders</h2>

            {currentReminders.length === 0 ? (
                <p>No current reminders.</p>
            ) : (
                currentReminders.slice(0, 5).map((reminder) => (
                    <div key={reminder._id}>
                        <h3>{reminder.title}</h3>

                        <p>{reminder.description}</p>

                        <p>Status: {reminder.status}</p>

                        <p>
                            Remind at:{" "}
                            {new Date(reminder.remindAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>

                        <hr />
                    </div>
                ))
            )}

            {currentReminders.length > 5 && <button onClick={() => navigate("/reminders")}>View all reminders</button>}
        </div>
    );
}

export default Overview;
