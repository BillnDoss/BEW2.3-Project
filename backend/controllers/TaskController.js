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
    try {
        const newTask = new Task({
            userId: req.user._id,
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            priority: req.body.priority,
            status: req.body.status,
        });

        await newTask.save();

        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error creating task:", error);

        res.status(500).json({
            message: "Failed to create task",
            error: error.message,
        });
    }
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
