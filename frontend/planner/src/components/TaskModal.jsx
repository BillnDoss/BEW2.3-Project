import { useState, useEffect } from "react";

const TaskModal = ({ isOpen, onClose, onSave, editTask = null }) => {
    const defaultState = {
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        status: "Active",
    };

    const priorities = ["Low", "Medium", "High"];
    const statuses = ["Active", "Completed"];

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
                status: editTask.status || "Active",
            });
        } else {
            setFormData(defaultState);
        }

        setErrors({});
    }, [isOpen, editTask]);

    if (!isOpen) {
        return null;
    }

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
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate,
            priority: formData.priority,
            status: formData.status,
        };
        console.log("Adding new task:", payload);
        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">{editTask ? "Edit Task Details" : "Add New Task"}</h2>

                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Task Title *</label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Finish project report"
                            className={`w-full px-3.5 py-2 text-sm bg-white border ${errors.title ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-slate-900"} rounded-xl focus:outline-none focus:ring-2`}
                        />

                        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Description</label>

                        <textarea
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your task..."
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Due Date *</label>

                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className={`w-full px-3.5 py-2 text-sm bg-white border ${errors.dueDate ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-slate-900"} rounded-xl focus:outline-none focus:ring-2`}
                        />

                        {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Priority</label>

                        <select name="priority" value={formData.priority} onChange={handleChange} className={`w-full px-3.5 py-2 text-sm bg-white border ${errors.priority ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-slate-900"} rounded-xl focus:outline-none focus:ring-2`}>
                            {priorities.map((priority) => (
                                <option key={priority} value={priority}>
                                    {priority}
                                </option>
                            ))}
                        </select>

                        {errors.priority && <p className="text-xs text-red-500 mt-1">{errors.priority}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Status</label>

                        <select name="status" value={formData.status} onChange={handleChange} className={`w-full px-3.5 py-2 text-sm bg-white border ${errors.status ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-slate-900"} rounded-xl focus:outline-none focus:ring-2`}>
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>

                        {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status}</p>}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>

                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm">
                            {editTask ? "Update Task" : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
