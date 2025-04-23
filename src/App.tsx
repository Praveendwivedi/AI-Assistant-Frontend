import React, { useState, useEffect } from 'react';
import './App.css';

const InstallItAI: React.FC = () => {
  const [isMonitoringActive, setIsMonitoringActive] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { time: '10:45', text: 'The user clicked on the settings icon in the top right corner...', isSystem: true },
    { time: '10:45', text: 'Hello! How can I assist you today?', isSystem: true },
    { time: '10:45', text: 'Navigating through the preferences menu...', isSystem: true },
    { time: '10:46', text: 'Hi! Can you help me with the installation?', isSystem: false },
    { time: '10:46', text: 'How can I help you?', isSystem: true },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const toggleMonitoring = () => {
    setIsMonitoringActive(!isMonitoringActive);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const now = new Date();
      const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setChatMessages([...chatMessages, 
        { time: timeString, text: newMessage, isSystem: false }
      ]);
      
      setNewMessage('');
      
      setTimeout(() => {
        const responseTime = new Date();
        const responseTimeString = `${responseTime.getHours()}:${responseTime.getMinutes().toString().padStart(2, '0')}`;
        setChatMessages(prev => [...prev, 
          { time: responseTimeString, text: 'I can help with that. What specific issue are you facing?', isSystem: true }
        ]);
      }, 1000);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-left">
          <h1>Install-it.ai</h1>
          <div className="status-container">
            <div className="status">
              <span>Status: </span>
              <span className={isMonitoringActive ? 'active' : 'inactive'}>
                {isMonitoringActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <button 
              onClick={toggleMonitoring}
              className={`monitoring-button ${isMonitoringActive ? 'stop' : 'start'}`}
            >
              {isMonitoringActive ? 'Stop Monitoring' : 'Start Monitoring'}
            </button>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="features-section">
          <div className="features-row">
            <div className="feature-card">
              <div className="feature-icon">🖼️</div>
              <h3>Vision Images Auto</h3>
              <p>Automatic image processing and analysis</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎙️</div>
              <h3>Redtime Transcription</h3>
              <p>Real-time speech to text conversion</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>MVP powered by Delegation</h3>
              <p>Minimal viable product with delegation features</p>
            </div>
          </div>
          <div className="mic-container">
            <div 
              className={`mic-box ${isRecording ? 'recording' : ''}`}
              onClick={toggleRecording}
            >
              <span className="mic-icon">{isRecording ? '⏹️' : '🎙️'}</span>
            </div>
          </div>
        </div>

        <div className="chat-section">
          <div className="chat-interface">
            <h2>Chat Interface</h2>
            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <div key={index} className={`message ${message.isSystem ? 'system' : 'user'}`}>
                  <span className="message-time">{message.time}</span>
                  <div className="message-content">{message.text}</div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallItAI;