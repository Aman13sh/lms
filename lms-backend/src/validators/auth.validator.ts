// src/validators/auth.validator.ts
// Authentication validation schemas

import Joi from 'joi';

// Custom validators
const panValidator = Joi.string()
  .uppercase()
  .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
  .message('Invalid PAN format');

const aadhaarValidator = Joi.string()
  .pattern(/^[0-9]{12}$/)
  .message('Aadhaar must be 12 digits');

const phoneValidator = Joi.string()
  .pattern(/^[6-9]\d{9}$/)
  .message('Invalid Indian phone number');

// Register schema
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).max(30).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password cannot exceed 30 characters',
    'any.required': 'Password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Please confirm your password',
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name cannot exceed 50 characters',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name cannot exceed 50 characters',
    'any.required': 'Last name is required',
  }),
  phoneNumber: phoneValidator.required().messages({
    'any.required': 'Phone number is required',
  }),
  dateOfBirth: Joi.date()
    .max('now')
    .min('1900-01-01')
    .required()
    .custom((value, helpers) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 18) {
        return helpers.error('custom.age');
      }
      return value;
    })
    .messages({
      'date.max': 'Invalid date of birth',
      'date.min': 'Invalid date of birth',
      'custom.age': 'You must be at least 18 years old',
      'any.required': 'Date of birth is required',
    }),
  panNumber: panValidator.required().messages({
    'any.required': 'PAN number is required',
  }),
  aadhaarNumber: aadhaarValidator.required().messages({
    'any.required': 'Aadhaar number is required',
  }),
  address: Joi.object({
    line1: Joi.string().required(),
    line2: Joi.string().optional(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).required(),
  }).required().messages({
    'any.required': 'Address is required',
  }),
});

// Login schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

// Refresh token schema
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});

// Change password schema
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    'any.required': 'Old password is required',
  }),
  newPassword: Joi.string().min(8).max(30).required().messages({
    'string.min': 'New password must be at least 8 characters',
    'string.max': 'New password cannot exceed 30 characters',
    'any.required': 'New password is required',
  }),
  confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Please confirm your new password',
  }),
});