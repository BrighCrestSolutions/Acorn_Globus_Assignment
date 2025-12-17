import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { useEquipment, usePagination } from '../../hooks';
import { Pagination, EmptyState } from '../shared';
import { EquipmentForm } from './EquipmentForm';
import { EquipmentCard } from './EquipmentCard';

export const EquipmentTab: React.FC = () => {
  const { equipment, loading, createEquipment, updateEquipment, deleteEquipment } = useEquipment();
  const { currentPage, setCurrentPage, itemsPerPage, paginate } = usePagination(10);
  
  const [editingEquipment, setEditingEquipment] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (equipmentData: any) => {
    const result = await createEquipment(equipmentData);
    if (result.success) {
      setShowForm(false);
      alert('Equipment created successfully!');
    } else {
      alert(result.error);
    }
  };

  const handleUpdate = async (equipmentData: any) => {
    if (!editingEquipment) return;
    const result = await updateEquipment(editingEquipment._id, equipmentData);
    if (result.success) {
      setEditingEquipment(null);
      setShowForm(false);
      alert('Equipment updated successfully!');
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return;
    const result = await deleteEquipment(id);
    if (result.success) {
      alert('Equipment deleted successfully!');
    } else {
      alert(result.error);
    }
  };

  const handleEdit = (equipment: any) => {
    setEditingEquipment(equipment);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingEquipment(null);
    setShowForm(false);
  };

  const paginatedEquipment = paginate(equipment);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Equipment Management</CardTitle>
              <CardDescription>Manage all equipment and inventory</CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>Add Equipment</Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <EquipmentForm
              initialData={editingEquipment}
              onSubmit={editingEquipment ? handleUpdate : handleCreate}
              onCancel={handleCancel}
              isEditing={!!editingEquipment}
            />
          )}

          <div className="space-y-4 mt-6">
            {loading && equipment.length === 0 ? (
              <div className="text-center py-8">Loading equipment...</div>
            ) : equipment.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No equipment available"
                description="Add your first equipment to get started"
                actionLabel="Add Equipment"
                onAction={() => setShowForm(true)}
              />
            ) : (
              paginatedEquipment.map((equip) => (
                <EquipmentCard
                  key={equip._id}
                  equipment={equip}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={equipment.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </>
  );
};
