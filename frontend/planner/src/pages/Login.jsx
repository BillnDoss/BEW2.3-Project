import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../assets/css/Login.css";
import api from "../utils/api";

function Login() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Redirects users to the products page if token exists in storage but needs to be inside a useEffect
    useEffect(() => {
        const userToken = localStorage.getItem("token");
        if (userToken !== null) navigate("/overview");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 💡 Add your login / authentication logic here
        console.log("Form submitted:", { name, email, password });
        try {
            // There is no need for the localhost URL and axios anymore because the api has the details
            const response = await api.post("/users/login", {
                name,
                email,
                password,
            });
            // Unable to immediately store data as token in storage because it is an object
            localStorage.setItem("token", response.data.token);
            navigate("/overview");
            console.log(response.data);
            alert("Succesfully Logged in!");
        } catch (error) {
            console.log("Login Error: ", error);
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
        </div>
    );
}

export default Login;
