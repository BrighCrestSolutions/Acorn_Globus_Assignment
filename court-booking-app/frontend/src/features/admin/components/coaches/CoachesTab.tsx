import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import { useCoaches, usePagination } from '../../hooks';
import { Pagination, EmptyState } from '../shared';
import { CoachForm } from './CoachForm';
import { CoachCard } from './CoachCard';

export const CoachesTab: React.FC = () => {
  const { coaches, loading, createCoach, updateCoach, deleteCoach } = useCoaches();
  const { currentPage, setCurrentPage, itemsPerPage, paginate } = usePagination(10);
  
  const [editingCoach, setEditingCoach] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (coachData: any) => {
    const result = await createCoach(coachData);
    if (result.success) {
      setShowForm(false);
      alert('Coach created successfully!');
    } else {
      alert(result.error);
    }
  };

  const handleUpdate = async (coachData: any) => {
    if (!editingCoach) return;
    const result = await updateCoach(editingCoach._id, coachData);
    if (result.success) {
      setEditingCoach(null);
      setShowForm(false);
      alert('Coach updated successfully!');
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coach?')) return;
    const result = await deleteCoach(id);
    if (result.success) {
      alert('Coach deleted successfully!');
    } else {
      alert(result.error);
    }
  };

  const handleEdit = (coach: any) => {
    setEditingCoach(coach);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingCoach(null);
    setShowForm(false);
  };

  const paginatedCoaches = paginate(coaches);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Coaches Management</CardTitle>
              <CardDescription>Manage all coaches and their availability</CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>Add Coach</Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <CoachForm
              initialData={editingCoach}
              onSubmit={editingCoach ? handleUpdate : handleCreate}
              onCancel={handleCancel}
              isEditing={!!editingCoach}
            />
          )}

          <div className="space-y-4 mt-6">
            {loading && coaches.length === 0 ? (
              <div className="text-center py-8">Loading coaches...</div>
            ) : coaches.length === 0 ? (
              <EmptyState
                icon={UserCircle}
                title="No coaches available"
                description="Add your first coach to get started"
                actionLabel="Add Coach"
                onAction={() => setShowForm(true)}
              />
            ) : (
              paginatedCoaches.map((coach) => (
                <CoachCard
                  key={coach._id}
                  coach={coach}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={coaches.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </>
  );
};
