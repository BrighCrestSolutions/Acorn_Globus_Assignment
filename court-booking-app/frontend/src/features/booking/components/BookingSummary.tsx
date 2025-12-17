import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Check, Loader2 } from 'lucide-react';

interface BookingSummaryProps {
  phone: string;
  notes: string;
  onPhoneChange: (phone: string) => void;
  onNotesChange: (notes: string) => void;
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  phone,
  notes,
  onPhoneChange,
  onNotesChange,
  onBack,
  onConfirm,
  loading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Your Booking</CardTitle>
        <CardDescription>Verify all details before confirming</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="phone">Contact Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            We'll use this to contact you about your booking
          </p>
        </div>
        <div>
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Input
            id="notes"
            placeholder="Any special requests or notes..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 pt-4">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={onConfirm} disabled={loading} className="flex-1">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Confirm Booking
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
