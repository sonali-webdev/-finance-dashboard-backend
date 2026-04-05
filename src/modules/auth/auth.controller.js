const { validationResult } = require("express-validator");
const authService = require("./auth.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/response.utils");

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const { name, email, password, role } = req.body;

    const result = await authService.register({
      name,
      email,
      password,
      role,
    });

    return successResponse(res, 201, "User registered successfully", result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    return successResponse(res, 200, "Login successful", result);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);

    return successResponse(res, 200, "User profile fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
