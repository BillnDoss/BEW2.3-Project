import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";
import GoalModal from "../components/GoalModal";

function Goals() {
    const [goals, setGoals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentGoal, setCurrentGoal] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const getAllGoals = async (userToken) => {
            try {
                const userToken = localStorage.getItem("token");
                console.log(userToken);
                if (userToken == null) throw new Error("User Token is unavailable");

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

    useEffect(() => {
        console.log(goals);
    }, [goals]);

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
            }

            else {
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
                const remainingGoals = goals.filter((goal) => goal._id !== id);

                setGoals(remainingGoals);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete goal. Please check your connection.");
        }
    };

    return (
        <>
            <h1>Goals</h1>
            <h3>Here are your currently set Goals: </h3>
            <div className="flex items-center gap-3">
                <button onClick={handleOpenAddForm} className="bg-slate-900 text-white px-4 py-2 rounded-xl">
                    Add Goal
                </button>
            </div>
            <div className="flex gap-2 mt-5">
                <button onClick={() => handleOpenEditForm(goal)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl">
                    Edit
                </button>

                <button onClick={() => handleDeleteGoal(goal._id)} className="flex-1 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
                    Delete
                </button>
            </div>
            {goals.length === 0 ? (
                <p>No goals found. </p>
            ) : (
                goals.map((goal) => (
                    <div key={goal._id}>
                        <h2>{goal.title}</h2>
                        <p>{goal.description}</p>
                        <p>
                            {new Date(goal.targetDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>

                        {/* Turn this into a progress bar */}
                        <p>{goal.progress}</p>
                        {/* Add a badge with button colour depending on status */}
                        <p>{goal.status}</p>
                    </div>
                ))
            )}
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
