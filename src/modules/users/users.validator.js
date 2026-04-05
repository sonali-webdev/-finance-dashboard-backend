const { body, param } = require("express-validator");

const updateRoleValidator = [
  param("id").notEmpty().withMessage("User ID is required"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["VIEWER", "ANALYST", "ADMIN"])
    .withMessage("Role must be VIEWER, ANALYST, or ADMIN"),
];

const updateStatusValidator = [
  param("id").notEmpty().withMessage("User ID is required"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be ACTIVE or INACTIVE"),
];

const userIdValidator = [
  param("id").notEmpty().withMessage("User ID is required"),
];

module.exports = {
  updateRoleValidator,
  updateStatusValidator,
  userIdValidator,
};
