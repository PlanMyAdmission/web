import Link from 'next/link';
import React from 'react';

const BOLD_PATTERN = /\*\*(.*?)\*\*/g;

const renderMessageContent = (content = '') =>
  `${content || ''}`.split('\n').map((line, lineIndex) => {
    const parts = [];
    let match;
    let lastIndex = 0;

    while ((match = BOLD_PATTERN.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }

      parts.push(
        <strong key={`bold-${lineIndex}-${match.index}`}>{match[1]}</strong>,
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    BOLD_PATTERN.lastIndex = 0;

    return (
      <React.Fragment key={`line-${lineIndex}`}>
        {parts.length > 0 ? parts : line}
        {lineIndex < `${content || ''}`.split('\n').length - 1 ? <br /> : null}
      </React.Fragment>
    );
  });

const ChatbotWindow = ({
  cx,
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
}) => {
  const isConnecting = connectionState === 'connecting';
  const isClosed = connectionState === 'closed';
  const inputDisabled = isConnecting || isClosed;
  const placeholder = isConnecting
    ? 'Connecting…'
    : isClosed
      ? 'Disconnected — refresh to retry'
      : 'Try: CGPA 8.2, IELTS 7.5, budget 20L INR, target Canada';
  const sendLabel = isTyping ? 'WAIT' : isConnecting ? '…' : 'SEND';

  return (
  <div className={cx('pma-chatbot-widget')}>
    <button
      className={cx('pma-chatbot-bubble', !isOpen ? 'pma-chatbot-pulse' : '')}
      onClick={toggleChat}
      style={{ display: isOpen ? 'none' : 'flex' }}
      type="button"
    >
      AI
    </button>

    {isOpen && (
      <div className={cx('pma-chatbot-chat', 'pma-chatbot-active')}>
        <div className={cx('pma-chatbot-header')}>
          <div className={cx('pma-chatbot-header-info')}>
            <div className={cx('pma-chatbot-header-avatar')}>AI</div>
            <div className={cx('pma-chatbot-header-text')}>
              <h3>Plan My Admission AI</h3>
              <p>Text Study Abroad Assistant</p>
            </div>
          </div>
          <button className={cx('pma-chatbot-close')} onClick={toggleChat} type="button">
            ×
          </button>
        </div>

        <div className={cx('pma-chatbot-messages')} ref={messagesRef}>
          {messages.map((message) => (
            <div key={message.id} className={cx('pma-chatbot-message', `pma-chatbot-${message.role}`)}>
              <div className={cx('pma-chatbot-avatar')}>{message.role === 'bot' ? 'AI' : 'U'}</div>
              <div className={cx('pma-chatbot-content')}>
                <div>{renderMessageContent(message.content)}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className={cx('pma-chatbot-message', 'pma-chatbot-bot')}>
              <div className={cx('pma-chatbot-avatar')}>AI</div>
              <div className={cx('pma-chatbot-content')}>
                <div className={cx('pma-chatbot-typing')}>
                  <span>AI is thinking...</span>
                  <div className={cx('pma-chatbot-dots')}>
                    <div className={cx('pma-chatbot-dot')}></div>
                    <div className={cx('pma-chatbot-dot')}></div>
                    <div className={cx('pma-chatbot-dot')}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={cx('pma-chatbot-input-area')}>
          <div className={cx('pma-chatbot-input-wrapper')}>
            <textarea
              className={cx('pma-chatbot-input')}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              rows="1"
              maxLength="500"
              disabled={inputDisabled}
            />
            <p className={cx('pma-chatbot-legal-note')}>
              By continuing, you accept our{' '}
              <Link href="/privacy-policy" target="_blank" rel="noreferrer">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/terms-and-conditions" target="_blank" rel="noreferrer">
                Terms &amp; Conditions
              </Link>
              .
            </p>
          </div>
          <button
            className={cx('pma-chatbot-send-btn')}
            onClick={() => handleSendMessage()}
            type="button"
            disabled={isTyping || inputDisabled || !inputValue.trim()}
          >
            {sendLabel}
          </button>
        </div>
      </div>
    )}
  </div>
  );
};

export default ChatbotWindow;
