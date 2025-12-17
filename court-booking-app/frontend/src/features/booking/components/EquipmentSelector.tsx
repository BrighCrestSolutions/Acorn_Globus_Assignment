import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import type { Equipment } from '../../../types';

interface EquipmentItem {
  item: string;
  quantity: number;
}

interface EquipmentSelectorProps {
  equipment: Equipment[];
  selectedEquipment: EquipmentItem[];
  onToggleEquipment: (equipmentId: string) => void;
  onUpdateQuantity: (equipmentId: string, quantity: number) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({
  equipment,
  selectedEquipment,
  onToggleEquipment,
  onUpdateQuantity,
  onBack,
  onContinue
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Select Equipment (Optional)
        </CardTitle>
        <CardDescription>Add rackets, shoes, or other equipment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {equipment.map((item) => {
          const selected = selectedEquipment.find(e => e.item === item._id);
          return (
            <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
                <div className="text-sm font-semibold text-primary mt-1">
                  ₹{item.hourlyRate}/hour
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {selected ? (
                  <>
                    <Input
                      type="number"
                      min="1"
                      max={item.availableQuantity}
                      value={selected.quantity}
                      onChange={(e) => onUpdateQuantity(item._id, parseInt(e.target.value))}
                      className="w-20"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onToggleEquipment(item._id)}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => onToggleEquipment(item._id)}
                    disabled={item.availableQuantity === 0}
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        <div className="flex space-x-2 pt-4">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={onContinue} className="flex-1">
            Continue <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
