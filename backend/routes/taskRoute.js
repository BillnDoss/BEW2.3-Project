const express = require("express");
const router = express.Router();
const taskController = require("../controllers/TaskController");
const auth = require("../middlewares/auth");

router.use(express.json());

router.get("/", auth.authenticate, taskController.getAllTasks);

router.get("/:id", auth.authenticate, taskController.getTaskById);

router.post("/", auth.authenticate, taskController.addNewTask);

router.patch("/:id", auth.authenticate, taskController.updateTask);

router.delete("/:id", auth.authenticate, taskController.deleteTask);

module.exports = router;