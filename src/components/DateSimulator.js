'use client';

import { useState, useEffect, useRef } from 'react';

export default function DateSimulator({ people, preselectedPerson1, preselectedPerson2, onDateComplete }) {
  const [person1Id, setPerson1Id] = useState(preselectedPerson1?.id || people[0]?.id || '');
  const [person2Id, setPerson2Id] = useState(preselectedPerson2?.id || people[1]?.id || '');
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentDateResult, setCurrentDateResult] = useState(null);
  const [visibleMessagesCount, setVisibleMessagesCount] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState('animated'); // 'animated' or 'instant'
  const [llmStatus, setLlmStatus] = useState(null);
  const [useNemotron, setUseNemotron] = useState(true);
  const [showReasoning, setShowReasoning] = useState(false);
  const chatBottomRef = useRef(null);

  // Fetch LLM configuration status
  useEffect(() => {
    fetch('/api/date')
      .then(res => res.json())
      .then(data => {
        if (data.llmStatus) setLlmStatus(data.llmStatus);
      })
      .catch(err => console.error(err));
  }, []);

  // Sync preselected people if prop changes
  useEffect(() => {
    if (preselectedPerson1) setPerson1Id(preselectedPerson1.id);
    if (preselectedPerson2) setPerson2Id(preselectedPerson2.id);
  }, [preselectedPerson1, preselectedPerson2]);

  // Handle animation ticker
  useEffect(() => {
    if (!currentDateResult || animationSpeed === 'instant') {
      if (currentDateResult) {
        setVisibleMessagesCount(currentDateResult.conversation.length);
      }
      return;
    }

    if (visibleMessagesCount < currentDateResult.conversation.length) {
      const timer = setTimeout(() => {
        setVisibleMessagesCount(prev => prev + 1);
        if (chatBottomRef.current) {
          chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentDateResult, visibleMessagesCount, animationSpeed]);

  const p1 = people.find(p => p.id === person1Id);
  const p2 = people.find(p => p.id === person2Id);

  const handleRandomize = () => {
    if (people.length < 2) return;
    const idx1 = Math.floor(Math.random() * people.length);
    let idx2 = Math.floor(Math.random() * (people.length - 1));
    if (idx2 >= idx1) idx2++;
    setPerson1Id(people[idx1].id);
    setPerson2Id(people[idx2].id);
    setCurrentDateResult(null);
  };

  const handleRunDate = async () => {
    if (!person1Id || !person2Id || person1Id === person2Id) return;

    setIsSimulating(true);
    setCurrentDateResult(null);
    setVisibleMessagesCount(0);
    setShowReasoning(false);

    try {
      const res = await fetch('/api/date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'single',
          person1Id,
          person2Id,
          forceDeterministic: !useNemotron
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.result) {
        setCurrentDateResult(data.result);
        if (data.llmStatus) setLlmStatus(data.llmStatus);
        if (animationSpeed === 'instant') {
          setVisibleMessagesCount(data.result.conversation.length);
        } else {
          setVisibleMessagesCount(1);
        }
        if (onDateComplete) {
          onDateComplete(data.result);
        }
      } else {
        throw new Error(data.error || 'Date simulation returned no result');
      }
    } catch (err) {
      console.warn('Simulation attempt failed, activating instant local fallback:', err);
      // Auto-recover immediately using deterministic engine so user is never stuck
      try {
        const fallbackRes = await fetch('/api/date', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'single',
            person1Id,
            person2Id,
            forceDeterministic: true
          })
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackData.success && fallbackData.result) {
          setCurrentDateResult(fallbackData.result);
          setVisibleMessagesCount(fallbackData.result.conversation.length);
        }
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
      }
    } finally {
      setIsSimulating(false);
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'curious': return '🤔';
      case 'engaged': return '✨';
      case 'excited': return '🤩';
      case 'enthusiastic': return '🎉';
      case 'passionate': return '🔥';
      case 'deep': return '🌊';
      case 'vulnerable': return '🥺';
      case 'thoughtful': return '💡';
      case 'smitten': return '🥰';
      case 'pleased': return '😊';
      default: return '💬';
    }
  };

  const isComplete = currentDateResult && visibleMessagesCount >= currentDateResult.conversation.length;

  return (
    <div style={{ marginTop: '2rem' }}>
      <div className="page-header">
        <h2 className="page-title">Autonomous Date Simulator</h2>
        <p className="page-subtitle">
          Select any two agents and watch them interact in an autonomous multi-phase date. 
          The agents explore conversation starters, shared interests, mutual emotional needs, and chemistry.
        </p>
      </div>

      {/* Date Selector Box */}
      <div className="card-glass" style={{ marginBottom: '2rem' }}>
        {/* NVIDIA Nemotron 120B Status & Settings Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 16px',
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: '#76b900',
              color: '#000',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              NV
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  NVIDIA Nemotron 120B Super-VL
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: llmStatus?.configured ? 'rgba(52, 211, 153, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: llmStatus?.configured ? 'var(--emerald-400)' : 'var(--gold-400)',
                  border: llmStatus?.configured ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                  fontWeight: 600
                }}>
                  {llmStatus?.configured
                    ? `🟢 ${llmStatus.activeKeysCount} Keys Swappable (40 RPM)`
                    : '🟡 Demo Fallback Mode'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                Model: <code>{llmStatus?.model || 'nvidia/nemotron-3.5-super-vl-120b-a12b'}</code> • Thinking Monologue Enabled
              </div>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={useNemotron}
              onChange={(e) => setUseNemotron(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: 'var(--emerald-500)', width: '16px', height: '16px' }}
            />
            <span>Enable Nemotron 120B LLM</span>
          </label>
        </div>

        <div className="date-selector">
          {/* Person 1 Selector */}
          <div className="card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <div className="profile-avatar" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                {p1?.name ? p1.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'P1'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <label className="form-label">Agent 1</label>
                <select
                  className="form-input"
                  value={person1Id}
                  onChange={(e) => {
                    setPerson1Id(e.target.value);
                    setCurrentDateResult(null);
                  }}
                  style={{ width: '100%', marginTop: '4px' }}
                >
                  {people.map(p => (
                    <option key={p.id} value={p.id} disabled={p.id === person2Id}>
                      {p.region === 'India' ? '🇮🇳 ' : '🌍 '}{p.name} ({p.analysis?.personalityType || 'Agent'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {p1 && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: p1.region === 'India' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    color: p1.region === 'India' ? 'var(--gold-400)' : 'var(--sky-400)',
                    border: p1.region === 'India' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)',
                    fontWeight: 600
                  }}>
                    {p1.region === 'India' ? '🇮🇳 India' : '🌍 Global'}
                  </span>
                  <span>📍 {p1.location || p1.scraped?.linkedin?.location}</span>
                </div>
                <p style={{ marginBottom: '6px' }}><strong>Archetype:</strong> {p1.analysis?.personalityType} • {p1.analysis?.communicationStyle}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {p1.analysis?.interests?.slice(0, 3).map((i, idx) => (
                    <span key={idx} className="tag tag-interest">{i}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* VS Badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div className="vs-badge">VS</div>
            <button
              className="btn btn-sm btn-ghost"
              onClick={handleRandomize}
              title="Pick a random couple"
              style={{ fontSize: '0.8rem' }}
            >
              🎲 Randomize
            </button>
          </div>

          {/* Person 2 Selector */}
          <div className="card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <div className="profile-avatar" style={{ width: '48px', height: '48px', fontSize: '1.2rem', background: 'linear-gradient(135deg, var(--accent-500), var(--gold-500))' }}>
                {p2?.name ? p2.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'P2'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <label className="form-label">Agent 2</label>
                <select
                  className="form-input"
                  value={person2Id}
                  onChange={(e) => {
                    setPerson2Id(e.target.value);
                    setCurrentDateResult(null);
                  }}
                  style={{ width: '100%', marginTop: '4px' }}
                >
                  {people.map(p => (
                    <option key={p.id} value={p.id} disabled={p.id === person1Id}>
                      {p.region === 'India' ? '🇮🇳 ' : '🌍 '}{p.name} ({p.analysis?.personalityType || 'Agent'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {p2 && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: p2.region === 'India' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    color: p2.region === 'India' ? 'var(--gold-400)' : 'var(--sky-400)',
                    border: p2.region === 'India' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)',
                    fontWeight: 600
                  }}>
                    {p2.region === 'India' ? '🇮🇳 India' : '🌍 Global'}
                  </span>
                  <span>📍 {p2.location || p2.scraped?.linkedin?.location}</span>
                </div>
                <p style={{ marginBottom: '6px' }}><strong>Archetype:</strong> {p2.analysis?.personalityType} • {p2.analysis?.communicationStyle}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {p2.analysis?.interests?.slice(0, 3).map((i, idx) => (
                    <span key={idx} className="tag tag-hobby">{i}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Playback Mode:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className={`btn btn-sm ${animationSpeed === 'animated' ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setAnimationSpeed('animated')}
              >
                🎬 Animated Turn-by-Turn
              </button>
              <button
                className={`btn btn-sm ${animationSpeed === 'instant' ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => {
                  setAnimationSpeed('instant');
                  if (currentDateResult) setVisibleMessagesCount(currentDateResult.conversation.length);
                }}
              >
                ⚡ Instant Transcript
              </button>
            </div>
          </div>

          <button
            className="btn btn-lg btn-primary"
            onClick={handleRunDate}
            disabled={isSimulating || person1Id === person2Id}
          >
            {isSimulating ? (
              <>
                <span className="date-active-dot" />
                <span>Simulating Autonomous Date...</span>
              </>
            ) : (
              <span>💘 Launch Autonomous Date</span>
            )}
          </button>
        </div>
      </div>

      {/* Date Transcript & Scoreboard */}
      {currentDateResult && (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
          {/* Header Banner */}
          <div className="card-glass" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="date-active-indicator">
                <span className="date-active-dot" />
                {isComplete ? 'Date Concluded' : 'Date in Progress...'}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {currentDateResult.person1.name} & {currentDateResult.person2.name}
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
              Step {Math.min(visibleMessagesCount, currentDateResult.conversation.length)} of {currentDateResult.conversation.length}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="dating-conversation" style={{ minHeight: '300px' }}>
            {currentDateResult.conversation.slice(0, visibleMessagesCount).map((msg, idx) => {
              const isP2 = msg.speaker === currentDateResult.person2.name;
              const speakerInitials = msg.speaker.split(' ').map(n => n[0]).slice(0, 2).join('');
              const prevMsg = idx > 0 ? currentDateResult.conversation[idx - 1] : null;
              const showPhaseHeader = !prevMsg || prevMsg.phase !== msg.phase;

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {showPhaseHeader && (
                    <div className="dating-phase-header">
                      <span>Phase {msg.phase}</span>
                    </div>
                  )}

                  <div className={`chat-message ${isP2 ? 'right' : ''}`}>
                    <div className={`chat-avatar ${isP2 ? 'person2' : ''}`}>
                      {speakerInitials}
                    </div>

                    <div className="chat-bubble">
                      <div className="speaker-name">
                        {msg.speaker} {getMoodEmoji(msg.mood)}
                      </div>
                      <div className="message-text">
                        {msg.message}
                      </div>
                      <div className="mood-indicator">
                        Agent vibe: {msg.mood}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Final Chemistry Card */}
          {isComplete && (
            <div className="chemistry-display" style={{ animation: 'slideUp 0.5s ease-out' }}>
              <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 'var(--radius-full)', background: 'rgba(217, 70, 239, 0.1)', color: 'var(--primary-300)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
                🎉 Autonomous Dating Evaluation
              </div>

              <div className="chemistry-score">
                {currentDateResult.chemistryScore}%
              </div>
              <div className="chemistry-label">
                {currentDateResult.chemistryScore >= 75
                  ? '🔥 High Chemistry & Mutual Alignment!'
                  : currentDateResult.chemistryScore >= 55
                  ? '✨ Strong Potential & Great Conversation'
                  : '🤝 Friendly Interaction with Divergent Values'}
              </div>

              {/* Shared Overlaps */}
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {currentDateResult.sharedInterests?.length > 0 && (
                  <div style={{ fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Shared Interests: </span>
                    <strong style={{ color: 'var(--primary-300)' }}>
                      {currentDateResult.sharedInterests.join(', ')}
                    </strong>
                  </div>
                )}
                {currentDateResult.sharedHobbies?.length > 0 && (
                  <div style={{ fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Shared Hobbies: </span>
                    <strong style={{ color: 'var(--emerald-400)' }}>
                      {currentDateResult.sharedHobbies.join(', ')}
                    </strong>
                  </div>
                )}
                {currentDateResult.sharedValues?.length > 0 && (
                  <div style={{ fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Shared Values: </span>
                    <strong style={{ color: 'var(--gold-400)' }}>
                      {currentDateResult.sharedValues.join(', ')}
                    </strong>
                  </div>
                )}
              </div>

              {/* Compatibility Breakdown Bars */}
              <div className="compatibility-bars">
                <div className="compat-bar">
                  <div className="compat-bar-label">
                    <span>Interests Alignment</span>
                    <span>{Math.round(currentDateResult.compatibility.interests || 50)}%</span>
                  </div>
                  <div className="compat-bar-track">
                    <div className="compat-bar-fill" style={{ width: `${Math.round(currentDateResult.compatibility.interests || 50)}%` }} />
                  </div>
                </div>

                <div className="compat-bar">
                  <div className="compat-bar-label">
                    <span>Hobbies Overlap</span>
                    <span>{Math.round(currentDateResult.compatibility.hobbies || 50)}%</span>
                  </div>
                  <div className="compat-bar-track">
                    <div className="compat-bar-fill" style={{ width: `${Math.round(currentDateResult.compatibility.hobbies || 50)}%` }} />
                  </div>
                </div>

                <div className="compat-bar">
                  <div className="compat-bar-label">
                    <span>Values Synergy</span>
                    <span>{Math.round(currentDateResult.compatibility.values || 50)}%</span>
                  </div>
                  <div className="compat-bar-track">
                    <div className="compat-bar-fill" style={{ width: `${Math.round(currentDateResult.compatibility.values || 50)}%` }} />
                  </div>
                </div>

                <div className="compat-bar">
                  <div className="compat-bar-label">
                    <span>Personality Fit</span>
                    <span>{Math.round(currentDateResult.compatibility.personality || 50)}%</span>
                  </div>
                  <div className="compat-bar-track">
                    <div className="compat-bar-fill" style={{ width: `${Math.round(currentDateResult.compatibility.personality || 50)}%` }} />
                  </div>
                </div>
              </div>

              {/* LLM Engine & Reasoning Details */}
              <div style={{
                marginTop: '2rem',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: currentDateResult.llmMetadata?.isRealLLM ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: currentDateResult.llmMetadata?.isRealLLM ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-subtle)',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{currentDateResult.llmMetadata?.isRealLLM ? '🟢' : '⚙️'}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {currentDateResult.llmMetadata?.isRealLLM
                        ? `Generated by NVIDIA Nemotron 120B (Key #${(currentDateResult.llmMetadata.keyIndex ?? 0) + 1} of ${currentDateResult.llmMetadata.totalKeys || 4})`
                        : (currentDateResult.llmMetadata?.poweredBy || 'Deterministic Engine')}
                    </span>
                  </div>
                  {currentDateResult.llmMetadata?.reasoning && (
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowReasoning(!showReasoning)}
                      style={{ fontSize: '0.8rem' }}
                    >
                      {showReasoning ? '🙈 Hide Thinking Monologue' : '🧠 View Nemotron 120B Monologue'}
                    </button>
                  )}
                </div>

                {showReasoning && currentDateResult.llmMetadata?.reasoning && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace'
                  }}>
                    <div style={{ color: 'var(--emerald-400)', fontWeight: 600, marginBottom: '6px' }}>
                      // NVIDIA Nemotron 120B Chain-of-Thought Reasoning:
                    </div>
                    {currentDateResult.llmMetadata.reasoning}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
