import { useEffect, useRef, useState } from 'react';
import {
  CHATBOT_WELCOME_MESSAGE,
  createChatbotMessage,
  createChatbotSessionId,
  loadStoredChatbotSession,
  sanitizeChatbotMessages,
  saveStoredChatbotSession,
} from '@/lib/chatbot/sessions.js';

const createInitialMessages = () =>
  sanitizeChatbotMessages([
    createChatbotMessage({
      role: 'bot',
      content: CHATBOT_WELCOME_MESSAGE,
    }),
  ]);

const useChatbotSession = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState(createInitialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasLoadedSession, setHasLoadedSession] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (!messagesRef.current) return;
    setTimeout(() => {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, 100);
  }, [messages, isTyping]);

  useEffect(() => {
    const storedSession = loadStoredChatbotSession(window.localStorage);

    if (storedSession?.sessionId) {
      setSessionId(storedSession.sessionId);
      setMessages(
        storedSession.messages.length
          ? storedSession.messages
          : createInitialMessages(),
      );
    } else {
      setSessionId(createChatbotSessionId());
      setMessages(createInitialMessages());
    }

    setHasLoadedSession(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedSession || !sessionId) {
      return;
    }

    saveStoredChatbotSession(window.localStorage, {
      sessionId,
      messages,
    });
  }, [hasLoadedSession, messages, sessionId]);

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('openAIChatbot', handleOpenChatbot);
    return () => window.removeEventListener('openAIChatbot', handleOpenChatbot);
  }, []);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleSendMessage = async (messageText = null) => {
    const text = `${messageText || inputValue}`.trim();
    if (!text || isTyping || !sessionId) return;

    const userMessage = createChatbotMessage({
      role: 'user',
      content: text,
    });

    if (!userMessage) {
      return;
    }

    const nextMessages = sanitizeChatbotMessages([...messages, userMessage]);
    setMessages(nextMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          messages: nextMessages,
          metadata: {
            pagePath: window.location.pathname,
            locale: navigator.language || '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
            userAgent: navigator.userAgent || '',
          },
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to send the chat message.');
      }

      const reply = `${payload?.data?.message || ''}`.trim();
      if (!reply) {
        throw new Error('The chatbot response came back empty.');
      }

      if (`${payload?.data?.sessionId || ''}`.trim()) {
        setSessionId(payload.data.sessionId);
      }

      const assistantMessage =
        createChatbotMessage(payload?.data?.assistantMessage) ||
        createChatbotMessage({
          role: 'bot',
          content: reply,
        });

      if (!assistantMessage) {
        throw new Error('The chatbot response came back empty.');
      }

      setMessages((previous) =>
        sanitizeChatbotMessages([...previous, assistantMessage]),
      );
    } catch (error) {
      const errorMessage = createChatbotMessage({
        role: 'bot',
        content:
          error?.message ||
          'Unable to send the chat message right now. Please try again.',
      });

      if (!errorMessage) {
        return;
      }

      setMessages((previous) =>
        sanitizeChatbotMessages([...previous, errorMessage]),
      );
    } finally {
      setIsTyping(false);
    }
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
    messagesRef,
    toggleChat,
    handleSendMessage,
    handleInputChange,
    handleKeyPress,
  };
};
export default useChatbotSession;
