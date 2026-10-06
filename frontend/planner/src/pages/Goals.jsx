import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";
import GoalModal from "../components/GoalModal";
import { Box, Button, Card, CardContent, FormControl, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";

function Goals() {
    const [goals, setGoals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentGoal, setCurrentGoal] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [progressFilter, setProgressFilter] = useState("all");

    const navigate = useNavigate();

    useEffect(() => {
        const getAllGoals = async () => {
            try {
                const userToken = localStorage.getItem("token");

                if (!userToken) {
                    throw new Error("User Token is unavailable");
                }

                const response = await api.get("/goals/userGoals", {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });

                setGoals(response.data);
            } catch (error) {
                console.log(error);
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/");
            }
        };

        getAllGoals();
    }, [navigate]);

    const filteredGoals = goals.filter((goal) => {
        const statusMatches = statusFilter === "all" || goal.status === statusFilter;

        let progressMatches = true;

        if (progressFilter === "not-started") {
            progressMatches = goal.progress === 0;
        } else if (progressFilter === "in-progress") {
            progressMatches = goal.progress > 0 && goal.progress < 100;
        } else if (progressFilter === "completed") {
            progressMatches = goal.progress === 100;
        }

        return statusMatches && progressMatches;
    });

    const handleOpenAddForm = () => {
        setCurrentGoal(null);
        setIsModalOpen(true);
    };

    const handleOpenEditForm = (goal) => {
        setCurrentGoal(goal);
        setIsModalOpen(true);
    };

    const handleSaveGoal = async (payload) => {
        try {
            const userToken = localStorage.getItem("token");

            if (!userToken) {
                throw new Error("User Token is unavailable");
            }

            if (currentGoal === null) {
                const response = await api.post("/goals", payload, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });

                setGoals((previousGoals) => [...previousGoals, response.data]);
            } else {
                const response = await api.patch(`/goals/${currentGoal._id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });

                setGoals((previousGoals) => previousGoals.map((goal) => (goal._id === currentGoal._id ? response.data : goal)));
            }

            setIsModalOpen(false);
            setCurrentGoal(null);
        } catch (error) {
            console.error("Error saving goal:", error.response?.data || error);

            alert("Failed to save goal.");
        }
    };

    const handleDeleteGoal = async (id) => {
        try {
            const response = await api.delete(`/goals/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.status === 204) {
                setGoals((previousGoals) => previousGoals.filter((goal) => goal._id !== id));
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete goal. Please check your connection.");
        }
    };

    const clearFilters = () => {
        setStatusFilter("all");
        setProgressFilter("all");
    };

    return (
        <>
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <Typography variant="h3" component="h1" fontWeight="bold">
                            Goals
                        </Typography>

                        <Typography variant="body1" color="text.secondary">
                            Here are your currently set goals:
                        </Typography>
                    </div>

                    <Button variant="contained" onClick={handleOpenAddForm}>
                        Add Goal
                    </Button>
                </div>

                <br />

                <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel>Status</InputLabel>

                        <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                            <MenuItem value="all">All Statuses</MenuItem>

                            <MenuItem value="Active">Active</MenuItem>

                            <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 190 }}>
                        <InputLabel>Progress</InputLabel>

                        <Select value={progressFilter} label="Progress" onChange={(e) => setProgressFilter(e.target.value)}>
                            <MenuItem value="all">All Progress</MenuItem>

                            <MenuItem value="not-started">Not Started (0%)</MenuItem>

                            <MenuItem value="in-progress">In Progress (1-99%)</MenuItem>

                            <MenuItem value="completed">Completed (100%)</MenuItem>
                        </Select>
                    </FormControl>

                    {(statusFilter !== "all" || progressFilter !== "all") && (
                        <Button variant="text" color="inherit" onClick={clearFilters}>
                            Clear filters
                        </Button>
                    )}
                </div>

                {goals.length === 0 ? (
                    <Box className="text-center py-5">
                        <Typography color="text.secondary">No Data Detected.</Typography>
                    </Box>
                ) : filteredGoals.length === 0 ? (
                    <Box className="text-center py-5">
                        <Typography color="text.secondary">No Filtered Goals Found</Typography>

                        <Button variant="text" color="primary" onClick={clearFilters} sx={{ mt: 1 }}>
                            Clear filters
                        </Button>
                    </Box>
                ) : (
                    <div className="row g-4">
                        {filteredGoals.map((goal) => (
                            <div className="col-12" key={goal._id}>
                                <Card elevation={1}>
                                    <CardContent className="p-4">
                                        <div className="d-flex justify-content-between align-items-start gap-3">
                                            <div>
                                                <Typography variant="h5" fontWeight="600">
                                                    {goal.title}
                                                </Typography>

                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    {goal.description}
                                                </Typography>
                                            </div>

                                            <Typography variant="body2" fontWeight="600">
                                                {goal.status}
                                            </Typography>
                                        </div>

                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                                            Target date:{" "}
                                            {new Date(goal.targetDate).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </Typography>

                                        <Box sx={{ mt: 3 }}>
                                            <div className="d-flex justify-content-between mb-2">
                                                <Typography variant="body2" fontWeight="500">
                                                    Progress
                                                </Typography>

                                                <Typography variant="body2" fontWeight="600">
                                                    {goal.progress}%
                                                </Typography>
                                            </div>

                                            <LinearProgress
                                                variant="determinate"
                                                value={goal.progress}
                                                sx={{
                                                    height: 6,
                                                    borderRadius: 3,
                                                }}
                                            />
                                        </Box>

                                        <div className="d-flex gap-2 mt-4">
                                            <Button variant="outlined" size="small" onClick={() => handleOpenEditForm(goal)}>
                                                Edit
                                            </Button>

                                            <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteGoal(goal._id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <GoalModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCurrentGoal(null);
                }}
                onSave={handleSaveGoal}
                editGoals={currentGoal}
            />
        </>
    );
}

export default Goals;
