import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { format } from 'date-fns';
import type { Court, TimeSlot, Equipment, Coach } from '../../../types';

interface EquipmentItem {
  item: string;
  quantity: number;
}

interface BookingSidebarProps {
  court: Court;
  selectedSlot: TimeSlot | null;
  selectedEquipment: EquipmentItem[];
  equipment: Equipment[];
  selectedCoach: string | null;
  coaches: Coach[];
  pricing: any;
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
  court,
  selectedSlot,
  selectedEquipment,
  equipment,
  selectedCoach,
  coaches,
  pricing
}) => {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-muted-foreground">Court</div>
          <div className="font-semibold">{court.name}</div>
        </div>
        
        {selectedSlot && (
          <div>
            <div className="text-sm text-muted-foreground">Date & Time</div>
            <div className="font-semibold">
              {format(new Date(selectedSlot.startTime), 'MMM dd, yyyy')}
            </div>
            <div className="text-sm">
              {format(new Date(selectedSlot.startTime), 'HH:mm')} - {format(new Date(selectedSlot.endTime), 'HH:mm')}
            </div>
          </div>
        )}

        {selectedEquipment.length > 0 && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">Equipment</div>
            {selectedEquipment.map((item) => {
              const eq = equipment.find(e => e._id === item.item);
              return eq ? (
                <div key={item.item} className="text-sm">
                  {eq.name} × {item.quantity}
                </div>
              ) : null;
            })}
          </div>
        )}

        {selectedCoach && (
          <div>
            <div className="text-sm text-muted-foreground">Coach</div>
            <div className="font-semibold">
              {coaches.find(c => c._id === selectedCoach)?.name}
            </div>
          </div>
        )}

        {pricing && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Court Fee</span>
              <span>₹{pricing.courtFee}</span>
            </div>
            {pricing.equipmentFee > 0 && (
              <div className="flex justify-between text-sm">
                <span>Equipment Fee</span>
                <span>₹{pricing.equipmentFee}</span>
              </div>
            )}
            {pricing.coachFee > 0 && (
              <div className="flex justify-between text-sm">
                <span>Coach Fee</span>
                <span>₹{pricing.coachFee}</span>
              </div>
            )}
            {pricing.appliedRules && pricing.appliedRules.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Applied: {pricing.appliedRules.map((r: any) => r.ruleName).join(', ')}
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span className="text-primary">₹{pricing.finalTotal}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
