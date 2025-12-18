import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { pricingRulesAPI } from '../../../../services/api';
import { PricingRuleForm } from './PricingRuleForm';
import { PricingRulesList } from './PricingRulesList';

interface PricingRule {
  _id: string;
  name: string;
  description?: string;
  type: string;
  multiplier: number;
  priority: number;
  active: boolean;
  conditions: any;
  createdAt: string;
  updatedAt: string;
}

interface PricingFormData {
  name: string;
  description: string;
  type: 'time-based' | 'day-based' | 'court-type' | 'seasonal' | 'festival' | 'specific-date' | 'custom';
  multiplier: number;
  priority: number;
  active: boolean;
  conditions: {
    startHour?: number;
    endHour?: number;
    daysOfWeek: number[];
    courtTypes: string[];
    startDate: string;
    endDate: string;
    festivalName: string;
    festivalDate: string;
    specificDate: string;
  };
}

export const PricingTab: React.FC = () => {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  
  const [pricingForm, setPricingForm] = useState<PricingFormData>({
    name: '',
    description: '',
    type: 'time-based',
    multiplier: 1.0,
    priority: 0,
    active: true,
    conditions: {
      startHour: undefined,
      endHour: undefined,
      daysOfWeek: [],
      courtTypes: [],
      startDate: '',
      endDate: '',
      festivalName: '',
      festivalDate: '',
      specificDate: ''
    }
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await pricingRulesAPI.getAll();
      setRules(response.data.rules || []);
    } catch (error: any) {
      console.error('Error fetching pricing rules:', error);
      alert(`Error: ${error.response?.data?.message || 'Failed to fetch pricing rules'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Build the conditions object based on rule type
      const conditions: any = {};
      
      if (pricingForm.type === 'time-based') {
        conditions.startHour = pricingForm.conditions.startHour;
        conditions.endHour = pricingForm.conditions.endHour;
      } else if (pricingForm.type === 'day-based') {
        conditions.daysOfWeek = pricingForm.conditions.daysOfWeek;
      } else if (pricingForm.type === 'court-type') {
        conditions.courtTypes = pricingForm.conditions.courtTypes;
      } else if (pricingForm.type === 'seasonal') {
        conditions.startDate = pricingForm.conditions.startDate;
        conditions.endDate = pricingForm.conditions.endDate;
      } else if (pricingForm.type === 'festival') {
        conditions.festivalName = pricingForm.conditions.festivalName;
        conditions.festivalDate = pricingForm.conditions.festivalDate;
      } else if (pricingForm.type === 'specific-date') {
        conditions.specificDate = pricingForm.conditions.specificDate;
      }

      const ruleData = {
        name: pricingForm.name,
        description: pricingForm.description,
        type: pricingForm.type,
        multiplier: pricingForm.multiplier,
        priority: pricingForm.priority,
        active: pricingForm.active,
        conditions
      };

      if (editingRule) {
        await pricingRulesAPI.update(editingRule._id, ruleData);
        alert('Pricing rule updated successfully!');
      } else {
        await pricingRulesAPI.create(ruleData);
        alert('Pricing rule created successfully!');
      }
      
      // Reset form and close
      handleFormCancel();
      fetchRules();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || 'Failed to save pricing rule'}`);
    }
  };

  const handleEditRule = (rule: PricingRule) => {
    setEditingRule(rule);
    setPricingForm({
      name: rule.name,
      description: rule.description || '',
      type: rule.type as any,
      multiplier: rule.multiplier,
      priority: rule.priority,
      active: rule.active,
      conditions: {
        startHour: rule.conditions?.startHour,
        endHour: rule.conditions?.endHour,
        daysOfWeek: rule.conditions?.daysOfWeek || [],
        courtTypes: rule.conditions?.courtTypes || [],
        startDate: rule.conditions?.startDate ? new Date(rule.conditions.startDate).toISOString().split('T')[0] : '',
        endDate: rule.conditions?.endDate ? new Date(rule.conditions.endDate).toISOString().split('T')[0] : '',
        festivalName: rule.conditions?.festivalName || '',
        festivalDate: rule.conditions?.festivalDate ? new Date(rule.conditions.festivalDate).toISOString().split('T')[0] : '',
        specificDate: rule.conditions?.specificDate ? new Date(rule.conditions.specificDate).toISOString().split('T')[0] : ''
      }
    });
    setShowForm(true);
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing rule?')) return;
    
    try {
      await pricingRulesAPI.delete(id);
      alert('Pricing rule deleted successfully!');
      fetchRules();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || 'Failed to delete pricing rule'}`);
    }
  };

  const handleToggleRule = async (id: string) => {
    try {
      await pricingRulesAPI.toggle(id);
      fetchRules();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || 'Failed to toggle pricing rule'}`);
    }
  };

  const resetForm = () => {
    setPricingForm({
      name: '',
      description: '',
      type: 'time-based',
      multiplier: 1.0,
      priority: 0,
      active: true,
      conditions: {
        startHour: undefined,
        endHour: undefined,
        daysOfWeek: [],
        courtTypes: [],
        startDate: '',
        endDate: '',
        festivalName: '',
        festivalDate: '',
        specificDate: ''
      }
    });
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRule(null);
    resetForm();
  };

  const handleAddNew = () => {
    resetForm();
    setEditingRule(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with action button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Pricing Rules</h2>
          <p className="text-muted-foreground">Manage dynamic pricing for courts</p>
        </div>
        <Button onClick={handleAddNew} disabled={showForm}>
          + Add Pricing Rule
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <PricingRuleForm
          formData={pricingForm}
          isEditing={!!editingRule}
          onSubmit={handleSubmitRule}
          onChange={setPricingForm}
          onCancel={handleFormCancel}
        />
      )}

      {/* Rules List */}
      <PricingRulesList
        rules={rules}
        loading={loading}
        onEdit={handleEditRule}
        onDelete={handleDeleteRule}
        onToggle={handleToggleRule}
      />
    </div>
  );
};
