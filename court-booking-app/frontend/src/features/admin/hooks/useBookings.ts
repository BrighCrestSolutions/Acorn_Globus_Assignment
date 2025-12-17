import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../../services/api';

export const useBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAllBookings();
      setBookings(response.data.bookings || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bookings');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWaitlist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAllWaitlist();
      setWaitlist(response.data.waitlist || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load waitlist');
      console.error('Error loading waitlist:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterBookings = (status: string) => {
    if (status === 'all') return bookings;
    return bookings.filter((booking: any) => booking.status === status);
  };

  useEffect(() => {
    loadBookings();
    loadWaitlist();
  }, [loadBookings, loadWaitlist]);

  return {
    bookings,
    waitlist,
    loading,
    error,
    loadBookings,
    loadWaitlist,
    filterBookings
  };
};
