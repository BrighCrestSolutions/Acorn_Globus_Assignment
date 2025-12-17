import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courtsAPI, equipmentAPI, coachesAPI, bookingsAPI, waitlistAPI } from '../services/api';
import type { Court, Equipment, Coach, TimeSlot } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, X } from 'lucide-react';
import { format } from 'date-fns';

// Import modularized components
import {
  BookingStepIndicator,
  CourtInfoCard,
  DateTimeSelector,
  EquipmentSelector,
  CoachSelector,
  BookingSummary,
  BookingSidebar,
  WaitlistModal
} from '../features/booking/components';

// Import custom hooks
import { useReservation, useSlotPolling, useBookingSteps } from '../features/booking/hooks';

export const BookingPage: React.FC = () => {
  const { courtId } = useParams<{ courtId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Use custom hooks
  const { step, setStep } = useBookingSteps();
  const { reservationError, createReservation, releaseReservation } = useReservation(step);

  // State management
  const [court, setCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Array<{ item: string; quantity: number }>>([]);
  
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  
  const [pricing, setPricing] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Waitlist modal state
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistSlot, setWaitlistSlot] = useState<TimeSlot | null>(null);
  
  // Use slot polling hook
  const { slots, refreshSlots } = useSlotPolling(courtId, selectedDate, step, !!court);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Pre-fill phone if user has it saved
    if (user.phone) {
      setPhone(user.phone);
    }
    loadCourtDetails();
    loadEquipment();
    loadCoaches();
  }, [courtId, user]);

  useEffect(() => {
    if (selectedSlot) {
      fetchPricing();
    }
  }, [selectedSlot, selectedEquipment, selectedCoach]);

  // Handle reservation errors
  useEffect(() => {
    if (reservationError) {
      setError(reservationError);
    }
  }, [reservationError]);

  const loadCourtDetails = async () => {
    try {
      const response = await courtsAPI.getById(courtId!);
      const courtData = response.data.court;
      
      // Check if court is under maintenance
      if (courtData.status === 'maintenance') {
        setError('This court is currently under maintenance. Please book another court.');
        setCourt(null);
        return;
      }
      
      setCourt(courtData);
    } catch (error) {
      console.error('Error loading court:', error);
      setError('Failed to load court details');
    }
  };

  const loadEquipment = async () => {
    try {
      const response = await equipmentAPI.getAll();
      setEquipment(response.data.equipment);
    } catch (error) {
      console.error('Error loading equipment:', error);
    }
  };

  const loadCoaches = async () => {
    try {
      const response = await coachesAPI.getAll();
      setCoaches(response.data.coaches);
    } catch (error) {
      console.error('Error loading coaches:', error);
    }
  };

  const fetchPricing = async () => {
    if (!selectedSlot) return;

    try {
      const response = await bookingsAPI.previewPrice({
        courtId: courtId!,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        equipmentItems: selectedEquipment,
        coachId: selectedCoach
      });
      setPricing(response.data.pricing);
    } catch (error) {
      console.error('Error fetching pricing:', error);
    }
  };

  const handleSlotSelect = async (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot);
      
      // Create reservation for this slot
      try {
        await createReservation({
          courtId: courtId!,
          startTime: typeof slot.startTime === 'string' ? slot.startTime : new Date(slot.startTime).toISOString(),
          endTime: typeof slot.endTime === 'string' ? slot.endTime : new Date(slot.endTime).toISOString()
        });
        
        setStep(2);
      } catch (err: any) {
        setError(err.message || 'Failed to reserve slot');
        refreshSlots(); // Refresh slots to show updated availability
      }
    }
  };

  const handleJoinWaitlist = (slot: TimeSlot) => {
    setWaitlistSlot(slot);
    setShowWaitlistModal(true);
  };

  const handleWaitlistSubmit = async (data: {
    phone: string;
    equipment: Array<{ item: string; quantity: number }>;
    coachId: string | null;
    notes: string;
  }) => {
    try {
      const response = await waitlistAPI.join({
        courtId: courtId!,
        desiredDate: selectedDate,
        desiredStartTime: format(new Date(waitlistSlot!.startTime), 'HH:mm'),
        desiredEndTime: format(new Date(waitlistSlot!.endTime), 'HH:mm'),
        equipmentItems: data.equipment,
        coachId: data.coachId,
        phone: data.phone,
        notes: data.notes
      });

      alert(`Successfully joined waitlist! You are #${response.data.waitlistEntry.position} in queue. We'll notify you via ${data.phone} if a spot opens up.`);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to join waitlist');
    }
  };

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

  const handleBooking = async () => {
    setLoading(true);
    setError('');

    // Validate phone number
    if (!phone || phone.trim().length < 10) {
      setError('Please enter a valid phone number (minimum 10 digits)');
      setLoading(false);
      return;
    }

    try {
      const bookingData = {
        courtId: courtId!,
        startTime: selectedSlot!.startTime,
        endTime: selectedSlot!.endTime,
        equipmentItems: selectedEquipment,
        coachId: selectedCoach || undefined,
        notes,
        phone
      };

      await bookingsAPI.create(bookingData);
      
      // Release reservation after successful booking
      await releaseReservation();
      
      navigate('/dashboard?success=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show maintenance message if court is under maintenance
  if (error && !court) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-orange-200">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center text-orange-800">
              <span className="text-2xl mr-3">🔧</span>
              Court Under Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-lg text-gray-700">{error}</p>
              <div className="bg-orange-100 border border-orange-200 rounded-md p-4">
                <p className="text-sm text-orange-800">
                  This court is temporarily unavailable for bookings due to scheduled maintenance. 
                  We apologize for any inconvenience.
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => navigate('/courts')} className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Browse Other Courts
                </Button>
                <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex-1">
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading court details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <CourtInfoCard court={court} />

      <BookingStepIndicator currentStep={step} />

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-6 flex items-start justify-between gap-3">
          <p className="flex-1">{error}</p>
          <button
            onClick={() => setError('')}
            className="text-destructive hover:text-destructive/80 transition-colors flex-shrink-0"
            aria-label="Close error"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 1: Select Date & Time */}
          {step === 1 && (
            <DateTimeSelector
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              slots={slots}
              selectedSlot={selectedSlot}
              onSlotSelect={handleSlotSelect}
              onJoinWaitlist={handleJoinWaitlist}
              loading={loading}
            />
          )}

          {/* Step 2: Select Equipment */}
          {step === 2 && (
            <EquipmentSelector
              equipment={equipment}
              selectedEquipment={selectedEquipment}
              onToggleEquipment={toggleEquipment}
              onUpdateQuantity={updateEquipmentQuantity}
              onBack={() => setStep(1)}
              onContinue={() => setStep(3)}
            />
          )}

          {/* Step 3: Select Coach */}
          {step === 3 && (
            <CoachSelector
              coaches={coaches}
              selectedCoach={selectedCoach}
              onSelectCoach={setSelectedCoach}
              onBack={() => setStep(2)}
              onContinue={() => setStep(4)}
            />
          )}

          {/* Step 4: Review & Confirm */}
          {step === 4 && (
            <BookingSummary
              phone={phone}
              notes={notes}
              onPhoneChange={setPhone}
              onNotesChange={setNotes}
              onBack={() => setStep(3)}
              onConfirm={handleBooking}
              loading={loading}
            />
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <BookingSidebar
            court={court}
            selectedSlot={selectedSlot}
            selectedEquipment={selectedEquipment}
            equipment={equipment}
            selectedCoach={selectedCoach}
            coaches={coaches}
            pricing={pricing}
          />
        </div>
      </div>

      {/* Waitlist Modal */}
      {waitlistSlot && (
        <WaitlistModal
          isOpen={showWaitlistModal}
          onClose={() => setShowWaitlistModal(false)}
          slot={waitlistSlot}
          selectedDate={selectedDate}
          equipment={equipment}
          coaches={coaches}
          defaultPhone={user?.phone || ''}
          onSubmit={handleWaitlistSubmit}
        />
      )}
    </div>
  );
};
