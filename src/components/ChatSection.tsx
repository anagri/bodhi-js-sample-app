import { useState } from 'react';
import {
  useBodhi,
  isApiResultOperationError,
  isApiResultSuccess,
  isApiResultError,
  type ApiResponseResult,
} from '@bodhiapp/bodhi-js-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageSquare, RefreshCw, Send, AlertCircle, Loader2 } from 'lucide-react';

type SectionStatus = 'idle' | 'fetching' | 'ready' | 'streaming' | 'error';

export default function ChatSection() {
  const { client } = useBodhi();
  const [status, setStatus] = useState<SectionStatus>('idle');
  const [modelInput, setModelInput] = useState<string>('');
  const [modelSuggestions, setModelSuggestions] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(true);

  const handleRefreshModels = async () => {
    setStatus('fetching');
    setError(null);

    const result = await client.fetchModels();

    if (isApiResultOperationError(result)) {
      console.error('[ChatSection] Fetch models failed:', result);
      setError(`Network Error: ${result.error.message}`);
      setStatus('error');
      return;
    }

    if (!isApiResultSuccess(result)) {
      console.error('[ChatSection] Fetch models failed:', result);
      setError(`Error ${result.status}`);
      setStatus('error');
      return;
    }

    const modelIds = (result.body.data || []).map((m: { id: string }) => m.id);
    setModelSuggestions(modelIds);

    if (!modelInput && modelIds.length > 0) {
      setModelInput(modelIds[0]);
    }

    setStatus('ready');
    console.log('[ChatSection] Models loaded:', modelIds);
  };

  const handleSendChat = async () => {
    if (!prompt.trim() || !modelInput.trim()) return;

    setStatus('streaming');
    setResponse('');
    setError(null);

    try {
      const stream = client.streamChat(modelInput.trim(), prompt, authenticated);
      for await (const chunk of stream) {
        const content = chunk.choices?.[0]?.delta?.content || '';
        setResponse((prev) => prev + content);
      }
      setStatus('ready');
    } catch (err) {
      console.error('[ChatSection] Stream failed:', err);
      setError(extractErrorMessage(err, 'Failed to stream response'));
      setStatus('error');
    }
  };

  const extractErrorMessage = (err: unknown, fallback: string): string => {
    const apiResult = err as ApiResponseResult<unknown>;
    if (isApiResultOperationError(apiResult)) return `OperationError: ${apiResult.error.message}`;
    if (isApiResultError(apiResult)) return `ApiError: ${apiResult.body.error.message}`;
    if (err instanceof Error) return `Error: ${err.message}`;
    if (typeof err === 'object' && err !== null) return `Error: ${JSON.stringify(err)}`;
    if (typeof err === 'string') return `Error: ${err}`;
    return fallback;
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'idle':
        return <Badge variant="secondary">Ready</Badge>;
      case 'fetching':
        return <Badge variant="warning">Loading</Badge>;
      case 'ready':
        return (
          <Badge variant="success">
            {modelSuggestions.length > 0 ? `${modelSuggestions.length} models` : 'Ready'}
          </Badge>
        );
      case 'streaming':
        return <Badge variant="warning">Streaming</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>Load models and query streaming chat API</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            list="model-suggestions"
            value={modelInput}
            onChange={(e) => setModelInput(e.target.value)}
            placeholder="Enter or select model..."
            className="flex-1"
            disabled={status === 'streaming'}
          />
          <datalist id="model-suggestions">
            {modelSuggestions.map((id) => (
              <option key={id} value={id} />
            ))}
          </datalist>
          <Button
            onClick={handleRefreshModels}
            disabled={status === 'fetching' || status === 'streaming'}
            variant="outline"
            size="sm"
          >
            {status === 'fetching' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>

        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your message..."
          className="w-full min-h-[80px] resize-none"
          disabled={status === 'streaming'}
        />

        <label className="flex items-center gap-2 text-xs">
          <Checkbox
            checked={authenticated}
            onChange={(e) => setAuthenticated(e.target.checked)}
          />
          <span className="text-muted-foreground">Authenticated</span>
        </label>

        <Button
          onClick={handleSendChat}
          disabled={status === 'streaming' || !prompt.trim() || !modelInput.trim()}
          size="sm"
          className="w-full"
        >
          {status === 'streaming' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send
        </Button>

        {status === 'streaming' && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Streaming response...</span>
          </div>
        )}

        {response && (
          <div className="p-3 bg-muted/50 border rounded-md text-sm whitespace-pre-wrap">
            {response}
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
