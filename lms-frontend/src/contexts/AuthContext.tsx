// src/contexts/AuthContext.tsx
// Authentication context for managing user state

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import type { ReactNode } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  role: string;
}

interface Customer {
  id: string;
  customerCode: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  customer: Customer | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  getDisplayName: () => string;
  getInitials: () => string;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load auth data from cookies on mount
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const storedAccessToken = Cookies.get('accessToken');
        const storedRefreshToken = Cookies.get('refreshToken');
        const storedUser = Cookies.get('user');
        const storedCustomer = Cookies.get('customer');

        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedAccessToken}`;
        }

        if (storedRefreshToken) {
          setRefreshToken(storedRefreshToken);
        }

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (storedCustomer) {
          setCustomer(JSON.parse(storedCustomer));
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        // Only clear data if there was corrupted data, not on every error
        if (error instanceof SyntaxError) {
          // Clear corrupted cookies
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          Cookies.remove('user');
          Cookies.remove('customer');
          delete axios.defaults.headers.common['Authorization'];
        }
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password,
      });
      if (response.data.success) {
        const { tokens, user: userData } = response.data.data;
        const customerData = userData.customer;

        // Store in state
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        setUser({
          id: userData.id,
          email: userData.email,
          role: userData.role
        });
        if (customerData) {
          setCustomer(customerData);
        }

        // Store in cookies with proper options
        // Set cookies to expire in 7 days for access token and 30 days for refresh token
        // For localhost development, don't use secure flag
        const isProduction = window.location.protocol === 'https:';

        Cookies.set('accessToken', tokens.accessToken, {
          expires: 7,
          secure: isProduction,
          sameSite: 'lax'
        });
        Cookies.set('refreshToken', tokens.refreshToken, {
          expires: 30,
          secure: isProduction,
          sameSite: 'lax'
        });
        Cookies.set('user', JSON.stringify({
          id: userData.id,
          email: userData.email,
          role: userData.role
        }), {
          expires: 7,
          secure: isProduction,
          sameSite: 'lax'
        });
        if (customerData) {
          Cookies.set('customer', JSON.stringify(customerData), {
            expires: 7,
            secure: isProduction,
            sameSite: 'lax'
          });
        }

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;

        // Don't navigate here, let the component handle it after state is set
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle error response structure properly
      const errorMessage = error.response?.data?.error?.message ||
                          error.response?.data?.message ||
                          error.message ||
                          'Login failed';
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (data: any) => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', data);

      if (response.data.success) {
        const { tokens, user: userData, customer: customerData } = response.data.data;

        // Store in state
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        setUser({
          id: userData.id,
          email: userData.email,
          role: userData.role
        });
        if (customerData) {
          setCustomer(customerData);
        }

        // Store in cookies with proper options
        // For localhost development, don't use secure flag
        const isProduction = window.location.protocol === 'https:';

        Cookies.set('accessToken', tokens.accessToken, {
          expires: 7,
          secure: isProduction,
          sameSite: 'lax'
        });
        Cookies.set('refreshToken', tokens.refreshToken, {
          expires: 30,
          secure: isProduction,
          sameSite: 'lax'
        });
        Cookies.set('user', JSON.stringify({
          id: userData.id,
          email: userData.email,
          role: userData.role
        }), {
          expires: 7,
          secure: isProduction,
          sameSite: 'lax'
        });
        if (customerData) {
          Cookies.set('customer', JSON.stringify(customerData), {
            expires: 7,
            secure: isProduction,
            sameSite: 'lax'
          });
        }

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;

        // Don't navigate here, let the component handle it after state is set
      }
    } catch (error) {
      if (error.response?.data?.error?.details) {
        throw error;
      }
      const errorMessage = error.response?.data?.error?.message ||
                          error.response?.data?.message ||
                          error.message ||
                          'Registration failed';
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = () => {
    // Clear state
    setUser(null);
    setCustomer(null);
    setAccessToken(null);
    setRefreshToken(null);

    // Clear cookies
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
    Cookies.remove('customer');

    // Clear axios header
    delete axios.defaults.headers.common['Authorization'];

    // Navigation will be handled by the component that calls logout
  };

  // Get display name
  const getDisplayName = (): string => {
    if (customer?.firstName && customer?.lastName) {
      return `${customer.firstName} ${customer.lastName}`;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  // Get initials
  const getInitials = (): string => {
    if (customer?.firstName && customer?.lastName) {
      return `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase();
    }
    const emailName = user?.email?.split('@')[0] || 'U';
    return emailName.substring(0, 2).toUpperCase();
  };

  const value = {
    user,
    customer,
    accessToken,
    refreshToken,
    loading,
    login,
    register,
    logout,
    getDisplayName,
    getInitials,
    isAuthenticated: !!user && !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Remove default export to fix HMR warning