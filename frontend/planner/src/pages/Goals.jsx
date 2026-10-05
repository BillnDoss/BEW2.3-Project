import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";
import GoalModal from "../components/GoalModal";

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
                navigate("/");
            }
        };
        getAllGoals();
    }, [navigate]);

    const filteredGoals = goals.filter((goal) => {
        const progressFilterStatus = statusFilter === "all" || goal.status === statusFilter;
        let progressStatus = true;
        if (progressFilter === "not-started") {
            progressStatus = goal.progress === 0;
        } else if (progressFilter === "in-progress") {
            progressStatus = goal.progress > 0 && goal.progress < 100;
        } else if (progressFilter === "completed") {
            progressStatus = goal.progress === 100;
        }
        return progressFilterStatus && progressStatus;
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

                console.log("Created goal:", response.data);

                setGoals((previousGoals) => [...previousGoals, response.data]);
            } else {
                const response = await api.patch(`/goals/${currentGoal._id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });

                console.log("Updated goal:", response.data);

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

    // Only navigates to reminders with the goal selected
    // const setToReminder = (goal) => {
    //     navigate("/reminders", {
    //         state: {
    //             goal: goal,
    //         },
    //     });
    // };

    return (
        <>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Goals</h1>
                        <h3 className="text-slate-500 mt-1">Here are your currently set goals:</h3>
                    </div>
                    <button onClick={handleOpenAddForm} className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition">
                        Add Goal
                    </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-6 mb-6">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300">
                        <option value="all">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <select value={progressFilter} onChange={(e) => setProgressFilter(e.target.value)} className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300">
                        <option value="all">All Progress</option>
                        <option value="not-started">Not Started (0%)</option>
                        <option value="in-progress">In Progress (1-99%)</option>
                        <option value="completed">Completed (100%)</option>
                    </select>
                    {(statusFilter !== "all" || progressFilter !== "all") && (
                        <button
                            onClick={() => {
                                setStatusFilter("all");
                                setProgressFilter("all");
                            }}
                            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
                {goals.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No Data Detected.</p>
                    </div>
                ) : filteredGoals.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No Filtered Goals Found</p>

                        <button
                            onClick={() => {
                                setStatusFilter("all");
                                setProgressFilter("all");
                            }}
                            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredGoals.map((goal) => (
                            <div key={goal._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">{goal.title}</h2>
                                        <p className="text-slate-500 mt-1">{goal.description}</p>
                                    </div>
                                    <p>{goal.status}</p>
                                </div>

                                <p className="text-sm text-slate-500 mt-4">
                                    Target date:{" "}
                                    {new Date(goal.targetDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                                <div className="mt-5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-700">Progress</span>
                                        <span className="text-sm font-semibold text-slate-700">{goal.progress}%</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-5">
                                    <button onClick={() => handleOpenEditForm(goal)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                                        Edit
                                    </button>
                                    {/* Adds it to Reminders but only temporarily  */}
                                    {/* <button onClick={() => handleAddToReminder(goal)} className="px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition">
                                        Add to Reminder
                                    </button> */}
                                    <button onClick={() => handleDeleteGoal(goal._id)} className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition">
                                        Delete
                                    </button>
                                </div>
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
                editingGoal={currentGoal}
            />
        </>
    );
}

export default Goals;
