const Task = require("../models/Tasks");

exports.getAllTasks = async (req, res) => {
    const tasks = await Task.find({});
    res.json(tasks);
};

exports.getTaskById = async (req, res) => {
    const task = await Task.find({ _id: req.params.id });
    res.json(task);
};

exports.addNewTask = async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const editedTask = await Task.findOneAndUpdate({ _id: id }, req.body, { new: true });
    res.json(editedTask);
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    await Task.findOneAndDelete({ _id: id });
    res.status(204).json();
};