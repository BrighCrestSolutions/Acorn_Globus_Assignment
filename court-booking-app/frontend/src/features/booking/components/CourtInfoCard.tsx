import React from 'react';
import type { Court } from '../../../types';

interface CourtInfoCardProps {
  court: Court;
}

export const CourtInfoCard: React.FC<CourtInfoCardProps> = ({ court }) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-2">Book {court.name}</h1>
      <p className="text-muted-foreground">Complete your booking in a few simple steps</p>
    </div>
  );
};
