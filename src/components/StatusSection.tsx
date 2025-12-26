import { useBodhi, ClientCtxState } from '@bodhiapp/bodhi-js-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export default function StatusSection() {
  const { clientState, showSetup } = useBodhi();

  const isReady = ClientCtxState.isOverallReady(clientState);
  const isInitializing = ClientCtxState.isInitializing(clientState);
  const clientInit = ClientCtxState.getClientInitState(clientState);
  const serverStatus = ClientCtxState.getServerState(clientState);

  const getStatusBadge = (ready: boolean, state: string) => {
    if (ready) return <Badge variant="success">{state}</Badge>;
    if (state === 'initializing') return <Badge variant="warning">{state}</Badge>;
    return <Badge variant="secondary">{state}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Extension Status</span>
          <Button onClick={showSetup} size="sm" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Setup
          </Button>
        </CardTitle>
        <CardDescription>Extension and server connection status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Status:</span>
            {getStatusBadge(isReady, isReady ? 'Ready' : isInitializing ? 'Initializing' : 'Not Ready')}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Client:</span>
            {getStatusBadge(clientInit.ready, clientInit.mode || clientInit.actualState)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Server:</span>
            {getStatusBadge(serverStatus.ready, serverStatus.actualState)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
