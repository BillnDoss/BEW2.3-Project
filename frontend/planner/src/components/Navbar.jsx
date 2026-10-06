import { NavLink, useNavigate } from "react-router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Navbar({ user }) {
    const navigate = useNavigate();

    const onLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-danger">
            <div className="container-fluid">
                <NavLink className={({ isActive }) => (isActive ? "navbar-brand active" : "navbar-brand")} to="/overview">
                    DailyFlow
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/overview">
                                Home/Overview
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/tasks">
                                Tasks
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/goals">
                                Goals
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/reminders">
                                Reminders
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/calender">
                                Calendar
                            </NavLink>
                        </li>

                        {user?.role === "admin" && (
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/dashboard">
                                    Dashboard
                                </NavLink>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/account">
                            <AccountCircleIcon />
                                Account
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <button className="btn nav-link" onClick={onLogout}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
