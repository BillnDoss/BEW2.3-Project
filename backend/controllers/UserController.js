const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user || !user.comparePassword(req.body.password)) {
            throw new Error("Invalid username or password");
        }

        const token = jwt.sign(
            {
                userEmail: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            },
        );

        res.json({
            token,
            role: user.role,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.retrieveOneUser = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

exports.retrieveAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.json(users);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

exports.updateCurrentUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        if (name !== undefined) {
            user.name = name;
        }

        if (email !== undefined) {
            user.email = email;
        }

        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: "Current password and new password are required",
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                error: "New password must be at least 8 characters",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        const passwordMatches = await user.comparePassword(currentPassword);

        if (!passwordMatches) {
            return res.status(401).json({
                error: "Current password is incorrect",
            });
        }

        user.password = newPassword;

        await user.save();

        res.json({
            message: "Password changed successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};
