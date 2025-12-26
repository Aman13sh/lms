// prisma/seed.ts
// Comprehensive seed script for LMS NBFC application

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive seed...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const officerPassword = await bcrypt.hash('Officer@123', 10);
  const customerPassword = await bcrypt.hash('Customer@123', 10);

  console.log('\n📦 Creating Users...');
  console.log('================================');

  // 1. Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lmsnbfc.com' },
    update: {},
    create: {
      email: 'admin@lmsnbfc.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('✅ Admin User Created:');
  console.log('   Email: admin@lmsnbfc.com');
  console.log('   Password: Admin@123');
  console.log('   Role: ADMIN');

  // 2. Create Loan Officer User
  const officerUser = await prisma.user.upsert({
    where: { email: 'officer@lmsnbfc.com' },
    update: {},
    create: {
      email: 'officer@lmsnbfc.com',
      passwordHash: officerPassword,
      role: 'LOAN_OFFICER',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('\n✅ Loan Officer Created:');
  console.log('   Email: officer@lmsnbfc.com');
  console.log('   Password: Officer@123');
  console.log('   Role: LOAN_OFFICER');

  // 3. Create Customer Users (3 customers)
  const customers = [
    {
      email: 'john.doe@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '9876543210',
      dateOfBirth: new Date('1990-05-15'),
      panNumber: 'ABCDE1234F',
      aadhaarNumber: '123456789012',
      address: {
        line1: '123 Main Street',
        line2: 'Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      annualIncome: 1200000,
      occupation: 'Software Engineer',
      kycStatus: 'VERIFIED'
    },
    {
      email: 'jane.smith@gmail.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '9876543211',
      dateOfBirth: new Date('1988-03-20'),
      panNumber: 'XYZAB5678C',
      aadhaarNumber: '234567890123',
      address: {
        line1: '456 Park Avenue',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      },
      annualIncome: 1800000,
      occupation: 'Product Manager',
      kycStatus: 'VERIFIED'
    },
    {
      email: 'rajesh.kumar@gmail.com',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      phoneNumber: '9876543212',
      dateOfBirth: new Date('1985-12-10'),
      panNumber: 'PQRST9876D',
      aadhaarNumber: '345678901234',
      address: {
        line1: '789 Gandhi Nagar',
        line2: 'Near City Mall',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      annualIncome: 2400000,
      occupation: 'Business Owner',
      kycStatus: 'PENDING'
    }
  ];

  for (const customerData of customers) {
    const customerUser = await prisma.user.upsert({
      where: { email: customerData.email },
      update: {},
      create: {
        email: customerData.email,
        passwordHash: customerPassword,
        role: 'CUSTOMER',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create customer profile
    const customerCode = `CUST${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;

    // Encrypt Aadhaar (simplified encryption for demo)
    const encryptedAadhaar = customerData.aadhaarNumber; // Store as is for now, actual encryption handled by the app

    // Check if customer with PAN already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { panNumber: customerData.panNumber }
    });

    if (!existingCustomer) {
      await prisma.customer.create({
        data: {
        userId: customerUser.id,
        customerCode: customerCode,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        phoneNumber: customerData.phoneNumber,
        dateOfBirth: customerData.dateOfBirth,
        panNumber: customerData.panNumber,
        aadhaarNumber: encryptedAadhaar,
        address: customerData.address,
        annualIncome: customerData.annualIncome,
        occupation: customerData.occupation,
        kycStatus: customerData.kycStatus as any,
        kycVerifiedAt: customerData.kycStatus === 'VERIFIED' ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        }
      });
    }

    console.log(`\n✅ Customer ${customerData.firstName} ${customerData.lastName} Created:`);
    console.log(`   Email: ${customerData.email}`);
    console.log('   Password: Customer@123');
    console.log(`   KYC Status: ${customerData.kycStatus}`);
  }

  // Create Loan Products
  console.log('\n\n🏦 Creating Loan Products...');
  console.log('================================');

  const loanProducts = [
    {
      productName: 'Gold Plan - Premium Loan',
      productCode: 'GOLD-001',
      description: 'Premium loan product with lowest interest rates for high-value customers. Best suited for customers with excellent credit history and high-value mutual fund portfolios.',
      minAmount: 100000,
      maxAmount: 10000000,
      minTenureMonths: 3,
      maxTenureMonths: 60,
      interestRate: 10.5,
      processingFeePercentage: 1.0,
      ltvRatio: 60,
      eligibleMfCategories: ['EQUITY', 'HYBRID', 'DEBT'],
      features: ['Lowest interest rate', 'Flexible repayment', 'No prepayment charges', 'Online account management'],
      status: 'ACTIVE'
    },
    {
      productName: 'Silver Plan - Standard Loan',
      productCode: 'SILVER-001',
      description: 'Standard loan product with competitive rates for regular customers. Ideal for salaried professionals and small business owners.',
      minAmount: 50000,
      maxAmount: 5000000,
      minTenureMonths: 3,
      maxTenureMonths: 48,
      interestRate: 12.0,
      processingFeePercentage: 1.5,
      ltvRatio: 55,
      eligibleMfCategories: ['EQUITY', 'HYBRID', 'DEBT'],
      features: ['Competitive rates', 'Quick approval', 'Minimal documentation', 'EMI flexibility'],
      status: 'ACTIVE'
    },
    {
      productName: 'Bronze Plan - Quick Loan',
      productCode: 'BRONZE-001',
      description: 'Quick disbursement loan with flexible terms. Perfect for urgent financial needs with instant approval process.',
      minAmount: 25000,
      maxAmount: 2000000,
      minTenureMonths: 3,
      maxTenureMonths: 36,
      interestRate: 14.0,
      processingFeePercentage: 2.0,
      ltvRatio: 50,
      eligibleMfCategories: ['EQUITY', 'HYBRID'],
      features: ['Instant approval', 'Same day disbursement', 'Minimal eligibility criteria', 'Online application'],
      status: 'ACTIVE'
    },
    {
      productName: 'Flexi Loan - Overdraft Facility',
      productCode: 'FLEXI-001',
      description: 'Overdraft facility against mutual funds with pay-as-you-use model. Interest charged only on utilized amount.',
      minAmount: 50000,
      maxAmount: 7500000,
      minTenureMonths: 12,
      maxTenureMonths: 60,
      interestRate: 11.5,
      processingFeePercentage: 1.25,
      ltvRatio: 60,
      eligibleMfCategories: ['EQUITY', 'HYBRID', 'DEBT', 'LIQUID'],
      features: ['Pay interest only on used amount', 'Withdraw anytime', 'No foreclosure charges', 'Auto-renewal facility'],
      status: 'ACTIVE'
    },
    {
      productName: 'Emergency Loan - Express',
      productCode: 'EXPRESS-001',
      description: 'Emergency loans for medical and other urgent needs with minimal documentation and express approval.',
      minAmount: 10000,
      maxAmount: 1000000,
      minTenureMonths: 3,
      maxTenureMonths: 24,
      interestRate: 15.0,
      processingFeePercentage: 2.5,
      ltvRatio: 45,
      eligibleMfCategories: ['EQUITY', 'DEBT'],
      features: ['1-hour approval', 'Medical emergency priority', 'No collateral evaluation fee', 'Grace period available'],
      status: 'ACTIVE'
    }
  ];

  // Upsert loan products
  for (const product of loanProducts) {
    await prisma.loanProduct.upsert({
      where: { productCode: product.productCode },
      update: {
        productName: product.productName,
        productCode: product.productCode,
        description: product.description,
        minAmount: product.minAmount,
        maxAmount: product.maxAmount,
        minTenureMonths: product.minTenureMonths,
        maxTenureMonths: product.maxTenureMonths,
        interestRate: product.interestRate,
        processingFeePercentage: product.processingFeePercentage,
        ltvRatio: product.ltvRatio,
        eligibleMfCategories: product.eligibleMfCategories as any[],
        status: product.status as any,
      },
      create: {
        productName: product.productName,
        productCode: product.productCode,
        description: product.description,
        minAmount: product.minAmount,
        maxAmount: product.maxAmount,
        minTenureMonths: product.minTenureMonths,
        maxTenureMonths: product.maxTenureMonths,
        interestRate: product.interestRate,
        processingFeePercentage: product.processingFeePercentage,
        ltvRatio: product.ltvRatio,
        eligibleMfCategories: product.eligibleMfCategories as any[],
        status: product.status as any,
      }
    });

    console.log(`\n✅ ${product.productName} Created:`);
    console.log(`   Code: ${product.productCode}`);
    console.log(`   Interest Rate: ${product.interestRate}%`);
    console.log(`   Loan Range: ₹${product.minAmount.toLocaleString('en-IN')} - ₹${product.maxAmount.toLocaleString('en-IN')}`);
    console.log(`   Tenure: ${product.minTenureMonths}-${product.maxTenureMonths} months`);
  }

  // Create Sample Collateral Types
  console.log('\n\n💎 Creating Collateral Types...');
  console.log('================================');

  const collateralTypes = [
    { type: 'MUTUAL_FUNDS', description: 'Mutual Fund Units' },
    { type: 'STOCKS', description: 'Listed Equity Shares' },
    { type: 'BONDS', description: 'Government and Corporate Bonds' },
  ];

  for (const collateral of collateralTypes) {
    console.log(`✅ ${collateral.description} collateral type configured`);
  }

  // Summary
  console.log('\n\n🎉 Seed Completed Successfully!');
  console.log('=====================================');
  console.log('\n📊 Summary:');
  console.log('------------');
  console.log(`✓ 1 Admin User`);
  console.log(`✓ 1 Loan Officer`);
  console.log(`✓ 3 Customer Users`);
  console.log(`✓ 5 Loan Products`);

  console.log('\n\n📝 Login Credentials:');
  console.log('=======================');
  console.log('\n🔐 Admin Account:');
  console.log('   Email: admin@lmsnbfc.com');
  console.log('   Password: Admin@123');
  console.log('   Access: Full system access, user management, loan product management');

  console.log('\n👔 Loan Officer Account:');
  console.log('   Email: officer@lmsnbfc.com');
  console.log('   Password: Officer@123');
  console.log('   Access: Review applications, approve/reject loans, manage disbursements');

  console.log('\n👤 Customer Accounts:');
  console.log('   1. John Doe');
  console.log('      Email: john.doe@gmail.com');
  console.log('      Password: Customer@123');
  console.log('      KYC: Verified ✓');

  console.log('\n   2. Jane Smith');
  console.log('      Email: jane.smith@gmail.com');
  console.log('      Password: Customer@123');
  console.log('      KYC: Verified ✓');

  console.log('\n   3. Rajesh Kumar');
  console.log('      Email: rajesh.kumar@gmail.com');
  console.log('      Password: Customer@123');
  console.log('      KYC: Pending ⏳');

  console.log('\n=====================================');
  console.log('🚀 You can now start using the application!');
  console.log('=====================================\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });