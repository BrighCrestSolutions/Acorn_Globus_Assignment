import { useState, useEffect } from 'react';
import { courtsAPI } from '../../../services/api';
import type { TimeSlot } from '../../../types';

export const useSlotPolling = (
  courtId: string | undefined,
  selectedDate: string,
  step: number,
  isCourtLoaded: boolean
) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAvailability = async () => {
    if (!courtId) return;
    
    try {
      setLoading(true);
      const response = await courtsAPI.getAvailability(courtId, selectedDate);
      setSlots(response.data.slots);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load availability when date or court changes
  useEffect(() => {
    if (isCourtLoaded && courtId) {
      loadAvailability();
    }
  }, [selectedDate, courtId, isCourtLoaded]);

  // Poll for availability updates every 10 seconds when on step 1
  useEffect(() => {
    if (step === 1 && isCourtLoaded && courtId) {
      const pollInterval = setInterval(() => {
        loadAvailability();
      }, 10000); // Poll every 10 seconds

      return () => clearInterval(pollInterval);
    }
  }, [step, courtId, selectedDate, isCourtLoaded]);

  return {
    slots,
    loading,
    refreshSlots: loadAvailability
  };
};
