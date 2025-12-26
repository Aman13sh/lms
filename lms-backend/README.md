# LMS Backend - Loan Management System for NBFC

Backend API for the Loan Management System designed for Non-Banking Financial Companies (NBFCs) that provide loans against mutual funds as collateral.

## Features

### Core Functionality
- User authentication with JWT (access & refresh tokens)
- Role-based access control (Admin, Loan Officer, Customer)
- Loan product management
- Loan application processing
- Customer KYC management
- Collateral management for mutual funds
- EMI calculation
- Application status tracking

### User Roles
1. **Admin** - Full system access, user and product management
2. **Loan Officer** - Review and approve loan applications
3. **Customer** - Apply for loans, track applications

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Prisma ORM** - Database ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Pino** - Logging

## Prerequisites

- Node.js v18 or higher
- PostgreSQL v14 or higher
- npm or yarn

## Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd lms-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create `.env` file in the root directory:
```env
# Database
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/lms_db

# Server
PORT=5001
NODE_ENV=development

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key
ENCRYPTION_IV=your-16-char-iv

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup

Create database:
```bash
createdb lms_db
```

Run migrations:
```bash
npx prisma migrate dev
```

Generate Prisma client:
```bash
npx prisma generate
```

### 5. Seed Database
```bash
npm run seed
```

This creates:
- 1 Admin user
- 1 Loan Officer
- 3 Customer accounts
- 5 Loan products

### 6. Build and Run

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## Project Structure

```
lms-backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/          # Database migrations
│   └── seed.ts             # Seed data
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── loanApplication.controller.ts
│   │   └── loanProduct.controller.ts
│   ├── middlewares/        # Express middlewares
│   │   ├── auth.ts         # Authentication middleware
│   │   ├── errorHandler.ts # Error handling
│   │   ├── rateLimiter.ts  # Rate limiting
│   │   └── validateRequest.ts
│   ├── routes/             # API routes
│   │   ├── auth.routes.ts
│   │   ├── loanApplication.routes.ts
│   │   └── loanProduct.routes.ts
│   ├── utils/              # Utility functions
│   │   ├── encryption.ts   # Data encryption
│   │   ├── helpers.ts      # Helper functions
│   │   └── logger.ts       # Logging setup
│   ├── validators/         # Request validators
│   └── server.ts           # Application entry point
├── dist/                   # Compiled JavaScript
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Loan Products
- `GET /api/loan-products` - Get all loan products
- `GET /api/loan-products/:id` - Get product by ID
- `POST /api/loan-products` - Create product (Admin)
- `PUT /api/loan-products/:id` - Update product (Admin)
- `DELETE /api/loan-products/:id` - Delete product (Admin)

### Loan Applications
- `POST /api/loan-applications` - Create application
- `GET /api/loan-applications` - Get user applications
- `GET /api/loan-applications/:id` - Get application details
- `PUT /api/loan-applications/:id/status` - Update status (Officer)

## Database Schema

### Main Tables
- **users** - User accounts
- **customers** - Customer profiles
- **loan_products** - Available loan products
- **loan_applications** - Loan applications
- **collaterals** - Pledged mutual funds
- **api_partners** - API partner configurations

## Available Scripts

```bash
# Development
npm run dev              # Run with nodemon
npm run build           # Compile TypeScript
npm start              # Run production server

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open Prisma Studio
npm run seed           # Seed database

# Testing
npm test               # Run tests
npm run test:watch     # Run tests in watch mode

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format with Prettier
```

## Default Login Credentials

After running seed script:

**Admin**
- Email: admin@lmsnbfc.com
- Password: Admin@123

**Loan Officer**
- Email: officer@lmsnbfc.com
- Password: Officer@123

**Customers**
- john.doe@gmail.com / Customer@123
- jane.smith@gmail.com / Customer@123
- rajesh.kumar@gmail.com / Customer@123

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation
- SQL injection protection via Prisma ORM
- CORS configuration
- Environment variables for secrets

## Error Handling

The application uses centralized error handling with custom error classes and proper HTTP status codes. All errors are logged using Pino logger.

## Logging

Logs are written to:
- Console (development)
- `logs/` directory (production)

Log levels: error, warn, info, debug

## Troubleshooting

### Database Connection Issues
1. Verify PostgreSQL is running
2. Check DATABASE_URL in .env
3. Ensure database exists

### Port Already in Use
Change PORT in .env file

### Migration Errors
```bash
npx prisma migrate reset  # Reset database
npx prisma migrate dev    # Run migrations
```

### Authentication Issues
1. Verify JWT_SECRET is set
2. Check token expiration times
3. Clear cookies and retry

## Development Guidelines

1. Use TypeScript for type safety
2. Follow RESTful API conventions
3. Implement proper error handling
4. Add input validation for all endpoints
5. Write unit tests for new features
6. Use Prisma migrations for schema changes

## License

MIT

## Support

For issues or questions, please contact the development team.