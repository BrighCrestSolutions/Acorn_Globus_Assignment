import React from 'react';
import { Check } from 'lucide-react';

interface BookingStepIndicatorProps {
  currentStep: number;
  steps?: number;
}

export const BookingStepIndicator: React.FC<BookingStepIndicatorProps> = ({ 
  currentStep, 
  steps = 4 
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {Array.from({ length: steps }, (_, i) => i + 1).map((s) => (
        <div key={s} className="flex items-center flex-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            currentStep >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > s ? <Check className="h-5 w-5" /> : s}
          </div>
          {s < steps && (
            <div className={`flex-1 h-1 mx-2 ${currentStep > s ? 'bg-primary' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
};
