import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";
import Chip from "@mui/material/Chip";

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [goals, setGoals] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [newAdminTask, setNewAdminTask] = useState({
        userId: "",
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        dueDate: "",
    });
    const [filter, setFilter] = useState("All");
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
                localStorage.removeItem("role");
                navigate("/");
            }
        };
        getAllData();
    }, [navigate]);

    const addAdminTask = async (e) => {
        e.preventDefault();

        try {
            const userToken = localStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };

            const response = await api.post("/tasks", newAdminTask, config);

            setTasks((previousTasks) => [...previousTasks, response.data]);

            setNewAdminTask({
                userId: "",
                title: "",
                description: "",
                priority: "Medium",
                status: "Pending",
                dueDate: "",
            });
        } catch (error) {
            console.log(error);
        }
    };

    const filteredRoles = users.filter((user) => {
        if (filter === "All") {
            return true;
        }

        return user.role === filter;
    });

    const priorityColor = (priority) => {
        switch (priority) {
            case "Low":
                return "success";
            case "Medium":
                return "warning";
            case "High":
                return "error";
            default:
                return "default";
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case "Pending":
                return "default";
            case "In Progress":
                return "info";
            case "Completed":
                return "success";
            case "Active":
                return "primary"; 
            default:
                return "default";
        }
    };

    return (
        <>
            <h1>Dashboard</h1>

            <h2>Add Task</h2>

            <form onSubmit={addAdminTask}>
                <div>
                    <label>Assign To:</label>

                    <select
                        value={newAdminTask.userId}
                        onChange={(e) =>
                            setNewAdminTask({
                                ...newAdminTask,
                                userId: e.target.value,
                            })
                        }
                        required
                    >
                        <option value="">Select a user</option>

                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Title:</label>

                    <input
                        type="text"
                        value={newAdminTask.title}
                        onChange={(e) =>
                            setNewAdminTask({
                                ...newAdminTask,
                                title: e.target.value,
                            })
                        }
                        required
                    />
                </div>

                <div>
                    <label>Description:</label>

                    <textarea
                        value={newAdminTask.description}
                        onChange={(e) =>
                            setNewAdminTask({
                                ...newAdminTask,
                                description: e.target.value,
                            })
                        }
                    />
                </div>

                <div>
                    <label>Priority:</label>

                    <select
                        value={newAdminTask.priority}
                        onChange={(e) =>
                            setNewAdminTask({
                                ...newAdminTask,
                                priority: e.target.value,
                            })
                        }
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div>
                    <label>Status:</label>

                    <select
                        value={newAdminTask.status}
                        onChange={(e) =>
                            setNewAdminTask({
                                ...newAdminTask,
                                status: e.target.value,
                            })
                        }
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div>
                    <label>Due Date:</label>

                    <input
                        type="date"
                        value={newAdminTask.dueDate}
                        onChange={(e) =>
                            setNewAdminTask({
                                ...newAdminTask,
                                dueDate: e.target.value,
                            })
                        }
                        required
                    />
                </div>

                <button type="submit">Add Task</button>
            </form>

            <hr />

            <h2>Users</h2>

            <div>
                <label>Filter by Role: </label>

                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </div>

            <br />
            {filteredRoles.map((user) => {
                const Tasks = tasks.filter((task) => String(task.userId) === String(user._id));
                const Goals = goals.filter((goal) => String(goal.userId) === String(user._id));
                const Reminders = reminders.filter((reminder) => String(reminder.userId) === String(user._id));

                return (
                    <div key={user._id}>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                        <Chip
                            label={user.role}
                            size="small"
                            sx={{
                                backgroundColor: user.role === "admin" ? "#0dcaf0" : "#6c757d",
                                color: user.role === "admin" ? "#000" : "#fff",
                                fontWeight: 500,
                            }}
                        />

                        <h3>Tasks</h3>

                        {Tasks.length === 0 ? (
                            <p>No tasks found.</p>
                        ) : (
                            Tasks.map((task) => (
                                <div key={task._id}>
                                    <h4>{task.title}</h4>
                                    <p>{task.description}</p>
                                    <p>
                                        Priority: <Chip label={task.priority} color={priorityColor(task.priority)} size="small" />
                                    </p>

                                    <p>
                                        Status: <Chip label={task.status} color={statusColor(task.status)} size="small" />
                                    </p>

                                    <p>
                                        Due:{" "}
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
                                    <p>
                                        Status: <Chip label={goal.status} color={statusColor(goal.status)} size="small" />
                                    </p>

                                    <p>
                                        Achieve By:{" "}
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
                                    <p>
                                        Status: <Chip label={reminder.status} color={statusColor(reminder.status)} size="small" />
                                    </p>
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
