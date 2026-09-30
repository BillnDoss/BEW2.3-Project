const Goal = require("../models/Goals");

exports.getAllGoals = async (req, res) => {
    const goals = await Goal.find({
    });
    res.json(goals);
};
exports.getAllGoalsUserEdition = async (req, res) => {
    const goals = await Goal.find({
        userId: req.user._id,
    });
    res.json(goals);
};

exports.getGoalbyId = async (req, res) => {
    const goal = await Goal.find({ _id: req.params.id, userId: req.user._id });
    res.json(goal);
};

exports.addNewGoal = async (req, res) => {
    const newGoal = new Goal({ ...req.body, userId: req.user._id });
    await newGoal.save();
    res.json(newGoal);
};

exports.updateGoal = async (req, res) => {
    const { id } = req.params;
    const { userId, ...updates } = req.body;
    const editedGoal = await Goal.findOneAndUpdate({ _id: id, userId: req.user._id }, updates, { new: true });
    res.json(editedGoal);
};

exports.deleteGoal = async (req, res) => {
    const { id } = req.params;
    await Goal.findOneAndDelete({ _id: id, userId: req.user._id });
    res.status(204).json();
};
