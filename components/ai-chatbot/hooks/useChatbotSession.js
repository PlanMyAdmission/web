import { useCallback, useEffect, useRef, useState } from 'react';
import {
  buildSessionUrl,
  buildWebSocketUrl,
} from '@/components/ai-chatbot/utils/buildUrls.js';
import { getSessionId } from '@/components/ai-chatbot/utils/manageLocalSession.js';
import {
  isTextCapable,
  isVoiceCapable,
} from '@/components/ai-chatbot/utils/chatMode.js';
import useVoiceStream from '@/components/ai-chatbot/hooks/useVoiceStream.js';
import createPcmPlayer from '@/components/ai-chatbot/utils/createPcmPlayer.js';
import { createSocketMessageHandler } from '@/components/ai-chatbot/hooks/socketMessageHandler.js';
const AGENT_ID = '6136635b-b9d5-427c-a9df-49ddf0ff71e1';
const createMessageId = () =>
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const useChatbotSession = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionChatMode, setSessionChatMode] = useState(null);
  const [activeMode, setActiveMode] = useState(null);
  const [requestedMode, setRequestedMode] = useState(null);
  const [authUrl, setAuthUrl] = useState(null);
  const messagesRef = useRef(null);
  const socketRef = useRef(null);
  const sessionIdRef = useRef(getSessionId());
  const pcmPlayerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const currentChunkIdRef = useRef(null);
  const isActiveRef = useRef(false);
  const connectWebSocketRef = useRef(null);
  useEffect(() => {
    if (!pcmPlayerRef.current) {
      pcmPlayerRef.current = createPcmPlayer();
    }
  }, []);
  useEffect(() => {
    let isMounted = true;
    fetch(buildSessionUrl(AGENT_ID), { method: 'GET' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Session request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setSessionChatMode(data?.data?.chat_mode || null);
        setActiveMode(isTextCapable(data?.data?.chat_mode) ? 'text' : null);
        setAuthUrl(data?.data?.auth_url ?? null);
      })
      .catch(() => {
        if (!isMounted) return;
        setMessages([
          {
            id: createMessageId(),
            type: 'bot',
            content: 'Unable to initialize chat session.',
          },
        ]);
      });
    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    if (!messagesRef.current) return;
    setTimeout(() => {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, 100);
  }, [messages, isTyping]);
  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('openAIChatbot', handleOpenChatbot);
    return () => window.removeEventListener('openAIChatbot', handleOpenChatbot);
  }, []);
  const handleSocketMessage = useCallback(
    async (event) => {
      const handler = createSocketMessageHandler({
        pcmPlayerRef,
        setConnecting: () => {},
        setMessages,
        setIsTyping,
        setActiveMode,
        currentChunkIdRef,
        sessionIdRef,
      });
      await handler(event);
    },
    [setMessages, setIsTyping, setActiveMode],
  );
  const scheduleReconnect = useCallback(() => {
    const RECONNECT_LIMIT = 5;
    const BASE_RECONNECT_DELAY_MS = 1000;
    const MAX_RECONNECT_DELAY_MS = 5000;
    reconnectAttemptsRef.current += 1;
    if (reconnectAttemptsRef.current >= RECONNECT_LIMIT) {
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          type: 'bot',
          content: 'Unable to connect to chat server.',
        },
      ]);
      return;
    }
    const delay = Math.min(
      BASE_RECONNECT_DELAY_MS * reconnectAttemptsRef.current,
      MAX_RECONNECT_DELAY_MS,
    );
    reconnectTimeoutRef.current = setTimeout(() => {
      connectWebSocketRef.current?.();
    }, delay);
  }, []);
  const connectWebSocket = useCallback(() => {
    if (!isActiveRef.current) return;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (
      socketRef.current &&
      socketRef.current.readyState !== WebSocket.CLOSED &&
      socketRef.current.readyState !== WebSocket.CLOSING
    ) {
      socketRef.current.close(1000, 'reconnecting');
      socketRef.current = null;
    }
    const socket = new WebSocket(buildWebSocketUrl(AGENT_ID));
    socket.binaryType = 'arraybuffer';
    socket.addEventListener('open', async () => {
      reconnectAttemptsRef.current = 0;
      let authPayload;
      if (authUrl) {
        try {
          const response = await fetch(authUrl, { method: 'GET' });
          if (response.ok) {
            authPayload = await response.json();
          }
        } catch (_error) {}
      }
      socket.send(
        JSON.stringify({
          type: 'session',
          sessionId: sessionIdRef.current,
          data: authPayload ? { auth: authPayload } : { a: 'lol' },
        }),
      );
    });
    socket.addEventListener('message', handleSocketMessage);
    socket.addEventListener('close', () => {
      if (!isActiveRef.current) return;
      scheduleReconnect();
    });
    socket.addEventListener('error', () => {
      if (!isActiveRef.current) return;
      scheduleReconnect();
    });
    socketRef.current = socket;
  }, [authUrl, handleSocketMessage, scheduleReconnect]);
  useEffect(() => {
    connectWebSocketRef.current = connectWebSocket;
  }, [connectWebSocket]);
  useEffect(() => {
    if (!isOpen) {
      isActiveRef.current = false;
      queueMicrotask(() => {
        setIsListening(false);
        setRequestedMode(null);
        setActiveMode(isTextCapable(sessionChatMode) ? 'text' : null);
      });
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.close(1000, 'widget closed');
        socketRef.current = null;
      }
      pcmPlayerRef.current?.stop();
      return;
    }
    isActiveRef.current = true;
    queueMicrotask(() => connectWebSocket());
    return () => {
      isActiveRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.close(1000, 'cleanup');
        socketRef.current = null;
      }
    };
  }, [connectWebSocket, isOpen, sessionChatMode]);
  useVoiceStream({
    socketRef,
    active: isOpen && isVoiceCapable(activeMode),
    setMicError: () => {},
    setMicListening: setIsListening,
    setMicStream: undefined,
    enabled: isVoiceCapable(sessionChatMode),
  });
  useEffect(() => {
    if (!requestedMode || requestedMode === activeMode) return;
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;
    socketRef.current.send(
      JSON.stringify({ type: 'mode', content: requestedMode }),
    );
  }, [activeMode, requestedMode]);
  const toggleChat = () => setIsOpen((prev) => !prev);
  const toggleVoice = () => {
    if (!isVoiceCapable(sessionChatMode)) {
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          type: 'bot',
          content:
            'Voice is not available for this session. Please type your message.',
        },
      ]);
      return;
    }
    const isMicOn = activeMode === 'both' || requestedMode === 'both';
    setRequestedMode(isMicOn ? 'text' : 'both');
  };
  const handleSendMessage = (messageText = null) => {
    const text = messageText || inputValue.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: createMessageId(), type: 'user', content: text },
    ]);
    setInputValue('');
    setIsTyping(true);
    pcmPlayerRef.current?.stop();
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          type: 'bot',
          content:
            'Connecting to the chat server. Please try again in a moment.',
        },
      ]);
      return;
    }
    socketRef.current.send(JSON.stringify({ type: 'message', content: text }));
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    event.target.style.height = 'auto';
    event.target.style.height = `${Math.min(event.target.scrollHeight, 140)}px`;
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  return {
    isOpen,
    messages,
    inputValue,
    isTyping,
    isListening,
    messagesRef,
    toggleChat,
    toggleVoice,
    handleSendMessage,
    handleInputChange,
    handleKeyPress,
  };
};
export default useChatbotSession;
