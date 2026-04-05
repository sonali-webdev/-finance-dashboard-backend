const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();
  console.log("🧹 Cleaned existing data");

  const hashedPassword = await bcrypt.hash("Admin123", 12);
  const viewerPassword = await bcrypt.hash("Viewer123", 12);
  const analystPassword = await bcrypt.hash("Analyst123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@finance.com",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const analyst = await prisma.user.create({
    data: {
      name: "John Analyst",
      email: "analyst@finance.com",
      password: analystPassword,
      role: "ANALYST",
      status: "ACTIVE",
    },
  });

  const viewer = await prisma.user.create({
    data: {
      name: "Jane Viewer",
      email: "viewer@finance.com",
      password: viewerPassword,
      role: "VIEWER",
      status: "ACTIVE",
    },
  });

  console.log("👥 Users created");

  const transactions = [
    // January
    {
      amount: 5000,
      type: "INCOME",
      category: "Salary",
      date: new Date("2024-01-15"),
      description: "Monthly salary January",
      userId: admin.id,
    },
    {
      amount: 1200,
      type: "EXPENSE",
      category: "Rent",
      date: new Date("2024-01-20"),
      description: "Office rent January",
      userId: admin.id,
    },
    {
      amount: 300,
      type: "EXPENSE",
      category: "Food",
      date: new Date("2024-01-25"),
      description: "Team lunch",
      userId: admin.id,
    },

    // February
    {
      amount: 5000,
      type: "INCOME",
      category: "Salary",
      date: new Date("2024-02-15"),
      description: "Monthly salary February",
      userId: admin.id,
    },
    {
      amount: 800,
      type: "INCOME",
      category: "Freelance",
      date: new Date("2024-02-10"),
      description: "Freelance project payment",
      userId: admin.id,
    },
    {
      amount: 150,
      type: "EXPENSE",
      category: "Food",
      date: new Date("2024-02-15"),
      description: "Office snacks",
      userId: admin.id,
    },
    {
      amount: 1200,
      type: "EXPENSE",
      category: "Rent",
      date: new Date("2024-02-20"),
      description: "Office rent February",
      userId: admin.id,
    },

    // March
    {
      amount: 5000,
      type: "INCOME",
      category: "Salary",
      date: new Date("2024-03-15"),
      description: "Monthly salary March",
      userId: admin.id,
    },
    {
      amount: 2000,
      type: "INCOME",
      category: "Investment",
      date: new Date("2024-03-20"),
      description: "Stock dividends",
      userId: admin.id,
    },
    {
      amount: 500,
      type: "EXPENSE",
      category: "Utilities",
      date: new Date("2024-03-10"),
      description: "Electricity and internet",
      userId: admin.id,
    },
    {
      amount: 1200,
      type: "EXPENSE",
      category: "Rent",
      date: new Date("2024-03-20"),
      description: "Office rent March",
      userId: admin.id,
    },

    // April
    {
      amount: 5000,
      type: "INCOME",
      category: "Salary",
      date: new Date("2024-04-15"),
      description: "Monthly salary April",
      userId: admin.id,
    },
    {
      amount: 350,
      type: "EXPENSE",
      category: "Transport",
      date: new Date("2024-04-05"),
      description: "Monthly transport pass",
      userId: admin.id,
    },
    {
      amount: 1200,
      type: "EXPENSE",
      category: "Rent",
      date: new Date("2024-04-20"),
      description: "Office rent April",
      userId: admin.id,
    },
    {
      amount: 600,
      type: "EXPENSE",
      category: "Food",
      date: new Date("2024-04-25"),
      description: "Team dinner",
      userId: admin.id,
    },

    // May
    {
      amount: 5000,
      type: "INCOME",
      category: "Salary",
      date: new Date("2024-05-15"),
      description: "Monthly salary May",
      userId: admin.id,
    },
    {
      amount: 1500,
      type: "INCOME",
      category: "Freelance",
      date: new Date("2024-05-20"),
      description: "Web development project",
      userId: admin.id,
    },
    {
      amount: 1200,
      type: "EXPENSE",
      category: "Rent",
      date: new Date("2024-05-20"),
      description: "Office rent May",
      userId: admin.id,
    },
    {
      amount: 200,
      type: "EXPENSE",
      category: "Utilities",
      date: new Date("2024-05-10"),
      description: "Internet bill",
      userId: admin.id,
    },

    // June
    {
      amount: 5000,
      type: "INCOME",
      category: "Salary",
      date: new Date("2024-06-15"),
      description: "Monthly salary June",
      userId: admin.id,
    },
    {
      amount: 1200,
      type: "EXPENSE",
      category: "Rent",
      date: new Date("2024-06-20"),
      description: "Office rent June",
      userId: admin.id,
    },
    {
      amount: 800,
      type: "EXPENSE",
      category: "Equipment",
      date: new Date("2024-06-25"),
      description: "Office supplies",
      userId: admin.id,
    },
  ];

  await prisma.transaction.createMany({
    data: transactions,
  });

  console.log("💰 Transactions created");
  console.log("\n✅ Seeding completed!");
  console.log("─────────────────────────────────");
  console.log("👤 Test Accounts:");
  console.log("   Admin    → admin@finance.com    / Admin123");
  console.log("   Analyst  → analyst@finance.com  / Analyst123");
  console.log("   Viewer   → viewer@finance.com   / Viewer123");
  console.log("─────────────────────────────────");
  console.log(`📊 Total transactions: ${transactions.length}`);
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
