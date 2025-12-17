import { useState, useEffect, useCallback } from 'react';
import { courtsAPI } from '../../../services/api';

export const useCourts = () => {
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courtsAPI.getAll();
      setCourts(response.data.courts || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load courts');
      console.error('Error loading courts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourt = async (courtData: any) => {
    try {
      setLoading(true);
      await courtsAPI.create(courtData);
      await loadCourts();
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create court';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateCourt = async (id: string, courtData: any) => {
    try {
      setLoading(true);
      await courtsAPI.update(id, courtData);
      await loadCourts();
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update court';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCourt = async (id: string) => {
    try {
      setLoading(true);
      await courtsAPI.delete(id);
      await loadCourts();
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete court';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourts();
  }, [loadCourts]);

  return {
    courts,
    loading,
    error,
    loadCourts,
    createCourt,
    updateCourt,
    deleteCourt
  };
};
