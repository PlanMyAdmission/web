import React from 'react';

const renderMessageHtml = (content) => ({
  __html: `${content || ''}`
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
});

const ChatbotWindow = ({
  cx,
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
}) => (
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
              <p>Study Abroad Expert</p>
            </div>
          </div>
          <button className={cx('pma-chatbot-close')} onClick={toggleChat} type="button">
            ×
          </button>
        </div>

        <div className={cx('pma-chatbot-messages')} ref={messagesRef}>
          {messages.map((message) => (
            <div key={message.id} className={cx('pma-chatbot-message', `pma-chatbot-${message.type}`)}>
              <div className={cx('pma-chatbot-avatar')}>{message.type === 'bot' ? 'AI' : 'U'}</div>
              <div className={cx('pma-chatbot-content')}>
                {message.isUniversityCard && message.universityData ? (
                  <div className={cx('pma-chatbot-university-card')}>
                    <div className={cx('pma-chatbot-university-header')}>
                      <div className={cx('pma-chatbot-rank')}>{message.universityData.ranking}</div>
                      <div>
                        <h4 className={cx('pma-chatbot-uni-name')}>{message.universityData.name}</h4>
                        <p className={cx('pma-chatbot-location')}>{message.universityData.location}</p>
                      </div>
                    </div>
                    <div className={cx('pma-chatbot-details')}>
                      <strong>Acceptance Rate:</strong> {message.universityData.acceptance_rate}
                      <br />
                      <strong>Annual Tuition:</strong> {message.universityData.tuition}
                    </div>
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={renderMessageHtml(message.content)} />
                )}
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
              placeholder="Ask me about studying abroad..."
              rows="1"
              maxLength="500"
            />
            {isListening && (
              <div className={cx('pma-chatbot-voice-status', 'pma-chatbot-show')}>Listening...</div>
            )}
          </div>
          <button
            className={cx('pma-chatbot-voice-btn', isListening ? 'pma-chatbot-listening' : '')}
            onClick={toggleVoice}
            type="button"
          >
            {isListening ? 'STOP' : 'MIC'}
          </button>
          <button className={cx('pma-chatbot-send-btn')} onClick={() => handleSendMessage()} type="button">
            SEND
          </button>
        </div>
      </div>
    )}
  </div>
);

export default ChatbotWindow;
