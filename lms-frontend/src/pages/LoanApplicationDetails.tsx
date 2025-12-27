// src/pages/LoanApplicationDetails.tsx
// Loan Application Details page with approve/reject functionality

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axiosConfig';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

interface LoanApplication {
  id: string;
  applicationNumber: string;
  status: string;
  requestedAmount: number;
  tenure: number;
  purpose: string;
  employmentType: string;
  monthlyIncome: number;
  existingEMI: number;
  submittedDate: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    pan: string;
    aadhaar: string;
  };
  loanProduct: {
    name: string;
    interestRate: number;
    processingFee: number;
    minAmount: number;
    maxAmount: number;
  };
  reviewNotes?: string;
  rejectionReason?: string;
}

const LoanApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const isLoanOfficer = user?.role === 'LOAN_OFFICER' || user?.role === 'ADMIN';

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/loan-applications/${id}`);
      setApplication(response.data.data);
    } catch (err) {
      console.error('Error fetching application details:', err);
      setError(err.response?.data?.error || 'Failed to fetch application details');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this application?')) {
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      await axios.post(`/api/loan-applications/${id}/approve`);
      alert('Application approved successfully!');
      await fetchApplicationDetails(); // Refresh the data
    } catch (err) {
      console.error('Error approving application:', err);
      setError(err.response?.data?.error || 'Failed to approve application');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      await axios.post(`/api/loan-applications/${id}/reject`, {
        reason: rejectionReason
      });
      alert('Application rejected successfully!');
      setShowRejectModal(false);
      await fetchApplicationDetails(); // Refresh the data
    } catch (err) {
      console.error('Error rejecting application:', err);
      setError(err.response?.data?.error || 'Failed to reject application');
    } finally {
      setProcessing(false);
    }
  };

  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { variant: 'gray' as const, label: 'Draft' },
      SUBMITTED: { variant: 'warning' as const, label: 'Submitted' },
      UNDER_REVIEW: { variant: 'warning' as const, label: 'Under Review' },
      APPROVED: { variant: 'success' as const, label: 'Approved' },
      DISBURSED: { variant: 'info' as const, label: 'Disbursed' },
      REJECTED: { variant: 'error' as const, label: 'Rejected' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] ||
                   { variant: 'gray' as const, label: status };
    return <Badge variant={config.variant} dot>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchApplicationDetails}>Retry</Button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-8 text-gray-500">
        Application not found
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Application #{application.applicationNumber}
          </h1>
          <p className="mt-2 text-gray-600">
            Submitted on {formatDate(application.submittedDate)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {getStatusBadge(application.status)}
          <Button variant="ghost" onClick={() => navigate('/loan-applications')}>
            Back to Applications
          </Button>
        </div>
      </div>

      {/* Action Buttons for Loan Officers */}
      {isLoanOfficer && (application.status === 'SUBMITTED' || application.status === 'UNDER_REVIEW') && (
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-yellow-900">Action Required</h3>
              <p className="text-yellow-700">This application is pending your review</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleApprove}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Approve Application'}
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowRejectModal(true)}
                disabled={processing}
              >
                Reject Application
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Application Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">
                {application.customer.firstName} {application.customer.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{application.customer.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{application.customer.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PAN</p>
              <p className="font-medium">{application.customer.pan}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Aadhaar</p>
              <p className="font-medium">XXXX-XXXX-{application.customer.aadhaar.slice(-4)}</p>
            </div>
          </div>
        </Card>

        {/* Loan Details */}
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Loan Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Product</p>
              <p className="font-medium">{application.loanProduct.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Requested Amount</p>
              <p className="font-medium text-lg">{formatAmount(application.requestedAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tenure</p>
              <p className="font-medium">{application.tenure} months</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interest Rate</p>
              <p className="font-medium">{application.loanProduct.interestRate}% p.a.</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Processing Fee</p>
              <p className="font-medium">{application.loanProduct.processingFee}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Purpose</p>
              <p className="font-medium">{application.purpose}</p>
            </div>
          </div>
        </Card>

        {/* Financial Information */}
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Financial Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Employment Type</p>
              <p className="font-medium">{application.employmentType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Income</p>
              <p className="font-medium">{formatAmount(application.monthlyIncome)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Existing EMI</p>
              <p className="font-medium">{formatAmount(application.existingEMI)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Net Income</p>
              <p className="font-medium text-green-600">
                {formatAmount(application.monthlyIncome - application.existingEMI)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Review Notes or Rejection Reason */}
      {(application.reviewNotes || application.rejectionReason) && (
        <Card className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Review Information</h3>
          {application.reviewNotes && (
            <div className="mb-3">
              <p className="text-sm text-gray-600">Review Notes</p>
              <p className="font-medium">{application.reviewNotes}</p>
            </div>
          )}
          {application.rejectionReason && (
            <div>
              <p className="text-sm text-gray-600">Rejection Reason</p>
              <p className="font-medium text-red-600">{application.rejectionReason}</p>
            </div>
          )}
        </Card>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Reject Application</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this application:
            </p>
            <textarea
              className="w-full p-3 border rounded-lg"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
              >
                {processing ? 'Processing...' : 'Reject Application'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanApplicationDetails;