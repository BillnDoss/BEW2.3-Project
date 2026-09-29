import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import api from "../utils/api";

function Calender() {
    const navigate = useNavigate();
    return (
        <>
            <h1>Calender</h1>

            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar />
            </LocalizationProvider>
                */}
        </> 
    );
}

export default Calender;
