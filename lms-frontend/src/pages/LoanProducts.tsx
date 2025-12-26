// src/pages/LoanProducts.tsx
// Loan Products listing and management page

import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

interface LoanProduct {
  id: string;
  productCode: string;
  productName: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minTenure: number;
  maxTenure: number;
  ltvRatio: number;
  processingFee: number;
  status: 'active' | 'inactive';
  popularityScore: number;
}

const LoanProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);

  const loanProducts: LoanProduct[] = [
    {
      id: '1',
      productCode: 'LAMF-GOLD',
      productName: 'Gold Plan - Premium Loan',
      interestRate: 10.5,
      minAmount: 500000,
      maxAmount: 10000000,
      minTenure: 12,
      maxTenure: 60,
      ltvRatio: 70,
      processingFee: 1.5,
      status: 'active',
      popularityScore: 95,
    },
    {
      id: '2',
      productCode: 'LAMF-SILVER',
      productName: 'Silver Plan - Standard Loan',
      interestRate: 12.0,
      minAmount: 100000,
      maxAmount: 5000000,
      minTenure: 6,
      maxTenure: 36,
      ltvRatio: 60,
      processingFee: 2.0,
      status: 'active',
      popularityScore: 80,
    },
    {
      id: '3',
      productCode: 'LAMF-BRONZE',
      productName: 'Bronze Plan - Quick Loan',
      interestRate: 14.0,
      minAmount: 50000,
      maxAmount: 2000000,
      minTenure: 3,
      maxTenure: 24,
      ltvRatio: 50,
      processingFee: 2.5,
      status: 'active',
      popularityScore: 65,
    },
    {
      id: '4',
      productCode: 'LAMF-FLEXI',
      productName: 'Flexi Loan - Overdraft Facility',
      interestRate: 11.5,
      minAmount: 200000,
      maxAmount: 7500000,
      minTenure: 12,
      maxTenure: 48,
      ltvRatio: 65,
      processingFee: 1.75,
      status: 'active',
      popularityScore: 70,
    },
  ];

  const filteredProducts = loanProducts.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Products</h1>
          <p className="mt-2 text-gray-600">Explore our range of loan products against mutual funds</p>
        </div>
        <Button variant="primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="Search loan products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="hover:shadow-hard transition-shadow cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            {/* Product Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{product.productName}</h3>
                <p className="text-sm text-gray-500 mt-1">Code: {product.productCode}</p>
              </div>
              <Badge
                variant={product.status === 'active' ? 'success' : 'gray'}
                dot
              >
                {product.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {/* Interest Rate Highlight */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">Interest Rate</p>
              <p className="text-2xl font-bold text-primary-600">{product.interestRate}% p.a.</p>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Popularity</span>
                  <span>{product.popularityScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                    style={{ width: `${product.popularityScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Loan Amount</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tenure</span>
                <span className="text-sm font-medium text-gray-900">
                  {product.minTenure} - {product.maxTenure} months
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">LTV Ratio</span>
                <span className="text-sm font-medium text-gray-900">{product.ltvRatio}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Processing Fee</span>
                <span className="text-sm font-medium text-gray-900">{product.processingFee}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-6">
              <Button variant="primary" size="sm" fullWidth>
                Apply Now
              </Button>
              <Button variant="outline" size="sm" fullWidth>
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Comparison Section */}
      <Card className="mt-8" title="Compare Loan Products" subtitle="Select products to compare features side by side">
        <div className="text-center py-8">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500">Select two or more products to compare</p>
          <Button variant="primary" size="sm" className="mt-4">
            Start Comparison
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoanProducts;