import React, { useState, useEffect, useRef } from 'react';
import './AIChatbot.css';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [context, setContext] = useState({
    userName: '',
    currentTopic: '',
    userInterests: [],
    previousQuestions: [],
    conversationState: 'greeting',
    preferredCountries: [],
    preferredPrograms: []
  });

  const messagesRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Education database
  const educationData = {
    universities: {
      harvard: {
        name: "Harvard University",
        location: "Cambridge, Massachusetts, USA",
        ranking: "#1 in USA, #3 Globally",
        tuition: "$54,269 per year",
        acceptance_rate: "3.4%",
        info: "Harvard University, founded in 1636, is America's oldest and most prestigious institution. With 8 US Presidents as alumni and a $53.2 billion endowment, Harvard provides unmatched opportunities.",
        requirements: "SAT: 1460-1580, GPA: 3.9+, Exceptional essays",
        careers: "Average starting salary: $95,000-$120,000"
      },
      stanford: {
        name: "Stanford University",
        location: "Stanford, California (Silicon Valley)",
        ranking: "#2 in USA, #5 Globally",
        tuition: "$56,169 per year",
        acceptance_rate: "4.3%",
        info: "Stanford University is the epicenter of tech innovation. Alumni founded Google, Netflix, PayPal, LinkedIn, and Snapchat.",
        requirements: "SAT: 1420-1570, Strong STEM focus",
        careers: "Average starting salary: $120,000-$180,000"
      },
      mit: {
        name: "MIT",
        location: "Cambridge, Massachusetts, USA",
        ranking: "#1 for Engineering & Technology",
        tuition: "$53,790 per year",
        acceptance_rate: "6.7%",
        info: "MIT is the world's premier technology institute with 93 Nobel Prize winners and cutting-edge research in AI, robotics, and quantum computing.",
        requirements: "SAT: 1490-1570, Strong math/science scores",
        careers: "Average starting salary: $110,000-$150,000"
      },
      oxford: {
        name: "Oxford University",
        location: "Oxford, England, UK",
        ranking: "#1 in UK, #4 Globally",
        tuition: "£28,370-£44,240 per year",
        acceptance_rate: "17.5%",
        info: "Oxford University, founded in 1096, is the oldest English-speaking university with 28 British Prime Ministers as alumni.",
        requirements: "A-levels: A*A*A minimum, Interview required",
        careers: "Strong placement in politics, law, finance globally"
      }
    },
    programs: {
      computer_science: {
        name: "Computer Science & Technology",
        salary: "$65,000-$200,000+ starting",
        growth: "25% job growth (fastest)",
        careers: ["Software Engineer ($85k-$200k)", "Data Scientist ($90k-$180k)", "AI Engineer ($110k-$220k)"],
        info: "Computer Science drives innovation across every industry. With AI revolution, demand has exploded with record salaries.",
        universities: ["MIT", "Stanford", "Harvard", "UC Berkeley"]
      },
      medicine: {
        name: "Medicine & Healthcare",
        salary: "$200,000-$500,000+",
        careers: ["Primary Care ($220k)", "Specialist ($300k-$500k+)", "Surgeon ($400k-$800k+)"],
        info: "Medicine offers highest earning potential with ultimate job security and satisfaction of saving lives.",
        universities: ["Harvard Medical", "Johns Hopkins", "Stanford Medicine"]
      },
      business: {
        name: "Business & MBA",
        salary: "$120,000-$300,000+",
        careers: ["Management Consultant ($140k-$300k)", "Investment Banking ($150k-$500k+)", "CEO/Executive ($200k-$2M+)"],
        info: "Business education provides the most versatile skillset and highest leadership opportunities.",
        universities: ["Harvard Business School", "Stanford GSB", "Wharton"]
      }
    },
    countries: {
      usa: {
        name: "United States",
        cost: "$45,000-$95,000 per year",
        work: "OPT: 12 months (36 for STEM)",
        benefits: ["World's top universities", "Highest salaries", "Tech innovation hub"],
        info: "The USA hosts world's best universities and offers highest graduate salaries globally."
      },
      uk: {
        name: "United Kingdom",
        cost: "£25,000-£45,000 per year",
        work: "Graduate Route: 2 years",
        benefits: ["Historic universities", "Shorter programs", "English-speaking"],
        info: "UK offers world-class education with shorter program durations and rich heritage."
      },
      canada: {
        name: "Canada",
        cost: "CAD $40,000-$70,000 per year",
        work: "PGWP: up to 3 years",
        benefits: ["Immigration-friendly", "High quality of life", "Clear PR pathways"],
        info: "Canada is the most welcoming destination with clear permanent residence paths."
      }
    }
  };

  // Initialize voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 1;
        
        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setTimeout(() => {
            handleSendMessage(transcript);
          }, 500);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event) => {
          setIsListening(false);
          if (event.error !== 'aborted' && event.error !== 'no-speech') {
            console.log('Voice recognition error:', event.error);
          }
        };
        
        setVoiceSupported(true);
      } catch (error) {
        console.log('Voice recognition initialization failed:', error);
        setVoiceSupported(false);
      }
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesRef.current) {
      setTimeout(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, 100);
    }
  }, [messages, isTyping]);

  // Listen for external chatbot open events
  useEffect(() => {
    const handleOpenChatbot = (event) => {
      try {
        console.log('🤖 AI Chatbot: Received openAIChatbot event', event);
        
        if (!isOpen) {
          console.log('🤖 AI Chatbot: Opening chatbot');
          setIsOpen(true);
          
          // Add initial greeting if first time opening
          if (messages.length === 0) {
            setTimeout(() => {
              const greeting = {
                id: Date.now(),
                type: 'bot',
                content: `👋 Hi! I'm your AI Personal Admission Coach from Plan My Admission!

I'm here to help you with your overseas education journey:
• University selection and rankings 🏛️
• Program guidance and career prospects 📚
• Country comparisons and costs 🌍
• Admission requirements 📝
• Scholarship opportunities 💰

What would you like to know about studying abroad?`
              };
              console.log('🤖 AI Chatbot: Setting greeting message', greeting);
              setMessages([greeting]);
            }, 500);
          }
        } else {
          console.log('🤖 AI Chatbot: Already open, ignoring event');
        }
      } catch (error) {
        console.error('🤖 AI Chatbot: Error handling openAIChatbot event', error);
      }
    };

    window.addEventListener('openAIChatbot', handleOpenChatbot);
    return () => {
      window.removeEventListener('openAIChatbot', handleOpenChatbot);
    };
  }, [isOpen, messages.length]);

  const toggleChat = () => {
    console.log('Toggle chat clicked, current state:', isOpen);
    setIsOpen(!isOpen);
    
    // Add initial greeting if first time opening
    if (!isOpen && messages.length === 0) {
      setTimeout(() => {
        const greeting = {
          id: Date.now(),
          type: 'bot',
          content: `Hello! I'm your AI study abroad advisor from Plan My Admission! 🎓

I can help you with:
• University selection and rankings 🏛️
• Program guidance and career prospects 📚
• Country comparisons and costs 🌍
• Admission requirements 📝
• Scholarship opportunities 💰

${voiceSupported ? 
  "You can type or use voice (MIC button) in English!" :
  "Please type your questions below - voice is not available on this device."
}

What's your name?`
        };
        setMessages([greeting]);
      }, 600);
    }
  };

  const toggleVoice = () => {
    if (!voiceSupported || !recognitionRef.current) {
      addBotMessage("Voice recognition is not available on this device or browser. Please type your message instead!");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        addBotMessage("Unable to start voice recognition. Please type your message!");
      }
    }
  };

  const handleSendMessage = (messageText = null) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: text
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Update context
    setContext(prev => ({
      ...prev,
      previousQuestions: [...prev.previousQuestions, text]
    }));

    // Show typing indicator
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      processMessage(text);
    }, 1400 + Math.random() * 1000);
  };

  const addBotMessage = (content, isUniversityCard = false, universityData = null) => {
    const botMessage = {
      id: Date.now(),
      type: 'bot',
      content,
      isUniversityCard,
      universityData
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const processMessage = (message) => {
    const lowerMsg = message.toLowerCase();
    
    // Context-aware name extraction
    if (context.conversationState === 'greeting' && !context.userName) {
      const userName = extractName(message);
      setContext(prev => ({
        ...prev,
        userName,
        conversationState: 'helping'
      }));
      
      const response = `Great to meet you, ${userName}! 👋

I'm here to provide comprehensive guidance on studying abroad. I have detailed knowledge about thousands of universities and programs worldwide.

What interests you most? Feel free to ask about specific universities like Harvard, Stanford, MIT, Oxford, or programs like Computer Science, Medicine, Business, etc.

I can also help with country comparisons, costs, scholarships, and admission requirements!`;
      
      addBotMessage(response);
      speak("Great to meet you! I can help you with comprehensive study abroad guidance.");
      return;
    }
    
    handleIntelligentQuery(message, lowerMsg);
  };

  const handleIntelligentQuery = (message, lowerMsg) => {
    updateContext(lowerMsg);
    
    const uniMatch = findUniversityMatch(lowerMsg);
    if (uniMatch) {
      handleUniversityQuery(uniMatch, lowerMsg);
      return;
    }
    
    const progMatch = findProgramMatch(lowerMsg);
    if (progMatch) {
      handleProgramQuery(progMatch, lowerMsg);
      return;
    }
    
    const countryMatch = findCountryMatch(lowerMsg);
    if (countryMatch) {
      handleCountryQuery(countryMatch, lowerMsg);
      return;
    }
    
    if (hasKeywords(lowerMsg, ['cost', 'fee', 'tuition', 'scholarship', 'funding', 'expensive', 'cheap'])) {
      handleCostQuery();
      return;
    }
    
    if (hasKeywords(lowerMsg, ['admission', 'apply', 'application', 'requirement', 'ielts', 'toefl', 'gre', 'gmat'])) {
      handleAdmissionQuery();
      return;
    }
    
    if (hasKeywords(lowerMsg, ['visa', 'immigration', 'work permit', 'opt', 'pgwp', 'stay'])) {
      handleVisaQuery();
      return;
    }
    
    if (hasKeywords(lowerMsg, ['career', 'job', 'salary', 'employment', 'future', 'prospects'])) {
      handleCareerQuery();
      return;
    }
    
    if (hasKeywords(lowerMsg, ['compare', 'vs', 'versus', 'difference', 'better', 'which'])) {
      handleComparisonQuery(lowerMsg);
      return;
    }
    
    handleGeneralQuery();
  };

  const updateContext = (message) => {
    setContext(prev => {
      const newInterests = [...prev.userInterests];
      const newCountries = [...prev.preferredCountries];
      
      ['computer science', 'medicine', 'business', 'engineering'].forEach(interest => {
        if (message.includes(interest) && !newInterests.includes(interest)) {
          newInterests.push(interest);
        }
      });
      
      ['usa', 'uk', 'canada', 'australia'].forEach(country => {
        if (message.includes(country) && !newCountries.includes(country)) {
          newCountries.push(country);
        }
      });
      
      return {
        ...prev,
        userInterests: newInterests,
        preferredCountries: newCountries
      };
    });
  };

  const handleUniversityQuery = (uni, query) => {
    // Add university card
    addBotMessage('', true, uni);
    
    let response = `**${uni.name}** (${uni.ranking})

${uni.info}

**Key Facts:**
• Location: ${uni.location}
• Acceptance Rate: ${uni.acceptance_rate}
• Annual Tuition: ${uni.tuition}

`;
    
    if (hasKeywords(query, ['admission', 'apply', 'requirement', 'how to get'])) {
      response += `**Admission Requirements:** ${uni.requirements}

`;
    }
    
    if (hasKeywords(query, ['career', 'job', 'salary', 'placement'])) {
      response += `**Career Outcomes:** ${uni.careers}

`;
    }
    
    response += getContextualFollowUp();
    
    addBotMessage(response);
    speak(`Here's information about ${uni.name}.`);
  };

  const handleProgramQuery = (prog, query) => {
    let response = `**${prog.name}** - Excellent Choice!

${prog.info}

**Career Prospects:**
• Salary Range: ${prog.salary}
`;
    
    if (prog.growth) response += `• Job Growth: ${prog.growth}
`;
    
    response += `• Career Paths: ${prog.careers.join(', ')}

**Top Universities:** ${prog.universities.join(', ')}

`;
    
    response += getContextualFollowUp();
    
    addBotMessage(response);
    speak(`${prog.name} is an excellent choice with great prospects.`);
  };

  const handleCountryQuery = (country, query) => {
    let response = `**Studying in ${country.name}**

${country.info}

**Key Details:**
• Annual Cost: ${country.cost}
• Work Rights: ${country.work}
• Benefits: ${country.benefits.join(', ')}

`;
    
    response += getContextualFollowUp();
    
    addBotMessage(response);
    speak(`Here's information about studying in ${country.name}.`);
  };

  const handleCostQuery = () => {
    let response = `💰 **Study Abroad Costs & Scholarships**

**Annual Costs (Tuition + Living):**
• 🇺🇸 USA: $45,000-$95,000 (₹37-78 lakhs)
• 🇬🇧 UK: £25,000-£45,000 (₹26-47 lakhs)
• 🇨🇦 Canada: CAD $40,000-$70,000 (₹24-42 lakhs)

**Scholarship Opportunities:**
• Merit scholarships: $5,000-$50,000
• Need-based aid: Up to full tuition
• Government programs: Fulbright, Chevening

`;
    
    response += getContextualFollowUp();
    
    addBotMessage(response);
    speak("Here's cost information for studying abroad.");
  };

  const handleAdmissionQuery = () => {
    let response = `📝 **Admission Strategy Guide**

**Timeline:**
• 12+ months: Research & test prep
• 8-10 months: Take standardized tests
• 6-8 months: Prepare applications
• 3-5 months: Submit applications

**Required Documents:**
• Academic transcripts (75%+ recommended)
• English tests (IELTS/TOEFL)
• Statement of Purpose
• Letters of Recommendation

**Get personalized help:** <a href="https://www.planmyadmission.com" target="_blank" class="pma-chatbot-register-link">Register on Plan My Admission →</a>

`;
    
    response += getContextualFollowUp();
    
    addBotMessage(response);
    speak("Here's your admission strategy guide.");
  };

  const handleVisaQuery = () => {
    let response = `🛂 **Visa & Work Rights Guide**

**🇺🇸 USA (F-1 Visa):**
• Work Rights: OPT 12-36 months
• Processing: 2-4 weeks + interview

**🇬🇧 UK (Student Visa):**
• Work Rights: Graduate Route 2 years
• Processing: 3-6 weeks

**🇨🇦 Canada (Study Permit):**
• Work Rights: PGWP up to 3 years
• Processing: 4-12 weeks

`;
    
    response += getContextualFollowUp();
    
    addBotMessage(response);
    speak("Here's visa information for major destinations.");
  };

  const handleCareerQuery = () => {
    let response = `🚀 **Career Prospects by Field**

`;
    
    if (context.userInterests.length > 0) {
      response += `Based on your interests in ${context.userInterests.join(', ')}:

`;
    }
    
    response += `**💻 Computer Science:**
• Starting: $65,000-$200,000+ (25% growth)
• Top roles: Software Engineer, Data Scientist

**🏥 Medicine:**
• Earnings: $200,000-$500,000+ (Job security)
• Roles: Physician, Specialist, Surgeon

**💼 Business/MBA:**
• Starting: $120,000-$300,000+ (Leadership)
• Roles: Consultant, Investment Banker

`;
    
    response += getContextualFollowUp();
    
    addBotMessage(response);
    speak("Here are career prospects for popular fields.");
  };

  const handleComparisonQuery = (query) => {
    let response = `🔄 **University & Program Comparisons**

`;
    
    if (context.preferredCountries.length > 1) {
      response += `Based on your interest in ${context.preferredCountries.join(' vs ')}:

`;
    }
    
    response += `**Harvard vs Stanford:**
• Harvard: Oldest prestige, all fields
• Stanford: Tech innovation, entrepreneurship

**USA vs UK vs Canada:**
• USA: Highest salaries, top universities
• UK: Shorter programs, historic prestige
• Canada: Immigration-friendly, affordable

`;
    
    response += getContextualFollowUp();
    
    addBotMessage(response);
    speak("Here are detailed comparisons for your consideration.");
  };

  const handleGeneralQuery = () => {
    const name = context.userName || 'there';
    let response = `Hi ${name}! I can provide comprehensive guidance on studying abroad.

`;
    
    if (context.userInterests.length > 0) {
      response += `I see you're interested in ${context.userInterests.join(', ')}. `;
    }
    
    response += `I can help with:
🏛️ **Universities:** Harvard, Stanford, MIT, Oxford
📚 **Programs:** Computer Science, Medicine, Business
🌍 **Countries:** USA, UK, Canada, Australia
💰 **Costs:** Tuition, scholarships, ROI analysis
📝 **Admissions:** Requirements, strategy, deadlines

**Want expert guidance?** <a href="https://www.planmyadmission.com" target="_blank" class="pma-chatbot-register-link">Register on Plan My Admission →</a>

What specific area would you like detailed information about?`;
    
    addBotMessage(response);
    speak("I can help with comprehensive study abroad guidance.");
  };

  const getContextualFollowUp = () => {
    const interests = context.userInterests;
    const countries = context.preferredCountries;
    
    if (interests.length > 0 && countries.length > 0) {
      return `Based on your interest in ${interests.join(', ')} and ${countries.join(', ')}, would you like specific university recommendations or admission guidance?`;
    } else if (interests.length > 0) {
      return `Since you're interested in ${interests.join(', ')}, would you like to know about top universities or career prospects?`;
    } else if (countries.length > 0) {
      return `For studying in ${countries.join(', ')}, would you like information about costs, visas, or top universities?`;
    }
    
    return "What specific aspect would you like to explore further?";
  };

  // Helper functions
  const findUniversityMatch = (query) => {
    for (let key in educationData.universities) {
      if (query.includes(key) || query.includes(educationData.universities[key].name.toLowerCase())) {
        return educationData.universities[key];
      }
    }
    return null;
  };

  const findProgramMatch = (query) => {
    for (let key in educationData.programs) {
      const prog = educationData.programs[key];
      if (query.includes(key.replace('_', ' ')) || 
          query.includes(prog.name.toLowerCase()) ||
          (key === 'computer_science' && (query.includes('cs') || query.includes('tech'))) ||
          (key === 'medicine' && (query.includes('medical') || query.includes('doctor'))) ||
          (key === 'business' && query.includes('mba'))) {
        return prog;
      }
    }
    return null;
  };

  const findCountryMatch = (query) => {
    for (let key in educationData.countries) {
      if (query.includes(key) || 
          query.includes(educationData.countries[key].name.toLowerCase()) ||
          (key === 'usa' && (query.includes('america') || query.includes('united states'))) ||
          (key === 'uk' && (query.includes('britain') || query.includes('england')))) {
        return educationData.countries[key];
      }
    }
    return null;
  };

  const hasKeywords = (text, keywords) => {
    return keywords.some(keyword => text.includes(keyword));
  };

  const extractName = (message) => {
    const words = message.split(' ');
    const nameWords = words.filter(word => 
      word.length > 2 && 
      /^[A-Za-z]+$/.test(word) && 
      !['the', 'and', 'but', 'for', 'with', 'about', 'study', 'want', 'like', 'hello', 'name', 'interested', 'looking'].includes(word.toLowerCase())
    );
    
    return nameWords.length > 0 ? 
      nameWords[0].charAt(0).toUpperCase() + nameWords[0].slice(1).toLowerCase() :
      message.split(' ')[0].charAt(0).toUpperCase() + message.split(' ')[0].slice(1).toLowerCase();
  };

  const speak = (text) => {
    if (!synthesisRef.current) return;
    
    const cleanText = text.replace(/[🎓💻🏥💼⚙️🏛️📚🌍💰📝🛂🚀]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.7;
    
    synthesisRef.current.speak(utterance);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  };

  console.log('AIChatbot rendering, isOpen:', isOpen);
  
  return (
    <div className="pma-chatbot-widget">
      {/* Chat Bubble */}
      <button 
        className={`pma-chatbot-bubble ${!isOpen ? 'pma-chatbot-pulse' : ''}`} 
        onClick={toggleChat}
        style={{ display: isOpen ? 'none' : 'flex' }}
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
            <button className="pma-chatbot-close" onClick={toggleChat}>
              ×
            </button>
          </div>

          <div className="pma-chatbot-messages" ref={messagesRef}>
            {messages.map((message) => (
              <div key={message.id} className={`pma-chatbot-message pma-chatbot-${message.type}`}>
                <div className="pma-chatbot-avatar">
                  {message.type === 'bot' ? 'AI' : 'U'}
                </div>
                <div className="pma-chatbot-content">
                  {message.isUniversityCard && message.universityData ? (
                    <div className="pma-chatbot-university-card">
                      <div className="pma-chatbot-university-header">
                        <div className="pma-chatbot-rank">{message.universityData.ranking}</div>
                        <div>
                          <h4 className="pma-chatbot-uni-name">{message.universityData.name}</h4>
                          <p className="pma-chatbot-location">{message.universityData.location}</p>
                        </div>
                      </div>
                      <div className="pma-chatbot-details">
                        <strong>Acceptance Rate:</strong> {message.universityData.acceptance_rate}<br />
                        <strong>Annual Tuition:</strong> {message.universityData.tuition}
                      </div>
                    </div>
                  ) : (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: message.content
                          .replace(/\n/g, '<br>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
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
                <div className="pma-chatbot-voice-status pma-chatbot-show">Listening...</div>
              )}
            </div>
            <button 
              className={`pma-chatbot-voice-btn ${isListening ? 'pma-chatbot-listening' : ''}`}
              onClick={toggleVoice}
            >
              {isListening ? 'STOP' : 'MIC'}
            </button>
            <button className="pma-chatbot-send-btn" onClick={() => handleSendMessage()}>
              SEND
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
