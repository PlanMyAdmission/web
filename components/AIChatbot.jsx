'use client';

import React from 'react';
import styles from '@/components/AIChatbot.module.css';
import { mapModuleClasses } from '@/lib/cx.js';
import useChatbotSession from '@/components/ai-chatbot/hooks/useChatbotSession.js';
import ChatbotWindow from '@/components/ai-chatbot/ChatbotWindow.jsx';

const cx = (...classNames) => mapModuleClasses(styles, ...classNames);

const AIChatbot = () => {
  const {
    isOpen,
    messages,
    inputValue,
    isTyping,
    messagesRef,
    toggleChat,
    handleSendMessage,
    handleInputChange,
    handleKeyPress,
  } = useChatbotSession();

  return (
    <ChatbotWindow
      cx={cx}
      isOpen={isOpen}
      messages={messages}
      inputValue={inputValue}
      isTyping={isTyping}
      messagesRef={messagesRef}
      toggleChat={toggleChat}
      handleSendMessage={handleSendMessage}
      handleInputChange={handleInputChange}
      handleKeyPress={handleKeyPress}
    />
  );
};

export default AIChatbot;
