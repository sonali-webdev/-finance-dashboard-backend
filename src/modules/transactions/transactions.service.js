const { prisma } = require("../../config/database");
const {
  getPaginationParams,
  getPaginationMeta,
} = require("../../utils/pagination.utils");

const getAllTransactions = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);

  const where = {
    isDeleted: false,
  };

  if (query.type) {
    where.type = query.type;
  }

  if (query.category) {
    where.category = {
      contains: query.category,
      mode: "insensitive",
    };
  }

  if (query.startDate || query.endDate) {
    where.date = {};

    if (query.startDate) {
      where.date.gte = new Date(query.startDate);
    }

    if (query.endDate) {
      const endDate = new Date(query.endDate);
      endDate.setHours(23, 59, 59, 999);
      where.date.lte = endDate;
    }
  }

  if (query.minAmount || query.maxAmount) {
    where.amount = {};

    if (query.minAmount) {
      where.amount.gte = parseFloat(query.minAmount);
    }

    if (query.maxAmount) {
      where.amount.lte = parseFloat(query.maxAmount);
    }
  }

  if (query.search) {
    where.OR = [
      {
        category: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  const orderBy = {};
  const sortBy = query.sortBy || "date";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
  orderBy[sortBy] = sortOrder;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        amount: true,
        type: true,
        category: true,
        date: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  const pagination = getPaginationMeta(total, page, limit);

  return { transactions, pagination };
};

const getTransactionById = async (transactionId) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      isDeleted: false,
    },
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!transaction) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }

  return transaction;
};

const createTransaction = async (transactionData, userId) => {
  const { amount, type, category, date, description } = transactionData;

  const transaction = await prisma.transaction.create({
    data: {
      amount: parseFloat(amount),
      type,
      category,
      date: new Date(date),
      description: description || null,
      userId,
    },
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      description: true,
      createdAt: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return transaction;
};

const updateTransaction = async (transactionId, updateData) => {
  const existing = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      isDeleted: false,
    },
  });

  if (!existing) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }

  const dataToUpdate = {};

  if (updateData.amount !== undefined) {
    dataToUpdate.amount = parseFloat(updateData.amount);
  }
  if (updateData.type !== undefined) {
    dataToUpdate.type = updateData.type;
  }
  if (updateData.category !== undefined) {
    dataToUpdate.category = updateData.category;
  }
  if (updateData.date !== undefined) {
    dataToUpdate.date = new Date(updateData.date);
  }
  if (updateData.description !== undefined) {
    dataToUpdate.description = updateData.description;
  }

  const transaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: dataToUpdate,
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return transaction;
};

const deleteTransaction = async (transactionId) => {
  const existing = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      isDeleted: false,
    },
  });

  if (!existing) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { isDeleted: true },
  });

  return { message: "Transaction deleted successfully" };
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
