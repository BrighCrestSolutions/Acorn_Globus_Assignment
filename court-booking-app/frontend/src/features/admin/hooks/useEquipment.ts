import { useState, useEffect, useCallback } from 'react';
import { equipmentAPI } from '../../../services/api';

export const useEquipment = () => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await equipmentAPI.getAll();
      setEquipment(response.data.equipment || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load equipment');
      console.error('Error loading equipment:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEquipment = async (equipmentData: any) => {
    try {
      setLoading(true);
      await equipmentAPI.create(equipmentData);
      await loadEquipment();
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create equipment';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateEquipment = async (id: string, equipmentData: any) => {
    try {
      setLoading(true);
      await equipmentAPI.update(id, equipmentData);
      await loadEquipment();
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update equipment';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      setLoading(true);
      await equipmentAPI.delete(id);
      await loadEquipment();
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete equipment';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  return {
    equipment,
    loading,
    error,
    loadEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment
  };
};
