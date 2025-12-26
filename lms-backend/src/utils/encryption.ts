// src/utils/encryption.ts
// Encryption utilities for sensitive data

import CryptoJS from 'crypto-js';
import { AppError } from '../middlewares/errorHandler';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-32-chars!';

// Encrypt sensitive data
export const encrypt = (text: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    throw new AppError('Encryption failed', 500, 'ENCRYPTION_ERROR');
  }
};

// Decrypt sensitive data
export const decrypt = (encryptedText: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new AppError('Decryption failed', 500, 'DECRYPTION_ERROR');
  }
};

// Hash data (one-way)
export const hash = (text: string): string => {
  return CryptoJS.SHA256(text).toString();
};

// Mask sensitive data for display
export const maskData = (data: string, visibleChars: number = 4): string => {
  if (data.length <= visibleChars) {
    return '*'.repeat(data.length);
  }
  const visible = data.slice(-visibleChars);
  const masked = '*'.repeat(data.length - visibleChars);
  return masked + visible;
};

// Mask PAN number (show last 4 digits)
export const maskPAN = (pan: string): string => {
  if (pan.length !== 10) return pan;
  return `${pan.slice(0, 2)}****${pan.slice(-4)}`;
};

// Mask Aadhaar number (show last 4 digits)
export const maskAadhaar = (aadhaar: string): string => {
  if (aadhaar.length !== 12) return aadhaar;
  return `****-****-${aadhaar.slice(-4)}`;
};

// Mask phone number (show last 4 digits)
export const maskPhone = (phone: string): string => {
  if (phone.length < 10) return phone;
  return `******${phone.slice(-4)}`;
};

// Mask email (show first 3 chars and domain)
export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  if (!domain) return email;

  const visibleChars = Math.min(3, username.length);
  const maskedUsername = username.slice(0, visibleChars) + '***';
  return `${maskedUsername}@${domain}`;
};