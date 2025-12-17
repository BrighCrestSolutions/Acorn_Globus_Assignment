import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { TimeSlot, Equipment, Coach } from '../../../types';

interface EquipmentItem {
  item: string;
  quantity: number;
}

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimeSlot;
  selectedDate: string;
  equipment: Equipment[];
  coaches: Coach[];
  defaultPhone: string;
  onSubmit: (data: {
    phone: string;
    equipment: EquipmentItem[];
    coachId: string | null;
    notes: string;
  }) => Promise<void>;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  slot,
  selectedDate,
  equipment,
  coaches,
  defaultPhone,
  onSubmit
}) => {
  const [phone, setPhone] = useState(defaultPhone);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleEquipment = (equipmentId: string) => {
    setSelectedEquipment(prev => {
      const existing = prev.find(e => e.item === equipmentId);
      if (existing) {
        return prev.filter(e => e.item !== equipmentId);
      } else {
        return [...prev, { item: equipmentId, quantity: 1 }];
      }
    });
  };

  const updateEquipmentQuantity = (equipmentId: string, quantity: number) => {
    setSelectedEquipment(prev => 
      prev.map(e => e.item === equipmentId ? { ...e, quantity } : e)
    );
  };

  const handleSubmit = async () => {
    if (!phone || phone.trim().length < 10) {
      setError('Please enter a valid phone number (at least 10 digits)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        phone,
        equipment: selectedEquipment,
        coachId: selectedCoach,
        notes
      });
      
      // Reset form
      setPhone(defaultPhone);
      setSelectedEquipment([]);
      setSelectedCoach(null);
      setNotes('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to join waitlist');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Join Waitlist</CardTitle>
          <CardDescription>
            Join waitlist for {format(new Date(slot.startTime), 'HH:mm')} - {format(new Date(slot.endTime), 'HH:mm')} on {selectedDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Phone Number */}
          <div>
            <Label htmlFor="waitlist-phone">Phone Number *</Label>
            <Input
              id="waitlist-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              We'll notify you if a spot opens up
            </p>
          </div>

          {/* Equipment Selection */}
          <div>
            <Label>Equipment (Optional)</Label>
            <div className="space-y-2 mt-2">
              {equipment.map((item) => {
                const selected = selectedEquipment.find(e => e.item === item._id);
                return (
                  <div key={item._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">₹{item.hourlyRate}/hour</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selected ? (
                        <>
                          <Input
                            type="number"
                            min="1"
                            max={item.availableQuantity}
                            value={selected.quantity}
                            onChange={(e) => updateEquipmentQuantity(item._id, parseInt(e.target.value))}
                            className="w-16 h-8 text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEquipment(item._id)}
                          >
                            Remove
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEquipment(item._id)}
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coach Selection */}
          <div>
            <Label>Coach (Optional)</Label>
            <div className="space-y-2 mt-2">
              {coaches.map((coach) => (
                <div
                  key={coach._id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedCoach === coach._id ? 'border-primary bg-primary/5' : 'hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedCoach(selectedCoach === coach._id ? null : coach._id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{coach.name}</div>
                      <div className="text-sm text-muted-foreground">{coach.email}</div>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      ₹{coach.hourlyRate}/hour
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="waitlist-notes">Additional Notes (Optional)</Label>
            <Input
              id="waitlist-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements or preferences"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                setError('');
              }}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join Waitlist'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
