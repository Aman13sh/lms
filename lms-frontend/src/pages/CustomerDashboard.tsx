// src/pages/CustomerDashboard.tsx
// Dashboard for customer users showing their loans and applications

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import loanApplicationService from '../services/loanApplicationService';
import type { DashboardStats, LoanApplication } from '../services/loanApplicationService';

const CustomerDashboard: React.FC = () => {
  const { getDisplayName } = useAuth();
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
      setApplications(applicationsData.slice(0, 3)); // Show only recent 3 applications
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { variant: 'success' as const, label: 'Active' },
      active: { variant: 'success' as const, label: 'Active' },
      UNDER_REVIEW: { variant: 'warning' as const, label: 'Under Review' },
      under_review: { variant: 'warning' as const, label: 'Under Review' },
      APPROVED: { variant: 'success' as const, label: 'Approved' },
      approved: { variant: 'success' as const, label: 'Approved' },
      REJECTED: { variant: 'error' as const, label: 'Rejected' },
      rejected: { variant: 'error' as const, label: 'Rejected' },
      DRAFT: { variant: 'gray' as const, label: 'Draft' },
      draft: { variant: 'gray' as const, label: 'Draft' },
      DISBURSED: { variant: 'info' as const, label: 'Disbursed' },
      disbursed: { variant: 'info' as const, label: 'Disbursed' },
      CLOSED: { variant: 'secondary' as const, label: 'Closed' },
      closed: { variant: 'secondary' as const, label: 'Closed' },
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
        <Button onClick={fetchDashboardData}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {getDisplayName()}!</h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your loans and applications.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Link to="/loan-applications/new">
          <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm">Quick Action</p>
                <p className="text-xl font-bold mt-1">Apply for Loan</p>
              </div>
              <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </Card>
        </Link>

        <Card className="bg-white">
          <div>
            <p className="text-gray-500 text-sm">Total Outstanding</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatAmount(stats?.totalOutstanding)}
            </p>
          </div>
        </Card>

        <Card className="bg-white">
          <div>
            <p className="text-gray-500 text-sm">Active Loans</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats?.activeLoans || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Loan(s) active</p>
          </div>
        </Card>

        <Card className="bg-white">
          <div>
            <p className="text-gray-500 text-sm">Credit Score</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats?.creditScore || 750}
            </p>
            <p className="text-sm text-gray-600 mt-1">Excellent</p>
          </div>
        </Card>
      </div>

      {/* Active Loans */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">My Active Loans</h2>
          <Link to="/ongoing-loans">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>

        {/* Show empty state for now since we don't have loans in DB yet */}
        <div className="text-center py-8">
          <p className="text-gray-500">
            {stats?.activeLoans > 0
              ? 'Loading loan details...'
              : 'No active loans'}
          </p>
          <Link to="/loan-applications/new">
            <Button variant="primary" size="sm" className="mt-4">Apply for a Loan</Button>
          </Link>
        </div>
      </Card>

      {/* Recent Applications */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
          <Link to="/loan-applications">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>

        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Application ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Applied On</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{app.applicationNumber}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{app.productName}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{formatAmount(app.requestedAmount)}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{formatDate(app.submittedDate)}</td>
                    <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                    <td className="py-3 px-4">
                      <Link to={`/loan-applications/${app.id}`}>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No loan applications yet</p>
            <Link to="/loan-applications/new">
              <Button variant="primary" size="sm" className="mt-4">Apply Now</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomerDashboard;