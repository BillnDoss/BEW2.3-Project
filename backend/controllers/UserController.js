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
        const token = jwt.sign({ userEmail: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ token });
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

