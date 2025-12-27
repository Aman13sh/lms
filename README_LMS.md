# Loan Management System (LMS) - NBFC LAMF

A comprehensive Loan Management System for Non-Banking Financial Companies (NBFCs) specializing in Lending Against Mutual Funds (LAMF).

## 🚀 Tech Stack

### Backend
- **Node.js + Express** - Server framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Prisma ORM** - Database ORM
- **JWT** - Authentication
- **Pino** - High-performance logging with human-readable API response times

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool (replaced deprecated Create React App)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom blue-green theme
- **React Router v6** - Routing
- **React Hook Form** - Form management
- **Recharts** - Data visualization
- **Axios** - API calls

## 🎨 Design System

### Color Theme
- **Primary**: Blue (#0074e6)
- **Secondary**: Green (#00b874)
- **Accent**: Teal/Blue-Green (#00a7bd)

## 📁 Project Structure

```
/1fi
├── SYSTEM_DESIGN.md          # Complete system architecture
├── database/
│   └── schema.sql            # PostgreSQL schema
├── lms-backend/
│   ├── prisma/
│   │   └── schema.prisma     # Prisma database models
│   ├── src/
│   │   ├── server.ts         # Express server with Pino logger
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API endpoints
│   │   ├── middlewares/      # Auth, validation, error handling
│   │   ├── validators/       # Joi validation schemas
│   │   └── utils/            # Helpers, encryption, logger
│   └── package.json
└── lms-frontend/             # Vite + React app
    ├── src/
    │   ├── components/
    │   │   ├── ui/          # Reusable components
    │   │   └── layout/      # Layout components
    │   ├── pages/           # Application pages
    │   │   ├── auth/        # Login, Signup
    │   │   └── ...          # All 5 modules
    │   └── App.tsx          # Main app with routing
    ├── tailwind.config.js   # Blue-green theme
    └── vite.config.ts       # Vite configuration
```

## ✅ Features Implemented

### 1. User Roles
- **ADMIN** - System management, loan product creation
- **LOAN_OFFICER** - Application review and approval
- **CUSTOMER** - Apply for loans, view status
- **API_PARTNER** - Fintech integration

### 2. All 5 Required Modules

#### Module 1: Loan Products
- Grid view with product cards
- Interest rates, LTV ratios, tenure
- Product comparison
- Apply now functionality

#### Module 2: Loan Applications
- Application listing with filters
- Status tracking (Draft, Under Review, Approved, Disbursed, Rejected)
- Statistics dashboard
- Quick actions

#### Module 3: New Application (with API)
- Multi-step form wizard
- Product selection
- Real-time EMI calculation
- Financial information collection
- Mutual fund collateral selection
- **API endpoints for fintech partners** ✅

#### Module 4: Ongoing Loans
- Active loan cards with progress
- EMI payment tracking
- Payment calendar
- Outstanding amount monitoring

#### Module 5: Collateral Management
- Mutual fund holdings table
- Pledge/Release functionality
- Portfolio distribution
- Risk analysis
- LTV ratio monitoring
- Margin call alerts

### 3. Additional Features
- **Dashboard** with charts and analytics
- **Authentication** (Login/Signup) with JWT
- **Responsive Design** - Works on all devices
- **Form Validation** - Comprehensive input validation
- **Error Handling** - Proper error messages and logging
- **API Ready** - Backend APIs for all operations
- **Human-Readable Logging** - Pino logger shows API response times in ms/s/min format

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd lms-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Set up database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5001`

### Frontend Setup (Vite)

1. Navigate to frontend directory:
```bash
cd lms-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔑 Default Ports

- **Frontend (Vite)**: http://localhost:5173
- **Backend**: http://localhost:5001
- **Database**: PostgreSQL on port 5432

## 📝 API Documentation

**Base URL:** `http://localhost:5001`

### Response Format
All API responses follow a consistent format:
```json
{
  "success": true,
  "message": "Operation message",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

---

### 1. Authentication APIs (`/api/auth`)

#### POST `/api/auth/register` - Register New Customer

**Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+919876543210",
  "dateOfBirth": "1990-01-15",
  "panNumber": "ABCDE1234F",
  "aadhaarNumber": "123456789012",
  "address": "123, Main Street, Mumbai, Maharashtra 400001"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid-user-id",
      "email": "john.doe@example.com",
      "role": "CUSTOMER"
    },
    "customer": {
      "id": "uuid-customer-id",
      "customerCode": "CUS1703123456",
      "firstName": "John",
      "lastName": "Doe"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### POST `/api/auth/login` - User Login

**Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-user-id",
      "email": "john.doe@example.com",
      "role": "CUSTOMER",
      "customer": {
        "id": "uuid-customer-id",
        "customerCode": "CUS1703123456",
        "firstName": "John",
        "lastName": "Doe",
        "kycStatus": "VERIFIED"
      }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### POST `/api/auth/refresh-token` - Refresh Access Token

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### GET `/api/auth/profile` - Get User Profile (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-user-id",
    "email": "john.doe@example.com",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "customer": {
      "id": "uuid-customer-id",
      "customerCode": "CUS1703123456",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+919876543210",
      "kycStatus": "VERIFIED"
    }
  }
}
```

#### POST `/api/auth/change-password` - Change Password (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "oldPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### POST `/api/auth/logout` - Logout (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 2. Loan Products APIs (`/api/loan-products`)

#### GET `/api/loan-products` - Get All Active Loan Products

**Response (200):**
```json
{
  "success": true,
  "message": "Loan products fetched successfully",
  "data": [
    {
      "id": "uuid-product-id",
      "productCode": "LAMF-001",
      "productName": "Loan Against Mutual Funds - Standard",
      "description": "Quick loan against your mutual fund investments",
      "minAmount": 50000,
      "maxAmount": 5000000,
      "minTenureMonths": 6,
      "maxTenureMonths": 36,
      "interestRate": 10.5,
      "processingFeePercentage": 1.0,
      "ltvRatio": 60,
      "eligibleMfCategories": ["EQUITY", "DEBT", "HYBRID"],
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "uuid-product-id-2",
      "productCode": "LAMF-002",
      "productName": "Loan Against Mutual Funds - Premium",
      "description": "Premium loan with higher LTV for premium customers",
      "minAmount": 100000,
      "maxAmount": 10000000,
      "minTenureMonths": 12,
      "maxTenureMonths": 60,
      "interestRate": 9.5,
      "processingFeePercentage": 0.75,
      "ltvRatio": 70,
      "eligibleMfCategories": ["EQUITY", "DEBT", "HYBRID", "LIQUID"],
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/loan-products/:id` - Get Loan Product by ID

**Response (200):**
```json
{
  "success": true,
  "message": "Loan product fetched successfully",
  "data": {
    "id": "uuid-product-id",
    "productCode": "LAMF-001",
    "productName": "Loan Against Mutual Funds - Standard",
    "description": "Quick loan against your mutual fund investments",
    "minAmount": 50000,
    "maxAmount": 5000000,
    "minTenureMonths": 6,
    "maxTenureMonths": 36,
    "interestRate": 10.5,
    "processingFeePercentage": 1.0,
    "ltvRatio": 60,
    "eligibleMfCategories": ["EQUITY", "DEBT", "HYBRID"],
    "status": "ACTIVE",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/loan-products` - Create Loan Product (Admin Only)

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "productName": "Loan Against Mutual Funds - Elite",
  "productCode": "LAMF-003",
  "description": "Elite loan product for HNI customers",
  "minAmount": 500000,
  "maxAmount": 50000000,
  "minTenureMonths": 12,
  "maxTenureMonths": 84,
  "interestRate": 8.5,
  "processingFeePercentage": 0.5,
  "ltvRatio": 75,
  "eligibleMfCategories": ["EQUITY", "DEBT", "HYBRID", "LIQUID"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Loan product created successfully",
  "data": {
    "id": "uuid-new-product-id",
    "productCode": "LAMF-003",
    "productName": "Loan Against Mutual Funds - Elite",
    "description": "Elite loan product for HNI customers",
    "minAmount": 500000,
    "maxAmount": 50000000,
    "minTenureMonths": 12,
    "maxTenureMonths": 84,
    "interestRate": 8.5,
    "processingFeePercentage": 0.5,
    "ltvRatio": 75,
    "eligibleMfCategories": ["EQUITY", "DEBT", "HYBRID", "LIQUID"],
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### PUT `/api/loan-products/:id` - Update Loan Product (Admin Only)

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "interestRate": 9.0,
  "maxAmount": 60000000
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Loan product updated successfully",
  "data": {
    "id": "uuid-product-id",
    "productCode": "LAMF-003",
    "productName": "Loan Against Mutual Funds - Elite",
    "interestRate": 9.0,
    "maxAmount": 60000000
  }
}
```

#### DELETE `/api/loan-products/:id` - Delete Loan Product (Admin Only)

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "message": "Loan product deleted successfully"
}
```

---

### 3. Loan Applications APIs (`/api/loan-applications`)

#### GET `/api/loan-applications/dashboard/stats` - Get Dashboard Statistics (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Response for Customer (200):**
```json
{
  "success": true,
  "data": {
    "totalApplications": 3,
    "activeLoans": 1,
    "totalOutstanding": 450000,
    "creditScore": 750
  }
}
```

**Response for Admin/Loan Officer (200):**
```json
{
  "success": true,
  "data": {
    "totalApplications": 156,
    "activeLoans": 87,
    "totalCustomers": 234,
    "totalCollateral": 125000000,
    "totalOutstanding": 45000000
  }
}
```

#### GET `/api/loan-applications` - Get All Loan Applications (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-application-id",
      "applicationNumber": "APP1703123456",
      "customerName": "John Doe",
      "customerEmail": "john.doe@example.com",
      "productName": "Loan Against Mutual Funds - Standard",
      "requestedAmount": 500000,
      "approvedAmount": null,
      "status": "UNDER_REVIEW",
      "submittedDate": "2024-01-15T10:30:00.000Z",
      "ltvRatio": "60%",
      "tenure": "24 months",
      "interestRate": 10.5,
      "monthlyEmi": null,
      "reviewNotes": null
    },
    {
      "id": "uuid-application-id-2",
      "applicationNumber": "APP1703123457",
      "customerName": "Jane Smith",
      "customerEmail": "jane.smith@example.com",
      "productName": "Loan Against Mutual Funds - Premium",
      "requestedAmount": 1000000,
      "approvedAmount": 1000000,
      "status": "APPROVED",
      "submittedDate": "2024-01-10T14:20:00.000Z",
      "ltvRatio": "60%",
      "tenure": "36 months",
      "interestRate": 9.5,
      "monthlyEmi": 32267,
      "reviewNotes": null
    }
  ]
}
```

#### POST `/api/loan-applications` - Create New Loan Application (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "loanProductId": "uuid-product-id",
  "requestedAmount": 500000,
  "tenure": 24,
  "purposeOfLoan": "Business Expansion",
  "monthlyIncome": 150000,
  "existingEMI": 20000,
  "collateralIds": ["uuid-collateral-1", "uuid-collateral-2"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Loan application created successfully",
  "data": {
    "id": "uuid-new-application-id",
    "applicationNumber": "APP1703123458",
    "customerId": "uuid-customer-id",
    "loanProductId": "uuid-product-id",
    "requestedAmount": 500000,
    "tenureMonths": 24,
    "interestRate": 10.5,
    "status": "DRAFT",
    "applicationData": {
      "purposeOfLoan": "Business Expansion",
      "monthlyIncome": 150000,
      "existingEMI": 20000,
      "calculatedEmi": 23072
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "loanProduct": {
      "id": "uuid-product-id",
      "productName": "Loan Against Mutual Funds - Standard"
    },
    "customer": {
      "id": "uuid-customer-id",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

#### PATCH `/api/loan-applications/:id/status` - Update Application Status (Loan Officer/Admin Only)

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "status": "APPROVED",
  "approvedAmount": 500000,
  "reviewNotes": "All documents verified. Collateral value sufficient."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Application status updated successfully",
  "data": {
    "id": "uuid-application-id",
    "applicationNumber": "APP1703123456",
    "status": "APPROVED",
    "approvedAmount": 500000,
    "reviewedById": "uuid-officer-id",
    "reviewedAt": "2024-01-16T09:15:00.000Z",
    "approvedById": "uuid-officer-id",
    "approvedAt": "2024-01-16T09:15:00.000Z"
  }
}
```

#### POST `/api/loan-applications/:id/approve` - Approve Application (Loan Officer/Admin Only)

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "approvedAmount": 500000,
  "remarks": "Application approved after verification"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Application approved successfully",
  "data": {
    "id": "uuid-application-id",
    "status": "APPROVED",
    "approvedAmount": 500000,
    "approvedAt": "2024-01-16T09:15:00.000Z"
  }
}
```

#### POST `/api/loan-applications/:id/reject` - Reject Application (Loan Officer/Admin Only)

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "reason": "Insufficient collateral value"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Application rejected",
  "data": {
    "id": "uuid-application-id",
    "status": "REJECTED",
    "rejectionReason": "Insufficient collateral value",
    "rejectedAt": "2024-01-16T09:15:00.000Z"
  }
}
```

