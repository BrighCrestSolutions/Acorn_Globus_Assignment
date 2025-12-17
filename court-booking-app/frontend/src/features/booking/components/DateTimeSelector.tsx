import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Calendar, Clock } from 'lucide-react';
import { format, addDays } from 'date-fns';
import type { TimeSlot } from '../../../types';
import { getSlotStatus, getSlotLabel, isSlotSelectable } from '../utils/slotHelpers';

interface DateTimeSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
  onJoinWaitlist: (slot: TimeSlot) => void;
  loading?: boolean;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  onDateChange,
  slots,
  selectedSlot,
  onSlotSelect,
  onJoinWaitlist,
  loading = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Select Date & Time
        </CardTitle>
        <CardDescription>Choose your preferred date and time slot</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            min={format(new Date(), 'yyyy-MM-dd')}
            max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Available Time Slots (1-hour blocks)</Label>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Auto-refreshing...
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            💡 Tip: Book multiple consecutive hours by selecting different slots separately. Pricing applies per hour with dynamic rules.
          </p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {slots.map((slot, idx) => {
              const slotData = slot as any;
              const status = getSlotStatus(slotData);
              const label = getSlotLabel(slotData);
              const selectable = isSlotSelectable(slotData);
              
              return (
                <div key={idx} className="space-y-1">
                  <Button
                    variant={selectedSlot === slot ? 'default' : slot.available ? 'outline' : 'ghost'}
                    disabled={!selectable}
                    onClick={() => onSlotSelect(slot)}
                    className={`w-full ${
                      status === 'past' ? 'opacity-40 cursor-not-allowed' : 
                      status === 'reserved' ? 'opacity-60 border-orange-300' :
                      status === 'holding' ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    {format(new Date(slot.startTime), 'HH:mm')}
                    {label && <span className="ml-1 text-[10px]">{label}</span>}
                  </Button>
                  {!slot.available && status !== 'past' && status !== 'reserved' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs h-7"
                      onClick={() => onJoinWaitlist(slot)}
                      disabled={loading}
                    >
                      Join Waitlist
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
          {slots.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">No slots available for this date</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
