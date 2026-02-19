import jsonParser from '@/components/ai-chatbot/utils/jsonParser.js';
import { saveSessionId } from '@/components/ai-chatbot/utils/manageLocalSession.js';
import { isValidMode } from '@/components/ai-chatbot/utils/chatMode.js';

const createMessageId = () =>
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const normalizeSessionItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item, index) => ({
    id: item.id || `${Date.now()}-${index}`,
    type: item.role === 'assistant' ? 'bot' : 'user',
    content: item.message?.content || '',
  }));
};

const appendAssistantChunk = (setMessages, chunkId, chunk) => {
  if (!chunk) return;
  setMessages((prev) => {
    const updated = prev.slice();
    const targetIndex = updated.findIndex((msg) => msg.id === chunkId);
    if (targetIndex === -1) {
      updated.push({ id: chunkId, type: 'bot', content: chunk });
      return updated;
    }

    const target = updated[targetIndex];
    updated[targetIndex] = {
      ...target,
      content: `${target.content || ''}${chunk}`,
    };
    return updated;
  });
};

export const createSocketMessageHandler =
  ({
    pcmPlayerRef,
    setConnecting,
    setMessages,
    setIsTyping,
    setActiveMode,
    currentChunkIdRef,
    sessionIdRef,
  }) =>
  async (event) => {
    const raw = event?.data;
    if (raw instanceof ArrayBuffer) {
      pcmPlayerRef.current?.enqueuePcmArrayBuffer(raw);
      return;
    }
    if (raw instanceof Blob) {
      const buffer = await raw.arrayBuffer();
      pcmPlayerRef.current?.enqueuePcmArrayBuffer(buffer);
      return;
    }
    if (typeof raw !== 'string') return;

    const data = jsonParser(raw);
    const type = data?.type;

    if (type === 'session') {
      if (data.status === 'initialized') {
        setConnecting(false);
        if (data.sessionId) {
          saveSessionId(data.sessionId);
          sessionIdRef.current = data.sessionId;
        }
        setMessages(normalizeSessionItems(data.items));
        setIsTyping(false);
      }
      return;
    }

    if (type === 'chunk_start') {
      const chunkId = data?.id || createMessageId();
      currentChunkIdRef.current = chunkId;
      setMessages((prev) => [
        ...prev,
        { id: chunkId, type: 'bot', content: '' },
      ]);
      setIsTyping(false);
      return;
    }

    if (type === 'message_chunk') {
      if (!currentChunkIdRef.current) return;
      if (data?.id && data.id !== currentChunkIdRef.current) return;
      appendAssistantChunk(
        setMessages,
        currentChunkIdRef.current,
        data?.content || '',
      );
      return;
    }

    if (type === 'chunk_end') {
      if (!currentChunkIdRef.current) return;
      if (data?.id && data.id !== currentChunkIdRef.current) return;
      currentChunkIdRef.current = null;
      return;
    }

    if (type === 'audio_chunk') {
      if (data?.content) {
        pcmPlayerRef.current?.enqueueBase64Pcm(data.content);
      }
      return;
    }

    if (type === 'transcript') {
      if (!data?.final) return;
      const content = data?.content?.trim();
      if (!content) return;
      setMessages((prev) => [
        ...prev,
        { id: createMessageId(), type: 'user', content },
      ]);
      return;
    }

    if (type === 'mode') {
      const content = data?.content || data?.mode;
      if (isValidMode(content)) {
        setActiveMode(content);
      }
      return;
    }

    if (type === 'barge_in') {
      pcmPlayerRef.current?.stop();
    }
  };
