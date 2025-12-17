export const getSlotStatus = (slot: any) => {
  if (slot.isPast) return 'past';
  if (slot.isBookedByMe) return 'myBooking';
  if (slot.reservedByMe) return 'holding';
  if (slot.isInWaitlist) return 'waitlisted';
  if (slot.isReserved) return 'reserved';
  if (!slot.available) return 'booked';
  return 'available';
};

export const getSlotLabel = (slot: any) => {
  const status = getSlotStatus(slot);
  
  switch (status) {
    case 'past':
      return '(Past)';
    case 'myBooking':
      return '(Booked)';
    case 'holding':
      return '(Holding)';
    case 'waitlisted':
      return '(On Hold)';
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

export const canJoinWaitlist = (slot: any) => {
  const status = getSlotStatus(slot);
  return !slot.available && status !== 'past' && status !== 'reserved' && status !== 'myBooking' && status !== 'waitlisted';
};
