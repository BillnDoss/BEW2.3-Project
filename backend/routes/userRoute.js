const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { authenticate } = require("../middlewares/auth");

router.use(express.json());

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/:id", authenticate, userController.retrieveOneUser);

router.get("/", authenticate, userController.retrieveAllUsers);

module.exports = router;
