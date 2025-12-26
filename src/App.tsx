import { WebUIClient } from '@bodhiapp/bodhi-js';
import { BodhiProvider } from '@bodhiapp/bodhi-js-react';
import { useMemo } from 'react';
import StatusSection from '@/components/StatusSection';
import AuthSection from '@/components/AuthSection';
import ApiTestSection from '@/components/ApiTestSection';
import ChatSection from '@/components/ChatSection';
import { Separator } from '@/components/ui/separator';

const APP_CLIENT_ID = import.meta.env.VITE_APP_CLIENT_ID;

function SampleAppContent() {
  return (
    <div className="w-full max-w-2xl min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center pb-2">
          <h1 className="text-2xl font-semibold tracking-tight">Bodhi Browser Sample App</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Demo using @bodhiapp/bodhi-js-react and @bodhiapp/bodhi-js
          </p>
        </div>

        <Separator />

        {/* Sections */}
        <div className="space-y-6">
          <StatusSection />
          <AuthSection />
          <ApiTestSection />
          <ChatSection />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const client = useMemo(() => {
    return new WebUIClient(APP_CLIENT_ID, {
      authServerUrl: 'https://main-id.getbodhi.app/realms/bodhi',
      redirectUri: `${window.location.origin}/callback`,
      logLevel: 'debug',
    });
  }, []);

  return (
    <BodhiProvider client={client} logLevel="debug">
      <SampleAppContent />
    </BodhiProvider>
  );
}
