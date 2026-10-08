import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import AdminTaskModal from "../components/AdminTaskModal";
import DeleteIcon from "@mui/icons-material/Delete";

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [goals, setGoals] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [addAdminTask, setAddAdminTask] = useState(false);
    const [filter, setFilter] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        const getAllData = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("Token unavailable");
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const usersData = await api.get("/users", config);
                const tasksData = await api.get("/tasks", config);
                const goalsData = await api.get("/goals", config);
                const remindersData = await api.get("/reminders", config);

                setUsers(usersData.data);
                setTasks(tasksData.data);
                setGoals(goalsData.data);
                setReminders(remindersData.data);
            } catch (error) {
                console.log(error);
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/");
            }
        };
        getAllData();
    }, [navigate]);

    const filteredUsers = users.filter((user) => {
        return filter === "All" || user.role === filter;
    });

    const priorityColor = (priority) => {
        if (priority === "Low") return "success";
        if (priority === "Medium") return "warning";
        if (priority === "High") return "error";
        return "default";
    };

    const statusColor = (status) => {
        if (status === "In Progress") return "info";
        if (status === "Completed") return "success";
        if (status === "Active") return "primary";
        return "default";
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US");
    };

    const deleteUserTask = async (taskId) => {
        const confirmed = window.confirm("Are you sure?");

        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Token unavailable");
            }

            await api.delete(`/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error("Failed to delete task:", error);
            alert("Unable to delete Task");
        }
    };

    const deleteUser = async (userId) => {
        const confirmAlert = window.confirm("Are you sure you want to delete this user?");
        if (!confirmAlert) return;
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token unavailable");
            }
            await api.delete(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            setTasks((prevTasks) => prevTasks.filter((task) => String(task.userId) !== String(userId)));
            setGoals((prevGoals) => prevGoals.filter((goal) => String(goal.userId) !== String(userId)));
            setReminders((prevReminders) => prevReminders.filter((reminder) => String(reminder.userId) !== String(userId)));
        } catch (error) {
            console.error("Failed to delete user:", error);
            alert("Unable to delete specified user");
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Dashboard</h1>

                <Button variant="contained" onClick={() => setAddAdminTask(true)}>
                    Add Task
                </Button>
            </div>

            <AdminTaskModal
                open={addAdminTask}
                onClose={() => setAddAdminTask(false)}
                users={users}
                onTaskAdded={(newTask) => {
                    setTasks((prev) => [...prev, newTask]);
                }}
            />

            <div className="mb-4">
                <label className="me-2">Filter:</label>

                <select className="form-select d-inline-block" style={{ width: "150px" }} value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </div>

            <div className="row g-3">
                {filteredUsers.map((user) => {
                    const userTasks = tasks.filter((task) => String(task.userId) === String(user._id));
                    const userGoals = goals.filter((goal) => String(goal.userId) === String(user._id));
                    const userReminders = reminders.filter((reminder) => String(reminder.userId) === String(user._id));

                    return (
                        <div className="col-12 col-md-6" key={user._id}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h4>{user.name}</h4>
                                            <p className="text-muted">{user.email}</p>
                                        </div>

                                        <Chip
                                            label={user.role}
                                            size="small"
                                            sx={{
                                                backgroundColor: user.role === "admin" ? "#0dcaf0" : "#6c757d",
                                                color: user.role === "admin" ? "#000" : "#fff",
                                                fontWeight: 500,
                                            }}
                                        />
                                        <Button variant="outlined" color="error" size="small" onClick={() => deleteUser(user._id)}>
                                            <DeleteIcon />
                                        </Button>
                                    </div>

                                    <hr />

                                    <h5>Tasks</h5>

                                    {userTasks.length === 0 ? (
                                        <p className="text-muted">No tasks found.</p>
                                    ) : (
                                        userTasks.map((task) => (
                                            <div key={task._id} className="border rounded p-2 mb-2">
                                                <div className="d-flex justify-content-between">
                                                    <strong>{task.title}</strong>

                                                    <Chip label={task.priority} color={priorityColor(task.priority)} size="small" />
                                                </div>

                                                <Button variant="outlined" color="error" size="small" onClick={() => deleteUserTask(task._id)}>
                                                    Delete
                                                </Button>

                                                <p className="mb-1">{task.description}</p>

                                                <small className="text-muted">
                                                    {task.status} · Due {formatDate(task.dueDate)}
                                                </small>
                                            </div>
                                        ))
                                    )}

                                    <h5 className="mt-4">Goals</h5>

                                    {userGoals.length === 0 ? (
                                        <p className="text-muted">No goals found.</p>
                                    ) : (
                                        userGoals.map((goal) => (
                                            <div key={goal._id} className="border rounded p-2 mb-2">
                                                <div className="d-flex justify-content-between">
                                                    <strong>{goal.title}</strong>
                                                    <Chip label={goal.status} color={statusColor(goal.status)} size="small" />
                                                </div>
                                                <p className="mb-1">{goal.description}</p>
                                                <small>Progress: {goal.progress}%</small>
                                                <div className="progress mt-1">
                                                    <div
                                                        className="progress-bar"
                                                        style={{
                                                            width: `${goal.progress}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    <h5 className="mt-4">Reminders</h5>

                                    {userReminders.length === 0 ? (
                                        <p className="text-muted">No reminders found.</p>
                                    ) : (
                                        userReminders.map((reminder) => (
                                            <div key={reminder._id} className="border rounded p-2 mb-2">
                                                <div className="d-flex justify-content-between">
                                                    <strong>{reminder.title}</strong>

                                                    <Chip label={reminder.status} size="small" />
                                                </div>

                                                <p className="mb-0">{reminder.description}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Dashboard;
