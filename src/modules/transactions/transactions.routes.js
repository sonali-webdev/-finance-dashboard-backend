const express = require("express");
const router = express.Router();
const transactionsController = require("./transactions.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const {
  authorize,
  authorizeMinRole,
} = require("../../middlewares/role.middleware");
const {
  createTransactionValidator,
  updateTransactionValidator,
  transactionIdValidator,
  getTransactionsValidator,
} = require("./transactions.validator");

router.use(authenticate);

router.get(
  "/",
  getTransactionsValidator,
  transactionsController.getAllTransactions,
);

router.get(
  "/:id",
  transactionIdValidator,
  transactionsController.getTransactionById,
);

router.post(
  "/",
  authorize("ADMIN"),
  createTransactionValidator,
  transactionsController.createTransaction,
);

router.put(
  "/:id",
  authorize("ADMIN"),
  updateTransactionValidator,
  transactionsController.updateTransaction,
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  transactionIdValidator,
  transactionsController.deleteTransaction,
);

module.exports = router;
