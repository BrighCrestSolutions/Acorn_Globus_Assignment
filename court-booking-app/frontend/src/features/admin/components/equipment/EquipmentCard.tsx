import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../shared';

interface EquipmentCardProps {
  equipment: any;
  onEdit: (equipment: any) => void;
  onDelete: (id: string) => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg">{equipment.name}</h3>
              <StatusBadge status={equipment.status} variant="equipment" />
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{equipment.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Hourly Rate</p>
                <p className="font-medium">₹{equipment.hourlyRate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Quantity</p>
                <p className="font-medium">{equipment.quantity}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Available</p>
                <p className="font-medium">{equipment.availableQuantity}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(equipment)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(equipment._id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