---

### 4. Active Loans APIs (`/api/loans`)

#### GET `/api/loans` - Get All Loans (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-loan-id",
      "loanAccountNumber": "LOAN1703123456",
      "customerId": "uuid-customer-id",
      "customerName": "John Doe",
      "principalAmount": 500000,
      "outstandingPrincipal": 420000,
      "outstandingInterest": 3500,
      "interestRate": 10.5,
      "tenureMonths": 24,
      "emiAmount": 23072,
      "nextEmiDate": "2024-02-05",
      "totalEmisPaid": 4,
      "remainingEmis": 20,
      "status": "ACTIVE",
      "disbursedAt": "2024-01-20T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/loans/:id` - Get Loan by ID (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-loan-id",
    "loanAccountNumber": "LOAN1703123456",
    "customerId": "uuid-customer-id",
    "principalAmount": 500000,
    "outstandingPrincipal": 420000,
    "outstandingInterest": 3500,
    "interestRate": 10.5,
    "tenureMonths": 24,
    "emiAmount": 23072,
    "nextEmiDate": "2024-02-05",
    "totalEmisPaid": 4,
    "remainingEmis": 20,
    "status": "ACTIVE",
    "collaterals": [
      {
        "id": "uuid-collateral-id",
        "mutualFundName": "HDFC Top 100 Fund",
        "pledgedUnits": 1000,
        "pledgeValue": 650000,
        "currentValue": 680000
      }
    ]
  }
}
```

#### GET `/api/loans/:id/emi-schedule` - Get EMI Schedule (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "loanId": "uuid-loan-id",
    "emiAmount": 23072,
    "schedule": [
      {
        "emiNumber": 1,
        "dueDate": "2024-02-05",
        "principalComponent": 18655,
        "interestComponent": 4417,
        "totalAmount": 23072,
        "status": "PAID",
        "paidDate": "2024-02-04"
      },
      {
        "emiNumber": 2,
        "dueDate": "2024-03-05",
        "principalComponent": 18820,
        "interestComponent": 4252,
        "totalAmount": 23072,
        "status": "PAID",
        "paidDate": "2024-03-05"
      },
      {
        "emiNumber": 3,
        "dueDate": "2024-04-05",
        "principalComponent": 18986,
        "interestComponent": 4086,
        "totalAmount": 23072,
        "status": "PENDING",
        "paidDate": null
      }
    ]
  }
}
```

