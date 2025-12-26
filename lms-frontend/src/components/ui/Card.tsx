// src/components/ui/Card.tsx
// Reusable Card component for content sections

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  bordered?: boolean;
  shadow?: 'soft' | 'medium' | 'hard' | 'none';
  className?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  bordered = false,
  shadow = 'soft',
  className = '',
  headerAction,
  footer,
  onClick,
}) => {
  const getShadowClass = () => {
    switch (shadow) {
      case 'soft':
        return 'shadow-soft';
      case 'medium':
        return 'shadow-medium';
      case 'hard':
        return 'shadow-hard';
      case 'none':
        return '';
      default:
        return 'shadow-soft';
    }
  };

  return (
    <div
      className={`
        bg-white rounded-lg
        ${bordered ? 'border border-gray-200' : ''}
        ${getShadowClass()}
        ${className}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}

      <div className="p-6">{children}</div>

      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;