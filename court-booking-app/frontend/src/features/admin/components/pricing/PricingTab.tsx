import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pricingRulesAPI } from '../../../../services/api';

export const PricingTab: React.FC = () => {
  const [pricingForm, setPricingForm] = useState({
    name: '',
    type: 'time-based',
    multiplier: 1.5,
    startHour: 18,
    endHour: 21
  });

  const handleCreatePricingRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pricingRulesAPI.create(pricingForm);
      alert('Pricing rule created successfully!');
      setPricingForm({
        name: '',
        type: 'time-based',
        multiplier: 1.5,
        startHour: 18,
        endHour: 21
      });
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || 'Failed to create pricing rule'}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Pricing Rule</CardTitle>
        <CardDescription>Add dynamic pricing rules</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreatePricingRule} className="space-y-4">
          <div>
            <Label htmlFor="rule-name">Rule Name</Label>
            <Input
              id="rule-name"
              value={pricingForm.name}
              onChange={(e) => setPricingForm({ ...pricingForm, name: e.target.value })}
              required
              placeholder="e.g., Evening Peak Hours"
            />
          </div>
          <div>
            <Label htmlFor="rule-type">Rule Type</Label>
            <select
              id="rule-type"
              className="w-full border rounded-md px-3 py-2"
              value={pricingForm.type}
              onChange={(e) => setPricingForm({ ...pricingForm, type: e.target.value })}
            >
              <option value="time-based">Time Based</option>
              <option value="day-based">Day Based</option>
              <option value="court-type">Court Type</option>
            </select>
          </div>
          <div>
            <Label htmlFor="rule-multiplier">Price Multiplier</Label>
            <Input
              id="rule-multiplier"
              type="number"
              step="0.1"
              value={pricingForm.multiplier}
              onChange={(e) => setPricingForm({ ...pricingForm, multiplier: parseFloat(e.target.value) })}
              required
              min="0"
            />
            <p className="text-xs text-muted-foreground mt-1">
              1.0 = no change, 1.5 = 50% increase, 0.8 = 20% discount
            </p>
          </div>
          {pricingForm.type === 'time-based' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-hour">Start Hour (0-23)</Label>
                <Input
                  id="start-hour"
                  type="number"
                  min="0"
                  max="23"
                  value={pricingForm.startHour}
                  onChange={(e) => setPricingForm({ ...pricingForm, startHour: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="end-hour">End Hour (0-23)</Label>
                <Input
                  id="end-hour"
                  type="number"
                  min="0"
                  max="23"
                  value={pricingForm.endHour}
                  onChange={(e) => setPricingForm({ ...pricingForm, endHour: parseInt(e.target.value) })}
                />
              </div>
            </div>
          )}
          <Button type="submit">Create Rule</Button>
        </form>
      </CardContent>
    </Card>
  );
};
