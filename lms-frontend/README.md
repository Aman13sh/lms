# LMS Frontend - Loan Management System UI

Frontend application for the Loan Management System (LMS) for Non-Banking Financial Companies. Built with React, TypeScript, and TailwindCSS.

## Features

### Customer Features
- User registration with KYC details
- Login/logout with JWT authentication
- Dashboard with loan application overview
- Apply for loans against mutual funds
- Track application status
- View loan products
- Manage collateral
- View ongoing loans

### Admin Features
- User management
- Loan product configuration
- System monitoring

### Loan Officer Features
- Review loan applications
- Approve/reject applications
- View customer details

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router v6** - Routing
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **js-cookie** - Cookie management
- **React Hot Toast** - Notifications
- **Recharts** - Data visualization

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Backend API running on port 5001

## Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd lms-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration (Optional)
Create `.env` file:
```env
VITE_API_URL=http://localhost:5001
```

### 4. Start Development Server
```bash
npm run dev
```

Application runs on http://localhost:5173

## Project Structure

```
lms-frontend/
├── src/
│   ├── assets/              # Static assets
│   ├── components/          # Reusable components
│   │   ├── layout/         # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/             # UI components
│   │       ├── Alert.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       └── Modal.tsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── pages/              # Page components
│   │   ├── auth/          # Authentication pages
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── CustomerDashboard.tsx
│   │   ├── NewApplication.tsx
│   │   ├── LoanApplications.tsx
│   │   ├── LoanProducts.tsx
│   │   ├── CollateralManagement.tsx
│   │   └── OngoingLoans.tsx
│   ├── services/           # API services
│   │   ├── authService.ts
│   │   └── loanApplicationService.ts
│   ├── utils/              # Utilities
│   │   ├── axiosConfig.ts  # Axios configuration
│   │   ├── formatters.ts   # Data formatters
│   │   └── helpers.ts      # Helper functions
│   ├── App.tsx             # Main app component
│   ├── App.css             # Global styles
│   └── main.tsx            # Entry point
├── public/                  # Public assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # TailwindCSS config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

## Available Pages

### Authentication
- `/login` - User login
- `/register` - New user registration

### Customer Pages
- `/dashboard` - Customer dashboard
- `/new-application` - Apply for new loan
- `/loan-applications` - View all applications
- `/loan-products` - Available loan products
- `/collateral-management` - Manage mutual funds
- `/ongoing-loans` - Active loans

### Admin Pages
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/products` - Product management

## Key Components

### Authentication Flow
1. User logs in with credentials
2. Backend returns JWT tokens
3. Tokens stored in cookies
4. Axios interceptor adds token to requests
5. Automatic token refresh on expiry

### Loan Application Process
1. **Product Selection** - Choose loan product
2. **Loan Details** - Enter amount, tenure, purpose
3. **Financial Information** - Monthly income, existing EMI
4. **Collateral Selection** - Select mutual funds to pledge
5. **Review & Submit** - Final submission

## API Integration

### Configuration
Base URL configured in `src/utils/axiosConfig.ts`
```typescript
axios.defaults.baseURL = 'http://localhost:5001';
```

### Authentication Headers
Automatically added via axios interceptor:
```typescript
Authorization: Bearer <token>
```

### Error Handling
- Global error interceptor
- Toast notifications for user feedback
- Automatic redirect on authentication failure

## Available Scripts

```bash
# Development
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build

# Code Quality
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
```

## Styling

### TailwindCSS Configuration
- Custom color palette
- Responsive utilities
- Component classes

### Color Scheme
- Primary: Blue shades
- Secondary: Gray shades
- Success: Green
- Error: Red
- Warning: Yellow

## State Management

### Context API
- **AuthContext** - User authentication state
- Provides user data, tokens, login/logout functions

### Local State
- Form state with React Hook Form
- Component state with useState

## Form Validation

Using React Hook Form with validation rules:
- Required fields
- Email validation
- Password strength
- Amount limits
- Tenure constraints

## Environment Variables

```env
VITE_API_URL=http://localhost:5001  # Backend API URL
```

## Build & Deployment

### Production Build
```bash
npm run build
```

Creates optimized build in `dist/` directory

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to Netlify
1. Build the project
2. Upload `dist/` folder to Netlify

## Default Users

After running backend seed:

**Admin**
- admin@lmsnbfc.com / Admin@123

**Loan Officer**
- officer@lmsnbfc.com / Officer@123

**Customers**
- john.doe@gmail.com / Customer@123
- jane.smith@gmail.com / Customer@123
- rajesh.kumar@gmail.com / Customer@123

## Troubleshooting

### Backend Connection Issues
1. Verify backend is running on port 5001
2. Check CORS configuration
3. Verify API URL in axiosConfig.ts

### Authentication Issues
1. Clear browser cookies
2. Check token expiration
3. Verify backend JWT configuration

### Build Errors
1. Clear node_modules and reinstall
2. Check TypeScript errors
3. Verify import paths

### Styling Issues
1. Restart dev server after tailwind.config changes
2. Clear browser cache
3. Check for CSS conflicts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Code splitting with React.lazy
- Image optimization
- Bundle size optimization
- Memoization for expensive operations

## Security

- JWT stored in httpOnly cookies
- XSS protection with React
- Input sanitization
- HTTPS in production

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests and linting
5. Submit pull request

## License

MIT

## Support

For issues or questions, please contact the development team.