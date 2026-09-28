const Reminder = require("../models/Reminders");

exports.getAllReminders = async (req, res) => {
    const reminders = await Reminder.find({});
    res.json(reminders);
};

exports.getReminderbyId = async (req, res) => {
    const reminder = await Reminder.find({ _id: req.params.id });
    res.json(reminder);
};

exports.addNewReminder = async (req, res) => {
    const newReminder = new Reminder(req.body);
    await newReminder.save();
    res.json(newReminder);
};

exports.updateReminder = async (req, res) => {
    const { id } = req.params;
    const editedReminder = await Reminder.findOneAndUpdate({ _id: id }, req.body, { new: true });
    res.json(editedReminder);
};

exports.deleteReminder = async (req, res) => {
    const { id } = req.params;
    await Reminder.findOneAndDelete({ _id: id });
    res.status(204).json();
};
