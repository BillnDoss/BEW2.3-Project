const express = require("express");
const router = express.Router();
const goalController = require("../controllers/GoalsController");
const auth = require("../middlewares/auth");

router.use(express.json());

router.get("/", auth.authenticate, goalController.getAllGoals);

router.get("/userGoals", auth.authenticate, goalController.getAllGoalsUserEdition);

router.get("/:id", auth.authenticate, goalController.getGoalbyId);

router.post("/", auth.authenticate, goalController.addNewGoal);

router.patch("/:id", auth.authenticate, goalController.updateGoal);

router.delete("/:id", auth.authenticate, goalController.deleteGoal);

module.exports = router;
