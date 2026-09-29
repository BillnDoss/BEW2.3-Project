import { NavLink, useNavigate } from "react-router";

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

                <div className="collapse navbar-collapse">
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
                                Calender
                            </NavLink>
                        </li>

                        {user?.role === "admin" && (
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/dashboard">
                                    Dashboard
                                </NavLink>
                            </li>
                        )}

                        <button className="btn" onClick={onLogout}>
                            Logout
                        </button>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
