import { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Slider, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const GoalModal = ({ isOpen, onClose, onSave, editGoals = null }) => {
    const defaultState = {
        title: "",
        description: "",
        targetDate: "",
        progress: "0",
        status: "Active",
    };

    const statuses = ["Active", "Completed"];

    const [formData, setFormData] = useState(defaultState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isOpen) return;

        if (editGoals) {
            setFormData({
                title: editGoals.title || "",
                description: editGoals.description || "",
                targetDate: editGoals.targetDate ? new Date(editGoals.targetDate).toISOString().split("T")[0] : "",
                progress: editGoals.progress !== undefined && editGoals.progress !== null ? editGoals.progress.toString() : "0",
                status: editGoals.status || "Active",
            });
        } else {
            setFormData(defaultState);
        }

        setErrors({});
    }, [isOpen, editGoals]);

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

    const handleProgressChange = (_, value) => {
        setFormData((previous) => ({
            ...previous,
            progress: value.toString(),
        }));

        if (errors.progress) {
            setErrors((previous) => ({
                ...previous,
                progress: "",
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Goal title is required";
        }

        if (!formData.targetDate) {
            newErrors.targetDate = "Target date is required";
        }

        if (formData.progress === "" || isNaN(formData.progress) || Number(formData.progress) < 0 || Number(formData.progress) > 100) {
            newErrors.progress = "Progress must be between 0 and 100";
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
            targetDate: formData.targetDate,
            progress: Number(formData.progress),
            status: formData.status,
        };

        onSave(payload);
    };

    return (
        <Modal open={isOpen} onClose={onClose} aria-labelledby="goal-modal-title">
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: {
                        xs: "calc(100% - 32px)",
                        sm: 500,
                    },
                    maxHeight: "90vh",
                    overflowY: "auto",
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    boxShadow: 24,
                    outline: "none",
                }}
            >
                <Box
                    className="d-flex justify-content-between align-items-center px-4 py-3"
                    sx={{
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Box>
                        <Typography id="goal-modal-title" variant="h6" fontWeight={700}>
                            {editGoals ? "Edit Goal Details" : "Add New Goal"}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {editGoals ? "Update your goal information." : "Set a new goal and track your progress."}
                        </Typography>
                    </Box>

                    <IconButton onClick={onClose} aria-label="close" size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box component="form" onSubmit={handleSubmit} className="p-4">
                    <TextField fullWidth label="Goal Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Complete my first 10K" required error={Boolean(errors.title)} helperText={errors.title} margin="normal" />
                    <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your goal..." multiline rows={3} margin="normal" />

                    <TextField
                        fullWidth
                        label="Target Date"
                        name="targetDate"
                        type="date"
                        value={formData.targetDate}
                        onChange={handleChange}
                        required
                        error={Boolean(errors.targetDate)}
                        helperText={errors.targetDate}
                        margin="normal"
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />

                    <Box sx={{ mt: 3 }}>
                        <Box className="d-flex justify-content-between align-items-center">
                            <Typography variant="body2" fontWeight={600}>
                                Progress
                            </Typography>

                            <Typography variant="body2" fontWeight={700} color="primary">
                                {formData.progress}%
                            </Typography>
                        </Box>

                        <Slider value={Number(formData.progress)} onChange={handleProgressChange} min={0} max={100} step={1} valueLabelDisplay="auto" sx={{ mt: 1 }} />

                        {errors.progress && (
                            <Typography variant="caption" color="error">
                                {errors.progress}
                            </Typography>
                        )}
                    </Box>

                    <FormControl fullWidth margin="normal" error={Boolean(errors.status)}>
                        <InputLabel>Status</InputLabel>

                        <Select name="status" value={formData.status} label="Status" onChange={handleChange}>
                            {statuses.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </Select>

                        {errors.status && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                {errors.status}
                            </Typography>
                        )}
                    </FormControl>

                    <Divider className="my-4" />

                    <Box className="d-flex justify-content-end gap-2">
                        <Button type="button" variant="outlined" color="inherit" onClick={onClose}>
                            Cancel
                        </Button>

                        <Button type="submit" variant="contained">
                            {editGoals ? "Update Goal" : "Create Goal"}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default GoalModal;
