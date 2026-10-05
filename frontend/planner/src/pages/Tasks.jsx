import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";
import TaskModal from "../components/TaskModal";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        const getAllTasks = async () => {
            try {
                const userToken = localStorage.getItem("token");

                if (!userToken) {
                    throw new Error("User Token is unavailable");
                }

                const response = await api.get("/tasks/userTasks", {
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
    }, [navigate]);

    const filteredTasks = tasks.filter((task) => {
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
        return matchesStatus && matchesPriority;
    });

    const handleOpenAddForm = () => {
        setCurrentTask(null);
        setIsModalOpen(true);
    };

    const handleOpenEditForm = (task) => {
        setCurrentTask(task);
        setIsModalOpen(true);
    };

    const handleSaveTask = async (payload) => {
        try {
            const userToken = localStorage.getItem("token");

            if (!userToken) {
                throw new Error("User Token is unavailable");
            }

            if (currentTask === null) {
                const response = await api.post("/tasks", payload, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });

                console.log("Created task:", response.data);

                setTasks((previousTasks) => [...previousTasks, response.data]);
            } else {
                const response = await api.patch(`/tasks/${currentTask._id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });

                console.log("Updated task:", response.data);

                setTasks((previousTasks) => previousTasks.map((task) => (task._id === currentTask._id ? response.data : task)));
            }

            setIsModalOpen(false);
            setCurrentTask(null);
        } catch (error) {
            console.error("Error saving task:", error.response?.data || error);

            alert("Failed to save task.");
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            const userToken = localStorage.getItem("token");

            if (!userToken) {
                throw new Error("User Token is unavailable");
            }

            const response = await api.delete(`/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            if (response.status === 204) {
                setTasks((previousTasks) => previousTasks.filter((task) => task._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete task:", error.response?.data || error);

            alert("Failed to delete task.");
        }
    };

    const clearFilters = () => {
        setStatusFilter("all");
        setPriorityFilter("all");
    };

    return (
        <>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>

                        <h3 className="text-slate-500 mt-1">Here are your current tasks:</h3>
                    </div>

                    <button onClick={handleOpenAddForm} className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition">
                        Add Task
                    </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-6 mb-6">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300">
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300">
                        <option value="all">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>

                    {(statusFilter !== "all" || priorityFilter !== "all") && (
                        <button onClick={clearFilters} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">
                            Clear all filters
                        </button>
                    )}
                </div>
                {tasks.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No tasks found.</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No filtered tasks found.</p>

                        <button onClick={clearFilters} className="mt-3 text-sm text-blue-600 hover:text-blue-800">
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredTasks.map((task) => (
                            <div key={task._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">{task.title}</h2>

                                        <p className="text-slate-500 mt-1">{task.description}</p>
                                    </div>

                                    <span className="px-3 py-1 text-sm rounded-full bg-slate-100 text-slate-700">{task.status}</span>
                                </div>

                                <p className="text-sm text-slate-500 mt-4">
                                    Due date:{" "}
                                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>

                                <div className="flex gap-2 mt-4">
                                    <span className={`px-3 py-1 text-sm rounded-full ${task.priority === "High" ? "bg-red-100 text-red-700" : task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{task.priority}</span>
                                </div>

                                <div className="flex gap-2 mt-5">
                                    <button onClick={() => handleOpenEditForm(task)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                                        Edit
                                    </button>

                                    <button onClick={() => handleDeleteTask(task._id)} className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCurrentTask(null);
                }}
                onSave={handleSaveTask}
                editingTask={currentTask}
            />
        </>
    );
}

export default Tasks;
