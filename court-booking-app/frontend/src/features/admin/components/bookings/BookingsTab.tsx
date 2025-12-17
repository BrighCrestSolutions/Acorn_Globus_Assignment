import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useBookings, usePagination } from '../../hooks';
import { Pagination, EmptyState, StatusBadge } from '../shared';
import { format } from 'date-fns';

export const BookingsTab: React.FC = () => {
  const { bookings, waitlist, loading, filterBookings } = useBookings();
  const { currentPage, setCurrentPage, itemsPerPage, paginate, resetPage } = usePagination(10);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    resetPage();
  };

  const filteredBookings = statusFilter === 'all' ? bookings : (filterBookings(statusFilter) || []);
  const paginatedBookings = paginate(filteredBookings);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Bookings & Waitlist Management</CardTitle>
            <CardDescription>View and manage all bookings and waitlist entries</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('confirmed')}
            >
              Confirmed
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('pending')}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('cancelled')}
            >
              Cancelled
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Bookings Section */}
          <div>
            <h3 className="font-semibold mb-4">Active Bookings ({bookings.length})</h3>
            <div className="space-y-4">
              {loading && filteredBookings.length === 0 ? (
                <div className="text-center py-8">Loading bookings...</div>
              ) : filteredBookings.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No bookings found"
                  description="No bookings match your current filter"
                />
              ) : (
                paginatedBookings.map((booking) => (
                  <Card key={booking._id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">
                              {booking.user?.name || 'Unknown User'}
                            </h4>
                            <StatusBadge status={booking.status} variant="booking" />
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Court</p>
                              <p className="font-medium">{booking.court?.name || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Date</p>
                              <p className="font-medium">
                                {format(new Date(booking.startTime), 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Time</p>
                              <p className="font-medium">
                                {format(new Date(booking.startTime), 'HH:mm')} - {format(new Date(booking.endTime), 'HH:mm')}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total</p>
                              <p className="font-medium">₹{booking.pricing?.finalTotal || 0}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredBookings.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Waitlist Section */}
          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-4">Waitlist ({waitlist.length})</h3>
            <div className="space-y-4">
              {waitlist.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No waitlist entries"
                  description="All slots are currently available"
                />
              ) : (
                waitlist.map((entry) => (
                  <Card key={entry._id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">
                              {entry.user?.name || 'Unknown User'}
                            </h4>
                            <StatusBadge status={entry.status} variant="booking" />
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Court</p>
                              <p className="font-medium">{entry.court?.name || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Date</p>
                              <p className="font-medium">
                                {format(new Date(entry.desiredDate || entry.date), 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Time</p>
                              <p className="font-medium">{entry.desiredStartTime || entry.startTime} - {entry.desiredEndTime || entry.endTime}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Expires</p>
                              <p className="font-medium text-orange-600">
                                {format(new Date(entry.expiresAt), 'MMM dd, HH:mm')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
