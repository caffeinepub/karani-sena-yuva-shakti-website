import { useState } from 'react';
import { useGetAdmins } from '../hooks/useGetAdmins';
import { useAddAdmin } from '../hooks/useAddAdmin';
import { useRemoveAdmin } from '../hooks/useRemoveAdmin';
import { useResetAdminSystem } from '../hooks/useResetAdminSystem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, Trash2, UserPlus, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminManagementSection() {
  const [newAdminPrincipal, setNewAdminPrincipal] = useState('');
  const { data: admins, isLoading } = useGetAdmins();
  const addAdminMutation = useAddAdmin();
  const removeAdminMutation = useRemoveAdmin();
  const resetSystemMutation = useResetAdminSystem();

  const handleAddAdmin = async () => {
    if (!newAdminPrincipal.trim()) {
      toast.error('Please enter a valid principal ID');
      return;
    }

    try {
      const success = await addAdminMutation.mutateAsync(newAdminPrincipal.trim());
      if (success) {
        toast.success('Admin added successfully');
        setNewAdminPrincipal('');
      } else {
        toast.error('Admin already exists or could not be added');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add admin');
    }
  };

  const handleRemoveAdmin = async (principalStr: string) => {
    try {
      const success = await removeAdminMutation.mutateAsync(principalStr);
      if (success) {
        toast.success('Admin removed successfully');
      } else {
        toast.error('Cannot remove super admin or admin does not exist');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove admin');
    }
  };

  const handleResetSystem = async () => {
    try {
      await resetSystemMutation.mutateAsync();
      toast.success('Admin system reset successfully. You are now the super admin.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset admin system');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Admin
          </CardTitle>
          <CardDescription>
            Enter the Internet Identity principal ID of the user you want to add as an admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="principal">Principal ID</Label>
              <Input
                id="principal"
                placeholder="Enter principal ID (e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx)"
                value={newAdminPrincipal}
                onChange={(e) => setNewAdminPrincipal(e.target.value)}
                disabled={addAdminMutation.isPending}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAddAdmin}
                disabled={addAdminMutation.isPending || !newAdminPrincipal.trim()}
              >
                {addAdminMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Admin
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Admins</CardTitle>
          <CardDescription>
            List of all administrators with access to the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!admins || admins.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No admins found</p>
          ) : (
            <div className="space-y-3">
              {admins.map((admin) => (
                <div
                  key={admin.principal.toString()}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm break-all">
                        {admin.principal.toString()}
                      </p>
                    </div>
                    {admin.isSuperAdmin && (
                      <Badge variant="default" className="flex-shrink-0">
                        Super Admin
                      </Badge>
                    )}
                  </div>
                  {!admin.isSuperAdmin && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={removeAdminMutation.isPending}
                          className="ml-4 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Admin</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this admin? They will lose access to the admin panel.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveAdmin(admin.principal.toString())}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Reset the entire admin system. This action will clear all admins and re-initialize you as the super admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={resetSystemMutation.isPending}>
                {resetSystemMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset Admin System'
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Reset Admin System
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p className="font-semibold">This action will:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Remove all current admins (including super admin)</li>
                    <li>Re-initialize you as the new super admin</li>
                    <li>Cannot be undone</li>
                  </ul>
                  <p className="mt-4 text-destructive font-semibold">
                    Are you absolutely sure you want to proceed?
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetSystem}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, Reset System
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
