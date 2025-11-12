import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import Icon from './Icon';
import './CoachKAssistant.css';

const CoachKAssistant = () => {
  const { coachKState, setCoachKState, coachingBias } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [coachKState.messages]);

  // Auto-open on first visit
  useEffect(() => {
    if (!coachingBias && coachKState.currentStage === 'welcome') {
      setTimeout(() => {
        initializeOnboarding();
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeOnboarding = () => {
    const stage1Messages = [
      {
        speaker: 'AI Assistant',
        message: "Welcome! Let's get you set up.",
        type: 'info'
      },
      {
        speaker: 'AI Assistant',
        message: "First, configure your system preferences using the brain icon in the header.",
        type: 'info'
      }
    ];

    setCoachKState(prev => ({
      ...prev,
      isOpen: true,
      currentStage: 'stage1',
      messages: stage1Messages
    }));
  };

  const handleMinimize = () => {
    setCoachKState(prev => ({ ...prev, isMinimized: true, isOpen: false }));
  };

  const handleToggle = () => {
    setCoachKState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
      isMinimized: false
    }));
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      speaker: 'Coach',
      message: inputText,
      type: 'user'
    };

    const responseMessage = {
      speaker: 'Coach K',
      message: 'I understand. Let me help you with that.',
      type: 'info'
    };

    setCoachKState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage, responseMessage]
    }));

    setInputText('');
  };

  const handleOpenCoachingIQ = () => {
    console.log('[LOGIC HOOK: handleOpenCoachingIQ] Opening Coaching IQ Drawer');
    // Trigger opening the Coaching IQ drawer
    const event = new CustomEvent('openCoachingIQDrawer');
    window.dispatchEvent(event);
  };

  const handleQuickAction = (action) => {
    console.log(`[LOGIC HOOK: handleQuickAction] Action: ${action}`);
    // Navigation actions would go here
    if (action === 'Go to Player IQ') {
      window.location.href = '/player-iq';
    }
  };

  // Minimized bubble state
  if (coachKState.isMinimized && !coachKState.isOpen) {
    return (
      <div className="coach-k-bubble" onClick={handleToggle} title="AI Assistant">
        <Icon name="bot" size={24} color="#000000" />
      </div>
    );
  }

  // Expanded panel state
  if (!coachKState.isOpen) {
    return null;
  }

  return (
    <div className="coach-k-assistant">
      <div className="coach-k-header">
        <div className="header-title">
          <Icon name="bot" size={20} />
          <span className="name">AI Assistant</span>
        </div>
        <div className="header-actions">
          <button className="minimize-btn" onClick={handleMinimize}>−</button>
          <button className="close-btn" onClick={() => setCoachKState(prev => ({ ...prev, isOpen: false }))}>&times;</button>
        </div>
      </div>

      <div className="coach-k-chat">
        {coachKState.messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.type}`}>
            <div className="message-speaker">{msg.speaker}</div>
            <div className="message-content">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {!coachingBias && (
        <div className="coach-k-actions">
          <button className="action-btn" onClick={handleOpenCoachingIQ}>
            <Icon name="brain" size={16} />
            <span>Configure Settings</span>
          </button>
        </div>
      )}

      <div className="coach-k-input">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask Coach K anything..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default CoachKAssistant;

