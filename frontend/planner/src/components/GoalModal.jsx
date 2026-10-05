import { useState, useEffect } from "react";

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
            title: formData.title,
            description: formData.description,
            targetDate: formData.targetDate,
            progress: Number(formData.progress),
            status: formData.status,
        };

        console.log("Adding new goal:", payload);
        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">{editGoals ? "Edit Goal Details" : "Add New Goal"}</h2>

                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Goal Title *</label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Complete my first 10K"
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
                            placeholder="Describe your goal..."
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Target Date *</label>

                        <input
                            type="date"
                            name="targetDate"
                            value={formData.targetDate}
                            onChange={handleChange}
                            className={`w-full px-3.5 py-2 text-sm bg-white border ${errors.targetDate ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-slate-900"} rounded-xl focus:outline-none focus:ring-2`}
                        />

                        {errors.targetDate && <p className="text-xs text-red-500 mt-1">{errors.targetDate}</p>}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Progress</label>

                            <span className="text-xs font-semibold text-slate-500">{formData.progress}%</span>
                        </div>

                        <input type="range" name="progress" min="0" max="100" step="1" value={formData.progress} onChange={handleChange} className="w-full accent-slate-900" />

                        {errors.progress && <p className="text-xs text-red-500 mt-1">{errors.progress}</p>}
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
                            {editGoals ? "Update Goal" : "Create Goal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GoalModal;
