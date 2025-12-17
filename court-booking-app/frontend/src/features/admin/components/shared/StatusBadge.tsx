import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'court' | 'booking' | 'user' | 'equipment';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'booking' }) => {
  const getStatusStyles = () => {
    const normalizedStatus = status.toLowerCase();
    
    switch (variant) {
      case 'court':
        return {
          active: 'bg-green-100 text-green-800',
          maintenance: 'bg-yellow-100 text-yellow-800',
          disabled: 'bg-red-100 text-red-800'
        }[normalizedStatus] || 'bg-gray-100 text-gray-800';
        
      case 'booking':
        return {
          confirmed: 'bg-green-100 text-green-800',
          pending: 'bg-yellow-100 text-yellow-800',
          cancelled: 'bg-red-100 text-red-800',
          completed: 'bg-blue-100 text-blue-800',
          waiting: 'bg-blue-100 text-blue-800',
          notified: 'bg-purple-100 text-purple-800',
          expired: 'bg-red-100 text-red-800',
          converted: 'bg-green-100 text-green-800'
        }[normalizedStatus] || 'bg-gray-100 text-gray-800';
        
      case 'user':
        return {
          verified: 'bg-green-100 text-green-800',
          pending: 'bg-yellow-100 text-yellow-800',
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-gray-100 text-gray-800'
        }[normalizedStatus] || 'bg-gray-100 text-gray-800';
        
      case 'equipment':
        return {
          available: 'bg-green-100 text-green-800',
          unavailable: 'bg-red-100 text-red-800',
          maintenance: 'bg-yellow-100 text-yellow-800'
        }[normalizedStatus] || 'bg-gray-100 text-gray-800';
        
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  );
};
