const express = require("express");
const router = express.Router();
const usersController = require("./users.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorize } = require("../../middlewares/role.middleware");
const {
  updateRoleValidator,
  updateStatusValidator,
  userIdValidator,
} = require("./users.validator");

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/", usersController.getAllUsers);

router.get("/:id", userIdValidator, usersController.getUserById);

router.patch("/:id/role", updateRoleValidator, usersController.updateUserRole);

router.patch(
  "/:id/status",
  updateStatusValidator,
  usersController.updateUserStatus,
);

router.delete("/:id", userIdValidator, usersController.deleteUser);

module.exports = router;
