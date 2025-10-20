import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VoiceAgent.css';

function VoiceAgent() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const recognitionRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const messagesEndRef = useRef(null);
  const greetingSpoken = useRef(false);
  const sessionIdRef = useRef(null);
  const isMountedRef = useRef(true);

  // 🔥 CRITICAL: Hide Navbar & Footer tanpa ubah App.js
  useEffect(() => {
    // Find and hide navbar
    const navbar = document.querySelector('.navbar');
    const footer = document.querySelector('.footer');
    const mainContent = document.querySelector('.main-content');
    
    // Store original display values
    const originalNavbarDisplay = navbar ? navbar.style.display : null;
    const originalFooterDisplay = footer ? footer.style.display : null;
    const originalMainPadding = mainContent ? mainContent.style.paddingTop : null;

    // Hide navbar & footer
    if (navbar) navbar.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (mainContent) mainContent.style.paddingTop = '0';

    // Disable body scroll
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Cleanup: restore original state
    return () => {
      if (navbar) navbar.style.display = originalNavbarDisplay || '';
      if (footer) footer.style.display = originalFooterDisplay || '';
      if (mainContent) mainContent.style.paddingTop = originalMainPadding || '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.speechSynthesis.cancel();
    };
  }, []);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech Recognition tidak didukung di browser ini');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'id-ID';

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      if (interim) {
        setInterimTranscript(interim);
      }

      if (final) {
        setInterimTranscript('');
        handleSendMessage(final);
        recognition.stop();
        setIsListening(false);
        setIsHolding(false);
        stopRecordingTimer();
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setIsHolding(false);
      setInterimTranscript('');
      stopRecordingTimer();
    };

    recognition.onend = () => {
      if (isHolding) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isHolding]);

  // Initialize session & greeting
  useEffect(() => {
    isMountedRef.current = true;

    const initializeSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/voice/start-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        sessionIdRef.current = data.sessionId;

        if (!greetingSpoken.current && isMountedRef.current) {
          greetingSpoken.current = true;
          
          const greetingMsg = {
            id: Date.now(),
            type: 'ai',
            text: data.message,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          };

          setMessages([greetingMsg]);

          const speakGreeting = () => {
            const voices = window.speechSynthesis.getVoices();
            const indonesianVoice = voices.find(voice => voice.lang === 'id-ID');
            
            const utterance = new SpeechSynthesisUtterance(data.message);
            utterance.lang = 'id-ID';
            if (indonesianVoice) {
              utterance.voice = indonesianVoice;
            }
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
          };

          if (window.speechSynthesis.getVoices().length > 0) {
            setTimeout(speakGreeting, 300);
          } else {
            window.speechSynthesis.onvoiceschanged = () => {
              setTimeout(speakGreeting, 300);
            };
          }
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    };

    initializeSession();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Text-to-speech
  const speakText = (text) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(voice => voice.lang === 'id-ID');
    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Recording timer
  const startRecordingTimer = () => {
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setRecordingTime(0);
  };

  // Hold-to-talk handlers
  const handleHoldStart = async (e) => {
    e.preventDefault();
    
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsHolding(true);
      setIsListening(true);
      setInterimTranscript('');
      startRecordingTimer();
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Microphone access denied:', error);
      alert('Mohon izinkan akses microphone untuk menggunakan fitur voice');
    }
  };

  const handleHoldEnd = (e) => {
    e.preventDefault();
    
    if (isHolding) {
      setIsHolding(false);
      setIsListening(false);
      stopRecordingTimer();
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  // Global event listeners
  useEffect(() => {
    const handleGlobalMouseUp = (e) => {
      if (isHolding) {
        handleHoldEnd(e);
      }
    };

    const handleGlobalTouchEnd = (e) => {
      if (isHolding) {
        handleHoldEnd(e);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isHolding]);

  // Send message
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setTextInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/voice/text-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          text: text.trim()
        })
      });

      const data = await response.json();
      
      setTimeout(() => {
        setIsTyping(false);

        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          text: data.message,
          destinations: data.destinations,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, aiMessage]);
        speakText(data.message);
      }, 1000);

    } catch (error) {
      setIsTyping(false);
      console.error('Failed to send message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(textInput);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voice-agent-container">
      {/* Header */}
      <div className="voice-agent-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="agent-info">
          <div className={`agent-avatar ${isSpeaking ? 'speaking' : ''}`}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#7C3AED"/>
              <path d="M16 8c-2.21 0-4 1.79-4 4v4c0 2.21 1.79 4 4 4s4-1.79 4-4v-4c0-2.21-1.79-4-4-4zm6 8c0 3.31-2.69 6-6 6s-6-2.69-6-6" 
                    stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="agent-details">
            <h2>Wanderly AI</h2>
            <span className="agent-status">Online</span>
          </div>
        </div>

        <button className="menu-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="50" fill="#F3E8FF"/>
                <path d="M60 30c-16.57 0-30 13.43-30 30s13.43 30 30 30 30-13.43 30-30-13.43-30-30-30zm0 54c-13.23 0-24-10.77-24-24s10.77-24 24-24 24 10.77 24 24-10.77 24-24 24z" 
                      fill="#7C3AED"/>
                <circle cx="50" cy="55" r="4" fill="#7C3AED"/>
                <circle cx="70" cy="55" r="4" fill="#7C3AED"/>
                <path d="M50 70c0-5.52 4.48-10 10-10s10 4.48 10 10" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Halo! Aku Wanderly !</h3>
            <p>Tahan tombol mikrofon untuk berbicara,<br/>atau ketik pertanyaanmu di bawah</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}-message`}>
                {message.type === 'ai' && (
                  <div className="message-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="12" fill="#7C3AED"/>
                      <path d="M12 6c-1.66 0-3 1.34-3 3v3c0 1.66 1.34 3 3 3s3-1.34 3-3V9c0-1.66-1.34-3-3-3zm4.5 6c0 2.49-2.01 4.5-4.5 4.5s-4.5-2.01-4.5-4.5" 
                            stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
                
                <div className="message-content">
                  <p>{message.text}</p>
                  
                  {message.destinations && message.destinations.length > 0 && (
                    <div className="destination-cards">
                      {message.destinations.map((dest, idx) => (
                        <div key={idx} className="destination-card-mini">
                          <img src={dest.image} alt={dest.name} />
                          <div className="dest-card-info">
                            <h4>{dest.name}</h4>
                            <p>{dest.description}</p>
                            <span className="dest-price">{dest.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <span className="message-time">{message.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message ai-message">
                <div className="message-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#7C3AED"/>
                  </svg>
                </div>
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-container">
        <form onSubmit={handleTextSubmit} className="text-input-form">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Ketik pesan..."
            className="text-input"
          />
          
          <button
            type="button"
            className={`voice-button ${isHolding ? 'recording' : ''}`}
            onMouseDown={handleHoldStart}
            onTouchStart={handleHoldStart}
          >
            {isHolding ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="8" y="8" width="8" height="8" rx="1" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" 
                      fill="currentColor"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5M12 19v4M8 23h8" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>

          <span className="mic-hint">Tahan mic untuk bicara</span>
        </form>
      </div>

      {/* Recording Overlay */}
      {isHolding && (
        <div className="recording-overlay">
          <div className="recording-content">
            <div className="recording-wave">
              <div className="wave-circle wave-1"></div>
              <div className="wave-circle wave-2"></div>
              <div className="wave-circle wave-3"></div>
              <div className="mic-icon-recording">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="white"/>
                  <path d="M24 28c3.31 0 6-2.69 6-6V10c0-3.31-2.69-6-6-6s-6 2.69-6 6v12c0 3.31 2.69 6 6 6z" 
                        fill="#DC2626"/>
                  <path d="M34 22c0 5.52-4.48 10-10 10s-10-4.48-10-10" 
                        stroke="#DC2626" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            
            <div className="recording-timer">{formatTime(recordingTime)}</div>
            
            {interimTranscript && (
              <div className="interim-transcript">
                <p>{interimTranscript}</p>
              </div>
            )}
            
            <p className="recording-hint">Lepas untuk mengirim</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoiceAgent;