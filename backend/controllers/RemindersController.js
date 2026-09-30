const Reminder = require("../models/Reminders");

exports.getAllReminders = async (req, res) => {
    const reminders = await Reminder.find({
    });
    res.json(reminders);
};
exports.getAllRemindersUserEdition = async (req, res) => {
    const reminders = await Reminder.find({
        userId: req.user._id,
    });
    res.json(reminders);
};

exports.getReminderbyId = async (req, res) => {
    const reminder = await Reminder.find({
        _id: req.params.id,
        userId: req.user._id,
    });
    res.json(reminder);
};

exports.addNewReminder = async (req, res) => {
    const newReminder = new Reminder({
        ...req.body,
        userId: req.user._id,
    });
    await newReminder.save();
    res.json(newReminder);
};

exports.updateReminder = async (req, res) => {
    const { id } = req.params;
    const { userId, ...updates } = req.body;
    const editedReminder = await Reminder.findOneAndUpdate({ _id: id, userId: req.user._id }, updates, { new: true });
    res.json(editedReminder);
};

exports.deleteReminder = async (req, res) => {
    const { id } = req.params;
    await Reminder.findOneAndDelete({ _id: id, userId: req.user._id });
    res.status(204).json();
};
