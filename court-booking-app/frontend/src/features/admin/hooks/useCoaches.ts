import { useState, useEffect, useCallback } from 'react';
import { coachesAPI } from '../../../services/api';

export const useCoaches = () => {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCoaches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await coachesAPI.getAll();
      setCoaches(response.data.coaches || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load coaches');
      console.error('Error loading coaches:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCoach = async (coachData: any) => {
    try {
      setLoading(true);
      await coachesAPI.create(coachData);
      await loadCoaches();
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create coach';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateCoach = async (id: string, coachData: any) => {
    try {
      setLoading(true);
      await coachesAPI.update(id, coachData);
      await loadCoaches();
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update coach';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCoach = async (id: string) => {
    try {
      setLoading(true);
      await coachesAPI.delete(id);
      await loadCoaches();
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete coach';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoaches();
  }, [loadCoaches]);

  return {
    coaches,
    loading,
    error,
    loadCoaches,
    createCoach,
    updateCoach,
    deleteCoach
  };
};
