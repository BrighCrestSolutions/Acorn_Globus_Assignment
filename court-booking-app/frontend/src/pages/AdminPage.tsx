import React, { useState } from 'react';
import { AdminTabs } from '../features/admin/components/AdminTabs';
import { CourtsTab } from '../features/admin/components/courts';
import { EquipmentTab } from '../features/admin/components/equipment';
import { CoachesTab } from '../features/admin/components/coaches';
import { PricingTab } from '../features/admin/components/pricing';
import { BookingsTab } from '../features/admin/components/bookings';
import { UsersTab } from '../features/admin/components/users';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('courts');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage courts, equipment, coaches, and pricing</p>
      </div>

      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'courts' && <CourtsTab />}
      {activeTab === 'equipment' && <EquipmentTab />}
      {activeTab === 'coaches' && <CoachesTab />}
      {activeTab === 'pricing' && <PricingTab />}
      {activeTab === 'bookings' && <BookingsTab />}
      {activeTab === 'users' && <UsersTab />}
    </div>
  );
};
