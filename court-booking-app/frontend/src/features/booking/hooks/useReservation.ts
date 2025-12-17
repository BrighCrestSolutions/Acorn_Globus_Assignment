import { useState, useEffect, useRef } from 'react';
import { reservationsAPI } from '../../../services/api';

interface ReservationParams {
  courtId: string;
  startTime: string;
  endTime: string;
}

export const useReservation = (step: number) => {
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const hasExtended = useRef(false);

  // Create reservation
  const createReservation = async (params: ReservationParams) => {
    try {
      const response = await reservationsAPI.create({
        courtId: params.courtId,
        startTime: params.startTime,
        endTime: params.endTime
      });
      
      setReservationId(response.data.reservation._id);
      setError('');
      return response.data.reservation._id;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to reserve slot';
      setError(errorMsg);
      
      // If reservation fails with 400, slot might be taken
      if (err.response?.status === 400) {
        throw new Error(errorMsg);
      }
      
      // For other errors, return null but don't throw (allow booking to continue)
      return null;
    }
  };

  // Extend reservation when moving to final step
  useEffect(() => {
    if (step === 4 && reservationId && !hasExtended.current) {
      hasExtended.current = true;
      reservationsAPI.extend(reservationId).catch(err => {
        console.error('Failed to extend reservation:', err);
      });
    }
    
    // Reset extension flag when leaving step 4
    if (step !== 4) {
      hasExtended.current = false;
    }
  }, [step, reservationId]);

  // Release reservation on unmount
  useEffect(() => {
    return () => {
      if (reservationId) {
        reservationsAPI.release(reservationId).catch(err => {
          console.error('Failed to release reservation on unmount:', err);
        });
      }
    };
  }, [reservationId]);

  // Release reservation when going back to step 1
  useEffect(() => {
    if (step === 1 && reservationId) {
      reservationsAPI.release(reservationId).catch(err => {
        console.error('Failed to release reservation on back:', err);
      });
      setReservationId(null);
      hasExtended.current = false;
    }
  }, [step, reservationId]);

  // Manual release function
  const releaseReservation = async () => {
    if (reservationId) {
      try {
        await reservationsAPI.release(reservationId);
        setReservationId(null);
        hasExtended.current = false;
      } catch (err) {
        console.error('Failed to release reservation:', err);
      }
    }
  };

  return {
    reservationId,
    reservationError: error,
    createReservation,
    releaseReservation,
    setReservationId
  };
};
