import { useState } from "react";
import { useNavigate } from "react-router";
import "../assets/css/Login.css";
import meme from "../assets/images/images1.png"
import api from "../utils/api";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registrationError, setRegistrationError] = useState("")
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRegistrationError("")
        console.log("Form submitted:", { name, email, password });
        try {
            const response = await api.post("/users/register", {
                name,
                email,
                password,
            });
            console.log("Registration successful: ", response.data);
            alert("Registration Successful!");
            setName("")
            setEmail("")
            setPassword("")
        } catch (error) {
            setRegistrationError("Registration Failed, User already exists or Insufficient Details!");
            console.log("Registration Error: ", error);
        }
    };

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit} className="login-card">
                <h2>Sign Up</h2>

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
                    Register now
                </button>

                <button type="button" className="register-btn" style={{ marginTop: "12px" }} onClick={() => navigate("/")}>
                    Already have an account? Sign in here!
                </button>
            </form>
            {registrationError && (
                <div className="modal-overlay">
                    <div className="error-popup">
                        <img src={meme} alt="Registration failed" />

                        <h3>Registration Failed</h3>

                        <p>{registrationError}</p>

                        <button
                            type="button"
                            onClick={() => setRegistrationError("")}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Register;
