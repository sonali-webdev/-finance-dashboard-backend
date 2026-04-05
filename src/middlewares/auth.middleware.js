const { verifyToken } = require("../utils/jwt.utils");
const { errorResponse } = require("../utils/response.utils");
const { prisma } = require("../config/database");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, 401, "Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return errorResponse(res, 401, "Access denied. Invalid token format.");
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse(
        res,
        401,
        "Access denied. Token is invalid or expired.",
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return errorResponse(res, 401, "Access denied. User no longer exists.");
    }

    if (user.status === "INACTIVE") {
      return errorResponse(
        res,
        403,
        "Access denied. Your account has been deactivated.",
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 500, "Authentication error.");
  }
};

module.exports = { authenticate };