#### POST `/api/loans/:id/payment` - Make EMI Payment (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "amount": 23072,
  "paymentMethod": "NEFT",
  "referenceNumber": "NEFT123456789"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "EMI payment successful",
  "data": {
    "transactionId": "uuid-transaction-id",
    "loanId": "uuid-loan-id",
    "amount": 23072,
    "principalComponent": 18986,
    "interestComponent": 4086,
    "paymentDate": "2024-04-05T10:30:00.000Z",
    "remainingEmis": 19,
    "newOutstandingPrincipal": 401014
  }
}
```

#### POST `/api/loans/:id/prepayment` - Make Prepayment (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "amount": 100000,
  "paymentMethod": "RTGS",
  "referenceNumber": "RTGS987654321"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Prepayment successful",
  "data": {
    "transactionId": "uuid-transaction-id",
    "loanId": "uuid-loan-id",
    "prepaymentAmount": 100000,
    "prepaymentCharges": 1000,
    "netPrepayment": 99000,
    "newOutstandingPrincipal": 302014,
    "newEmiAmount": 18500,
    "remainingEmis": 19
  }
}
```

#### GET `/api/loans/:id/statement` - Get Loan Statement (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "loanId": "uuid-loan-id",
    "loanAccountNumber": "LOAN1703123456",
    "customerName": "John Doe",
    "statementDate": "2024-04-05",
    "principalAmount": 500000,
    "totalInterestPayable": 53728,
    "totalAmountPayable": 553728,
    "paidPrincipal": 98986,
    "paidInterest": 12802,
    "outstandingPrincipal": 401014,
    "outstandingInterest": 0,
    "transactions": [
      {
        "date": "2024-01-20",
        "description": "Loan Disbursement",
        "debit": 500000,
        "credit": 0,
        "balance": 500000
      },
      {
        "date": "2024-02-04",
        "description": "EMI Payment - Feb 2024",
        "debit": 0,
        "credit": 23072,
        "balance": 481345
      }
    ]
  }
}
```

---

### 5. Customer Management APIs (`/api/customers`)

#### GET `/api/customers` - Get All Customers (Admin/Loan Officer Only)

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-customer-id",
      "customerCode": "CUS1703123456",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "+919876543210",
      "kycStatus": "VERIFIED",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "uuid-customer-id-2",
      "customerCode": "CUS1703123457",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phoneNumber": "+919876543211",
      "kycStatus": "PENDING",
      "createdAt": "2024-01-16T11:45:00.000Z"
    }
  ]
}
```

