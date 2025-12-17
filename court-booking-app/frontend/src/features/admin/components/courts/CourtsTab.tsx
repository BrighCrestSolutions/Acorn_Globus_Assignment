import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useCourts, usePagination } from '../../hooks';
import { Pagination, EmptyState } from '../shared';
import { CourtForm } from './CourtForm';
import { CourtCard } from './CourtCard';

export const CourtsTab: React.FC = () => {
  const { courts, loading, createCourt, updateCourt, deleteCourt } = useCourts();
  const { currentPage, setCurrentPage, itemsPerPage, paginate } = usePagination(10);
  
  const [editingCourt, setEditingCourt] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (courtData: any) => {
    const result = await createCourt(courtData);
    if (result.success) {
      setShowForm(false);
      alert('Court created successfully!');
    } else {
      alert(result.error);
    }
  };

  const handleUpdate = async (courtData: any) => {
    if (!editingCourt) return;
    const result = await updateCourt(editingCourt._id, courtData);
    if (result.success) {
      setEditingCourt(null);
      setShowForm(false);
      alert('Court updated successfully!');
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this court?')) return;
    const result = await deleteCourt(id);
    if (result.success) {
      alert('Court deleted successfully!');
    } else {
      alert(result.error);
    }
  };

  const handleEdit = (court: any) => {
    setEditingCourt(court);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingCourt(null);
    setShowForm(false);
  };

  const paginatedCourts = paginate(courts);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Courts Management</CardTitle>
              <CardDescription>Manage all courts and their availability</CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>Add Court</Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <CourtForm
              initialData={editingCourt}
              onSubmit={editingCourt ? handleUpdate : handleCreate}
              onCancel={handleCancel}
              isEditing={!!editingCourt}
            />
          )}

          <div className="space-y-4 mt-6">
            {loading && courts.length === 0 ? (
              <div className="text-center py-8">Loading courts...</div>
            ) : courts.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title="No courts available"
                description="Create your first court to get started"
                actionLabel="Add Court"
                onAction={() => setShowForm(true)}
              />
            ) : (
              paginatedCourts.map((court) => (
                <CourtCard
                  key={court._id}
                  court={court}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={courts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </>
  );
};
