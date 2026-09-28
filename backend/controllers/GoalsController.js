const Goal = require("../models/Goals");

exports.getAllGoals = async (req, res) => {
    const goals = await Goal.find({});
    res.json(goals);
};

exports.getGoalbyId = async (req, res) => {
    const goal = await Goal.find({ _id: req.params.id });
    res.json(goal);
};

exports.addNewGoal = async (req, res) => {
    const newGoal = new Goal(req.body);
    await newGoal.save();
    res.json(newGoal);
};

exports.updateGoal = async (req, res) => {
    const { id } = req.params;
    const editedGoal = await Goal.findOneAndUpdate({ _id: id }, req.body, { new: true });
    res.json(editedGoal);
};

exports.deleteGoal = async (req, res) => {
    const { id } = req.params;
    await Goal.findOneAndDelete({ _id: id });
    res.status(204).json();
};