#### GET `/api/customers/:id` - Get Customer by ID (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-customer-id",
    "customerCode": "CUS1703123456",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+919876543210",
    "dateOfBirth": "1990-01-15",
    "panNumber": "ABCDE1234F",
    "address": "123, Main Street, Mumbai, Maharashtra 400001",
    "kycStatus": "VERIFIED",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### PUT `/api/customers/:id` - Update Customer Profile (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "phoneNumber": "+919876543299",
  "address": "456, New Street, Mumbai, Maharashtra 400002"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Customer profile updated successfully",
  "data": {
    "id": "uuid-customer-id",
    "phoneNumber": "+919876543299",
    "address": "456, New Street, Mumbai, Maharashtra 400002",
    "updatedAt": "2024-01-20T14:30:00.000Z"
  }
}
```

#### POST `/api/customers/:id/kyc` - Submit KYC Documents (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Request (multipart/form-data):**
```
panCard: <file>
aadhaarCard: <file>
addressProof: <file>
photograph: <file>
```

**Response (200):**
```json
{
  "success": true,
  "message": "KYC documents submitted successfully",
  "data": {
    "customerId": "uuid-customer-id",
    "kycStatus": "UNDER_REVIEW",
    "documentsSubmitted": ["PAN_CARD", "AADHAAR_CARD", "ADDRESS_PROOF", "PHOTOGRAPH"],
    "submittedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### POST `/api/customers/:id/verify-kyc` - Verify KYC (Loan Officer/Admin Only)

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "status": "VERIFIED",
  "remarks": "All documents verified successfully"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "KYC verified successfully",
  "data": {
    "customerId": "uuid-customer-id",
    "kycStatus": "VERIFIED",
    "verifiedById": "uuid-officer-id",
    "verifiedAt": "2024-01-16T09:15:00.000Z"
  }
}
```

---

### 6. Collateral Management APIs (`/api/collaterals`)

#### GET `/api/collaterals` - Get All Collaterals (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-collateral-id",
      "customerId": "uuid-customer-id",
      "mutualFundId": "uuid-mf-id",
      "mutualFundName": "HDFC Top 100 Fund",
      "amcName": "HDFC AMC",
      "folioNumber": "1234567890",
      "totalUnits": 1500,
      "pledgedUnits": 1000,
      "availableUnits": 500,
      "currentNav": 680,
      "pledgeValue": 680000,
      "status": "PLEDGED",
      "pledgedAt": "2024-01-20T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/collaterals/customer/:customerId` - Get Customer Collaterals (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "customerId": "uuid-customer-id",
    "totalPledgedValue": 1360000,
    "totalAvailableValue": 340000,
    "collaterals": [
      {
        "id": "uuid-collateral-id",
        "mutualFundName": "HDFC Top 100 Fund",
        "folioNumber": "1234567890",
        "totalUnits": 1500,
        "pledgedUnits": 1000,
        "availableUnits": 500,
        "currentNav": 680,
        "pledgeValue": 680000,
        "status": "PLEDGED"
      },
      {
        "id": "uuid-collateral-id-2",
        "mutualFundName": "ICICI Prudential Bluechip Fund",
        "folioNumber": "0987654321",
        "totalUnits": 2000,
        "pledgedUnits": 1500,
        "availableUnits": 500,
        "currentNav": 450,
        "pledgeValue": 675000,
        "status": "PLEDGED"
      }
    ]
  }
}
```

#### POST `/api/collaterals/pledge` - Pledge Mutual Fund Units (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "holdingId": "uuid-holding-id",
  "units": 1000,
  "loanApplicationId": "uuid-application-id"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Mutual fund units pledged successfully",
  "data": {
    "collateralId": "uuid-collateral-id",
    "holdingId": "uuid-holding-id",
    "pledgedUnits": 1000,
    "pledgeValue": 680000,
    "ltvApplicable": 60,
    "eligibleLoanAmount": 408000,
    "pledgedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

#### POST `/api/collaterals/release` - Release Pledged Units (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "collateralId": "uuid-collateral-id",
  "units": 500,
  "reason": "Partial loan repayment"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pledged units released successfully",
  "data": {
    "collateralId": "uuid-collateral-id",
    "releasedUnits": 500,
    "remainingPledgedUnits": 500,
    "releasedAt": "2024-04-05T14:30:00.000Z"
  }
}
```

