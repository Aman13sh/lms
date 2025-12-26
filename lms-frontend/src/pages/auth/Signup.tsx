// src/pages/auth/Signup.tsx
// Signup page component

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  panNumber: string;
  aadhaarNumber: string;
  password: string;
  confirmPassword: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

const Signup: React.FC = () => {
  const { register: authRegister } = useAuth();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<SignupFormData>({
    mode: 'onChange',
  });

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    setError('');
    setLoading(true);

    try {
      const formattedData = {
        ...data,
        address: {
          line1: data.addressLine1,
          line2: data.addressLine2,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        },
      };

      await authRegister(formattedData);
    } catch (err: any) {
      // Handle validation errors from backend
      if (err.response?.data?.error?.details && Array.isArray(err.response.data.error.details)) {
        const validationErrors = err.response.data.error.details;
        const errorMessages = validationErrors.map((e: any) => `${e.field}: ${e.message}`).join('\n');
        setError(errorMessages);
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Validate current step before moving to next
  const validateStep = async (currentStep: number) => {
    let fieldsToValidate: (keyof SignupFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth'];
        break;
      case 2:
        fieldsToValidate = ['panNumber', 'aadhaarNumber', 'addressLine1', 'city', 'state', 'pincode'];
        break;
      case 3:
        fieldsToValidate = ['password', 'confirmPassword'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateStep(step);
    if (isValid) {
      setStep(step + 1);
      setError('');
    } else {
      setError('Please fix the errors above before proceeding');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-accent rounded-2xl mb-4">
            <span className="text-2xl font-bold text-white">LMS</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-600">Join NBFC LMS for easy loan against mutual funds</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-24 h-1 ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-24 h-1 ${step >= 3 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-2xl shadow-hard p-8">
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    placeholder="John"
                    {...register('firstName', { required: 'First name is required' })}
                    error={errors.firstName?.message}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    {...register('lastName', { required: 'Last name is required' })}
                    error={errors.lastName?.message}
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={errors.email?.message}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="9876543210"
                  {...register('phoneNumber', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Invalid Indian phone number',
                    },
                  })}
                  error={errors.phoneNumber?.message}
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  {...register('dateOfBirth', {
                    required: 'Date of birth is required',
                    validate: (value) => {
                      const today = new Date();
                      const birthDate = new Date(value);
                      let age = today.getFullYear() - birthDate.getFullYear();
                      const monthDiff = today.getMonth() - birthDate.getMonth();

                      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                      }

                      if (birthDate > today) {
                        return 'Birth date cannot be in the future';
                      }

                      return age >= 18 || 'You must be at least 18 years old';
                    },
                  })}
                  error={errors.dateOfBirth?.message}
                />

                <div className="flex justify-end">
                  <Button type="button" variant="primary" onClick={nextStep}>
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: KYC Information */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Information</h3>

                <Input
                  label="PAN Number"
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  {...register('panNumber', {
                    required: 'PAN number is required',
                    pattern: {
                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                      message: 'PAN format must be: 5 letters + 4 numbers + 1 letter (e.g., ABCDE1234F)',
                    },
                    setValueAs: (value) => value?.toUpperCase(),
                  })}
                  error={errors.panNumber?.message}
                  className="uppercase"
                />

                <Input
                  label="Aadhaar Number"
                  placeholder="123456789012"
                  maxLength={12}
                  {...register('aadhaarNumber', {
                    required: 'Aadhaar number is required',
                    pattern: {
                      value: /^[0-9]{12}$/,
                      message: 'Aadhaar must be exactly 12 digits',
                    },
                  })}
                  error={errors.aadhaarNumber?.message}
                />

                <Input
                  label="Address Line 1"
                  placeholder="Flat/House No, Building Name"
                  {...register('addressLine1', { required: 'Address is required' })}
                  error={errors.addressLine1?.message}
                />

                <Input
                  label="Address Line 2"
                  placeholder="Street, Area (Optional)"
                  {...register('addressLine2')}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="Mumbai"
                    {...register('city', { required: 'City is required' })}
                    error={errors.city?.message}
                  />
                  <Input
                    label="State"
                    placeholder="Maharashtra"
                    {...register('state', { required: 'State is required' })}
                    error={errors.state?.message}
                  />
                </div>

                <Input
                  label="Pincode"
                  placeholder="400001"
                  maxLength={6}
                  {...register('pincode', {
                    required: 'Pincode is required',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'Pincode must be exactly 6 digits',
                    },
                  })}
                  error={errors.pincode?.message}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="ghost" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="button" variant="primary" onClick={nextStep}>
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Security */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Password</h3>

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message: 'Password must contain uppercase, lowercase, number and special character',
                    },
                  })}
                  error={errors.password?.message}
                  hint="At least 8 characters with uppercase, lowercase, number and special character"
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  error={errors.confirmPassword?.message}
                />

                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-700">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-700">
                        Privacy Policy
                      </a>
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      I want to receive promotional emails and updates
                    </span>
                  </label>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="ghost" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="submit" variant="primary" loading={loading}>
                    Create Account
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;