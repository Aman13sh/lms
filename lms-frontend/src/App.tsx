// src/App.tsx
// Main application component with routing (Vite version)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Configure axios with interceptors
import './utils/axiosConfig';

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Main Pages
import Dashboard from './pages/Dashboard';
import LoanProducts from './pages/LoanProducts';
import LoanApplications from './pages/LoanApplications';
import LoanApplicationDetails from './pages/LoanApplicationDetails';
import NewApplication from './pages/NewApplication';
import OngoingLoans from './pages/OngoingLoans';
import CollateralManagement from './pages/CollateralManagement';

// Auth Guard Component - Now uses the auth context
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // You can return a loading spinner here
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Main App Routes component (separate from App to use auth context)
function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#00b874',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout userRole={user?.role as any} />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="loan-products" element={<LoanProducts />} />
          <Route path="loan-applications" element={<LoanApplications />} />
          <Route path="loan-applications/new" element={<NewApplication />} />
          <Route path="loan-applications/:id" element={<LoanApplicationDetails />} />
          <Route path="ongoing-loans" element={<OngoingLoans />} />
          <Route path="collateral" element={<CollateralManagement />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

// Main App component with Router and AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;