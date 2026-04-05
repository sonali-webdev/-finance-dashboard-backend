const { validationResult } = require("express-validator");
const usersService = require("./users.service");
const {
  successResponse,
  errorResponse,
  paginatedResponse,
} = require("../../utils/response.utils");

const getAllUsers = async (req, res, next) => {
  try {
    const { users, pagination } = await usersService.getAllUsers(req.query);

    return paginatedResponse(
      res,
      "Users fetched successfully",
      users,
      pagination,
    );
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const user = await usersService.getUserById(req.params.id);

    return successResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const user = await usersService.updateUserRole(
      req.params.id,
      req.body.role,
      req.user.id,
    );

    return successResponse(res, 200, "User role updated successfully", user);
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const user = await usersService.updateUserStatus(
      req.params.id,
      req.body.status,
      req.user.id,
    );

    return successResponse(res, 200, "User status updated successfully", user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed", errors.array());
    }

    await usersService.deleteUser(req.params.id, req.user.id);

    return successResponse(res, 200, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
};
