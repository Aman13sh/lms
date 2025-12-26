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

### Partner API Endpoints (Fintech Integration)

Base URL: `http://localhost:5001/api/v1/partner`

#### Authentication
```
POST /auth/token
Headers: X-API-Key: your-api-key
```

#### Create Loan Application
```
POST /applications/create
Headers: X-API-Key: your-api-key
Body: {
  customerId: string,
  loanProductId: string,
  requestedAmount: number,
  tenure: number,
  collateralMfIds: string[]
}
```

#### Check Application Status
```
GET /applications/:applicationId/status
Headers: X-API-Key: your-api-key
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