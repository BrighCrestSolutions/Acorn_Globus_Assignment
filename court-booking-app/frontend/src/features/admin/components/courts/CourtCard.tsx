import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../shared';

interface CourtCardProps {
  court: any;
  onEdit: (court: any) => void;
  onDelete: (id: string) => void;
}

export const CourtCard: React.FC<CourtCardProps> = ({ court, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg">{court.name}</h3>
              <StatusBadge status={court.status} variant="court" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{court.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sport</p>
                <p className="font-medium capitalize">{court.sport}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Hourly Rate</p>
                <p className="font-medium">₹{court.hourlyBaseRate}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(court)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(court._id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
