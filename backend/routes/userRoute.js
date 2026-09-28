const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.use(express.json());

router.post("/register", userController.register);

router.post("/login", userController.login);

module.exports = router;
