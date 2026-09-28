import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
// import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/Overview";
import Calender from "./pages/Calender";
import Reminders from "./pages/Reminders";
import Tasks from "./pages/Tasks";
import Goals from "./pages/Goals";
import Account from "./pages/Account";
import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/calender" element={<Calender />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route
                    path="/goals"
                    element={
                        <>
                            <Navbar />
                            <Goals />
                        </>
                    }
                />
                <Route
                    path="/account"
                    element={
                        <>
                            <Navbar />
                            <Account />
                        </>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
