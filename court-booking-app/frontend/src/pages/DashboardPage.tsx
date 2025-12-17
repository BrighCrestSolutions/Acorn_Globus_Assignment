import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { bookingsAPI, waitlistAPI } from '../services/api';
import { type Booking, type Waitlist } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, Clock, MapPin, User, Package, X, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [waitlist, setWaitlist] = useState<Waitlist[]>([]);
  const [viewType, setViewType] = useState<'bookings' | 'waitlist'>('bookings');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'cancelled' | 'completed'>('all');
  const [waitlistStatusFilter, setWaitlistStatusFilter] = useState<'all' | 'waiting' | 'expired' | 'notified' | 'converted'>('all');
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(searchParams.get('success') === 'true');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (viewType === 'bookings') {
      loadBookings();
    } else {
      loadWaitlist();
    }
  }, [viewType, filter, statusFilter, waitlistStatusFilter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsAPI.getAll();
      let filtered = response.data.bookings;

      // Apply time-based filter
      if (filter === 'upcoming') {
        filtered = filtered.filter((b: Booking) => 
          new Date(b.startTime) > new Date() && b.status === 'confirmed'
        );
      } else if (filter === 'past') {
        filtered = filtered.filter((b: Booking) => 
          new Date(b.startTime) < new Date() || b.status === 'completed' || b.status === 'cancelled'
        );
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter((b: Booking) => b.status === statusFilter);
      }

      setBookings(filtered);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWaitlist = async () => {
    setLoading(true);
    try {
      const params = waitlistStatusFilter !== 'all' ? { status: waitlistStatusFilter } : undefined;
      const response = await waitlistAPI.getAll(params);
      setWaitlist(response.data.waitlist || []);
    } catch (error) {
      console.error('Error loading waitlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingsAPI.cancel(bookingId);
      loadBookings();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      waiting: 'bg-blue-100 text-blue-800',
      notified: 'bg-purple-100 text-purple-800',
      expired: 'bg-red-100 text-red-800',
      converted: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-3 sm:px-4 py-3 rounded-md mb-4 sm:mb-6 flex items-center justify-between text-sm sm:text-base">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span>Booking confirmed successfully!</span>
          </div>
          <button onClick={() => setShowSuccess(false)} className="text-green-600 hover:text-green-800">
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      )}

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">My Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Welcome back, {user?.name}!</p>
      </div>

      {/* View Type Toggle */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={viewType === 'bookings' ? 'default' : 'outline'}
            onClick={() => {
              setViewType('bookings');
              setCurrentPage(1);
            }}
            className="text-sm sm:text-base h-9 sm:h-10"
          >
            My Bookings
          </Button>
          <Button
            variant={viewType === 'waitlist' ? 'default' : 'outline'}
            onClick={() => {
              setViewType('waitlist');
              setCurrentPage(1);
            }}
            className="text-sm sm:text-base h-9 sm:h-10"
          >
            Waitlist
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      {viewType === 'bookings' ? (
        <div className="space-y-3 mb-4 sm:mb-6">
          <div>
            <h3 className="text-xs sm:text-sm font-medium mb-2 text-muted-foreground">Time Filter</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
                className="text-xs sm:text-sm"
              >
                All Bookings
              </Button>
              <Button
                variant={filter === 'upcoming' ? 'default' : 'outline'}
                onClick={() => setFilter('upcoming')}
                size="sm"
                className="text-xs sm:text-sm"
              >
                Upcoming
              </Button>
              <Button
                variant={filter === 'past' ? 'default' : 'outline'}
                onClick={() => setFilter('past')}
                size="sm"
                className="text-xs sm:text-sm"
              >
                Past
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs sm:text-sm font-medium mb-2 text-muted-foreground">Status Filter</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
                className="text-xs sm:text-sm"
              >
                All Status
              </Button>
              <Button
                variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('confirmed')}
                size="sm"
                className="text-xs sm:text-sm bg-green-50 hover:bg-green-100 border-green-200"
              >
                Confirmed
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('completed')}
                size="sm"
                className="text-xs sm:text-sm bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('cancelled')}
                size="sm"
                className="text-xs sm:text-sm bg-red-50 hover:bg-red-100 border-red-200"
              >
                Cancelled
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          <div>
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Waitlist Status Filter</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={waitlistStatusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setWaitlistStatusFilter('all')}
                size="sm"
              >
                All Status
              </Button>
              <Button
                variant={waitlistStatusFilter === 'waiting' ? 'default' : 'outline'}
                onClick={() => setWaitlistStatusFilter('waiting')}
                size="sm"
                className="bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                Waiting
              </Button>
              <Button
                variant={waitlistStatusFilter === 'notified' ? 'default' : 'outline'}
                onClick={() => setWaitlistStatusFilter('notified')}
                size="sm"
                className="bg-purple-50 hover:bg-purple-100 border-purple-200"
              >
                Notified
              </Button>
              <Button
                variant={waitlistStatusFilter === 'expired' ? 'default' : 'outline'}
                onClick={() => setWaitlistStatusFilter('expired')}
                size="sm"
                className="bg-red-50 hover:bg-red-100 border-red-200"
              >
                Expired
              </Button>
              <Button
                variant={waitlistStatusFilter === 'converted' ? 'default' : 'outline'}
                onClick={() => setWaitlistStatusFilter('converted')}
                size="sm"
                className="bg-green-50 hover:bg-green-100 border-green-200"
              >
                Converted
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bookings List */}
      {viewType === 'bookings' && (
        <div className="space-y-4">
          {bookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((booking) => (
          <Card key={booking._id}>
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary flex-shrink-0" />
                    <span className="truncate">{booking.court.name}</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Booking ID: {booking._id.slice(-8)}
                  </CardDescription>
                </div>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusBadge(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
                <div>
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Date
                  </div>
                  <div className="font-semibold text-sm sm:text-base">
                    {format(new Date(booking.startTime), 'MMM dd, yyyy')}
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Time
                  </div>
                  <div className="font-semibold text-sm sm:text-base">
                    {format(new Date(booking.startTime), 'HH:mm')} - {format(new Date(booking.endTime), 'HH:mm')}
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">Duration</div>
                  <div className="font-semibold text-sm sm:text-base">{booking.duration} hour(s)</div>
                </div>
              </div>

              {booking.equipment && booking.equipment.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2">
                    <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Equipment
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {booking.equipment.map((eq, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-xs sm:text-sm rounded">
                        {eq.item.name} × {eq.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {booking.coach && (
                <div className="mb-4">
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Coach
                  </div>
                  <div className="font-semibold text-sm sm:text-base">{booking.coach.name}</div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 pt-4 border-t">
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Total Amount</div>
                  <div className="text-xl sm:text-2xl font-bold text-primary">
                    ₹{booking.pricing.finalTotal}
                  </div>
                </div>
                {booking.status === 'confirmed' && new Date(booking.startTime) > new Date() && (
                  <Button
                    variant="destructive"
                    onClick={() => handleCancelBooking(booking._id)}
                    className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

          {bookings.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground mb-4">No bookings found</p>
                <Button onClick={() => window.location.href = '/courts'} className="text-sm sm:text-base h-9 sm:h-10">
                  Book Your First Court
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Waitlist List */}
      {viewType === 'waitlist' && (
        <div className="space-y-4">
          {waitlist.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((entry) => (
            <Card key={entry._id}>
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary flex-shrink-0" />
                      <span className="truncate">{entry.court.name}</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Waitlist Entry ID: {entry._id.slice(-8)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(entry.status)}`}>
                      {entry.status}
                    </span>
                    {entry.status === 'expired' && (
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-1">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Desired Date
                    </div>
                    <div className="font-semibold text-sm sm:text-base">
                      {format(new Date(entry.desiredDate), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Desired Time
                    </div>
                    <div className="font-semibold text-sm sm:text-base">
                      {entry.desiredStartTime} - {entry.desiredEndTime}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">Position</div>
                    <div className="font-semibold text-sm sm:text-base">#{entry.position}</div>
                  </div>
                </div>

                {entry.equipment && entry.equipment.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2">
                      <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Equipment
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {entry.equipment.map((eq, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-xs sm:text-sm rounded">
                          {eq.item.name} × {eq.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {entry.coach && (
                  <div className="mb-4">
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Coach
                    </div>
                    <div className="font-semibold text-sm sm:text-base">{entry.coach.name}</div>
                  </div>
                )}

                {entry.status === 'expired' && (
                  <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-red-800 font-medium">This waitlist entry has expired</p>
                        <p className="text-xs text-red-600 mt-1">
                          The time slot has passed and we couldn't secure a booking for you. 
                          You can try booking another slot.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 pt-4 border-t">
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Created</div>
                    <div className="text-xs sm:text-sm font-medium">
                      {format(new Date(entry.createdAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                  {entry.status === 'expired' && (
                    <Button
                      variant="default"
                      onClick={() => window.location.href = '/courts'}
                      className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
                    >
                      Book Again
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {waitlist.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground mb-4">No waitlist entries found</p>
                <Button onClick={() => window.location.href = '/courts'} className="text-sm sm:text-base h-9 sm:h-10">
                  Browse Courts
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Pagination */}
      {((viewType === 'bookings' && bookings.length > itemsPerPage) || 
        (viewType === 'waitlist' && waitlist.length > itemsPerPage)) && (
        <div className="flex justify-center items-center gap-2 mt-4 sm:mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-4"
          >
            Previous
          </Button>
          <span className="text-xs sm:text-sm text-muted-foreground">
            Page {currentPage} of {Math.ceil((viewType === 'bookings' ? bookings.length : waitlist.length) / itemsPerPage)}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(Math.ceil((viewType === 'bookings' ? bookings.length : waitlist.length) / itemsPerPage), p + 1))}
            disabled={currentPage === Math.ceil((viewType === 'bookings' ? bookings.length : waitlist.length) / itemsPerPage)}
            className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-4"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
