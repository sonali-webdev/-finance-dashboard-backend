const { body, param, query } = require("express-validator");

const createTransactionValidator = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Type must be INCOME or EXPENSE"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date format (YYYY-MM-DD)"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Description cannot exceed 255 characters"),
];

const updateTransactionValidator = [
  param("id").notEmpty().withMessage("Transaction ID is required"),

  body("amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),

  body("type")
    .optional()
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Type must be INCOME or EXPENSE"),

  body("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid date format (YYYY-MM-DD)"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Description cannot exceed 255 characters"),
];

const transactionIdValidator = [
  param("id").notEmpty().withMessage("Transaction ID is required"),
];

const getTransactionsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("type")
    .optional()
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Type must be INCOME or EXPENSE"),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date format (YYYY-MM-DD)"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date format (YYYY-MM-DD)"),
];

module.exports = {
  createTransactionValidator,
  updateTransactionValidator,
  transactionIdValidator,
  getTransactionsValidator,
};
