import React from 'react';
import { MapPin, Package, UserCircle, Settings, Calendar, Users } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'courts', label: 'Courts', icon: MapPin },
    { id: 'equipment', label: 'Equipment', icon: Package },
    { id: 'coaches', label: 'Coaches', icon: UserCircle },
    { id: 'pricing', label: 'Pricing Rules', icon: Settings },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => onTabChange(tab.id)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};
