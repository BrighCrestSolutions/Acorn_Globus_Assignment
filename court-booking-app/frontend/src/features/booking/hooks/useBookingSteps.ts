import { useState } from 'react';

export const useBookingSteps = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  const goToStep = (stepNum: number) => setStep(Math.max(1, Math.min(stepNum, 4)));

  return {
    step,
    nextStep,
    prevStep,
    goToStep,
    setStep
  };
};
