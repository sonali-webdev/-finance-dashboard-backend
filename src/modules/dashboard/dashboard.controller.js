const dashboardService = require("./dashboard.service");
const { successResponse } = require("../../utils/response.utils");

const getSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getSummary();

    return successResponse(
      res,
      200,
      "Dashboard summary fetched successfully",
      summary,
    );
  } catch (error) {
    next(error);
  }
};

const getCategoryBreakdown = async (req, res, next) => {
  try {
    const categories = await dashboardService.getCategoryBreakdown(req.query);

    return successResponse(
      res,
      200,
      "Category breakdown fetched successfully",
      categories,
    );
  } catch (error) {
    next(error);
  }
};

const getMonthlyTrends = async (req, res, next) => {
  try {
    const trends = await dashboardService.getMonthlyTrends(req.query);

    return successResponse(
      res,
      200,
      "Monthly trends fetched successfully",
      trends,
    );
  } catch (error) {
    next(error);
  }
};

const getWeeklyTrends = async (req, res, next) => {
  try {
    const trends = await dashboardService.getWeeklyTrends(req.query);

    return successResponse(
      res,
      200,
      "Weekly trends fetched successfully",
      trends,
    );
  } catch (error) {
    next(error);
  }
};

const getTopCategories = async (req, res, next) => {
  try {
    const topCategories = await dashboardService.getTopCategories(req.query);

    return successResponse(
      res,
      200,
      "Top categories fetched successfully",
      topCategories,
    );
  } catch (error) {
    next(error);
  }
};

const getIncomeExpenseComparison = async (req, res, next) => {
  try {
    const comparison = await dashboardService.getIncomeExpenseComparison(
      req.query,
    );

    return successResponse(
      res,
      200,
      "Income vs Expense comparison fetched successfully",
      comparison,
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getWeeklyTrends,
  getTopCategories,
  getIncomeExpenseComparison,
};
