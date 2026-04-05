const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { registerValidator, loginValidator } = require("./auth.validator");

router.post("/register", registerValidator, authController.register);

router.post("/login", loginValidator, authController.login);

router.get("/me", authenticate, authController.getMe);

module.exports = router;
