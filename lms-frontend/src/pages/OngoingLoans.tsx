// src/pages/OngoingLoans.tsx
// Ongoing loans management page

import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

interface Loan {
  id: string;
  loanNumber: string;
  customerName: string;
  productName: string;
  principalAmount: number;
  outstandingAmount: number;
  emiAmount: number;
  nextEmiDate: string;
  emisPaid: number;
  totalEmis: number;
  status: 'active' | 'overdue' | 'prepaid';
  interestRate: number;
}

const OngoingLoans: React.FC = () => {

  const loans: Loan[] = [
    {
      id: '1',
      loanNumber: 'LN202411001',
      customerName: 'John Doe',
      productName: 'Gold Plan - Premium Loan',
      principalAmount: 500000,
      outstandingAmount: 425000,
      emiAmount: 21500,
      nextEmiDate: '2025-01-05',
      emisPaid: 3,
      totalEmis: 24,
      status: 'active',
      interestRate: 10.5,
    },
    {
      id: '2',
      loanNumber: 'LN202410002',
      customerName: 'Jane Smith',
      productName: 'Silver Plan - Standard Loan',
      principalAmount: 350000,
      outstandingAmount: 280000,
      emiAmount: 19800,
      nextEmiDate: '2025-01-10',
      emisPaid: 5,
      totalEmis: 18,
      status: 'active',
      interestRate: 12.0,
    },
    {
      id: '3',
      loanNumber: 'LN202409003',
      customerName: 'Mike Johnson',
      productName: 'Flexi Loan - Overdraft',
      principalAmount: 725000,
      outstandingAmount: 650000,
      emiAmount: 24500,
      nextEmiDate: '2024-12-28',
      emisPaid: 4,
      totalEmis: 36,
      status: 'overdue',
      interestRate: 11.5,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" dot>Active</Badge>;
      case 'overdue':
        return <Badge variant="error" dot>Overdue</Badge>;
      case 'prepaid':
        return <Badge variant="info" dot>Prepaid</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const calculateProgress = (paid: number, total: number) => {
    return Math.round((paid / total) * 100);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ongoing Loans</h1>
        <p className="mt-2 text-gray-600">Manage and track your active loan accounts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-primary-50 to-primary-100">
          <p className="text-sm text-primary-700">Total Active Loans</p>
          <p className="text-2xl font-bold text-primary-900">{loans.length}</p>
        </Card>
        <Card className="bg-gradient-to-r from-secondary-50 to-secondary-100">
          <p className="text-sm text-secondary-700">Total Outstanding</p>
          <p className="text-2xl font-bold text-secondary-900">
            {formatCurrency(loans.reduce((sum, loan) => sum + loan.outstandingAmount, 0))}
          </p>
        </Card>
        <Card className="bg-gradient-to-r from-accent-50 to-accent-100">
          <p className="text-sm text-accent-700">Next EMI Due</p>
          <p className="text-2xl font-bold text-accent-900">Dec 28, 2024</p>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100">
          <p className="text-sm text-yellow-700">Overdue Loans</p>
          <p className="text-2xl font-bold text-yellow-900">
            {loans.filter(l => l.status === 'overdue').length}
          </p>
        </Card>
      </div>

      {/* Loans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loans.map((loan) => (
          <Card key={loan.id} className="hover:shadow-hard transition-shadow">
            {/* Loan Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{loan.loanNumber}</h3>
                <p className="text-sm text-gray-600">{loan.customerName}</p>
                <p className="text-xs text-gray-500 mt-1">{loan.productName}</p>
              </div>
              {getStatusBadge(loan.status)}
            </div>

            {/* Loan Details */}
            <div className="space-y-4">
              {/* EMI Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">EMI Progress</span>
                  <span className="font-medium">{loan.emisPaid} / {loan.totalEmis} EMIs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all"
                    style={{ width: `${calculateProgress(loan.emisPaid, loan.totalEmis)}%` }}
                  />
                </div>
              </div>

              {/* Amount Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Principal Amount</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(loan.principalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Outstanding</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(loan.outstandingAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">EMI Amount</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(loan.emiAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next EMI Date</p>
                  <p className="font-semibold text-gray-900">{loan.nextEmiDate}</p>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Interest Rate</span>
                <span className="font-semibold text-primary-600">{loan.interestRate}% p.a.</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button variant="primary" size="sm" fullWidth>
                  Pay EMI
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  View Details
                </Button>
                <Button variant="ghost" size="sm" fullWidth>
                  Statement
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* EMI Calendar */}
      <Card className="mt-8" title="EMI Calendar" subtitle="Upcoming EMI payments for all loans">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Loan Number</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">EMI Amount</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="py-3 text-sm">Dec 28, 2024</td>
                <td className="py-3 text-sm font-medium">LN202409003</td>
                <td className="py-3 text-sm font-medium">{formatCurrency(24500)}</td>
                <td className="py-3"><Badge variant="error" dot>Overdue</Badge></td>
                <td className="py-3">
                  <Button variant="primary" size="sm">Pay Now</Button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 text-sm">Jan 05, 2025</td>
                <td className="py-3 text-sm font-medium">LN202411001</td>
                <td className="py-3 text-sm font-medium">{formatCurrency(21500)}</td>
                <td className="py-3"><Badge variant="warning" dot>Upcoming</Badge></td>
                <td className="py-3">
                  <Button variant="outline" size="sm">Schedule</Button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 text-sm">Jan 10, 2025</td>
                <td className="py-3 text-sm font-medium">LN202410002</td>
                <td className="py-3 text-sm font-medium">{formatCurrency(19800)}</td>
                <td className="py-3"><Badge variant="warning" dot>Upcoming</Badge></td>
                <td className="py-3">
                  <Button variant="outline" size="sm">Schedule</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default OngoingLoans;