#### GET `/api/collaterals/valuation` - Get Current Valuation (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "valuationDate": "2024-04-05",
    "totalPledgedValue": 1380000,
    "totalLoanOutstanding": 800000,
    "currentLtv": 58,
    "marginCallThreshold": 70,
    "status": "HEALTHY",
    "collaterals": [
      {
        "mutualFundName": "HDFC Top 100 Fund",
        "pledgedUnits": 1000,
        "previousNav": 680,
        "currentNav": 695,
        "valueChange": "+2.2%",
        "currentValue": 695000
      }
    ]
  }
}
```

#### POST `/api/collaterals/import-holdings` - Import MF Holdings (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "casFile": "<base64-encoded-CAS-file>",
  "password": "optional-password"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Mutual fund holdings imported successfully",
  "data": {
    "importedHoldings": 5,
    "totalValue": 2500000,
    "holdings": [
      {
        "id": "uuid-holding-id",
        "mutualFundName": "HDFC Top 100 Fund",
        "amcName": "HDFC AMC",
        "folioNumber": "1234567890",
        "units": 1500,
        "currentNav": 680,
        "currentValue": 1020000
      }
    ]
  }
}
```

---

### 7. Partner API Endpoints (`/api/v1/partner`)

These APIs are for fintech partner integration.

