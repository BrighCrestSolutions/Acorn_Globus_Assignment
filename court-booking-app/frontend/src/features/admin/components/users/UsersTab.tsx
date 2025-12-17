import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users as UsersIcon } from 'lucide-react';
import { useUsers, usePagination } from '../../hooks';
import { Pagination, EmptyState, StatusBadge } from '../shared';
import { format } from 'date-fns';

export const UsersTab: React.FC = () => {
  const { users, loading } = useUsers();
  const { currentPage, setCurrentPage, itemsPerPage, paginate } = usePagination(10);

  const paginatedUsers = paginate(users);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Users Management</CardTitle>
          <CardDescription>View all registered users</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading && users.length === 0 ? (
            <div className="text-center py-8">Loading users...</div>
          ) : users.length === 0 ? (
            <EmptyState
              icon={UsersIcon}
              title="No users found"
              description="No users are registered yet"
            />
          ) : (
            paginatedUsers.map((user) => (
              <Card key={user._id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{user.name}</h4>
                        <StatusBadge 
                          status={user.isActive ? 'active' : 'inactive'} 
                          variant="user" 
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-medium">{user.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Role</p>
                          <p className="font-medium capitalize">{user.role}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Joined</p>
                          <p className="font-medium">
                            {format(new Date(user.createdAt), 'MMM dd, yyyy')}
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
        <Pagination
          currentPage={currentPage}
          totalItems={users.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
};
