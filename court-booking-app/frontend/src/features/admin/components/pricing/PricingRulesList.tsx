import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingRuleCard } from './PricingRuleCard';

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

interface PricingRulesListProps {
  rules: PricingRule[];
  loading: boolean;
  onEdit: (rule: PricingRule) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export const PricingRulesList: React.FC<PricingRulesListProps> = ({
  rules,
  loading,
  onEdit,
  onDelete,
  onToggle
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Pricing Rules ({rules.length})</CardTitle>
        <CardDescription>Manage and view all pricing rules</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : rules.length === 0 ? (
          <p className="text-center text-muted-foreground">No pricing rules found. Create one to get started!</p>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <PricingRuleCard
                key={rule._id}
                rule={rule}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
