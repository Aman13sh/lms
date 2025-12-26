-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'LOAN_OFFICER', 'CUSTOMER', 'API_PARTNER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LoanApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'DISBURSED');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('ACTIVE', 'CLOSED', 'DEFAULTED', 'PREPAID');

-- CreateEnum
CREATE TYPE "CollateralStatus" AS ENUM ('ACTIVE', 'RELEASED', 'LIQUIDATED');

-- CreateEnum
CREATE TYPE "EmiStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'WAIVED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DISBURSEMENT', 'EMI_PAYMENT', 'PREPAYMENT', 'PENALTY', 'REFUND');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "PartnerStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "two_factor_secret" TEXT,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_products" (
    "id" TEXT NOT NULL,
    "product_code" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "description" TEXT,
    "interest_rate" DECIMAL(5,2) NOT NULL,
    "min_amount" DECIMAL(12,2) NOT NULL,
    "max_amount" DECIMAL(12,2) NOT NULL,
    "min_tenure_months" INTEGER NOT NULL,
    "max_tenure_months" INTEGER NOT NULL,
    "ltv_ratio" DECIMAL(5,2) NOT NULL,
    "processing_fee_percentage" DECIMAL(5,2) NOT NULL,
    "prepayment_penalty" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "late_payment_penalty" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "eligible_mf_categories" JSONB,
    "min_credit_score" INTEGER,
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "customer_code" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT,
    "pan_number" TEXT NOT NULL,
    "aadhaar_number" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "alternate_phone" TEXT,
    "email" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "permanent_address" JSONB,
    "occupation" TEXT,
    "annual_income" DECIMAL(12,2),
    "kyc_status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "kyc_documents" JSONB,
    "kyc_verified_at" TIMESTAMP(3),
    "credit_score" INTEGER,
    "credit_score_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_applications" (
    "id" TEXT NOT NULL,
    "application_number" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "loan_product_id" TEXT NOT NULL,
    "requested_amount" DECIMAL(12,2) NOT NULL,
    "approved_amount" DECIMAL(12,2),
    "tenure_months" INTEGER NOT NULL,
    "purpose_of_loan" TEXT,
    "interest_rate" DECIMAL(5,2),
    "processing_fee" DECIMAL(12,2),
    "status" "LoanApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "application_data" JSONB,
    "documents" JSONB,
    "credit_check_data" JSONB,
    "rejection_reason" TEXT,
    "rejection_code" TEXT,
    "submitted_at" TIMESTAMP(3),
    "reviewed_at" TIMESTAMP(3),
    "approved_at" TIMESTAMP(3),
    "rejected_at" TIMESTAMP(3),
    "disbursed_at" TIMESTAMP(3),
    "created_by" TEXT,
    "reviewed_by" TEXT,
    "approved_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL,
    "loan_number" TEXT NOT NULL,
    "loan_application_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "loan_product_id" TEXT NOT NULL,
    "principal_amount" DECIMAL(12,2) NOT NULL,
    "disbursed_amount" DECIMAL(12,2) NOT NULL,
    "outstanding_principal" DECIMAL(12,2) NOT NULL,
    "outstanding_interest" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_interest_payable" DECIMAL(12,2) NOT NULL,
    "interest_rate" DECIMAL(5,2) NOT NULL,
    "tenure_months" INTEGER NOT NULL,
    "emi_amount" DECIMAL(12,2) NOT NULL,
    "processing_fee" DECIMAL(12,2),
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "first_emi_date" TIMESTAMP(3) NOT NULL,
    "next_emi_date" TIMESTAMP(3),
    "status" "LoanStatus" NOT NULL DEFAULT 'ACTIVE',
    "total_emis" INTEGER NOT NULL,
    "emis_paid" INTEGER NOT NULL DEFAULT 0,
    "last_payment_date" TIMESTAMP(3),
    "last_payment_amount" DECIMAL(12,2),
    "prepayment_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "penalty_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "closure_date" TIMESTAMP(3),
    "closure_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mutual_funds" (
    "id" TEXT NOT NULL,
    "scheme_code" TEXT NOT NULL,
    "isin" TEXT,
    "scheme_name" TEXT NOT NULL,
    "amc_name" TEXT NOT NULL,
    "category" TEXT,
    "sub_category" TEXT,
    "scheme_type" TEXT,
    "current_nav" DECIMAL(10,4),
    "nav_date" TIMESTAMP(3),
    "aum" DECIMAL(15,2),
    "expense_ratio" DECIMAL(5,2),
    "is_eligible_collateral" BOOLEAN NOT NULL DEFAULT true,
    "max_ltv_ratio" DECIMAL(5,2) NOT NULL DEFAULT 50.00,
    "risk_rating" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mutual_funds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_mf_holdings" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "mutual_fund_id" TEXT NOT NULL,
    "folio_number" TEXT NOT NULL,
    "units_held" DECIMAL(16,4) NOT NULL,
    "units_pledged" DECIMAL(16,4) NOT NULL DEFAULT 0,
    "purchase_nav" DECIMAL(10,4),
    "purchase_value" DECIMAL(12,2),
    "current_value" DECIMAL(12,2),
    "holding_days" INTEGER,
    "demat_account" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_mf_holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_collaterals" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "customer_mf_holding_id" TEXT NOT NULL,
    "units_pledged" DECIMAL(16,4) NOT NULL,
    "pledge_value" DECIMAL(12,2) NOT NULL,
    "current_value" DECIMAL(12,2) NOT NULL,
    "nav_at_pledge" DECIMAL(10,4) NOT NULL,
    "current_nav" DECIMAL(10,4),
    "ltv_ratio" DECIMAL(5,2) NOT NULL,
    "current_ltv" DECIMAL(5,2),
    "margin_percentage" DECIMAL(5,2),
    "status" "CollateralStatus" NOT NULL DEFAULT 'ACTIVE',
    "pledge_date" TIMESTAMP(3) NOT NULL,
    "pledge_reference" TEXT,
    "release_date" TIMESTAMP(3),
    "release_reference" TEXT,
    "liquidation_date" TIMESTAMP(3),
    "liquidation_value" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_collaterals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emi_schedule" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "emi_number" INTEGER NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "emi_amount" DECIMAL(12,2) NOT NULL,
    "principal_component" DECIMAL(12,2) NOT NULL,
    "interest_component" DECIMAL(12,2) NOT NULL,
    "outstanding_principal" DECIMAL(12,2) NOT NULL,
    "status" "EmiStatus" NOT NULL DEFAULT 'PENDING',
    "paid_amount" DECIMAL(12,2),
    "paid_date" TIMESTAMP(3),
    "payment_mode" TEXT,
    "transaction_ref" TEXT,
    "late_fee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "waiver_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "waiver_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emi_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "transaction_ref" TEXT NOT NULL,
    "loan_id" TEXT,
    "customer_id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "payment_mode" TEXT,
    "bank_account" TEXT,
    "bank_name" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "payment_gateway" TEXT,
    "gateway_transaction_id" TEXT,
    "payment_details" JSONB,
    "remarks" TEXT,
    "initiated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "failure_reason" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_partners" (
    "id" TEXT NOT NULL,
    "partner_code" TEXT NOT NULL,
    "partner_name" TEXT NOT NULL,
    "company_name" TEXT,
    "api_key" TEXT NOT NULL,
    "api_secret_hash" TEXT NOT NULL,
    "webhook_url" TEXT,
    "webhook_secret" TEXT,
    "ip_whitelist" TEXT[],
    "allowed_endpoints" TEXT[],
    "rate_limit" INTEGER NOT NULL DEFAULT 1000,
    "daily_limit" INTEGER NOT NULL DEFAULT 10000,
    "commission_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "status" "PartnerStatus" NOT NULL DEFAULT 'ACTIVE',
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "onboarded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_logs" (
    "id" TEXT NOT NULL,
    "partner_id" TEXT,
    "user_id" TEXT,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "request_headers" JSONB,
    "request_body" JSONB,
    "response_body" JSONB,
    "status_code" INTEGER NOT NULL,
    "response_time_ms" INTEGER,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "loan_products_product_code_key" ON "loan_products"("product_code");

-- CreateIndex
CREATE UNIQUE INDEX "customers_user_id_key" ON "customers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_customer_code_key" ON "customers"("customer_code");

-- CreateIndex
CREATE UNIQUE INDEX "customers_pan_number_key" ON "customers"("pan_number");

-- CreateIndex
CREATE UNIQUE INDEX "loan_applications_application_number_key" ON "loan_applications"("application_number");

-- CreateIndex
CREATE UNIQUE INDEX "loans_loan_number_key" ON "loans"("loan_number");

-- CreateIndex
CREATE UNIQUE INDEX "loans_loan_application_id_key" ON "loans"("loan_application_id");

-- CreateIndex
CREATE UNIQUE INDEX "mutual_funds_scheme_code_key" ON "mutual_funds"("scheme_code");

-- CreateIndex
CREATE UNIQUE INDEX "customer_mf_holdings_customer_id_folio_number_mutual_fund_i_key" ON "customer_mf_holdings"("customer_id", "folio_number", "mutual_fund_id");

-- CreateIndex
CREATE UNIQUE INDEX "emi_schedule_loan_id_emi_number_key" ON "emi_schedule"("loan_id", "emi_number");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transaction_ref_key" ON "transactions"("transaction_ref");

-- CreateIndex
CREATE UNIQUE INDEX "api_partners_partner_code_key" ON "api_partners"("partner_code");

-- CreateIndex
CREATE UNIQUE INDEX "api_partners_api_key_key" ON "api_partners"("api_key");

-- CreateIndex
CREATE INDEX "api_logs_partner_id_idx" ON "api_logs"("partner_id");

-- CreateIndex
CREATE INDEX "api_logs_created_at_idx" ON "api_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_loan_product_id_fkey" FOREIGN KEY ("loan_product_id") REFERENCES "loan_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_loan_application_id_fkey" FOREIGN KEY ("loan_application_id") REFERENCES "loan_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_loan_product_id_fkey" FOREIGN KEY ("loan_product_id") REFERENCES "loan_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_mf_holdings" ADD CONSTRAINT "customer_mf_holdings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_mf_holdings" ADD CONSTRAINT "customer_mf_holdings_mutual_fund_id_fkey" FOREIGN KEY ("mutual_fund_id") REFERENCES "mutual_funds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_collaterals" ADD CONSTRAINT "loan_collaterals_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_collaterals" ADD CONSTRAINT "loan_collaterals_customer_mf_holding_id_fkey" FOREIGN KEY ("customer_mf_holding_id") REFERENCES "customer_mf_holdings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emi_schedule" ADD CONSTRAINT "emi_schedule_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_logs" ADD CONSTRAINT "api_logs_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "api_partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_logs" ADD CONSTRAINT "api_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

