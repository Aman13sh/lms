// src/components/ui/Badge.tsx
// Reusable Badge component for status indicators

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  dot?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = true,
  dot = false,
  className = '',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-100 text-primary-800';
      case 'secondary':
        return 'bg-secondary-100 text-secondary-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'gray':
        return 'bg-gray-100 text-gray-800';
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'md':
        return 'px-2.5 py-0.5 text-sm';
      case 'lg':
        return 'px-3 py-1 text-base';
      default:
        return '';
    }
  };

  const getDotColor = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-500';
      case 'secondary':
        return 'bg-secondary-500';
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      case 'gray':
        return 'bg-gray-500';
      default:
        return '';
    }
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${rounded ? 'rounded-full' : 'rounded'}
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-2 h-2 rounded-full mr-1.5 ${getDotColor()}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;