const { prisma } = require("../../config/database");

const baseFilter = {
  isDeleted: false,
};

const getSummary = async () => {
  const [
    totalIncomeResult,
    totalExpenseResult,
    totalTransactions,
    recentTransactions,
  ] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        ...baseFilter,
        type: "INCOME",
      },
      _sum: { amount: true },
      _count: true,
    }),

    prisma.transaction.aggregate({
      where: {
        ...baseFilter,
        type: "EXPENSE",
      },
      _sum: { amount: true },
      _count: true,
    }),

    prisma.transaction.count({
      where: baseFilter,
    }),

    prisma.transaction.findMany({
      where: baseFilter,
      take: 5,
      orderBy: { date: "desc" },
      select: {
        id: true,
        amount: true,
        type: true,
        category: true,
        date: true,
        description: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  ]);

  const totalIncome = parseFloat(totalIncomeResult._sum.amount || 0);

  const totalExpense = parseFloat(totalExpenseResult._sum.amount || 0);

  const netBalance = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    netBalance,
    totalTransactions,
    incomeCount: totalIncomeResult._count,
    expenseCount: totalExpenseResult._count,
    recentTransactions,
  };
};

const getCategoryBreakdown = async (query) => {
  const where = { ...baseFilter };

  if (query.type) {
    where.type = query.type;
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

  const categories = await prisma.transaction.groupBy({
    by: ["category", "type"],
    where,
    _sum: { amount: true },
    _count: true,
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  const formatted = categories.map((item) => ({
    category: item.category,
    type: item.type,
    total: parseFloat(item._sum.amount || 0),
    count: item._count,
  }));

  return formatted;
};

const getMonthlyTrends = async (query) => {
  const year = parseInt(query.year) || new Date().getFullYear();

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);
  endDate.setHours(23, 59, 59, 999);

  const transactions = await prisma.transaction.findMany({
    where: {
      ...baseFilter,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      amount: true,
      type: true,
      date: true,
    },
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthlyData = months.map((month, index) => ({
    month,
    monthNumber: index + 1,
    income: 0,
    expense: 0,
    net: 0,
  }));

  transactions.forEach((transaction) => {
    const monthIndex = new Date(transaction.date).getMonth();
    const amount = parseFloat(transaction.amount);

    if (transaction.type === "INCOME") {
      monthlyData[monthIndex].income += amount;
    } else {
      monthlyData[monthIndex].expense += amount;
    }
  });

  monthlyData.forEach((month) => {
    month.net = parseFloat((month.income - month.expense).toFixed(2));
    month.income = parseFloat(month.income.toFixed(2));
    month.expense = parseFloat(month.expense.toFixed(2));
  });

  return {
    year,
    trends: monthlyData,
  };
};

const getWeeklyTrends = async (query) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const transactions = await prisma.transaction.findMany({
    where: {
      ...baseFilter,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      amount: true,
      type: true,
      date: true,
    },
    orderBy: { date: "asc" },
  });

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toISOString().split("T")[0],
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      income: 0,
      expense: 0,
      net: 0,
    });
  }

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date)
      .toISOString()
      .split("T")[0];

    const dayData = days.find((d) => d.date === transactionDate);

    if (dayData) {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === "INCOME") {
        dayData.income += amount;
      } else {
        dayData.expense += amount;
      }
    }
  });

  days.forEach((day) => {
    day.net = parseFloat((day.income - day.expense).toFixed(2));
    day.income = parseFloat(day.income.toFixed(2));
    day.expense = parseFloat(day.expense.toFixed(2));
  });

  return { days };
};

const getTopCategories = async (query) => {
  const limit = parseInt(query.limit) || 5;
  const where = { ...baseFilter };

  if (query.type) {
    where.type = query.type;
  }

  const topCategories = await prisma.transaction.groupBy({
    by: ["category"],
    where,
    _sum: { amount: true },
    _count: true,
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
    take: limit,
  });

  const formatted = topCategories.map((item) => ({
    category: item.category,
    total: parseFloat(item._sum.amount || 0),
    count: item._count,
  }));

  return formatted;
};

const getIncomeExpenseComparison = async (query) => {
  const where = { ...baseFilter };

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

  const [income, expense] = await Promise.all([
    prisma.transaction.aggregate({
      where: { ...where, type: "INCOME" },
      _sum: { amount: true },
      _count: true,
      _avg: { amount: true },
      _max: { amount: true },
      _min: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { ...where, type: "EXPENSE" },
      _sum: { amount: true },
      _count: true,
      _avg: { amount: true },
      _max: { amount: true },
      _min: { amount: true },
    }),
  ]);

  const totalIncome = parseFloat(income._sum.amount || 0);
  const totalExpense = parseFloat(expense._sum.amount || 0);
  const totalAmount = totalIncome + totalExpense;

  return {
    income: {
      total: totalIncome,
      count: income._count,
      average: parseFloat(income._avg.amount || 0).toFixed(2),
      highest: parseFloat(income._max.amount || 0),
      lowest: parseFloat(income._min.amount || 0),
      percentage: totalAmount
        ? parseFloat(((totalIncome / totalAmount) * 100).toFixed(2))
        : 0,
    },
    expense: {
      total: totalExpense,
      count: expense._count,
      average: parseFloat(expense._avg.amount || 0).toFixed(2),
      highest: parseFloat(expense._max.amount || 0),
      lowest: parseFloat(expense._min.amount || 0),
      percentage: totalAmount
        ? parseFloat(((totalExpense / totalAmount) * 100).toFixed(2))
        : 0,
    },
    netBalance: parseFloat((totalIncome - totalExpense).toFixed(2)),
  };
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getWeeklyTrends,
  getTopCategories,
  getIncomeExpenseComparison,
};
