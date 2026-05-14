import { useCallback, useEffect, useRef, useState } from 'react';
import { createChatClient } from '@/lib/chat/client.js';
import {
  CHAT_WS_URL,
  CHATBOT_SESSION_ID_STORAGE_KEY,
} from '@/lib/chat/constants.js';
import { createMessage, mapServerItem } from '@/lib/chat/util.js';

const RECONNECT_DELAYS_MS = [1000, 2000, 5000, 10000, 30000];

const readStoredSessionId = () => {
  try {
    return window.localStorage.getItem(CHATBOT_SESSION_ID_STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

const writeStoredSessionId = (id) => {
  try {
    if (id) window.localStorage.setItem(CHATBOT_SESSION_ID_STORAGE_KEY, id);
  } catch {
    // ignore
  }
};

const useChatbotSession = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionState, setConnectionState] = useState('idle');
  const messagesRef = useRef(null);
  const clientRef = useRef(null);
  const activeStreamIdRef = useRef(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef(null);
  const hasEverConnectedRef = useRef(false);
  const unmountedRef = useRef(false);
  const connectRef = useRef(null);

  useEffect(() => {
    if (!messagesRef.current) return;
    const node = messagesRef.current;
    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 100);
  }, [messages, isTyping]);

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('openAIChatbot', handleOpenChatbot);
    return () => window.removeEventListener('openAIChatbot', handleOpenChatbot);
  }, []);

  const connect = useCallback(() => {
    if (!CHAT_WS_URL || unmountedRef.current) return;

    clientRef.current?.close();
    clientRef.current = null;
    clearTimeout(reconnectTimerRef.current);

    const client = createChatClient({
      sessionId: readStoredSessionId(),
      visitorId: undefined,
      onOpen: () => {
        if (unmountedRef.current) return;
        setConnectionState('connecting');
      },
      onSessionReady: ({ sessionId, items }) => {
        if (unmountedRef.current) return;
        writeStoredSessionId(sessionId);
        if (!hasEverConnectedRef.current) {
          const history = (items || []).map(mapServerItem).filter(Boolean);
          setMessages(history);
          hasEverConnectedRef.current = true;
        }
        reconnectAttemptRef.current = 0;
        setConnectionState('open');
      },
      onChunkStart: ({ id }) => {
        if (unmountedRef.current) return;
        activeStreamIdRef.current = id;
        const placeholder = createMessage({
          id,
          role: 'bot',
          content: '',
          streaming: true,
        });
        if (placeholder) {
          setMessages((prev) => [...prev, placeholder]);
        }
        setIsTyping(false);
      },
      onChunk: ({ id, content }) => {
        if (!content || unmountedRef.current) return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, content: m.content + content } : m,
          ),
        );
      },
      onChunkEnd: ({ id }) => {
        if (unmountedRef.current) return;
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, streaming: false } : m)),
        );
        if (activeStreamIdRef.current === id) {
          activeStreamIdRef.current = null;
        }
      },
      onError: (message) => {
        if (unmountedRef.current) return;
        setIsTyping(false);
        const errMsg = createMessage({
          role: 'bot',
          content: message || 'Something went wrong. Please try again.',
        });
        if (errMsg) setMessages((prev) => [...prev, errMsg]);
      },
      onClose: ({ code } = {}) => {
        if (unmountedRef.current) return;
        setIsTyping(false);

        const isNormalClose = code === 1000 || code === 1001;
        if (isNormalClose) {
          setConnectionState('closed');
          return;
        }

        const attempt = reconnectAttemptRef.current;
        const delay =
          RECONNECT_DELAYS_MS[
            Math.min(attempt, RECONNECT_DELAYS_MS.length - 1)
          ];
        reconnectAttemptRef.current = attempt + 1;
        setConnectionState('reconnecting');

        reconnectTimerRef.current = setTimeout(() => {
          if (!unmountedRef.current) connectRef.current();
        }, delay);
      },
    });

    clientRef.current = client;
  }, []);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    if (!isOpen || !CHAT_WS_URL) return;
    if (clientRef.current) return;
    connect();
  }, [isOpen, connect]);

  useEffect(() => {
    return () => {
      unmountedRef.current = true;
      clearTimeout(reconnectTimerRef.current);
      clientRef.current?.close();
      clientRef.current = null;
    };
  }, []);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleSendMessage = useCallback(
    (messageText = null) => {
      const text = `${messageText || inputValue}`.trim();
      if (!text || isTyping || connectionState !== 'open') return;

      const userMessage = createMessage({ role: 'user', content: text });
      if (!userMessage) return;

      if (!clientRef.current?.sendMessage(text)) return;

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsTyping(true);
    },
    [inputValue, isTyping, connectionState],
  );

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
    connectionState,
    messagesRef,
    toggleChat,
    handleSendMessage,
    handleInputChange,
    handleKeyPress,
  };
};

export default useChatbotSession;
