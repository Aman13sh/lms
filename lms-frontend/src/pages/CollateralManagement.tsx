// src/pages/CollateralManagement.tsx
// Collateral (Mutual Funds) management page

import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

interface MutualFund {
  id: string;
  schemeName: string;
  amcName: string;
  category: string;
  folioNumber: string;
  unitsHeld: number;
  unitsPledged: number;
  unitsFree: number;
  currentNav: number;
  currentValue: number;
  pledgedValue: number;
  ltvRatio: number;
  status: 'pledged' | 'free' | 'partial';
}

const CollateralManagement: React.FC = () => {
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  

  const mutualFunds: MutualFund[] = [
    {
      id: '1',
      schemeName: 'HDFC Top 100 Fund - Growth',
      amcName: 'HDFC Mutual Fund',
      category: 'Large Cap',
      folioNumber: '1234567890',
      unitsHeld: 500,
      unitsPledged: 300,
      unitsFree: 200,
      currentNav: 850.25,
      currentValue: 425125,
      pledgedValue: 255075,
      ltvRatio: 60,
      status: 'partial',
    },
    {
      id: '2',
      schemeName: 'ICICI Prudential Bluechip Fund',
      amcName: 'ICICI Prudential MF',
      category: 'Large Cap',
      folioNumber: '0987654321',
      unitsHeld: 750,
      unitsPledged: 750,
      unitsFree: 0,
      currentNav: 625.50,
      currentValue: 469125,
      pledgedValue: 469125,
      ltvRatio: 65,
      status: 'pledged',
    },
    {
      id: '3',
      schemeName: 'SBI Magnum Midcap Fund',
      amcName: 'SBI Mutual Fund',
      category: 'Mid Cap',
      folioNumber: '5555555555',
      unitsHeld: 300,
      unitsPledged: 0,
      unitsFree: 300,
      currentNav: 450.75,
      currentValue: 135225,
      pledgedValue: 0,
      ltvRatio: 0,
      status: 'free',
    },
    {
      id: '4',
      schemeName: 'Axis Focused 25 Fund',
      amcName: 'Axis Mutual Fund',
      category: 'Multi Cap',
      folioNumber: '9999999999',
      unitsHeld: 400,
      unitsPledged: 200,
      unitsFree: 200,
      currentNav: 775.30,
      currentValue: 310120,
      pledgedValue: 155060,
      ltvRatio: 55,
      status: 'partial',
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
      case 'pledged':
        return <Badge variant="error" dot>Fully Pledged</Badge>;
      case 'partial':
        return <Badge variant="warning" dot>Partially Pledged</Badge>;
      case 'free':
        return <Badge variant="success" dot>Free</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const totalStats = {
    totalValue: mutualFunds.reduce((sum, fund) => sum + fund.currentValue, 0),
    pledgedValue: mutualFunds.reduce((sum, fund) => sum + fund.pledgedValue, 0),
    freeValue: mutualFunds.reduce((sum, fund) => sum + (fund.currentValue - fund.pledgedValue), 0),
    totalSchemes: mutualFunds.length,
  };

  const eligibleLoanAmount = totalStats.freeValue * 0.6; // 60% LTV on free units

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Collateral Management</h1>
        <p className="mt-2 text-gray-600">Manage your mutual fund holdings and pledged securities</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-primary-50 to-primary-100">
          <p className="text-sm text-primary-700">Total Portfolio Value</p>
          <p className="text-2xl font-bold text-primary-900">{formatCurrency(totalStats.totalValue)}</p>
        </Card>
        <Card className="bg-gradient-to-r from-red-50 to-red-100">
          <p className="text-sm text-red-700">Pledged Value</p>
          <p className="text-2xl font-bold text-red-900">{formatCurrency(totalStats.pledgedValue)}</p>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <p className="text-sm text-green-700">Free Value</p>
          <p className="text-2xl font-bold text-green-900">{formatCurrency(totalStats.freeValue)}</p>
        </Card>
        <Card className="bg-gradient-to-r from-secondary-50 to-secondary-100">
          <p className="text-sm text-secondary-700">Eligible Loan Amount</p>
          <p className="text-2xl font-bold text-secondary-900">{formatCurrency(eligibleLoanAmount)}</p>
        </Card>
      </div>

      {/* Alert for Margin Call */}
      <Alert
        type="warning"
        title="Margin Call Alert"
        message="Your ICICI Prudential Bluechip Fund has dropped below the required margin. Please add more collateral or reduce your loan amount."
        className="mb-6"
      />

      {/* Actions Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Button variant="primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Holding
          </Button>
          <Button variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import from Demat
          </Button>
        </div>
        <Button variant="secondary" disabled={selectedFunds.length === 0}>
          Pledge Selected ({selectedFunds.length})
        </Button>
      </div>

      {/* Mutual Funds Table */}
      <Card title="Your Mutual Fund Holdings" subtitle="Manage pledging and release of your MF units">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFunds(mutualFunds.map(f => f.id));
                      } else {
                        setSelectedFunds([]);
                      }
                    }}
                  />
                </th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Scheme Details</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Units</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">NAV</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mutualFunds.map((fund) => (
                <tr key={fund.id} className="hover:bg-gray-50">
                  <td className="py-3">
                    <input
                      type="checkbox"
                      checked={selectedFunds.includes(fund.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFunds([...selectedFunds, fund.id]);
                        } else {
                          setSelectedFunds(selectedFunds.filter(id => id !== fund.id));
                        }
                      }}
                      disabled={fund.status === 'pledged'}
                    />
                  </td>
                  <td className="py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{fund.schemeName}</p>
                      <p className="text-xs text-gray-500">{fund.amcName} | {fund.category}</p>
                      <p className="text-xs text-gray-400">Folio: {fund.folioNumber}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="text-sm">
                      <p>Total: <span className="font-medium">{fund.unitsHeld}</span></p>
                      <p className="text-xs text-red-600">Pledged: {fund.unitsPledged}</p>
                      <p className="text-xs text-green-600">Free: {fund.unitsFree}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    <p className="text-sm font-medium">{formatCurrency(fund.currentNav)}</p>
                  </td>
                  <td className="py-3">
                    <div className="text-sm">
                      <p className="font-medium">{formatCurrency(fund.currentValue)}</p>
                      {fund.pledgedValue > 0 && (
                        <p className="text-xs text-gray-500">
                          Pledged: {formatCurrency(fund.pledgedValue)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    {getStatusBadge(fund.status)}
                    {fund.ltvRatio > 0 && (
                      <p className="text-xs text-gray-500 mt-1">LTV: {fund.ltvRatio}%</p>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      {fund.unitsFree > 0 && (
                        <Button variant="outline" size="sm">Pledge</Button>
                      )}
                      {fund.unitsPledged > 0 && (
                        <Button variant="ghost" size="sm">Release</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Portfolio Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card title="Portfolio Distribution" subtitle="By AMC">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>HDFC Mutual Fund</span>
                <span className="font-medium">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>ICICI Prudential MF</span>
                <span className="font-medium">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>SBI Mutual Fund</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-accent-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Axis Mutual Fund</span>
                <span className="font-medium">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Risk Analysis" subtitle="Portfolio risk metrics">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Average LTV Ratio</span>
              <span className="text-lg font-semibold text-primary-600">58.5%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Portfolio Volatility</span>
              <span className="text-lg font-semibold text-yellow-600">Medium</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Margin of Safety</span>
              <span className="text-lg font-semibold text-green-600">41.5%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Risk Score</span>
              <span className="text-lg font-semibold text-secondary-600">7.2/10</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CollateralManagement;