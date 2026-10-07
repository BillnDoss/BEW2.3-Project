import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TaskModal = ({ isOpen, onClose, onSave, editTask = null }) => {
    const defaultState = {
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        status: "Pending",
    };

    const priorities = ["Low", "Medium", "High"];
    const statuses = ["Pending", "In Progress", "Completed"];

    const [formData, setFormData] = useState(defaultState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isOpen) return;

        if (editTask) {
            setFormData({
                title: editTask.title || "",
                description: editTask.description || "",
                dueDate: editTask.dueDate ? new Date(editTask.dueDate).toISOString().split("T")[0] : "",
                priority: editTask.priority || "Medium",
                status: editTask.status || "Pending",
            });
        } else {
            setFormData(defaultState);
        }

        setErrors({});
    }, [isOpen, editTask]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((previous) => ({
                ...previous,
                [name]: "",
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Task title is required";
        }

        if (!formData.dueDate) {
            newErrors.dueDate = "Due date is required";
        }

        if (!formData.priority) {
            newErrors.priority = "Priority is required";
        }

        if (!formData.status) {
            newErrors.status = "Status is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const payload = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            dueDate: formData.dueDate,
            priority: formData.priority,
            status: formData.status,
        };

        onSave(payload);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle className="border-bottom px-4 py-3">
                <div className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-0 fw-bold">{editTask ? "Edit Task Details" : "Add New Task"}</h5>
                    <IconButton onClick={onClose} size="small" aria-label="Close">
                        <CloseIcon />
                    </IconButton>
                </div>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent className="p-4">
                    <div className="row g-3">
                        <div className="col-12">
                            <TextField fullWidth label="Task Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Finish project report" error={Boolean(errors.title)} helperText={errors.title} required />
                        </div>

                        <div className="col-12">
                            <TextField fullWidth multiline rows={3} label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your task..." />
                        </div>

                        <div className="col-12">
                            <TextField
                                fullWidth
                                type="date"
                                label="Due Date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                error={Boolean(errors.dueDate)}
                                helperText={errors.dueDate}
                                required
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                            />
                        </div>

                        <div className="col-md-6">
                            <FormControl fullWidth error={Boolean(errors.priority)}>
                                <InputLabel>Priority</InputLabel>

                                <Select name="priority" value={formData.priority} label="Priority" onChange={handleChange}>
                                    {priorities.map((priority) => (
                                        <MenuItem key={priority} value={priority}>
                                            {priority}
                                        </MenuItem>
                                    ))}
                                </Select>

                                {errors.priority && <div className="text-danger small mt-1">{errors.priority}</div>}
                            </FormControl>
                        </div>

                        <div className="col-md-6">
                            <FormControl fullWidth error={Boolean(errors.status)}>
                                <InputLabel>Status</InputLabel>

                                <Select name="status" value={formData.status} label="Status" onChange={handleChange}>
                                    {statuses.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </Select>

                                {errors.status && <div className="text-danger small mt-1">{errors.status}</div>}
                            </FormControl>
                        </div>
                    </div>
                </DialogContent>

                <DialogActions className="border-top px-4 py-3">
                    <div className="w-100 d-flex justify-content-end gap-2">
                        <Button type="button" variant="outlined" color="inherit" onClick={onClose}>
                            Cancel
                        </Button>

                        <Button type="submit" variant="contained">
                            {editTask ? "Update Task" : "Create Task"}
                        </Button>
                    </div>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TaskModal;
