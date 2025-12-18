import React from 'react';
import { Button } from '@/components/ui/button';

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

interface PricingRuleCardProps {
  rule: PricingRule;
  onEdit: (rule: PricingRule) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatConditions = (rule: PricingRule) => {
  const { conditions, type } = rule;
  if (!conditions) return 'N/A';

  if (type === 'time-based') {
    return `${conditions.startHour}:00 - ${conditions.endHour}:00`;
  } else if (type === 'day-based') {
    return conditions.daysOfWeek?.map((d: number) => daysOfWeek[d].slice(0, 3)).join(', ') || 'All days';
  } else if (type === 'court-type') {
    return conditions.courtTypes?.join(', ') || 'All types';
  } else if (type === 'seasonal') {
    return `${new Date(conditions.startDate).toLocaleDateString()} - ${new Date(conditions.endDate).toLocaleDateString()}`;
  } else if (type === 'festival') {
    return `${conditions.festivalName} (${new Date(conditions.festivalDate).toLocaleDateString()})`;
  } else if (type === 'specific-date') {
    return new Date(conditions.specificDate).toLocaleDateString();
  }
  return 'Custom';
};

const getMultiplierBadge = (multiplier: number) => {
  if (multiplier > 1) return `+${((multiplier - 1) * 100).toFixed(0)}%`;
  if (multiplier < 1) return `-${((1 - multiplier) * 100).toFixed(0)}%`;
  return 'Base Price';
};

export const PricingRuleCard: React.FC<PricingRuleCardProps> = ({
  rule,
  onEdit,
  onDelete,
  onToggle
}) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg">{rule.name}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              rule.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {rule.active ? 'Active' : 'Inactive'}
            </span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {rule.type.replace('-', ' ').toUpperCase()}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              rule.multiplier > 1 
                ? 'bg-red-100 text-red-800' 
                : rule.multiplier < 1
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {getMultiplierBadge(rule.multiplier)}
            </span>
          </div>
          {rule.description && (
            <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
          )}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Conditions:</span>
              <p className="text-muted-foreground">{formatConditions(rule)}</p>
            </div>
            <div>
              <span className="font-medium">Multiplier:</span>
              <p className="text-muted-foreground">{rule.multiplier}x</p>
            </div>
            <div>
              <span className="font-medium">Priority:</span>
              <p className="text-muted-foreground">{rule.priority}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggle(rule._id)}
          >
            {rule.active ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(rule)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(rule._id)}
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
