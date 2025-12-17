import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { User, ArrowRight } from 'lucide-react';
import type { Coach } from '../../../types';

interface CoachSelectorProps {
  coaches: Coach[];
  selectedCoach: string | null;
  onSelectCoach: (coachId: string | null) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const CoachSelector: React.FC<CoachSelectorProps> = ({
  coaches,
  selectedCoach,
  onSelectCoach,
  onBack,
  onContinue
}) => {
  const handleCoachClick = (coachId: string) => {
    onSelectCoach(selectedCoach === coachId ? null : coachId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Select Coach (Optional)
        </CardTitle>
        <CardDescription>Book a professional coach for your session</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {coaches.map((coach) => (
          <div
            key={coach._id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedCoach === coach._id ? 'border-primary bg-primary/5' : 'hover:border-gray-400'
            }`}
            onClick={() => handleCoachClick(coach._id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-lg">{coach.name}</div>
                <div className="text-sm text-muted-foreground mb-2">{coach.bio}</div>
                <div className="flex flex-wrap gap-1">
                  {coach.specialties.map((spec, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">₹{coach.hourlyRate}</div>
                <div className="text-xs text-muted-foreground">/hour</div>
              </div>
            </div>
          </div>
        ))}
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
