import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Code, Terminal, Package, Rocket, CheckCircle, AlertCircle } from 'lucide-react';

export default function DeveloperGuideTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Developer Guide</h2>
        <p className="text-muted-foreground">Step-by-step setup and deployment instructions</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Prerequisites</AlertTitle>
        <AlertDescription>
          Ensure you have Node.js (v18+), dfx SDK, and Git installed before proceeding.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>Get your development environment up and running</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="step1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Step 1: Install Dependencies</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Install the required dependencies for both frontend and backend development.
                </p>
                <CodeBlock code="npm install" />
                <p className="text-sm text-muted-foreground">
                  This will install all necessary packages including React, TypeScript, and ICP SDK.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="step2">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Step 2: Start Local Replica</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Start the local Internet Computer replica for development.
                </p>
                <CodeBlock code="dfx start --clean --background" />
                <p className="text-sm text-muted-foreground">
                  The <code>--clean</code> flag ensures a fresh state, and <code>--background</code> runs it in the background.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="step3">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Step 3: Deploy Canisters</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Deploy both backend and frontend canisters to your local replica.
                </p>
                <CodeBlock code="dfx deploy" />
                <p className="text-sm text-muted-foreground">
                  This command builds and deploys all canisters defined in dfx.json.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="step4">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Step 4: Start Development Server</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Start the Vite development server for hot-reload development.
                </p>
                <CodeBlock code="npm start" />
                <p className="text-sm text-muted-foreground">
                  Your application will be available at <code>http://localhost:3000</code>
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Production Deployment
          </CardTitle>
          <CardDescription>Deploy your application to the Internet Computer mainnet</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="prod1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Build for Production</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Create an optimized production build of your frontend.
                </p>
                <CodeBlock code="npm run build" />
                <p className="text-sm text-muted-foreground">
                  This generates optimized assets in the <code>dist</code> directory.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="prod2">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4" />
                  <span>Deploy to Mainnet</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Deploy your canisters to the Internet Computer mainnet.
                </p>
                <CodeBlock code="dfx deploy --network ic" />
                <Alert className="mt-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Ensure you have sufficient ICP cycles in your wallet before deploying to mainnet.
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="prod3">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Verify Deployment</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Check the status of your deployed canisters.
                </p>
                <CodeBlock code="dfx canister --network ic status backend" />
                <CodeBlock code="dfx canister --network ic status frontend" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Useful Commands
          </CardTitle>
          <CardDescription>Common commands for development and debugging</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <CommandReference 
            title="Check canister IDs"
            command="dfx canister id backend"
            description="Get the canister ID for the backend"
          />
          <CommandReference 
            title="View canister logs"
            command="dfx canister logs backend"
            description="View logs from the backend canister"
          />
          <CommandReference 
            title="Stop local replica"
            command="dfx stop"
            description="Stop the local Internet Computer replica"
          />
          <CommandReference 
            title="Generate type bindings"
            command="dfx generate backend"
            description="Generate TypeScript bindings from Candid interface"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="bg-muted p-3 rounded-lg">
      <code className="text-sm font-mono">{code}</code>
    </div>
  );
}

function CommandReference({ title, command, description }: { title: string; command: string; description: string }) {
  return (
    <div className="border-l-2 border-primary pl-4 py-2">
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      <CodeBlock code={command} />
      <p className="text-xs text-muted-foreground mt-2">{description}</p>
    </div>
  );
}
