// src/pages/NewApplication.tsx
// New loan application form page

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from '../utils/axiosConfig';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import loanApplicationService from '../services/loanApplicationService';

interface ApplicationFormData {
  loanProductId: string;
  requestedAmount: number;
  tenure: number;
  purposeOfLoan: string;
  monthlyIncome: number;
  existingEMI: number;
  mutualFunds: Array<{
    schemeName: string;
    folioNumber: string;
    units: number;
    currentValue: number;
  }>;
}

interface LoanProduct {
  id: string;
  productName: string;
  productCode: string;
  description?: string;
  interestRate: string;
  minAmount: string;
  maxAmount: string;
  minTenureMonths: number;
  maxTenureMonths: number;
}

const NewApplication: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [calculatedEMI, setCalculatedEMI] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormData>();

  const requestedAmount = watch('requestedAmount');
  const tenure = watch('tenure');

  // Fetch loan products from API
  useEffect(() => {
    const fetchLoanProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await axios.get('/api/loan-products');
        if (response.data.success) {
          setLoanProducts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching loan products:', error);
        toast.error('Failed to load loan products');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchLoanProducts();
  }, []);

  // Calculate EMI when amount or tenure changes
  React.useEffect(() => {
    if (requestedAmount && tenure) {
      const principal = requestedAmount;
      const rate = 12 / 12 / 100; // 12% annual rate
      const n = tenure;
      const emi = (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
      setCalculatedEMI(Math.round(emi));
    }
  }, [requestedAmount, tenure]);

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      setIsSubmitting(true);

      // Validate that we have the required data
      if (!selectedProduct) {
        toast.error('Please select a loan product');
        setIsSubmitting(false);
        setStep(1);
        return;
      }

      if (!data.requestedAmount || !data.tenure || !data.purposeOfLoan) {
        toast.error('Please fill in all loan details');
        setIsSubmitting(false);
        setStep(2);
        return;
      }

      if (!data.monthlyIncome) {
        toast.error('Please fill in your financial information');
        setIsSubmitting(false);
        setStep(3);
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Submitting your application...');

      // Call API to create loan application
      const response = await loanApplicationService.createApplication({
        loanProductId: selectedProduct,
        requestedAmount: Number(data.requestedAmount),
        tenure: Number(data.tenure),
        purposeOfLoan: data.purposeOfLoan,
        monthlyIncome: Number(data.monthlyIncome),
        existingEMI: Number(data.existingEMI) || 0,
        collateralIds: [] // TODO: Add selected collateral IDs from step 4
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.success) {
        toast.success('Application submitted successfully!');
        navigate('/loan-applications');
      } else {
        throw new Error(response.message || 'Failed to submit application');
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.response?.data?.error?.message || error.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Loan Application</h1>
        <p className="mt-2 text-gray-600">Apply for a loan against your mutual fund holdings</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= s ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {s}
            </div>
            {s < 4 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-primary-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Select Product */}
        {step === 1 && (
          <Card title="Step 1: Select Loan Product" subtitle="Choose the loan product that suits your needs">
            <div className="space-y-4">
              {loadingProducts ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : loanProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No loan products available at the moment.
                </div>
              ) : (
                loanProducts.map((product) => (
                <div
                  key={product.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedProduct === product.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => setSelectedProduct(product.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.productName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Interest Rate: {product.interestRate}% | Max Amount: ₹{Number(product.maxAmount).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <input
                      type="radio"
                      {...register('loanProductId', { required: 'Please select a loan product' })}
                      value={product.id}
                      checked={selectedProduct === product.id}
                      className="mt-1"
                    />
                  </div>
                </div>
              )))}
              {errors.loanProductId && (
                <p className="text-sm text-error">{errors.loanProductId.message}</p>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button type="button" variant="primary" onClick={() => setStep(2)} disabled={!selectedProduct}>
                Next Step
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Loan Details */}
        {step === 2 && (
          <Card title="Step 2: Loan Details" subtitle="Enter your loan requirements">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Requested Amount (₹)"
                  type="number"
                  placeholder="500000"
                  {...register('requestedAmount', {
                    required: 'Amount is required',
                    min: { value: 50000, message: 'Minimum amount is ₹50,000' },
                    max: {
                      value: Number(loanProducts.find(p => p.id === selectedProduct)?.maxAmount) || 10000000,
                      message: `Maximum amount for this product is ₹${(Number(loanProducts.find(p => p.id === selectedProduct)?.maxAmount) || 10000000).toLocaleString('en-IN')}`
                    },
                  })}
                  error={errors.requestedAmount?.message}
                  hint={`Max loan amount: ₹${(Number(loanProducts.find(p => p.id === selectedProduct)?.maxAmount) || 0).toLocaleString('en-IN')}`}
                />

                <Input
                  label="Tenure (Months)"
                  type="number"
                  placeholder="24"
                  {...register('tenure', {
                    required: 'Tenure is required',
                    min: { value: 3, message: 'Minimum tenure is 3 months' },
                    max: { value: 60, message: 'Maximum tenure is 60 months' },
                  })}
                  error={errors.tenure?.message}
                />
              </div>

              <Input
                label="Purpose of Loan"
                placeholder="e.g., Business expansion, Medical emergency"
                {...register('purposeOfLoan', { required: 'Purpose is required' })}
                error={errors.purposeOfLoan?.message}
              />

              {calculatedEMI && (
                <div className="bg-primary-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Estimated EMI</p>
                  <p className="text-2xl font-bold text-primary-600">₹{calculatedEMI.toLocaleString('en-IN')}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                Previous
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  const amount = watch('requestedAmount');
                  const tenureVal = watch('tenure');
                  const purpose = watch('purposeOfLoan');

                  if (!amount || !tenureVal || !purpose) {
                    toast.error('Please fill in all loan details');
                    return;
                  }
                  setStep(3);
                }}
              >
                Next Step
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Financial Information */}
        {step === 3 && (
          <Card title="Step 3: Financial Information" subtitle="Provide your income details">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Monthly Income (₹)"
                  type="number"
                  placeholder="75000"
                  {...register('monthlyIncome', {
                    required: 'Monthly income is required',
                    min: { value: 10000, message: 'Minimum income is ₹10,000' },
                  })}
                  error={errors.monthlyIncome?.message}
                />

                <Input
                  label="Existing EMI (₹)"
                  type="number"
                  placeholder="0"
                  {...register('existingEMI', {
                    min: { value: 0, message: 'EMI cannot be negative' },
                  })}
                  error={errors.existingEMI?.message}
                  hint="Enter 0 if no existing loans"
                />
              </div>

              <Alert
                type="info"
                message="Your debt-to-income ratio will be calculated to assess loan eligibility"
              />
            </div>

            <div className="flex justify-between mt-6">
              <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                Previous
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  const income = watch('monthlyIncome');

                  if (!income) {
                    toast.error('Please fill in your monthly income');
                    return;
                  }
                  setStep(4);
                }}
              >
                Next Step
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Collateral (Mutual Funds) */}
        {step === 4 && (
          <Card title="Step 4: Select Mutual Funds as Collateral" subtitle="Choose MF units to pledge">
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">Your Mutual Fund Holdings</h4>
                  <Button type="button" variant="outline" size="sm">
                    Import from Demat
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <input type="checkbox" className="mr-3" />
                    <div className="flex-1">
                      <p className="font-medium">HDFC Top 100 Fund</p>
                      <p className="text-sm text-gray-600">Folio: 1234567890 | Units: 500</p>
                    </div>
                    <p className="font-medium">₹2,50,000</p>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <input type="checkbox" className="mr-3" />
                    <div className="flex-1">
                      <p className="font-medium">ICICI Prudential Bluechip Fund</p>
                      <p className="text-sm text-gray-600">Folio: 0987654321 | Units: 750</p>
                    </div>
                    <p className="font-medium">₹3,75,000</p>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <input type="checkbox" className="mr-3" />
                    <div className="flex-1">
                      <p className="font-medium">SBI Magnum Midcap Fund</p>
                      <p className="text-sm text-gray-600">Folio: 5555555555 | Units: 300</p>
                    </div>
                    <p className="font-medium">₹1,80,000</p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Collateral Value</p>
                    <p className="text-2xl font-bold text-secondary-600">₹8,05,000</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Eligible Loan Amount (60% LTV)</p>
                    <p className="text-2xl font-bold text-primary-600">₹4,83,000</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button type="button" variant="ghost" onClick={() => setStep(3)} disabled={isSubmitting}>
                Previous
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting}>
                Submit Application
              </Button>
            </div>
          </Card>
        )}
      </form>
    </div>
  );
};

export default NewApplication;