import { useCallback, useEffect, useRef, useState } from 'react';
import { createChatClient } from '@/lib/chat/client.js';
import {
  CHAT_WS_URL,
  CHATBOT_SESSION_ID_STORAGE_KEY,
} from '@/lib/chat/constants.js';
import { createMessage, mapServerItem } from '@/lib/chat/util.js';

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
  const [connectionState, setConnectionState] = useState(() =>
    CHAT_WS_URL ? 'connecting' : 'closed',
  );
  const messagesRef = useRef(null);
  const clientRef = useRef(null);
  const activeStreamIdRef = useRef(null);

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

  useEffect(() => {
    const client = createChatClient({
      sessionId: readStoredSessionId(),
      visitorId: undefined,
      onSessionReady: ({ sessionId, items }) => {
        writeStoredSessionId(sessionId);
        const history = (items || []).map(mapServerItem).filter(Boolean);
        setMessages(history);
        setConnectionState('open');
      },
      onChunkStart: ({ id }) => {
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
        if (!content) return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, content: m.content + content } : m,
          ),
        );
      },
      onChunkEnd: ({ id }) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, streaming: false } : m)),
        );
        if (activeStreamIdRef.current === id) {
          activeStreamIdRef.current = null;
        }
      },
      onError: (message) => {
        setIsTyping(false);
        const errMsg = createMessage({
          role: 'bot',
          content: message || 'Something went wrong. Please try again.',
        });
        if (errMsg) setMessages((prev) => [...prev, errMsg]);
      },
      onClose: () => {
        setIsTyping(false);
        setConnectionState('closed');
      },
    });

    clientRef.current = client;
    return () => {
      client?.close();
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
