import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";
import { Card, CardContent, Typography, Button, Chip, LinearProgress, Divider } from "@mui/material";

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
        return (
            <div className="container py-5 text-center">
                <Typography variant="h6" color="text.secondary">
                    Loading...
                </Typography>
            </div>
        );
    }

    // This only renders incomplete tasks
    const currentTasks = tasks.filter((task) => task.status !== "Completed");
    const currentGoals = goals.filter((goal) => goal.status !== "Completed" && goal.progress < 100);
    const currentReminders = reminders.filter((reminder) => reminder.status !== "Completed");

    // Date formatting helper
    const formatDate = (date) => {
        if (!date) return "No date";

        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="container py-4">
            <div className="mb-4">
                <Typography variant="h4" component="h1" className="fw-bold">
                    Welcome back, {username?.name}!
                </Typography>

                <Typography variant="body1" color="text.secondary">
                    Here's an overview of your current tasks, goals, and reminders.
                </Typography>
            </div>
            <Divider className="mb-4" />
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Typography variant="h5" component="h2" className="fw-bold">
                    Summary
                </Typography>
            </div>
            <div className="row g-3 mb-5">
                <div className="col-md-4">
                    <Card
                        sx={{
                            height: "100%",
                            borderRadius: 2,
                        }}
                    >
                        <CardContent>
                            <Typography variant="subtitle1" color="text.secondary">
                                Tasks
                            </Typography>

                            <Typography variant="h3" className="fw-bold">
                                {currentTasks.length}
                            </Typography>

                            <Typography color="text.secondary">Current tasks</Typography>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-md-4">
                    <Card
                        sx={{
                            height: "100%",
                            borderRadius: 2,
                        }}
                    >
                        <CardContent>
                            <Typography variant="subtitle1" color="text.secondary">
                                Goals
                            </Typography>

                            <Typography variant="h3" className="fw-bold">
                                {currentGoals.length}
                            </Typography>

                            <Typography color="text.secondary">Current goals</Typography>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-md-4">
                    <Card
                        sx={{
                            height: "100%",
                            borderRadius: 2,
                        }}
                    >
                        <CardContent>
                            <Typography variant="subtitle1" color="text.secondary">
                                Reminders
                            </Typography>

                            <Typography variant="h3" className="fw-bold">
                                {currentReminders.length}
                            </Typography>

                            <Typography color="text.secondary">Current reminders</Typography>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Typography variant="h5" component="h2" className="fw-bold">
                        Current Tasks
                    </Typography>

                    {currentTasks.length > 5 && (
                        <Button variant="outlined" size="small" onClick={() => navigate("/tasks")}>
                            View all
                        </Button>
                    )}
                </div>

                {currentTasks.length === 0 ? (
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary">No current tasks.</Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="row g-3">
                        {currentTasks.slice(0, 5).map((task) => (
                            <div className="col-md-6" key={task._id}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        borderRadius: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" className="fw-bold mb-2">
                                            {task.title}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" className="mb-3">
                                            {task.description || "No description"}
                                        </Typography>

                                        <div className="d-flex gap-2 flex-wrap mb-3">
                                            <Chip label={task.status} size="small" />

                                            <Chip label={task.priority} size="small" color="primary" />
                                        </div>

                                        <Typography variant="body2" color="text.secondary">
                                            Due: <strong>{formatDate(task.dueDate)}</strong>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Typography variant="h5" component="h2" className="fw-bold">
                        Current Goals
                    </Typography>

                    {currentGoals.length > 5 && (
                        <Button variant="outlined" size="small" onClick={() => navigate("/goals")}>
                            View all
                        </Button>
                    )}
                </div>

                {currentGoals.length === 0 ? (
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary">No current goals.</Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="row g-3">
                        {currentGoals.slice(0, 5).map((goal) => (
                            <div className="col-md-6" key={goal._id}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        borderRadius: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" className="fw-bold mb-2">
                                            {goal.title}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" className="mb-3">
                                            {goal.description || "No description"}
                                        </Typography>

                                        {/* Progress */}
                                        <div className="d-flex justify-content-between mb-1">
                                            <Typography variant="body2">Progress</Typography>

                                            <Typography variant="body2">{goal.progress}%</Typography>
                                        </div>

                                        <LinearProgress
                                            variant="determinate"
                                            value={goal.progress || 0}
                                            sx={{
                                                height: 8,
                                                borderRadius: 5,
                                            }}
                                        />

                                        <div className="mt-3">
                                            <Chip label={goal.status} size="small" />
                                        </div>

                                        <Typography variant="body2" color="text.secondary" className="mt-3">
                                            Target: <strong>{formatDate(goal.targetDate)}</strong>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Typography variant="h5" component="h2" className="fw-bold">
                        Current Reminders
                    </Typography>

                    {currentReminders.length > 5 && (
                        <Button variant="outlined" size="small" onClick={() => navigate("/reminders")}>
                            View all
                        </Button>
                    )}
                </div>

                {currentReminders.length === 0 ? (
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary">No current reminders.</Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="row g-3">
                        {currentReminders.slice(0, 5).map((reminder) => (
                            <div className="col-md-6" key={reminder._id}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        borderRadius: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" className="fw-bold mb-2">
                                            {reminder.title}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" className="mb-3">
                                            {reminder.description || "No description"}
                                        </Typography>

                                        <Chip label={reminder.status} size="small" color="primary" />

                                        <Typography variant="body2" color="text.secondary" className="mt-3">
                                            Remind at: <strong>{formatDate(reminder.remindAt)}</strong>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Overview;
