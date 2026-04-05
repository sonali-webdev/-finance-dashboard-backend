const { validationResult } = require("express-validator");
const transactionsService = require("./transactions.service");
const {
  successResponse,
  errorResponse,
  paginatedResponse,
} = require("../../utils/response.utils");

const getAllTransactions = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const { transactions, pagination } =
      await transactionsService.getAllTransactions(req.query);

    return paginatedResponse(
      res,
      "Transactions fetched successfully",
      transactions,
      pagination,
    );
  } catch (error) {
    next(error);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const transaction = await transactionsService.getTransactionById(
      req.params.id,
    );

    return successResponse(
      res,
      200,
      "Transaction fetched successfully",
      transaction,
    );
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const transaction = await transactionsService.createTransaction(
      req.body,
      req.user.id,
    );

    return successResponse(
      res,
      201,
      "Transaction created successfully",
      transaction,
    );
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const transaction = await transactionsService.updateTransaction(
      req.params.id,
      req.body,
    );

    return successResponse(
      res,
      200,
      "Transaction updated successfully",
      transaction,
    );
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed", errors.array());
    }

    await transactionsService.deleteTransaction(req.params.id);

    return successResponse(res, 200, "Transaction deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