#### POST `/api/v1/partner/auth/token` - Generate Partner Access Token

**Headers:** `X-API-Key: your-partner-api-key`

**Request:**
```json
{
  "partnerId": "partner-123",
  "secret": "partner-secret-key"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  }
}
```

#### POST `/api/v1/partner/applications/create` - Create Loan Application via API

**Headers:**
- `X-API-Key: your-partner-api-key`
- `Authorization: Bearer <partnerAccessToken>`

**Request:**
```json
{
  "customerId": "uuid-customer-id",
  "loanProductId": "uuid-product-id",
  "requestedAmount": 500000,
  "tenure": 24,
  "collateralMfIds": ["uuid-collateral-1", "uuid-collateral-2"],
  "callbackUrl": "https://partner.example.com/webhook"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Loan application created successfully",
  "data": {
    "applicationId": "uuid-application-id",
    "applicationNumber": "APP1703123456",
    "status": "SUBMITTED",
    "estimatedProcessingTime": "24-48 hours",
    "trackingUrl": "https://lms.nbfc.com/track/APP1703123456"
  }
}
```

#### GET `/api/v1/partner/applications/:applicationId/status` - Check Application Status

**Headers:**
- `X-API-Key: your-partner-api-key`
- `Authorization: Bearer <partnerAccessToken>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "applicationId": "uuid-application-id",
    "applicationNumber": "APP1703123456",
    "status": "APPROVED",
    "statusHistory": [
      {
        "status": "SUBMITTED",
        "timestamp": "2024-01-15T10:30:00.000Z"
      },
      {
        "status": "UNDER_REVIEW",
        "timestamp": "2024-01-15T14:00:00.000Z"
      },
      {
        "status": "APPROVED",
        "timestamp": "2024-01-16T09:15:00.000Z"
      }
    ],
    "approvedAmount": 500000,
    "nextSteps": "Loan agreement signing pending"
  }
}
```

#### POST `/api/v1/partner/applications/:applicationId/documents` - Upload Documents

**Headers:**
- `X-API-Key: your-partner-api-key`
- `Authorization: Bearer <partnerAccessToken>`
- `Content-Type: multipart/form-data`

