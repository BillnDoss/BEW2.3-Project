import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../assets/css/Login.css";
import api from "../utils/api";
import corndog from "../assets/images/images.jpeg";

function Login() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();

    // Redirects users to the products page if token exists in storage but needs to be inside a useEffect
    useEffect(() => {
        const userToken = localStorage.getItem("token");
        if (!userToken) return;
        try {
            const payload = JSON.parse(atob(userToken.split(".")[1]));
            const expiredToken = payload.exp * 1000 < Date.now();
            if (expiredToken) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");

                return;
            }
            navigate("/");
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError("");

        try {
            const response = await api.post("/users/login", {
                name,
                email,
                password,
            });

            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            navigate("/overview");
            alert("Successfully Logged in!");
        } catch (error) {
            console.log("Login Error:", error);
            setLoginError("Incorrect username, email, or password.");
        }
    };

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit} className="login-card">
                <h2>Welcome Back</h2>

                <div className="form-group">
                    <label htmlFor="name">Username</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="name" required />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>

                <button type="submit" className="login-btn">
                    Sign In
                </button>
                <button type="button" className="register-btn" style={{ marginTop: "12px" }} onClick={() => navigate("/register")}>
                    No account? Sign up here!
                </button>
            </form>

            {loginError && (
                <div className="modal-overlay">
                    <div className="error-popup">
                        <img src={corndog} alt="Login failed" />

                        <h3>Login Failed</h3>

                        <p>Incorrect username, email, or password.</p>

                        <button onClick={() => setLoginError("")}>Try Again</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
