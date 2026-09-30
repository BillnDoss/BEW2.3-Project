import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";

function Reminders() {
    const [reminders, setReminders] = useState([]);
    const navigate = useNavigate();

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
                navigate("/");
            }
        };
        getAllReminders();
    }, []);

    useEffect(() => {
        console.log(reminders);
    }, [reminders]);
    return (
        <>
            <h1>Reminders</h1>
            <h3>Here are your currently set Reminders:</h3>
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
                    </div>
                ))
            )}
        </>
    );
}

export default Reminders;
