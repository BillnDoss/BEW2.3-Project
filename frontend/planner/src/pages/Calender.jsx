import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickerDay } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import api from "../utils/api";

function Calendar() {
    const [tasks, setTasks] = useState([]);
    const [goals, setGoals] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const navigate = useNavigate();

    useEffect(() => {
        const getCalendarData = async () => {
            try {
                const userToken = localStorage.getItem("token");

                if (!userToken) {
                    throw new Error("User Token is unavailable");
                }

                const headers = {
                    Authorization: `Bearer ${userToken}`,
                };

                const [tasksResponse, goalsResponse, remindersResponse] = await Promise.all([api.get("/tasks/userTasks", { headers }), api.get("/goals/userGoals", { headers }), api.get("/reminders/userReminders", { headers })]);

                setTasks(tasksResponse.data);
                setGoals(goalsResponse.data);
                setReminders(remindersResponse.data);
            } catch (error) {
                console.error("Failed to load calendar data:", error);

                localStorage.removeItem("token");
                navigate("/");
            }
        };

        getCalendarData();
    }, [navigate]);

    const selectedTasks = tasks.filter((task) => dayjs(task.dueDate).isSame(selectedDate, "day"));
    const selectedGoals = goals.filter((goal) => dayjs(goal.targetDate).isSame(selectedDate, "day"));
    const selectedReminders = reminders.filter((reminder) => dayjs(reminder.remindAt).isSame(selectedDate, "day"));

    return (
        <>
            <h1>Calendar</h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    value={selectedDate}
                    onChange={(newDate) => {
                        setSelectedDate(newDate);
                    }}
                    slots={{
                        day: (props) => {
                            const dayTasks = tasks.filter((task) => dayjs(task.dueDate).isSame(props.day, "day"));
                            const dayGoals = goals.filter((goal) => dayjs(goal.targetDate).isSame(props.day, "day"));
                            const dayReminders = reminders.filter((reminder) => dayjs(reminder.remindAt).isSame(props.day, "day"));
                            const hasEvents = dayTasks.length > 0 || dayGoals.length > 0 || dayReminders.length > 0;
                            return (
                                <div
                                    style={{
                                        position: "relative",
                                        display: "inline-flex",
                                    }}
                                >
                                    <PickerDay {...props} />

                                    {hasEvents && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: 3,
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                display: "flex",
                                                gap: "2px",
                                                pointerEvents: "none",
                                            }}
                                        >
                                            {/* May change these to a different way of rendering next time */}

                                            {/* Blue for Tasks */}
                                            {dayTasks.length > 0 && (
                                                <span
                                                    style={{
                                                        width: 5,
                                                        height: 5,
                                                        borderRadius: "50%",
                                                        backgroundColor: "#2563eb",
                                                    }}
                                                />
                                            )}

                                            {/* Green for goals */}
                                            {dayGoals.length > 0 && (
                                                <span
                                                    style={{
                                                        width: 5,
                                                        height: 5,
                                                        borderRadius: "50%",
                                                        backgroundColor: "#16a34a",
                                                    }}
                                                />
                                            )}

                                            {/* Yellow for reminders */}
                                            {dayReminders.length > 0 && (
                                                <span
                                                    style={{
                                                        width: 5,
                                                        height: 5,
                                                        borderRadius: "50%",
                                                        backgroundColor: "#eab308",
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        },
                    }}
                />
            </LocalizationProvider>

            <div className="mt-6">
                <h2>{selectedDate.format("MMMM D, YYYY")}</h2>

                {selectedTasks.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-blue-600">Tasks</h3>

                        {selectedTasks.map((task) => (
                            <div key={task._id} className="border rounded-xl p-4 mt-2">
                                <h4>{task.title}</h4>
                                {task.description && <p>{task.description}</p>}
                                <p>Priority: {task.priority}</p>
                                <p>Status: {task.status}</p>
                            </div>
                        ))}
                    </div>
                )}

                {selectedGoals.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-green-600">Goals</h3>

                        {selectedGoals.map((goal) => (
                            <div key={goal._id} className="border rounded-xl p-4 mt-2">
                                <h4>{goal.title}</h4>
                                {goal.description && <p>{goal.description}</p>}
                                <p>Progress: {goal.progress}%</p>
                                <p>Status: {goal.status}</p>
                            </div>
                        ))}
                    </div>
                )}

                {selectedReminders.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-yellow-600">Reminders</h3>

                        {selectedReminders.map((reminder) => (
                            <div key={reminder._id} className="border rounded-xl p-4 mt-2">
                                <h4>{reminder.title}</h4>
                                {reminder.description && <p>{reminder.description}</p>}
                                <p>Time: {dayjs(reminder.remindAt).format("h:mm A")}</p>
                                <p>Status: {reminder.status}</p>
                            </div>
                        ))}
                    </div>
                )}
                {selectedTasks.length === 0 && selectedGoals.length === 0 && selectedReminders.length === 0 && <p className="mt-4">Nothing here!</p>}
            </div>
        </>
    );
}

export default Calendar;
