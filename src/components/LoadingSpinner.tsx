import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'gradient' | 'pulse';
}

export function LoadingSpinner({
  size = 'md',
  className = '',
  variant = 'default',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const variantClasses = {
    default: 'border-gray-300 border-t-blue-500',
    gradient:
      'border-transparent border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-cyan-500',
    pulse: 'border-blue-500 animate-pulse',
  };

  if (variant === 'gradient') {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        {/* Outer spinning ring with gradient */}
        <div
          className={`absolute inset-0 rounded-full border-2 ${variantClasses.gradient} animate-spin`}
        />

        {/* Inner glow effect */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" />

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full animate-ping" />
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`${sizeClasses[size]} ${className} relative`}>
        {/* Main spinner */}
        <div
          className={`animate-spin rounded-full border-2 ${variantClasses.pulse} ${sizeClasses[size]}`}
        />

        {/* Pulsing background */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping ${sizeClasses[size]}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`animate-spin rounded-full border-2 ${variantClasses.default} ${sizeClasses[size]} ${className}`}
    />
  );
}
