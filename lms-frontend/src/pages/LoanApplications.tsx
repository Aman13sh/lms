// src/pages/LoanApplications.tsx
// Loan Applications listing and management page

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import loanApplicationService from '../services/loanApplicationService';
import type { LoanApplication } from '../services/loanApplicationService';

const LoanApplications: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isCustomer = user?.role === 'CUSTOMER';

  // Fetch applications from API
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await loanApplicationService.getApplications();
      setApplications(data);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.error || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  // Format amount for display
  const formatAmount = (amount: number | undefined) => {
    if (!amount) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

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

  const columns = [
    {
      key: 'applicationNumber',
      header: 'Application ID',
      accessor: 'applicationNumber' as keyof LoanApplication,
    },
    {
      key: 'customerName',
      header: 'Customer',
      accessor: 'customerName' as keyof LoanApplication,
    },
    {
      key: 'productName',
      header: 'Product',
      accessor: 'productName' as keyof LoanApplication,
    },
    {
      key: 'requestedAmount',
      header: 'Amount',
      accessor: (row: LoanApplication) => formatAmount(row.requestedAmount),
      className: 'font-medium',
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (row: LoanApplication) => getStatusBadge(row.status),
    },
    {
      key: 'submittedDate',
      header: 'Submitted',
      accessor: (row: LoanApplication) => formatDate(row.submittedDate),
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row: LoanApplication) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/loan-applications/${row.id}`)}>
          View Details
        </Button>
      ),
    },
  ];

  const filteredApplications = filter === 'all'
    ? applications
    : applications.filter(app =>
        app.status.toUpperCase() === filter.toUpperCase() ||
        app.status.toLowerCase() === filter.toLowerCase()
      );

  const stats = {
    total: applications.length,
    draft: applications.filter(a => a.status.toUpperCase() === 'DRAFT').length,
    under_review: applications.filter(a => a.status.toUpperCase() === 'UNDER_REVIEW').length,
    approved: applications.filter(a => a.status.toUpperCase() === 'APPROVED').length,
    disbursed: applications.filter(a => a.status.toUpperCase() === 'DISBURSED').length,
    rejected: applications.filter(a => a.status.toUpperCase() === 'REJECTED').length,
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
        <Button onClick={fetchApplications}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isCustomer ? 'My Loan Applications' : 'Loan Applications'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isCustomer ? 'Track your loan application status' : 'Manage and track all loan applications'}
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/loan-applications/new')}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Application
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card
          className={`cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-primary-500' : ''}`}
          onClick={() => setFilter('all')}
        >
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${filter === 'draft' ? 'ring-2 ring-gray-500' : ''}`}
          onClick={() => setFilter('draft')}
        >
          <p className="text-sm text-gray-600">Draft</p>
          <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${filter === 'under_review' ? 'ring-2 ring-yellow-500' : ''}`}
          onClick={() => setFilter('under_review')}
        >
          <p className="text-sm text-yellow-600">Under Review</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.under_review}</p>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${filter === 'approved' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => setFilter('approved')}
        >
          <p className="text-sm text-green-600">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${filter === 'disbursed' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilter('disbursed')}
        >
          <p className="text-sm text-blue-600">Disbursed</p>
          <p className="text-2xl font-bold text-blue-600">{stats.disbursed}</p>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${filter === 'rejected' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          <p className="text-sm text-red-600">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        {filteredApplications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No applications found
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredApplications}
            onRowClick={(row) => navigate(`/loan-applications/${row.id}`)}
          />
        )}
      </Card>
    </div>
  );
};

export default LoanApplications;