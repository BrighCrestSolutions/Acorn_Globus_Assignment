import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

interface PricingRuleFormProps {
  formData: PricingFormData;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: PricingFormData) => void;
  onCancel: () => void;
}

export const PricingRuleForm: React.FC<PricingRuleFormProps> = ({
  formData,
  isEditing,
  onSubmit,
  onChange,
  onCancel
}) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const toggleDayOfWeek = (day: number) => {
    const days = formData.conditions.daysOfWeek;
    const newDays = days.includes(day) 
      ? days.filter(d => d !== day)
      : [...days, day];
    
    onChange({
      ...formData,
      conditions: { ...formData.conditions, daysOfWeek: newDays }
    });
  };

  const toggleCourtType = (type: string) => {
    const types = formData.conditions.courtTypes;
    const newTypes = types.includes(type)
      ? types.filter(t => t !== type)
      : [...types, type];
    
    onChange({
      ...formData,
      conditions: { ...formData.conditions, courtTypes: newTypes }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Pricing Rule' : 'Create Pricing Rule'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update the pricing rule details' : 'Add dynamic pricing rules for festivals, specific dates, or recurring conditions'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rule-name">Rule Name *</Label>
              <Input
                id="rule-name"
                value={formData.name}
                onChange={(e) => onChange({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Evening Peak Hours"
              />
            </div>
            <div>
              <Label htmlFor="rule-type">Rule Type *</Label>
              <select
                id="rule-type"
                className="w-full border rounded-md px-3 py-2"
                value={formData.type}
                onChange={(e) => onChange({ ...formData, type: e.target.value as any })}
              >
                <option value="time-based">Time Based</option>
                <option value="day-based">Day Based</option>
                <option value="court-type">Court Type</option>
                <option value="seasonal">Seasonal Range</option>
                <option value="festival">Festival Special</option>
                <option value="specific-date">Specific Date</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="rule-description">Description</Label>
            <Input
              id="rule-description"
              value={formData.description}
              onChange={(e) => onChange({ ...formData, description: e.target.value })}
              placeholder="Brief description of this pricing rule"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="rule-multiplier">Price Multiplier *</Label>
              <Input
                id="rule-multiplier"
                type="number"
                step="0.1"
                value={formData.multiplier}
                onChange={(e) => onChange({ ...formData, multiplier: parseFloat(e.target.value) || 1.0 })}
                required
                min="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                1.0 = base price, 1.5 = +50%, 0.8 = -20%
              </p>
            </div>
            <div>
              <Label htmlFor="rule-priority">Priority</Label>
              <Input
                id="rule-priority"
                type="number"
                value={formData.priority}
                onChange={(e) => onChange({ ...formData, priority: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Higher = evaluated first
              </p>
            </div>
            <div>
              <Label htmlFor="rule-active">Status</Label>
              <select
                id="rule-active"
                className="w-full border rounded-md px-3 py-2"
                value={formData.active ? 'true' : 'false'}
                onChange={(e) => onChange({ ...formData, active: e.target.value === 'true' })}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* Time-based conditions */}
          {formData.type === 'time-based' && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-3">Time Range</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-hour">Start Hour (0-23) *</Label>
                  <Input
                    id="start-hour"
                    type="number"
                    min="0"
                    max="23"
                    value={formData.conditions.startHour ?? ''}
                    onChange={(e) => onChange({
                      ...formData,
                      conditions: { ...formData.conditions, startHour: parseInt(e.target.value) }
                    })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end-hour">End Hour (0-23) *</Label>
                  <Input
                    id="end-hour"
                    type="number"
                    min="0"
                    max="23"
                    value={formData.conditions.endHour ?? ''}
                    onChange={(e) => onChange({
                      ...formData,
                      conditions: { ...formData.conditions, endHour: parseInt(e.target.value) }
                    })}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Day-based conditions */}
          {formData.type === 'day-based' && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-3">Select Days of Week *</h4>
              <div className="grid grid-cols-4 gap-2">
                {daysOfWeek.map((day, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={formData.conditions.daysOfWeek.includes(index) ? 'default' : 'outline'}
                    onClick={() => toggleDayOfWeek(index)}
                    className="text-xs"
                  >
                    {day.slice(0, 3)}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Select at least one day
              </p>
            </div>
          )}

          {/* Court-type conditions */}
          {formData.type === 'court-type' && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-3">Select Court Types *</h4>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.conditions.courtTypes.includes('indoor') ? 'default' : 'outline'}
                  onClick={() => toggleCourtType('indoor')}
                >
                  Indoor
                </Button>
                <Button
                  type="button"
                  variant={formData.conditions.courtTypes.includes('outdoor') ? 'default' : 'outline'}
                  onClick={() => toggleCourtType('outdoor')}
                >
                  Outdoor
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Select at least one court type
              </p>
            </div>
          )}

          {/* Seasonal conditions */}
          {formData.type === 'seasonal' && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-3">Date Range</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date *</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.conditions.startDate}
                    onChange={(e) => onChange({
                      ...formData,
                      conditions: { ...formData.conditions, startDate: e.target.value }
                    })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date *</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={formData.conditions.endDate}
                    onChange={(e) => onChange({
                      ...formData,
                      conditions: { ...formData.conditions, endDate: e.target.value }
                    })}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Festival conditions */}
          {formData.type === 'festival' && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-3">Festival Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="festival-name">Festival Name *</Label>
                  <Input
                    id="festival-name"
                    value={formData.conditions.festivalName}
                    onChange={(e) => onChange({
                      ...formData,
                      conditions: { ...formData.conditions, festivalName: e.target.value }
                    })}
                    placeholder="e.g., Diwali, Christmas, New Year"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="festival-date">Festival Date *</Label>
                  <Input
                    id="festival-date"
                    type="date"
                    value={formData.conditions.festivalDate}
                    onChange={(e) => onChange({
                      ...formData,
                      conditions: { ...formData.conditions, festivalDate: e.target.value }
                    })}
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Special pricing for festival days
              </p>
            </div>
          )}

          {/* Specific date conditions */}
          {formData.type === 'specific-date' && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-3">Specific Date</h4>
              <div>
                <Label htmlFor="specific-date">Date *</Label>
                <Input
                  id="specific-date"
                  type="date"
                  value={formData.conditions.specificDate}
                  onChange={(e) => onChange({
                    ...formData,
                    conditions: { ...formData.conditions, specificDate: e.target.value }
                  })}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                One-time pricing for a specific date
              </p>
            </div>
          )}

          {/* Custom conditions note */}
          {formData.type === 'custom' && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Custom rules require manual API configuration. This type is for advanced use cases.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {isEditing ? 'Update Pricing Rule' : 'Create Pricing Rule'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
