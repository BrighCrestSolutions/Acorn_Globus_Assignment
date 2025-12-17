export const getSlotStatus = (slot: any) => {
  if (slot.isPast) return 'past';
  if (slot.reservedByMe) return 'holding';
  if (slot.isReserved) return 'reserved';
  if (!slot.available) return 'booked';
  return 'available';
};

export const getSlotLabel = (slot: any) => {
  const status = getSlotStatus(slot);
  
  switch (status) {
    case 'past':
      return '(Past)';
    case 'holding':
      return '(Holding)';
    case 'reserved':
      return '(Reserved)';
    case 'booked':
      return '';
    default:
      return '';
  }
};

export const isSlotSelectable = (slot: any) => {
  return slot.available && !slot.isPast;
};
