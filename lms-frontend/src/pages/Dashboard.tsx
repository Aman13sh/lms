// src/pages/Dashboard.tsx
// Dashboard page with different views based on user role

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import loanApplicationService from '../services/loanApplicationService';
import type { DashboardStats, LoanApplication } from '../services/loanApplicationService';

// Admin/Officer Dashboard Component
const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, applicationsData] = await Promise.all([
        loanApplicationService.getDashboardStats(),
        loanApplicationService.getApplications()
      ]);
      setStats(statsData);
      setApplications(applicationsData.slice(0, 5)); // Show only recent 5 applications
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.error || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Format amount for display
  const formatAmount = (amount: number | undefined) => {
    if (!amount) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Sample data for charts (will be replaced with real data later)
  const loanTrendData = [
    { month: 'Jan', applications: 45, approved: 38, disbursed: 35 },
    { month: 'Feb', applications: 52, approved: 44, disbursed: 40 },
    { month: 'Mar', applications: 61, approved: 55, disbursed: 51 },
    { month: 'Apr', applications: 58, approved: 50, disbursed: 47 },
    { month: 'May', applications: 69, approved: 62, disbursed: 58 },
    { month: 'Jun', applications: 76, approved: 68, disbursed: 64 },
  ];

  const portfolioData = [
    { name: 'Equity Funds', value: 45, color: '#0074e6' },
    { name: 'Debt Funds', value: 30, color: '#00b874' },
    { name: 'Hybrid Funds', value: 15, color: '#00a7bd' },
    { name: 'Others', value: 10, color: '#6b7280' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { variant: 'gray' as const, label: 'Draft' },
      draft: { variant: 'gray' as const, label: 'Draft' },
      UNDER_REVIEW: { variant: 'warning' as const, label: 'Under Review' },
      under_review: { variant: 'warning' as const, label: 'Under Review' },
      APPROVED: { variant: 'success' as const, label: 'Approved' },
      approved: { variant: 'success' as const, label: 'Approved' },
      DISBURSED: { variant: 'info' as const, label: 'Disbursed' },
      disbursed: { variant: 'info' as const, label: 'Disbursed' },
      REJECTED: { variant: 'error' as const, label: 'Rejected' },
      rejected: { variant: 'error' as const, label: 'Rejected' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] ||
                   { variant: 'gray' as const, label: status };
    return <Badge variant={config.variant} dot>{config.label}</Badge>;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's an overview of your loan management system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100">Total Applications</p>
              <p className="text-3xl font-bold mt-2">{stats?.totalApplications || 0}</p>
              <p className="text-primary-100 text-sm mt-2">
                All loan applications
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100">Active Loans</p>
              <p className="text-3xl font-bold mt-2">{stats?.activeLoans || 0}</p>
              <p className="text-secondary-100 text-sm mt-2">
                Worth <span className="text-white font-medium">{formatAmount(stats?.totalOutstanding)}</span>
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-accent-500 to-accent-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100">Total Collateral</p>
              <p className="text-3xl font-bold mt-2">{formatAmount(stats?.totalCollateral)}</p>
              <p className="text-accent-100 text-sm mt-2">
                Secured collateral value
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Customers</p>
              <p className="text-3xl font-bold mt-2">{stats?.totalCustomers || 0}</p>
              <p className="text-purple-100 text-sm mt-2">
                Registered customers
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Loan Application Trends" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={loanTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area type="monotone" dataKey="applications" stackId="1" stroke="#0074e6" fill="#0074e6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="approved" stackId="2" stroke="#00b874" fill="#00b874" fillOpacity={0.6} />
              <Area type="monotone" dataKey="disbursed" stackId="3" stroke="#00a7bd" fill="#00a7bd" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Applications</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-secondary-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Approved</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-accent-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Disbursed</span>
            </div>
          </div>
        </Card>

        <Card title="Collateral Portfolio Distribution" subtitle="By fund type">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Applications Table */}
      <Card
        title="Recent Loan Applications"
        subtitle="Latest applications requiring attention"
        headerAction={
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <span className="text-sm font-medium text-gray-900">{app.applicationNumber}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-gray-900">{app.customerName}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm font-medium text-gray-900">{formatAmount(app.requestedAmount)}</span>
                    </td>
                    <td className="py-3">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-gray-600">{formatDate(app.submittedDate)}</span>
                    </td>
                    <td className="py-3">
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// Main Dashboard Component with Role-Based Rendering
const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Show CustomerDashboard for customers, AdminDashboard for admin/officers
  if (user?.role === 'CUSTOMER') {
    return <CustomerDashboard />;
  }

  // For ADMIN and OFFICER roles, show the admin dashboard
  return <AdminDashboard />;
};

export default Dashboard;