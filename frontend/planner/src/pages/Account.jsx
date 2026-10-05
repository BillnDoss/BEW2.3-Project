import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";

function Account() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [changePassword, setchangePassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savePassword, setSavePassword] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/");
                    return;
                }

                const response = await api.get("/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                setFormData({
                    name: response.data.name || "",
                    email: response.data.email || "",
                });
            } catch (error) {
                console.error("Failed to fetch user:", error.response?.data || error);

                localStorage.removeItem("token");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setProfileError("");
    };

    const handleEdit = () => {
        setFormData({
            name: user.name || "",
            email: user.email || "",
        });

        setProfileError("");
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({
            name: user.name || "",
            email: user.email || "",
        });

        setProfileError("");
        setIsEditing(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        setProfileError("");

        if (!formData.name.trim()) {
            setProfileError("Name is required.");
            return;
        }

        if (!formData.email.trim()) {
            setProfileError("Email is required.");
            return;
        }

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            const response = await api.patch(
                "/users/:id",
                {
                    name: formData.name,
                    email: formData.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            setUser(response.data);

            setFormData({
                name: response.data.name || "",
                email: response.data.email || "",
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update user:", error.response?.data || error);

            setProfileError(error.response?.data?.error || "Failed to update account.");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswordData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setPasswordError("");
    };

    const handlePasswordCancel = () => {
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setPasswordError("");
        setchangePassword(false);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setPasswordError("");

        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordError("Please fill in all password fields.");
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters.");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        if (passwordData.currentPassword === passwordData.newPassword) {
            setPasswordError("New password must be different from your current password.");
            return;
        }

        try {
            setSavePassword(true);

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            await api.patch(
                "/users/:id/password",
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            alert("Password changed successfully.");

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setchangePassword(false);
        } catch (error) {
            console.error("Failed to change password:", error.response?.data || error);

            setPasswordError(error.response?.data?.error || "Failed to change password.");
        } finally {
            setSavePassword(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Loading account...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mt-4">
                <p>Unable to load account.</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1>Account</h1>

            {!isEditing ? (
                <div className="card p-4 mt-3">
                    <h2>Profile</h2>

                    <div className="mt-3">
                        <p>
                            <strong>Name:</strong> {user.name}
                        </p>

                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>

                        <p>
                            <strong>Role:</strong> {user.role}
                        </p>
                    </div>

                    <button type="button" onClick={handleEdit} className="btn btn-primary mt-3">
                        Edit Account
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSave} className="card p-4 mt-3">
                    <h2>Edit Profile</h2>

                    {profileError && <div className="alert alert-danger mt-3">{profileError}</div>}

                    <div className="mb-3 mt-3">
                        <label htmlFor="name" className="form-label">
                            Name
                        </label>

                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>

                        <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">
                            Role
                        </label>

                        <input id="role" type="text" value={user.role} className="form-control" disabled />
                    </div>

                    <div className="d-flex gap-2">
                        <button type="button" onClick={handleCancel} className="btn btn-secondary" disabled={saving}>
                            Cancel
                        </button>

                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            )}

            {!changePassword ? (
                <div className="card p-4 mt-3">
                    <h2>Security</h2>

                    <p className="mt-3">
                        <strong>Password:</strong> ••••••••
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            setPasswordError("");
                            setchangePassword(true);
                        }}
                        className="btn btn-primary mt-3"
                    >
                        Change Password
                    </button>
                </div>
            ) : (
                <form onSubmit={handleChangePassword} className="card p-4 mt-3">
                    <h2>Change Password</h2>

                    {passwordError && <div className="alert alert-danger mt-3">{passwordError}</div>}

                    <div className="mb-3 mt-3">
                        <label htmlFor="currentPassword" className="form-label">
                            Current Password
                        </label>

                        <input id="currentPassword" type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">
                            New Password
                        </label>

                        <input id="newPassword" type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm New Password
                        </label>

                        <input id="confirmPassword" type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="form-control" required />
                    </div>

                    <div className="d-flex gap-2">
                        <button type="button" onClick={handlePasswordCancel} className="btn btn-secondary" disabled={savePassword}>
                            Cancel
                        </button>

                        <button type="submit" className="btn btn-primary" disabled={savePassword}>
                            {savePassword ? "Changing..." : "Change Password"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default Account;
