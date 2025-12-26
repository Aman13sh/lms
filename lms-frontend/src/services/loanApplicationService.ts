// src/services/loanApplicationService.ts
// Service for loan application API calls

// Import the configured axios instance that uses cookies
import axios from '../utils/axiosConfig';

export type LoanApplication = {
  id: string;
  applicationNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  requestedAmount: number;
  approvedAmount?: number;
  status: string;
  submittedDate: string;
  ltvRatio: string;
  tenure: string;
  interestRate?: number;
  monthlyEmi?: number;
  reviewNotes?: string;
};

export type DashboardStats = {
  totalApplications: number;
  activeLoans: number;
  totalOutstanding: number;
  creditScore?: number;
  totalCustomers?: number;
  totalCollateral?: number;
};

export interface CreateApplicationRequest {
  loanProductId: string;
  requestedAmount: number;
  tenure: number;
  purposeOfLoan: string;
  monthlyIncome: number;
  existingEMI?: number;
  collateralIds?: string[];
}

class LoanApplicationService {
  // Get all loan applications
  async getApplications(): Promise<LoanApplication[]> {
    try {
      const response = await axios.get('/api/loan-applications');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await axios.get('/api/loan-applications/dashboard/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Create new loan application
  async createApplication(data: CreateApplicationRequest): Promise<any> {
    try {
      const response = await axios.post('/api/loan-applications', data);
      return response.data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  // Update application status (admin/officer only)
  async updateApplicationStatus(
    id: string,
    status: string,
    reviewNotes?: string,
    approvedAmount?: number
  ): Promise<any> {
    try {
      const response = await axios.patch(`/api/loan-applications/${id}/status`, {
        status,
        reviewNotes,
        approvedAmount,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  // Get single application details
  async getApplicationById(id: string): Promise<LoanApplication> {
    try {
      const response = await axios.get(`/api/loan-applications/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching application details:', error);
      throw error;
    }
  }
}

export default new LoanApplicationService();