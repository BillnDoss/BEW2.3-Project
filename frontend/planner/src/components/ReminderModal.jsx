import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ReminderModal = ({ isOpen, onClose, onSave, editReminder = null }) => {
    const initialFormState = {
        title: "",
        description: "",
        remindAt: "",
        status: "Pending",
    };

    const statuses = ["Pending", "Completed"];

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isOpen) return;

        if (editReminder) {
            setFormData({
                title: editReminder.title || "",
                description: editReminder.description || "",
                remindAt: editReminder.remindAt ? new Date(editReminder.remindAt).toISOString().slice(0, 16) : "",
                status: editReminder.status || "Pending",
            });
        } else {
            setFormData(initialFormState);
        }

        setErrors({});
    }, [isOpen, editReminder]);

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
            newErrors.title = "Reminder title is required";
        }

        if (!formData.remindAt) {
            newErrors.remindAt = "Reminder date and time is required";
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
            remindAt: formData.remindAt,
            status: formData.status,
        };

        onSave(payload);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle className="border-bottom px-4 py-3">
                <div className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-0 fw-bold">{editReminder ? "Edit Reminder Details" : "Add New Reminder"}</h5>

                    <IconButton onClick={onClose} size="small" aria-label="Close">
                        <CloseIcon />
                    </IconButton>
                </div>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent className="p-4">
                    <div className="row g-3">
                        <div className="col-12">
                            <TextField fullWidth required label="Reminder Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Take medication" error={Boolean(errors.title)} helperText={errors.title} />
                        </div>
                        <div className="col-12">
                            <TextField fullWidth multiline rows={3} label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your reminder..." />
                        </div>
                        <div className="col-12">
                            <TextField
                                fullWidth
                                required
                                type="datetime-local"
                                label="Reminder Date & Time"
                                name="remindAt"
                                value={formData.remindAt}
                                onChange={handleChange}
                                error={Boolean(errors.remindAt)}
                                helperText={errors.remindAt}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                            />
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
                            {editReminder ? "Update Reminder" : "Create Reminder"}
                        </Button>
                    </div>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ReminderModal;
