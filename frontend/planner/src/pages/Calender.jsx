import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickerDay } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import Chip from "@mui/material/Chip";
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
                localStorage.removeItem("role");
                navigate("/");
            }
        };

        getCalendarData();
    }, [navigate]);

    const selectedTasks = tasks.filter((task) => dayjs(task.dueDate).isSame(selectedDate, "day"));
    const selectedGoals = goals.filter((goal) => dayjs(goal.targetDate).isSame(selectedDate, "day"));
    const selectedReminders = reminders.filter((reminder) => dayjs(reminder.remindAt).isSame(selectedDate, "day"));
    const hasEvents = selectedTasks.length > 0 || selectedGoals.length > 0 || selectedReminders.length > 0;

    const priorityColor = (priority) => {
        if (priority === "Low") return "success";
        if (priority === "Medium") return "warning";
        if (priority === "High") return "error";
        return "default";
    };

    const statusColor = (status) => {
        if (status === "In Progress") return "info";
        if (status === "Completed") return "success";
        if (status === "Active") return "primary";
        return "default";
    };

    return (
        <div className="container py-4" style={{ maxWidth: "900px" }}>
            <div className="mb-4">
                <h2 className="fw-bold mb-1">Calendar</h2>
                <p className="text-muted mb-0">View your tasks, goals and reminders.</p>
            </div>
            <div className="border rounded-3 bg-white p-3 mb-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        value={selectedDate}
                        onChange={(newDate) => setSelectedDate(newDate)}
                        sx={{
                            width: "100%",
                            maxWidth: "420px",
                            margin: "0 auto",
                            "& .MuiDayCalendar-weekDayLabel": {
                                color: "#6c757d",
                                fontWeight: 600,
                            },
                            "& .MuiPickersDay-root": {
                                borderRadius: "8px",
                            },
                            "& .Mui-selected": {
                                backgroundColor: "#0d6efd !important",
                            },
                        }}
                        slots={{
                            day: (props) => {
                                const dayTasks = tasks.filter((task) => dayjs(task.dueDate).isSame(props.day, "day"));
                                const dayGoals = goals.filter((goal) => dayjs(goal.targetDate).isSame(props.day, "day"));
                                const dayReminders = reminders.filter((reminder) => dayjs(reminder.remindAt).isSame(props.day, "day"));
                                return (
                                    <div
                                        style={{
                                            position: "relative",
                                            display: "inline-flex",
                                        }}
                                    >
                                        <PickerDay {...props} />

                                        {(dayTasks.length > 0 || dayGoals.length > 0 || dayReminders.length > 0) && (
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
                                                {dayTasks.length > 0 && <span style={{ fontSize: "10px", color: "#0d6efd" }}>T</span>}
                                                {dayGoals.length > 0 && <span style={{ fontSize: "10px", color: "#198754" }}>G</span>}
                                                {dayReminders.length > 0 && <span style={{ fontSize: "10px", color: "#ffc107" }}>R</span>}
                                            </div>
                                        )}
                                    </div>
                                );
                            },
                        }}
                    />
                </LocalizationProvider>
                <div className="d-flex justify-content-center gap-4 mt-2">
                    <small className="text-muted">
                        <span className="text-primary">T</span> Tasks
                    </small>
                    <small className="text-muted">
                        <span className="text-success">G</span> Goals
                    </small>
                    <small className="text-muted">
                        <span className="text-warning">R</span> Reminders
                    </small>
                </div>
            </div>
            <div className="mb-4">
                <h4 className="fw-bold mb-1">{selectedDate.format("dddd, MMMM D")}</h4>
                <p className="text-muted mb-0">{selectedDate.format("YYYY")}</p>
            </div>

            {selectedTasks.length > 0 && (
                <section className="mb-4">
                    <h6 className="text-primary fw-bold mb-3">Tasks</h6>

                    {selectedTasks.map((task) => (
                        <div key={task._id} className="border-start border-primary border-3 ps-3 mb-3">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="fw-semibold mb-1">{task.title}</h6>
                                    {task.description && <p className="text-muted small mb-1">{task.description}</p>}
                                    <Chip label={task.priority} color={priorityColor(task.priority)} size="small" />
                                </div>
                                <Chip label={task.status} color={statusColor(task.status)} size="small" />
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {selectedGoals.length > 0 && (
                <section className="mb-4">
                    <h6 className="text-success fw-bold mb-3">Goals</h6>

                    {selectedGoals.map((goal) => (
                        <div key={goal._id} className="border-start border-success border-3 ps-3 mb-3">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="fw-semibold mb-1">{goal.title}</h6>
                                    {goal.description && <p className="text-muted small mb-1">{goal.description}</p>}
                                </div>
                                <span className="badge bg-light text-dark border">{goal.status}</span>
                            </div>
                            <div className="mt-2" style={{ maxWidth: "300px" }}>
                                <div className="d-flex justify-content-between">
                                    <small className="text-muted">Progress</small>

                                    <small className="fw-semibold">{goal.progress}%</small>
                                </div>
                                <div className="progress mt-1" style={{ height: "5px" }}>
                                    <div
                                        className="progress-bar bg-success"
                                        style={{
                                            width: `${goal.progress}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {selectedReminders.length > 0 && (
                <section className="mb-4">
                    <h6 className="text-warning fw-bold mb-3">Reminders</h6>

                    {selectedReminders.map((reminder) => (
                        <div key={reminder._id} className="border-start border-warning border-3 ps-3 mb-3">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="fw-semibold mb-1">{reminder.title}</h6>

                                    {reminder.description && <p className="text-muted small mb-1">{reminder.description}</p>}

                                    <small className="text-muted">{dayjs(reminder.remindAt).format("h:mm A")}</small>
                                </div>

                                <span className="badge bg-light text-dark border">{reminder.status}</span>
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {!hasEvents && (
                <div className="text-center border rounded-3 py-5">
                    <h6 className="fw-semibold">No Data Found</h6>
                </div>
            )}
        </div>
    );
}

export default Calendar;
