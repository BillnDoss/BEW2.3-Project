const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/RemindersController");
const auth = require("../middlewares/auth");

router.use(express.json());

router.get("/", auth.authenticate, reminderController.getAllReminders);

router.get("/userReminders", auth.authenticate, reminderController.getAllRemindersUserEdition);

router.get("/:id", auth.authenticate, reminderController.getReminderbyId);

router.post("/", auth.authenticate, reminderController.addNewReminder);

router.patch("/:id", auth.authenticate, reminderController.updateReminder);

router.delete("/:id", auth.authenticate, reminderController.deleteReminder);

module.exports = router;
