'use client';

import { useState, useEffect, useRef } from 'react';
import { createAgent } from '@/lib/agent-engine';

export default function ProfileModal({ person, onClose, onDatePerson, onDirectDate, rankings }) {
  const [activeTab, setActiveTab] = useState('agent');
  const dialogRef = useRef(null);

  // Sync dialog modal with React lifecycle
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) {
      dialog.showModal();
    }

    const handleClose = () => {
      onClose();
    };

    dialog.addEventListener('close', handleClose);

    // Light-dismiss fallback for browsers without native closedby support
    const handleBackdropClick = (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInside = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInside) {
        dialog.close();
      }
    };

    dialog.addEventListener('click', handleBackdropClick);

    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, [onClose]);

  if (!person) return null;

  const agent = createAgent(person);
  const initials = person.name
    ? person.name.split(' ').map(n => n[0]).slice(0, 2).join('')
    : '??';

  const personRankings = rankings?.[person.id];

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="profile-modal-title"
      style={{
        margin: 'auto',
        maxWidth: '900px',
        width: '92%',
        maxHeight: '90vh',
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        padding: '0',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      {/* Modal Header */}
      <div style={{
        padding: '1.5rem 2rem',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="profile-avatar" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
            {initials}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 id="profile-modal-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>
                {person.name}
              </h2>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: person.region === 'India' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                  color: person.region === 'India' ? 'var(--gold-400)' : 'var(--sky-400)',
                  border: person.region === 'India' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)',
                  fontWeight: 600
                }}
              >
                {person.region === 'India' ? '🇮🇳 India' : '🌍 Global'}
              </span>
              <span className="profile-mbti">{person.analysis?.personalityType || 'ENFP'}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {person.scraped?.linkedin?.headline || 'Autonomous Dating Agent'}
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              📍 {person.location || person.scraped?.linkedin?.location || 'Global'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {onDirectDate && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                if (dialogRef.current) dialogRef.current.close();
                onDirectDate(person);
              }}
            >
              💬 Date 1-on-1 Directly
            </button>
          )}
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              if (dialogRef.current) dialogRef.current.close();
              onDatePerson(person);
            }}
          >
            💘 Auto Simulate
          </button>
          <button
            className="modal-close"
            onClick={() => dialogRef.current && dialogRef.current.close()}
            aria-label="Close Profile Modal"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 2rem',
        gap: '4px',
        overflowX: 'auto'
      }}>
        <button
          className={`nav-link ${activeTab === 'agent' ? 'active' : ''}`}
          onClick={() => setActiveTab('agent')}
          style={{ padding: '12px 16px', borderRadius: '0', borderBottom: activeTab === 'agent' ? '2px solid var(--primary-500)' : 'none' }}
        >
          🤖 Agent Persona & Psychology
        </button>
        <button
          className={`nav-link ${activeTab === 'linkedin' ? 'active' : ''}`}
          onClick={() => setActiveTab('linkedin')}
          style={{ padding: '12px 16px', borderRadius: '0', borderBottom: activeTab === 'linkedin' ? '2px solid var(--primary-500)' : 'none' }}
        >
          💼 LinkedIn Footprint
        </button>
        <button
          className={`nav-link ${activeTab === 'instagram' ? 'active' : ''}`}
          onClick={() => setActiveTab('instagram')}
          style={{ padding: '12px 16px', borderRadius: '0', borderBottom: activeTab === 'instagram' ? '2px solid var(--primary-500)' : 'none' }}
        >
          📸 Instagram Footprint
        </button>
        <button
          className={`nav-link ${activeTab === 'prompt' ? 'active' : ''}`}
          onClick={() => setActiveTab('prompt')}
          style={{ padding: '12px 16px', borderRadius: '0', borderBottom: activeTab === 'prompt' ? '2px solid var(--primary-500)' : 'none' }}
        >
          🧠 System Prompt
        </button>
        {personRankings && (
          <button
            className={`nav-link ${activeTab === 'rankings' ? 'active' : ''}`}
            onClick={() => setActiveTab('rankings')}
            style={{ padding: '12px 16px', borderRadius: '0', borderBottom: activeTab === 'rankings' ? '2px solid var(--primary-500)' : 'none' }}
          >
            🏆 Suitor Rankings ({personRankings.matches?.length || 0})
          </button>
        )}
      </div>

      {/* Modal Content Body */}
      <div style={{ padding: '2rem', maxHeight: 'calc(90vh - 170px)', overflowY: 'auto' }}>
        
        {/* Tab 1: Agent Persona */}
        {activeTab === 'agent' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Overview Banner */}
            <div className="card-glass" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Communication Style
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-300)', marginTop: '4px' }}>
                  {person.analysis?.communicationStyle || 'Authentic & Direct'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Personality Archetype
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-400)', marginTop: '4px' }}>
                  {person.analysis?.personalityType} • {person.analysis?.gender || 'Non-specified'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Verified Links
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="tag tag-interest">
                    LinkedIn ↗
                  </a>
                  <a href={person.instagram} target="_blank" rel="noopener noreferrer" className="tag tag-personality">
                    Instagram ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Emotional Needs */}
            <div className="analysis-section">
              <h3><span className="section-icon">❤️</span> Core Emotional & Relational Needs</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Extracted psychological drivers that this agent requires in a prospective partner.
              </p>
              <div className="analysis-list">
                {person.analysis?.needs?.map((need, idx) => (
                  <span key={idx} className="analysis-item need">
                    ❤️ {need}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Hobbies */}
            <div className="analysis-section">
              <h3><span className="section-icon">🎯</span> Active Hobbies & Lifestyle</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Real pastimes and physical/creative pursuits extracted from social posts and stories.
              </p>
              <div className="analysis-list">
                {person.analysis?.hobbies?.map((hobby, idx) => (
                  <span key={idx} className="analysis-item hobby">
                    🎯 {hobby}
                  </span>
                ))}
              </div>
            </div>

            {/* Intellectual Interests */}
            <div className="analysis-section">
              <h3><span className="section-icon">💡</span> Intellectual & Creative Interests</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Domains of discussion, curiosity, industry passions, and creative output.
              </p>
              <div className="analysis-list">
                {person.analysis?.interests?.map((interest, idx) => (
                  <span key={idx} className="analysis-item interest">
                    💡 {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Values & Qualities */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              <div className="analysis-section">
                <h3><span className="section-icon">💎</span> Deep Values</h3>
                <div className="analysis-list">
                  {person.analysis?.values?.map((val, idx) => (
                    <span key={idx} className="analysis-item value">
                      💎 {val}
                    </span>
                  ))}
                </div>
              </div>

              <div className="analysis-section">
                <h3><span className="section-icon">✨</span> Observed Qualities</h3>
                <div className="analysis-list">
                  {person.analysis?.qualities?.map((q, idx) => (
                    <span key={idx} className="analysis-item quality">
                      ✨ {q}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: LinkedIn Profile */}
        {activeTab === 'linkedin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card-glass">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="tag tag-interest">Verified Official LinkedIn</span>
                <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">
                  Open LinkedIn Profile ↗
                </a>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{person.name}</h3>
              <p style={{ color: 'var(--primary-300)', fontWeight: 500, marginBottom: '0.5rem' }}>
                {person.scraped?.linkedin?.headline}
              </p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                📍 {person.scraped?.linkedin?.location} {person.scraped?.linkedin?.education ? `• 🎓 ${person.scraped.linkedin.education}` : ''}
              </p>
            </div>

            {person.scraped?.linkedin?.summary && (
              <div className="analysis-section">
                <h3><span className="section-icon">📝</span> About Summary</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                  {person.scraped.linkedin.summary}
                </p>
              </div>
            )}

            {person.scraped?.linkedin?.experience?.length > 0 && (
              <div className="analysis-section">
                <h3><span className="section-icon">💼</span> Experience Milestones</h3>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {person.scraped.linkedin.experience.map((exp, idx) => (
                    <li key={idx} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{exp}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {person.scraped?.linkedin?.skills?.length > 0 && (
              <div className="analysis-section">
                <h3><span className="section-icon">⚡</span> Professional Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {person.scraped.linkedin.skills.map((skill, idx) => (
                    <span key={idx} className="tag tag-interest">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Instagram Profile */}
        {activeTab === 'instagram' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card-glass">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="tag tag-personality">Verified Public Instagram</span>
                <a href={person.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">
                  Open Instagram Profile ↗
                </a>
              </div>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', margin: '1rem 0' }}>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-400)' }}>
                    {person.scraped?.instagram?.followers || 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Followers</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-300)' }}>
                    {person.scraped?.instagram?.following || 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Following</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-400)' }}>
                    {person.scraped?.instagram?.posts || 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Posts</div>
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                {person.scraped?.instagram?.bio || 'Public creator bio'}
              </p>
            </div>

            {person.scraped?.instagram?.themes?.length > 0 && (
              <div className="analysis-section">
                <h3><span className="section-icon">🎨</span> Content & Visual Themes</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {person.scraped.instagram.themes.map((theme, idx) => (
                    <span key={idx} className="tag tag-quality">
                      #{theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {person.scraped?.instagram?.recentCaptions?.length > 0 && (
              <div className="analysis-section">
                <h3><span className="section-icon">💬</span> Recent Captions & Voice</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {person.scraped.instagram.recentCaptions.map((cap, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 14px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.88rem',
                        color: 'var(--text-secondary)',
                        fontStyle: 'italic',
                        borderLeft: '3px solid var(--accent-500)'
                      }}
                    >
                      "{cap}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: System Prompt */}
        {activeTab === 'prompt' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card-glass">
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
                Autonomous Agent Dating Prompt
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                This is the actual system prompt instantiated for this agent during autonomous date simulations. 
                It controls their speech patterns, tone, boundaries, and evaluation logic.
              </p>
              <pre style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                fontSize: '0.82rem',
                lineHeight: '1.6',
                color: 'var(--text-primary)',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace'
              }}>
                {agent.systemPrompt}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 5: Suitor Rankings */}
        {activeTab === 'rankings' && personRankings && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>Match Rankings for {person.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Evaluated across all {personRankings.matches.length} dates. Average compatibility: <strong>{personRankings.averageCompatibility}%</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {personRankings.matches.map((m) => (
                <div
                  key={m.partnerId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`rank-number ${m.rank === 1 ? 'rank-1' : m.rank === 2 ? 'rank-2' : m.rank === 3 ? 'rank-3' : 'rank-default'}`}>
                      #{m.rank}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.partnerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        Tier: {m.tier.toUpperCase()} • Chemistry: {m.chemistryScore}%
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-400)' }}>
                      {m.overallScore}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
