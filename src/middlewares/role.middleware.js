const { errorResponse } = require("../utils/response.utils");

const roleHierarchy = {
  VIEWER: 1,
  ANALYST: 2,
  ADMIN: 3,
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 401, "Access denied. Not authenticated.");
      }

      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return errorResponse(
          res,
          403,
          `Access denied. Required role: ${allowedRoles.join(" or ")}. Your role: ${userRole}`,
        );
      }

      next();
    } catch (error) {
      return errorResponse(res, 500, "Authorization error.");
    }
  };
};

const authorizeMinRole = (minRole) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 401, "Access denied. Not authenticated.");
      }

      const userRoleLevel = roleHierarchy[req.user.role];
      const minRoleLevel = roleHierarchy[minRole];

      if (userRoleLevel < minRoleLevel) {
        return errorResponse(
          res,
          403,
          `Access denied. Minimum required role: ${minRole}. Your role: ${req.user.role}`,
        );
      }

      next();
    } catch (error) {
      return errorResponse(res, 500, "Authorization error.");
    }
  };
};

module.exports = { authorize, authorizeMinRole };
