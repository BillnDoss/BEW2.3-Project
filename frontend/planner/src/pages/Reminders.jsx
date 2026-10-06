import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import api from "../utils/api";
import ReminderModal from "../components/ReminderModal";

function Reminders() {
    const [reminders, setReminders] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReminder, setCurrentReminder] = useState(null);

    useEffect(() => {
        const getAllReminders = async (userToken) => {
            try {
                const userToken = localStorage.getItem("token");
                console.log(userToken);
                if (userToken == null) throw new Error("User Token is unavailable");

                const response = await api.get("/reminders/userReminders", {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setReminders(response.data);
            } catch (error) {
                console.log(error);
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/");
            }
        };
        getAllReminders();
    }, []);

    // Gets goal from the button inside Goals.jsx
    // useEffect(() => {
    //     if (location.state?.goal) {
    //         console.log("Goal received:", location.state.goal);
    //     }
    // }, [location.state]);

    useEffect(() => {
        console.log(reminders);
    }, [reminders]);

    const handleOpenAddForm = () => {
        setCurrentReminder(null);
        setIsModalOpen(true);
    };
    const handleOpenEditForm = (reminder) => {
        setCurrentReminder(reminder);
        setIsModalOpen(true);
    };

    const handleSaveReminder = async (payload) => {
        try {
            const userToken = localStorage.getItem("token");

            if (!userToken) {
                throw new Error("User Token is unavailable");
            }

            if (currentReminder === null) {
                const response = await api.post("/reminders", payload, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });

                console.log("Created reminder:", response.data);

                setReminders((previousReminders) => [...previousReminders, response.data]);
            } else {
                const response = await api.patch(`/reminders/${currentReminder._id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });

                console.log("Updated reminder:", response.data);

                setReminders((previousReminders) => previousReminders.map((reminder) => (reminder._id === currentReminder._id ? response.data : reminder)));
            }

            setIsModalOpen(false);
            setCurrentReminder(null);
        } catch (error) {
            console.error("Error saving reminder:", error.response?.data || error);

            alert("Failed to save reminder.");
        }
    };

    const handleDeleteReminder = async (id) => {
        try {
            const userToken = localStorage.getItem("token");

            if (!userToken) {
                throw new Error("User Token is unavailable");
            }

            const response = await api.delete(`/reminders/${id}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            if (response.status === 204) {
                setReminders((previousReminders) => previousReminders.filter((reminder) => reminder._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete reminder:", error.response?.data || error);

            alert("Failed to delete reminder.");
        }
    };

    return (
        <>
            <h1>Reminders</h1>
            <h3>Here are your currently set Reminders:</h3>
            <div className="flex items-center gap-3 mt-3">
                <button onClick={handleOpenAddForm} className="bg-slate-900 text-white px-4 py-2 rounded-xl">
                    Add Reminder
                </button>
            </div>
            {/* Only renders the goal doesnt do anything in backend, doesnt stay permanently either */}
            {/* {location.state?.goal && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                    <h2 className="text-lg font-semibold text-blue-900">Goal selected for reminder</h2>

                    <h3 className="text-blue-800 mt-2">{location.state.goal.title}</h3>

                    <p className="text-blue-700 mt-1">{location.state.goal.description}</p>

                    <p className="text-sm text-blue-600 mt-2">
                        Target date:{" "}
                        {new Date(location.state.goal.targetDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            )} */}
            {reminders.length === 0 ? (
                <p>No reminders found. </p>
            ) : (
                reminders.map((reminder) => (
                    <div key={reminder._id}>
                        <h2>{reminder.title}</h2>
                        <p>{reminder.description}</p>
                        <p>
                            {new Date(reminder.remindAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>

                        {/* Add a badge with button colour depending on status */}
                        <p>{reminder.status}</p>
                        {/* Edit and Delete */}
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => handleOpenEditForm(reminder)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50">
                                Edit
                            </button>

                            <button onClick={() => handleDeleteReminder(reminder._id)} className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50">
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
            <ReminderModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCurrentReminder(null);
                }}
                onSave={handleSaveReminder}
                editReminder={currentReminder}
            />
        </>
    );
}

export default Reminders;
