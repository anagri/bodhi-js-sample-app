import { useState } from 'react';
import { useBodhi, isApiResultOperationError } from '@bodhiapp/bodhi-js-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Send, Eraser, AlertCircle, Loader2 } from 'lucide-react';

type ApiStatus = 'ready' | 'calling' | 'completed' | 'error';

interface ApiResponse {
  status: number;
  headers: Record<string, string>;
  body: unknown;
}

export default function ApiTestSection() {
  const { client } = useBodhi();
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('/bodhi/v1/info');
  const [body, setBody] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const [status, setStatus] = useState<ApiStatus>('ready');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    setStatus('calling');
    setError(null);
    setResponse(null);

    let parsedBody: unknown = undefined;
    if (body.trim()) {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        parsedBody = body;
      }
    }

    const result = await client.sendApiRequest(
      method,
      endpoint,
      parsedBody,
      undefined,
      authenticated
    );

    if (isApiResultOperationError(result)) {
      setResponse({
        status: 0,
        headers: {},
        body: { error: result.error },
      });
      setError(`Network Error: ${result.error.message}`);
      setStatus('error');
      return;
    }

    setResponse({
      status: result.status,
      headers: result.headers || {},
      body: result.body,
    });

    if (result.status >= 400) {
      setError(`Error ${result.status}`);
      setStatus('error');
    } else {
      setStatus('completed');
    }
  };

  const handleClear = () => {
    setResponse(null);
    setError(null);
    setStatus('ready');
  };

  const formatBody = (body: unknown): string => {
    if (body === null || body === undefined) return '(no body)';
    try {
      return JSON.stringify(body, null, 2);
    } catch {
      return String(body);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'ready':
        return <Badge variant="secondary">Ready</Badge>;
      case 'calling':
        return <Badge variant="warning">Calling</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            API Test
          </CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>Query any API endpoint with optional authentication</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-28"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </Select>
          <Input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="/bodhi/v1/info"
            className="flex-1"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Body (JSON)</Label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
            rows={2}
            className="font-mono text-xs"
          />
        </div>

        <label className="flex items-center gap-2 text-xs">
          <Checkbox
            checked={authenticated}
            onChange={(e) => setAuthenticated(e.target.checked)}
          />
          <span className="text-muted-foreground">Authenticated</span>
        </label>

        <div className="flex gap-2">
          <Button
            onClick={handleSend}
            disabled={status === 'calling'}
            size="sm"
          >
            {status === 'calling' ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Send className="h-3 w-3" />
            )}
            Send
          </Button>
          <Button onClick={handleClear} variant="outline" size="sm">
            <Eraser className="h-3 w-3" />
            Clear
          </Button>
        </div>

        {response && (
          <div className="space-y-3 pt-2 border-t">
            <div className="space-y-1">
              <Label className="text-xs">Response Status</Label>
              <pre className="p-2 bg-muted rounded-md text-xs font-mono">
                {response.status}
              </pre>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Response Body</Label>
              <pre className="p-2 bg-muted rounded-md text-xs font-mono whitespace-pre-wrap max-h-40 overflow-auto">
                {formatBody(response.body)}
              </pre>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-xs">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