**Request (multipart/form-data):**
```
documentType: "INCOME_PROOF"
document: <file>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "documentId": "uuid-document-id",
    "documentType": "INCOME_PROOF",
    "fileName": "salary_slip.pdf",
    "uploadedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### GET `/api/v1/partner/loan-products` - Get Available Loan Products

**Headers:**
- `X-API-Key: your-partner-api-key`
- `Authorization: Bearer <partnerAccessToken>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-product-id",
      "productCode": "LAMF-001",
      "productName": "Loan Against Mutual Funds - Standard",
      "minAmount": 50000,
      "maxAmount": 5000000,
      "interestRate": 10.5,
      "ltvRatio": 60,
      "eligibleMfCategories": ["EQUITY", "DEBT", "HYBRID"]
    }
  ]
}
```

#### POST `/api/v1/partner/webhooks/register` - Register Webhook Endpoint

**Headers:**
- `X-API-Key: your-partner-api-key`
- `Authorization: Bearer <partnerAccessToken>`

**Request:**
```json
{
  "webhookUrl": "https://partner.example.com/lms-webhook",
  "events": ["APPLICATION_STATUS_CHANGED", "LOAN_DISBURSED", "EMI_DUE", "MARGIN_CALL"],
  "secret": "webhook-signing-secret"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Webhook registered successfully",
  "data": {
    "webhookId": "uuid-webhook-id",
    "webhookUrl": "https://partner.example.com/lms-webhook",
    "events": ["APPLICATION_STATUS_CHANGED", "LOAN_DISBURSED", "EMI_DUE", "MARGIN_CALL"],
    "status": "ACTIVE",
    "registeredAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 8. Health Check

#### GET `/health` - Health Check Endpoint

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "uptime": "72h 30m 15s"
}
```

---

### Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action"
  }
}
```

#### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

#### 409 Conflict
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_ENTRY",
    "message": "Resource already exists"
  }
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

### Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Headers returned:**
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

#### 429 Too Many Requests
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 900
  }
}
```

## 🎯 Key Improvements Over CRA

1. **Vite Instead of CRA**:
   - ⚡ Much faster build times
   - 🔥 Hot Module Replacement (HMR)
   - 📦 Smaller bundle size
   - 🚀 Better development experience

2. **Pino Logger**:
   - High-performance logging
   - Human-readable API response times (ms, s, min)
   - Structured logging for production

3. **Prisma ORM**:
   - Type-safe database queries
   - Auto-generated migrations
   - Better developer experience

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Input validation and sanitization
- API rate limiting
- Role-based access control (RBAC)
- Sensitive data encryption (Aadhaar, etc.)
- IP whitelisting for partner APIs

## 📊 Database Schema

The system uses PostgreSQL with the following main entities:
- Users & Authentication
- Loan Products
- Customers
- Loan Applications
- Active Loans
- Mutual Funds
- Customer MF Holdings
- Loan Collaterals
- EMI Schedule
- Transactions
- API Partners
- Audit Logs

## 🎨 UI Components

Reusable components with Tailwind CSS:
- **Button** - Multiple variants (primary, secondary, accent, outline, ghost)
- **Card** - Content containers with shadows
- **Input** - Form inputs with validation states
- **Badge** - Status indicators
- **Table** - Data display with pagination
- **Alert** - Notification messages

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints for tablet and desktop
- Collapsible sidebar
- Touch-friendly interface

## 🚦 Development Workflow

1. **Development**: Local with Vite HMR
2. **Testing**: Jest for unit tests
3. **Build**: `npm run build` for production
4. **Deploy**: Docker ready (add Dockerfile as needed)

## 📈 Performance

- Vite's lightning-fast HMR
- Code splitting with React.lazy()
- Optimized bundle size
- Pino's high-performance logging
- Database query optimization with Prisma

## 👨‍💻 Developer Experience

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Hot reloading with Vite
- Prisma Studio for database management
- Comprehensive error messages

## 🔄 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics dashboard
- [ ] Mobile app with React Native
- [ ] AI-based credit scoring
- [ ] Automated document verification
- [ ] Multi-language support

## 📞 Support

For any issues or questions, please refer to the SYSTEM_DESIGN.md file for detailed architecture information.

---

Built with ❤️ using modern web technologies. Powered by Vite ⚡ instead of deprecated Create React App.