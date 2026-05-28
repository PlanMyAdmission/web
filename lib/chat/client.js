import { CHAT_WS_URL } from '@/lib/chat/constants.js';

const generateRequestId = () =>
  `req-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

export const createChatClient = ({
  sessionId,
  visitorId,
  onOpen,
  onSessionReady,
  onChunkStart,
  onChunk,
  onChunkEnd,
  onAudioStart,
  onAudio,
  onAudioEnd,
  onBargeIn,
  onTranscript,
  onMode,
  onError,
  onClose,
} = {}) => {
  if (!CHAT_WS_URL) return null;

  const url = new URL(CHAT_WS_URL);
  if (visitorId) url.searchParams.set('visitor_id', visitorId);

  const ws = new WebSocket(url.toString());
  ws.binaryType = 'arraybuffer';
  let closed = false;

  ws.addEventListener('open', () => {
    onOpen?.();
    ws.send(
      JSON.stringify({
        type: 'session',
        sessionId: sessionId || null,
        requestId: 'init',
      }),
    );
  });

  ws.addEventListener('message', (event) => {
    if (event.data instanceof ArrayBuffer) {
      onAudio?.(event.data);
      return;
    }

    if (typeof event.data !== 'string') return;
    let msg;
    try {
      msg = JSON.parse(event.data);
    } catch {
      return;
    }

    switch (msg.type) {
      case 'session': {
        const status = msg.data?.status || msg.status;
        if (status !== 'initialized') return;
        onSessionReady?.({
          sessionId: msg.data?.sessionId || msg.sessionId,
          items: msg.data?.items || msg.items || [],
        });
        return;
      }
      case 'chunk_start':
        onChunkStart?.({ id: msg.data?.id || msg.id });
        return;
      case 'message_chunk':
        onChunk?.({
          id: msg.data?.id || msg.id,
          content: msg.data?.content || msg.content || '',
        });
        return;
      case 'chunk_end':
        onChunkEnd?.({ id: msg.data?.id || msg.id });
        return;
      case 'audio_start':
        onAudioStart?.({ id: msg.data?.id || msg.id });
        return;
      case 'audio_end':
        onAudioEnd?.({ id: msg.data?.id || msg.id });
        return;
      case 'barge_in':
        onBargeIn?.();
        return;
      case 'transcript':
        onTranscript?.({
          content: msg.data?.content ?? msg.content ?? '',
          final: msg.data?.final ?? msg.final ?? false,
        });
        return;
      case 'mode':
        onMode?.({ mode: msg.data?.mode || msg.mode });
        return;
      case 'error':
        onError?.(msg.data?.message || msg.message || 'Chat error');
        return;
      default:
        return;
    }
  });

  ws.addEventListener('error', () => {
    if (!closed) onError?.('Connection error');
  });

  ws.addEventListener('close', (event) => {
    closed = true;
    onClose?.({ code: event.code, reason: event.reason });
  });

  return {
    sendMessage: (content) => {
      if (ws.readyState !== WebSocket.OPEN) return false;
      ws.send(
        JSON.stringify({
          type: 'message',
          content,
          requestId: generateRequestId(),
        }),
      );
      return true;
    },
    sendAudio: (buffer) => {
      if (ws.readyState !== WebSocket.OPEN) return false;
      ws.send(buffer);
      return true;
    },
    sendMode: (mode) => {
      if (ws.readyState !== WebSocket.OPEN) return false;
      ws.send(
        JSON.stringify({
          type: 'mode',
          content: mode,
          requestId: generateRequestId(),
        }),
      );
      return true;
    },
    sendClientEvent: (type) => {
      if (ws.readyState !== WebSocket.OPEN) return false;
      ws.send(
        JSON.stringify({
          type: 'event',
          content: type,
          requestId: generateRequestId(),
        }),
      );
      return true;
    },
    close: () => {
      closed = true;
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close(1000, 'client close');
      }
    },
    get readyState() {
      return ws.readyState;
    },
  };
};
