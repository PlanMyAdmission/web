import React, { useEffect, useRef, useState } from "react";
import "./AIChatbot.css";
import {
  buildSessionUrl,
  buildWebSocketUrl,
} from "./ai-chatbot/utils/buildUrls";
import jsonParser from "./ai-chatbot/utils/jsonParser";
import {
  getSessionId,
  saveSessionId,
} from "./ai-chatbot/utils/manageLocalSession";
import {
  isTextCapable,
  isValidMode,
  isVoiceCapable,
} from "./ai-chatbot/utils/chatMode";
import useVoiceStream from "./ai-chatbot/hooks/useVoiceStream";
import createPcmPlayer from "./ai-chatbot/utils/createPcmPlayer";

const AGENT_ID = "6136635b-b9d5-427c-a9df-49ddf0ff71e1";
const DEFAULT_GREETING = "Hi how can I help you today";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState(null);
  const [sessionChatMode, setSessionChatMode] = useState(null);
  const [activeMode, setActiveMode] = useState(null);
  const [requestedMode, setRequestedMode] = useState(null);
  const [authUrl, setAuthUrl] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const messagesRef = useRef(null);
  const socketRef = useRef(null);
  const sessionIdRef = useRef(getSessionId());
  const pcmPlayerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const currentChunkIdRef = useRef(null);
  const isActiveRef = useRef(false);

  useEffect(() => {
    if (!pcmPlayerRef.current) {
      pcmPlayerRef.current = createPcmPlayer();
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetch(buildSessionUrl(AGENT_ID), { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Session request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setSessionChatMode(data?.chat_mode || null);
        setActiveMode(isTextCapable(data?.chat_mode) ? "text" : null);
        setAuthUrl(data?.auth_url ?? null);
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Unable to initialize chat session.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      setTimeout(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, 100);
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!error) return;
    console.log("AIChatbot:", error);
  }, [error]);

  useEffect(() => {
    if (!micError) return;
    console.log("AIChatbot mic:", micError);
  }, [micError]);

  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
    };

    window.addEventListener("openAIChatbot", handleOpenChatbot);
    return () => {
      window.removeEventListener("openAIChatbot", handleOpenChatbot);
    };
  }, []);

  const appendAssistantChunk = (chunkId, chunk) => {
    if (!chunk) return;
    setMessages((prev) => {
      const updated = prev.slice();
      const targetIndex = updated.findIndex((msg) => msg.id === chunkId);
      if (targetIndex === -1) {
        updated.push({
          id: chunkId,
          type: "bot",
          content: chunk,
        });
        return updated;
      }
      const target = updated[targetIndex];
      updated[targetIndex] = {
        ...target,
        content: `${target.content || ""}${chunk}`,
      };
      return updated;
    });
  };

  const normalizeSessionItems = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map((item, index) => ({
      id: item.id || `${Date.now()}-${index}`,
      type: item.role === "assistant" ? "bot" : "user",
      content: item.message?.content || "",
    }));
  };

  const ensureDefaultGreeting = (items) => {
    if (!Array.isArray(items)) return items;
    const firstMessage = items.find((item) => item?.content?.trim());
    const firstLength = firstMessage?.content?.length || 0;
    if (firstLength >= 40) return items;
    return [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type: "bot",
        content: DEFAULT_GREETING,
      },
      ...items,
    ];
  };

  const handleSocketMessage = async (event) => {
    const raw = event?.data;

    if (raw instanceof ArrayBuffer) {
      if (pcmPlayerRef.current) {
        pcmPlayerRef.current.enqueuePcmArrayBuffer(raw);
      }
      return;
    }

    if (raw instanceof Blob) {
      if (pcmPlayerRef.current) {
        const buffer = await raw.arrayBuffer();
        pcmPlayerRef.current.enqueuePcmArrayBuffer(buffer);
      }
      return;
    }

    if (typeof raw !== "string") {
      return;
    }

    const data = jsonParser(raw);
    const type = data?.type;

    if (type === "session") {
      if (data.status === "initialized") {
        setConnecting(false);
        if (data.sessionId) {
          saveSessionId(data.sessionId);
          sessionIdRef.current = data.sessionId;
        }
        const normalized = normalizeSessionItems(data.items);
        setMessages(ensureDefaultGreeting(normalized));
        setIsTyping(false);
      }
      return;
    }

    if (type === "chunk_start") {
      const chunkId =
        data?.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      currentChunkIdRef.current = chunkId;
      setMessages((prev) => [
        ...prev,
        {
          id: chunkId,
          type: "bot",
          content: "",
        },
      ]);
      setIsTyping(false);
      return;
    }

    if (type === "message_chunk") {
      if (!currentChunkIdRef.current) return;
      if (data?.id && data.id !== currentChunkIdRef.current) return;
      appendAssistantChunk(currentChunkIdRef.current, data?.content || "");
      return;
    }

    if (type === "chunk_end") {
      if (!currentChunkIdRef.current) return;
      if (data?.id && data.id !== currentChunkIdRef.current) return;
      currentChunkIdRef.current = null;
      return;
    }

    if (type === "audio_chunk") {
      const content = data?.content;
      if (!content || !pcmPlayerRef.current) return;
      pcmPlayerRef.current.enqueueBase64Pcm(content);
      return;
    }

    if (type === "transcript") {
      if (!data?.final) return;
      const content = data?.content?.trim();
      if (!content) return;
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          type: "user",
          content,
        },
      ]);
    }

    if (type === "mode") {
      const content = data?.content || data?.mode;
      if (isValidMode(content)) {
        setActiveMode(content);
      }
      return;
    }

    if (type === "barge_in") {
      if (pcmPlayerRef.current) {
        pcmPlayerRef.current.stop();
      }
    }
  };

  const scheduleReconnect = () => {
    const RECONNECT_LIMIT = 5;
    const BASE_RECONNECT_DELAY_MS = 1000;
    const MAX_RECONNECT_DELAY_MS = 5000;

    reconnectAttemptsRef.current += 1;

    if (reconnectAttemptsRef.current >= RECONNECT_LIMIT) {
      setError("Unable to connect to chat server.");
      return;
    }

    const delay = Math.min(
      BASE_RECONNECT_DELAY_MS * reconnectAttemptsRef.current,
      MAX_RECONNECT_DELAY_MS,
    );
    reconnectTimeoutRef.current = setTimeout(() => {
      connectWebSocket();
    }, delay);
  };

  const connectWebSocket = () => {
    if (!isActiveRef.current) return;

    setConnecting(true);

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (
      socketRef.current &&
      socketRef.current.readyState !== WebSocket.CLOSED &&
      socketRef.current.readyState !== WebSocket.CLOSING
    ) {
      socketRef.current.close(1000, "reconnecting");
      socketRef.current = null;
    }

    const socket = new WebSocket(buildWebSocketUrl(AGENT_ID));
    socket.binaryType = "arraybuffer";

    socket.addEventListener("open", async () => {
      reconnectAttemptsRef.current = 0;
      let authPayload;
      if (authUrl) {
        try {
          const response = await fetch(authUrl, { method: "GET" });
          if (response.ok) {
            authPayload = await response.json();
          }
        } catch (_error) {
          // Ignore auth errors and proceed without auth payload.
        }
      }
      socket.send(
        JSON.stringify({
          type: "session",
          sessionId: sessionIdRef.current,
          data: authPayload ? { auth: authPayload } : { a: "lol" },
        }),
      );
      setError(null);
    });

    socket.addEventListener("message", handleSocketMessage);

    socket.addEventListener("close", () => {
      if (!isActiveRef.current) return;
      setError("Connection closed. Reconnecting...");
      scheduleReconnect();
    });

    socket.addEventListener("error", () => {
      setError("Connection error. Reconnecting...");
    });

    socketRef.current = socket;
  };

  useEffect(() => {
    if (!isOpen) {
      isActiveRef.current = false;
      setIsListening(false);
      setMicError(null);
      setRequestedMode(null);
      setActiveMode(isTextCapable(sessionChatMode) ? "text" : null);

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.close(1000, "widget closed");
        socketRef.current = null;
      }
      if (pcmPlayerRef.current) {
        pcmPlayerRef.current.stop();
      }
      return;
    }

    isActiveRef.current = true;
    connectWebSocket();

    return () => {
      isActiveRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.close(1000, "cleanup");
        socketRef.current = null;
      }
    };
  }, [isOpen, authUrl, sessionChatMode]);

  useVoiceStream({
    socketRef,
    active: isOpen && isVoiceCapable(activeMode),
    setMicError,
    setMicListening: setIsListening,
    setMicStream: undefined,
    enabled: isVoiceCapable(sessionChatMode),
  });

  useEffect(() => {
    if (!requestedMode || requestedMode === activeMode) return;
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }
    socketRef.current.send(
      JSON.stringify({
        type: "mode",
        content: requestedMode,
      }),
    );
  }, [requestedMode, activeMode]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleVoice = () => {
    if (!isVoiceCapable(sessionChatMode)) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          type: "bot",
          content:
            "Voice is not available for this session. Please type your message.",
        },
      ]);
      return;
    }

    const isMicOn = activeMode === "both" || requestedMode === "both";
    setRequestedMode(isMicOn ? "text" : "both");
  };

  const handleSendMessage = (messageText = null) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type: "user",
        content: text,
      },
    ]);
    setInputValue("");
    setIsTyping(true);

    if (pcmPlayerRef.current) {
      pcmPlayerRef.current.stop();
    }

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          type: "bot",
          content:
            "Connecting to the chat server. Please try again in a moment.",
        },
      ]);
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        type: "message",
        content: text,
      }),
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  };

  return (
    <div className="pma-chatbot-widget">
      {/* Chat Bubble */}
      <button
        className={`pma-chatbot-bubble ${!isOpen ? "pma-chatbot-pulse" : ""}`}
        onClick={toggleChat}
        style={{ display: isOpen ? "none" : "flex" }}
        type="button"
      >
        AI
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="pma-chatbot-chat pma-chatbot-active">
          <div className="pma-chatbot-header">
            <div className="pma-chatbot-header-info">
              <div className="pma-chatbot-header-avatar">AI</div>
              <div className="pma-chatbot-header-text">
                <h3>Plan My Admission AI</h3>
                <p>Study Abroad Expert</p>
              </div>
            </div>
            <button
              className="pma-chatbot-close"
              onClick={toggleChat}
              type="button"
            >
              ×
            </button>
          </div>

          <div className="pma-chatbot-messages" ref={messagesRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`pma-chatbot-message pma-chatbot-${message.type}`}
              >
                <div className="pma-chatbot-avatar">
                  {message.type === "bot" ? "AI" : "U"}
                </div>
                <div className="pma-chatbot-content">
                  {message.isUniversityCard && message.universityData ? (
                    <div className="pma-chatbot-university-card">
                      <div className="pma-chatbot-university-header">
                        <div className="pma-chatbot-rank">
                          {message.universityData.ranking}
                        </div>
                        <div>
                          <h4 className="pma-chatbot-uni-name">
                            {message.universityData.name}
                          </h4>
                          <p className="pma-chatbot-location">
                            {message.universityData.location}
                          </p>
                        </div>
                      </div>
                      <div className="pma-chatbot-details">
                        <strong>Acceptance Rate:</strong>{" "}
                        {message.universityData.acceptance_rate}
                        <br />
                        <strong>Annual Tuition:</strong>{" "}
                        {message.universityData.tuition}
                      </div>
                    </div>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\n/g, "<br>")
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="pma-chatbot-message pma-chatbot-bot">
                <div className="pma-chatbot-avatar">AI</div>
                <div className="pma-chatbot-content">
                  <div className="pma-chatbot-typing">
                    <span>AI is thinking...</span>
                    <div className="pma-chatbot-dots">
                      <div className="pma-chatbot-dot"></div>
                      <div className="pma-chatbot-dot"></div>
                      <div className="pma-chatbot-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pma-chatbot-input-area">
            <div className="pma-chatbot-input-wrapper">
              <textarea
                className="pma-chatbot-input"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about studying abroad..."
                rows="1"
                maxLength="500"
              />
              {isListening && (
                <div className="pma-chatbot-voice-status pma-chatbot-show">
                  Listening...
                </div>
              )}
            </div>
            <button
              className={`pma-chatbot-voice-btn ${isListening ? "pma-chatbot-listening" : ""}`}
              onClick={toggleVoice}
              type="button"
            >
              {isListening ? "STOP" : "MIC"}
            </button>
            <button
              className="pma-chatbot-send-btn"
              onClick={() => handleSendMessage()}
              type="button"
            >
              SEND
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
