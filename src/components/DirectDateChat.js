'use client';

import { useState, useEffect, useRef } from 'react';

export default function DirectDateChat({ people = [], initialPersonId, onBackToExplore }) {
  const [activePersonId, setActivePersonId] = useState(initialPersonId || people[0]?.id || '');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chemistryScore, setChemistryScore] = useState(50);
  const [expandedReasoningId, setExpandedReasoningId] = useState(null);
  const messagesEndRef = useRef(null);

  const activePerson = people.find(p => p.id === activePersonId) || people[0];

  // Initialize or reset conversation when active agent changes
  useEffect(() => {
    if (!activePerson) return;

    const analysis = activePerson.analysis || {};
    const greeting = `Hi there! I'm ${activePerson.name}. It's wonderful to meet you. I'm usually juggling a lot, but I love taking time for meaningful conversations. What caught your interest about me today?`;

    setMessages([
      {
        id: `msg-${Date.now()}-init`,
        role: 'assistant',
        content: greeting,
        mood: 'curious',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRealLLM: false
      }
    ]);
    setChemistryScore(50);
  }, [activePersonId, activePerson]);

  // Autoscroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping || !activePerson) return;

    const userMsg = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personId: activePerson.id,
          messages: updatedHistory.map(m => ({ role: m.role, content: m.content })),
          userMessage: text
        })
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const agentMsg = {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content: data.reply.content,
          mood: data.reply.mood || 'engaged',
          reasoning: data.reply.reasoning || null,
          isRealLLM: data.reply.isRealLLM,
          modelUsed: data.reply.modelUsed,
          keyIndexUsed: data.reply.keyIndexUsed,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, agentMsg]);
        setChemistryScore(prev => Math.min(98, prev + Math.floor(Math.random() * 6) + 4));
      } else {
        throw new Error(data.error || 'No reply received');
      }
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback response if offline
      const fallbackReply = {
        id: `msg-${Date.now()}-fallback`,
        role: 'assistant',
        content: `I really value that insight. In my experience with ${activePerson.analysis?.interests?.[0] || 'growth'}, finding someone who shares that depth is rare. What's next on your journey?`,
        mood: 'thoughtful',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'curious': return '🤔';
      case 'engaged': return '✨';
      case 'excited': return '🤩';
      case 'playful': return '😏';
      case 'thoughtful': return '💡';
      case 'smitten': return '🥰';
      case 'deep': return '🌊';
      default: return '💬';
    }
  };

  const icebreakers = [
    "What's the biggest risk you've taken that changed your life?",
    `How do you balance high ambition with emotional connection?`,
    `What's one thing you're deeply passionate about outside of work?`,
    `What does an ideal Sunday look like for you?`
  ];

  return (
    <div style={{ marginTop: '2rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(217, 70, 239, 0.15)', color: 'var(--primary-300)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
            <span>💬</span> 1-on-1 Direct Dating Mode (Interactive AI Persona)
          </div>
          <h2 className="page-title">Date an Agent Directly</h2>
          <p className="page-subtitle">
            Chat 1-on-1 with any real persona powered by NVIDIA Nemotron 120B Super-VL. The agent embodies their authentic worldview, communication style, and emotional needs.
          </p>
        </div>

        {onBackToExplore && (
          <button className="btn btn-sm btn-ghost" onClick={onBackToExplore}>
            ← Back to Directory
          </button>
        )}
      </div>

      {/* Main Chat Container */}
      <div className="card-glass" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '720px', maxCrop: '100%' }}>
        
        {/* Agent Header Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-default)',
          background: 'rgba(17, 17, 24, 0.95)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="profile-avatar" style={{ width: '48px', height: '48px', fontSize: '1.2rem', background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>
              {activePerson?.name ? activePerson.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'A'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  {activePerson?.name}
                </h3>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: activePerson?.region === 'India' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                  color: activePerson?.region === 'India' ? 'var(--gold-400)' : 'var(--sky-400)',
                  border: activePerson?.region === 'India' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)',
                  fontWeight: 600
                }}>
                  {activePerson?.region === 'India' ? '🇮🇳 India' : '🌍 Global'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--emerald-400)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald-400)', display: 'inline-block' }} />
                  Online
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                {activePerson?.scraped?.linkedin?.headline?.slice(0, 70)}...
              </p>
            </div>
          </div>

          {/* Suitor Selector & Chemistry Meter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Chemistry Bar */}
            <div style={{ textAlign: 'right', minWidth: '140px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Date Chemistry</span>
                <strong style={{ color: 'var(--primary-300)' }}>{chemistryScore}%</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{
                  width: `${chemistryScore}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary-500), var(--accent-500))',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.4s ease-out'
                }} />
              </div>
            </div>

            {/* Switch Person Dropdown */}
            <select
              className="form-input"
              value={activePersonId}
              onChange={(e) => setActivePersonId(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            >
              {people.map(p => (
                <option key={p.id} value={p.id}>
                  {p.region === 'India' ? '🇮🇳 ' : '🌍 '}{p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: 'rgba(10, 10, 15, 0.4)'
        }}>
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  gap: '10px',
                  alignItems: 'flex-start'
                }}
              >
                {!isUser && (
                  <div className="chat-avatar" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                    {activePerson?.name ? activePerson.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'A'}
                  </div>
                )}

                <div style={{ maxWidth: '75%' }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    background: isUser
                      ? 'linear-gradient(135deg, var(--primary-600), var(--accent-600))'
                      : 'var(--bg-secondary)',
                    border: isUser ? 'none' : '1px solid var(--border-default)',
                    color: '#fff',
                    fontSize: '0.92rem',
                    lineHeight: 1.5,
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {!isUser && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-300)' }}>
                          {activePerson.name} {getMoodEmoji(msg.mood)}
                        </span>
                        {msg.isRealLLM && (
                          <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                            Nemotron 120B
                          </span>
                        )}
                      </div>
                    )}
                    <div>{msg.content}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: isUser ? 'flex-end' : 'flex-start', gap: '8px', marginTop: '4px', padding: '0 4px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{msg.timestamp}</span>
                    {!isUser && msg.reasoning && (
                      <button
                        type="button"
                        onClick={() => setExpandedReasoningId(expandedReasoningId === msg.id ? null : msg.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-400)', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {expandedReasoningId === msg.id ? 'Hide Thinking' : '🧠 View Monologue'}
                      </button>
                    )}
                  </div>

                  {expandedReasoningId === msg.id && msg.reasoning && (
                    <div style={{
                      marginTop: '6px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0, 0, 0, 0.6)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      color: 'var(--emerald-400)',
                      whiteSpace: 'pre-wrap'
                    }}>
                      <strong>// Nemotron 120B Inner Monologue:</strong><br />
                      {msg.reasoning}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div className="chat-avatar" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                {activePerson?.name ? activePerson.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'A'}
              </div>
              <div style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="date-active-dot" />
                <span>{activePerson?.name} is thinking with Nemotron 120B...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Icebreaker Suggestions */}
        <div style={{
          padding: '8px 1.5rem',
          background: 'rgba(17, 17, 24, 0.8)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', alignSelf: 'center' }}>Ideas:</span>
          {icebreakers.map((topic, i) => (
            <button
              key={i}
              className="btn btn-sm btn-ghost"
              onClick={() => handleSendMessage(topic)}
              disabled={isTyping}
              style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.03)' }}
            >
              💬 {topic}
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-default)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            className="form-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Type a date message to ${activePerson?.name}...`}
            disabled={isTyping}
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!inputText.trim() || isTyping}
            style={{ padding: '10px 20px' }}
          >
            {isTyping ? 'Thinking...' : '💘 Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
