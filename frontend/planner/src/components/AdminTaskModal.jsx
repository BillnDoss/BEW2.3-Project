import { useState } from "react";
import api from "../utils/api";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

function AddTaskModal({ open, onClose, users, onTaskAdded }) {
    const [newAdminTask, setNewAdminTask] = useState({
        userId: "",
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        dueDate: "",
    });

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

            onTaskAdded(response.data);
            // This is the default form structure when it resets
            setNewAdminTask({
                userId: "",
                title: "",
                description: "",
                priority: "Medium",
                status: "Pending",
                dueDate: "",
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Task</DialogTitle>

            <DialogContent>
                <form onSubmit={addAdminTask} id="add-task-form">
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

                    <br />

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

                    <br />

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

                    <br />

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

                    <br />

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

                    <br />

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
                </form>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>

                <Button type="submit" form="add-task-form" variant="contained">
                    Add Task
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddTaskModal;
