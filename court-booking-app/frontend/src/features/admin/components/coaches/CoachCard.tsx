import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../shared';

interface CoachCardProps {
  coach: any;
  onEdit: (coach: any) => void;
  onDelete: (id: string) => void;
}

export const CoachCard: React.FC<CoachCardProps> = ({ coach, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg">{coach.name}</h3>
              <StatusBadge status={coach.status} variant="equipment" />
            </div>
            {(coach.email || coach.phone) && (
              <div className="flex gap-4 text-sm mb-3">
                {coach.email && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span>✉</span>
                    <span>{coach.email}</span>
                  </div>
                )}
                {coach.phone && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span>📞</span>
                    <span>{coach.phone}</span>
                  </div>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Specialization</p>
                <p className="font-medium">{coach.specialization}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Hourly Rate</p>
                <p className="font-medium">₹{coach.hourlyRate}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(coach)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(coach._id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
