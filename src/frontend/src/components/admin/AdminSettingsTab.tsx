import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Settings, Info } from 'lucide-react';

export default function AdminSettingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Platform Settings</h2>
        <p className="text-muted-foreground">Configure platform-wide settings and preferences</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Configuration</AlertTitle>
        <AlertDescription>
          Platform settings are managed through the backend canister. Additional configuration options will be available in future updates.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>Platform configuration and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Internet Identity integration is enabled and configured.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">User Approval</h4>
              <p className="text-sm text-muted-foreground">
                User approval system is active. New users require admin approval.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Course Management</h4>
              <p className="text-sm text-muted-foreground">
                Admins can create, edit, and delete courses through the admin panel.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Mentorship Program</h4>
              <p className="text-sm text-muted-foreground">
                Community mentorship features are enabled for all approved users.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Information</CardTitle>
          <CardDescription>Current platform status and capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <InfoRow label="Platform Version" value="1.0.0" />
            <InfoRow label="Backend Language" value="Motoko" />
            <InfoRow label="Frontend Framework" value="React + TypeScript" />
            <InfoRow label="UI Components" value="shadcn/ui + Tailwind CSS" />
            <InfoRow label="State Management" value="React Query" />
            <InfoRow label="Authentication" value="Internet Identity" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
