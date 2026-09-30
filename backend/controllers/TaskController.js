const Task = require("../models/Tasks");

exports.getAllTasks = async (req, res) => {
    const tasks = await Task.find({});
    res.json(tasks);
};
exports.getAllTasksUserEdition = async (req, res) => {
    const tasks = await Task.find({
        userId: req.user._id,
    });
    res.json(tasks);
};

exports.getTaskById = async (req, res) => {
    const task = await Task.find({
        _id: req.params.id,
        userId: req.user._id,
    });
    res.json(task);
};

exports.addNewTask = async (req, res) => {
    const newTask = new Task({
        ...req.body,
        userId: req.user._id,
    });
    await newTask.save();
    res.json(newTask);
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { userId, ...updates } = req.body;
    const editedTask = await Task.findOneAndUpdate({ _id: id, userId: req.user._id }, updates, { new: true });
    res.json(editedTask);
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    await Task.findOneAndDelete({ _id: id, userId: req.user._id });
    res.status(204).json();
};
