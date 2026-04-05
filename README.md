# Finance Dashboard Backend API

A backend API for a finance dashboard system with role-based access control,
financial records management, and analytics.

---

## Tech Stack

| Layer          | Technology               |
| -------------- | ------------------------ |
| Runtime        | Node.js                  |
| Framework      | Express.js v5            |
| Database       | PostgreSQL               |
| ORM            | Prisma v5                |
| Authentication | JWT (JSON Web Tokens)    |
| Validation     | express-validator        |
| Security       | Helmet, CORS, Rate Limit |
| Password Hash  | bcryptjs                 |

---

## Project Structure

finance-dashboard-backend/
├── prisma/
│ ├── schema.prisma # Database schema
│ ├── seed.js # Sample data seeder
│ └── migrations/ # Database migrations
├── src/
│ ├── config/
│ │ ├── database.js # Prisma client instance
│ │ └── env.js # Environment validation
│ ├── middlewares/
│ │ ├── auth.middleware.js # JWT verification
│ │ ├── role.middleware.js # Role based access
│ │ └── error.middleware.js # Global error handler
│ ├── modules/
│ │ ├── auth/ # Login, register, profile
│ │ ├── users/ # User management
│ │ ├── transactions/ # Financial records
│ │ └── dashboard/ # Analytics and summaries
│ ├── utils/
│ │ ├── response.utils.js # Standard API responses
│ │ ├── jwt.utils.js # Token helpers
│ │ └── pagination.utils.js # Pagination helpers
│ └── app.js # Express app entry point
├── .env.example # Environment template
├── package.json
└── README.md

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- PostgreSQL installed and running
- npm or yarn

### Installation

#### Step 1: Clone the repository

```bash
git clone https://github.com/yourusername/finance-dashboard-backend.git
cd finance-dashboard-backend

Step 2: Install dependencies
npm install

Step 3: Setup environment variables
cp .env.example .env

Update .env with your database credentials.


Step 4: Setup Database
npx prisma migrate dev --name init
npm run db:seed

Step 5:  Start Server
npm run dev

Server runs at http://localhost:5000

Test Accounts (after seeding)
Role	Email	Password
Admin	admin@finance.com	Admin123
Analyst	analyst@finance.com	Analyst123
Viewer	viewer@finance.com	Viewer123

Access Control
Action	VIEWER	ANALYST	ADMIN
View transactions	✅	✅	✅
Create/Update/Delete	❌	❌	✅
Dashboard summary	✅	✅	✅
Dashboard analytics	❌	✅	✅
Manage users	❌	❌	✅

API Endpoints
Auth
POST   /api/auth/register    → Register user
POST   /api/auth/login       → Login and get token
GET    /api/auth/me          → Get current user

Users (Admin Only)
GET    /api/users                  → Get all users
GET    /api/users/:id              → Get single user
PATCH  /api/users/:id/role         → Update role
PATCH  /api/users/:id/status       → Update status
DELETE /api/users/:id              → Delete user

Transactions
GET    /api/transactions           → Get all (all roles)
GET    /api/transactions/:id       → Get one (all roles)
POST   /api/transactions           → Create (admin only)
PUT    /api/transactions/:id       → Update (admin only)
DELETE /api/transactions/:id       → Delete (admin only)

Dashboard
GET    /api/dashboard/summary          → Summary (all roles)
GET    /api/dashboard/categories       → By category (analyst+)
GET    /api/dashboard/trends/monthly   → Monthly trends (analyst+)
GET    /api/dashboard/trends/weekly    → Weekly trends (analyst+)
GET    /api/dashboard/top-categories   → Top categories (analyst+)
GET    /api/dashboard/comparison       → Income vs Expense (analyst+)

Query Parameters
Transactions
type        → INCOME or EXPENSE
category    → filter by category
startDate   → from date (YYYY-MM-DD)
endDate     → to date (YYYY-MM-DD)
minAmount   → minimum amount
maxAmount   → maximum amount
search      → search in category or description
sortBy      → field to sort (default: date)
sortOrder   → asc or desc
page        → page number
limit       → items per page

Response Format
Success
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}

Error
{
  "success": false,
  "message": "Something went wrong",
  "errors": []
}

Scripts
npm run dev          # Development server
npm run start        # Production server
npm run db:migrate   # Run migrations
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio

Assumptions
Any role can be assigned during registration
Transactions are soft deleted (isDeleted flag)
JWT tokens expire in 7 days
Rate limit is 100 requests per 15 minutes

Security
Passwords hashed with bcryptjs (12 salt rounds)
JWT authentication on all protected routes
Role based access control via middleware
HTTP security headers via Helmet
Input validation on all endpoints
```
