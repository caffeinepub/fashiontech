import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Rocket, Server, Globe, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDeploymentTab() {
  const canisterId = import.meta.env.VITE_BACKEND_CANISTER_ID || 'Not configured';
  const network = import.meta.env.VITE_DFX_NETWORK || 'local';
  const isProduction = network === 'ic';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Deployment Configuration</h2>
        <p className="text-muted-foreground">Manage deployment settings and monitor canister status</p>
      </div>

      <Alert variant={isProduction ? 'default' : 'destructive'}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Current Environment</AlertTitle>
        <AlertDescription>
          You are currently running on the <strong>{isProduction ? 'Internet Computer Mainnet' : 'Local Development Network'}</strong>
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Backend Canister
            </CardTitle>
            <CardDescription>Backend canister information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Canister ID</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono break-all">
                  {canisterId}
                </code>
                <Button 
                  size="icon" 
                  variant="outline"
                  onClick={() => copyToClipboard(canisterId)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Network</p>
              <Badge variant={isProduction ? 'default' : 'secondary'}>
                {isProduction ? 'Mainnet (IC)' : 'Local Development'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Running</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Frontend Deployment
            </CardTitle>
            <CardDescription>Frontend hosting information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono break-all">
                  {window.location.origin}
                </code>
                <Button 
                  size="icon" 
                  variant="outline"
                  onClick={() => copyToClipboard(window.location.origin)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Build Status</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Deployed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Deployment Commands
          </CardTitle>
          <CardDescription>Quick reference for deployment operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Local Development</h4>
            <div className="space-y-2">
              <CommandBlock 
                title="Start local replica"
                command="dfx start --clean --background"
              />
              <CommandBlock 
                title="Deploy locally"
                command="dfx deploy"
              />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Production Deployment</h4>
            <div className="space-y-2">
              <CommandBlock 
                title="Deploy to mainnet"
                command="dfx deploy --network ic"
              />
              <CommandBlock 
                title="Check canister status"
                command="dfx canister --network ic status backend"
              />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Build Optimization</h4>
            <div className="space-y-2">
              <CommandBlock 
                title="Build frontend"
                command="npm run build"
              />
              <CommandBlock 
                title="Optimize canister"
                command="dfx canister --network ic call backend optimize"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CommandBlock({ title, command }: { title: string; command: string }) {
  const copyCommand = () => {
    navigator.clipboard.writeText(command);
    toast.success('Command copied to clipboard');
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <div className="flex-1">
        <p className="text-sm font-medium mb-1">{title}</p>
        <code className="text-xs text-muted-foreground">{command}</code>
      </div>
      <Button size="sm" variant="ghost" onClick={copyCommand}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}
