const express = require("express");
const router = express.Router();
const dashboardController = require("./dashboard.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorizeMinRole } = require("../../middlewares/role.middleware");

router.use(authenticate);

router.get("/summary", dashboardController.getSummary);

router.get(
  "/categories",
  authorizeMinRole("ANALYST"),
  dashboardController.getCategoryBreakdown,
);

router.get(
  "/trends/monthly",
  authorizeMinRole("ANALYST"),
  dashboardController.getMonthlyTrends,
);

router.get(
  "/trends/weekly",
  authorizeMinRole("ANALYST"),
  dashboardController.getWeeklyTrends,
);

router.get(
  "/top-categories",
  authorizeMinRole("ANALYST"),
  dashboardController.getTopCategories,
);

router.get(
  "/comparison",
  authorizeMinRole("ANALYST"),
  dashboardController.getIncomeExpenseComparison,
);

module.exports = router;
