'use client';

import { useState } from 'react';

export default function RankingsView({ people, rankings, onSimulateAll, onSelectDate, isSimulating }) {
  const [selectedPersonId, setSelectedPersonId] = useState(people[0]?.id || '');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [suitorRegionFilter, setSuitorRegionFilter] = useState('ALL');

  const selectedPerson = people.find(p => p.id === selectedPersonId) || people[0];
  const personRankings = rankings?.[selectedPersonId];
  const hasRankings = rankings && Object.keys(rankings).length > 0;

  // Filter matches by tier and region
  const matches = personRankings?.matches || [];
  const filteredMatches = matches.filter(m => {
    if (tierFilter !== 'ALL' && m.tier !== tierFilter) return false;
    if (suitorRegionFilter !== 'ALL') {
      const partner = people.find(p => p.id === m.partnerId);
      if (partner?.region !== suitorRegionFilter) return false;
    }
    return true;
  });

  // Compute top global pairings across all people
  const topGlobalPairs = [];
  if (hasRankings) {
    const seen = new Set();
    Object.values(rankings).forEach(personRank => {
      personRank.matches?.forEach(m => {
        const pairKey = [personRank.personId, m.partnerId].sort().join('--');
        if (!seen.has(pairKey)) {
          seen.add(pairKey);
          topGlobalPairs.push({
            p1Id: personRank.personId,
            p1Name: personRank.personName,
            p2Id: m.partnerId,
            p2Name: m.partnerName,
            score: m.overallScore,
            tier: m.tier,
            sharedInterests: m.sharedInterests || []
          });
        }
      });
    });
    topGlobalPairs.sort((a, b) => b.score - a.score);
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(217, 70, 239, 0.1)', color: 'var(--primary-300)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <span>🏆</span> Compatibility Intelligence & Suitor Leaderboards
          </div>
          <h2 className="page-title">Agent Fit & Compatibility Rankings</h2>
          <p className="page-subtitle">
            Every agent ranks their suitors from best fit to worst, backed by multi-factor analysis:
            interests overlap, lifestyle hobbies, emotional needs, core values, and dating chemistry.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={onSimulateAll}
          disabled={isSimulating}
        >
          {isSimulating ? '⏳ Simulating Dates...' : '⚡ Re-compute All Rankings'}
        </button>
      </div>

      {!hasRankings ? (
        <div className="empty-state card" style={{ padding: '3.5rem 2rem' }}>
          <div className="icon">🏆</div>
          <h3>No Dating Rankings Generated Yet</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Run the autonomous date engine to evaluate all {people.length} agents against one another and generate the compatibility leaderboard.
          </p>
          <button
            className="btn btn-lg btn-primary"
            onClick={onSimulateAll}
            disabled={isSimulating}
          >
            {isSimulating ? 'Simulating All Matches...' : `🚀 Simulate All ${Math.round((people.length * (people.length - 1)) / 2)} Dates Now`}
          </button>
        </div>
      ) : (
        <div>
          {/* Top 3 Global Couples Banner */}
          {topGlobalPairs.length > 0 && (
            <div className="card-glass" style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.3rem' }}>🌟</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>
                  Network-Wide Top Soulmate Pairings
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {topGlobalPairs.slice(0, 3).map((pair, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-card)',
                      border: idx === 0 ? '1px solid var(--gold-500)' : '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: idx === 0 ? '0 0 25px rgba(251, 191, 36, 0.15)' : 'none'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span className={`rank-number ${idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : 'rank-3'}`}>
                          #{idx + 1}
                        </span>
                        <span className="profile-mbti" style={{ fontSize: '0.75rem' }}>
                          {pair.score}% Compatibility
                        </span>
                      </div>

                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {pair.p1Name} 💘 {pair.p2Name}
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                        Tier: {pair.tier.toUpperCase()}
                      </div>

                      {pair.sharedInterests?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {pair.sharedInterests.slice(0, 2).map((si, sIdx) => (
                            <span key={sIdx} className="tag tag-interest" style={{ fontSize: '0.7rem' }}>
                              {si}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => onSelectDate(pair.p1Id, pair.p2Id)}
                      style={{ marginTop: '1rem', width: '100%' }}
                    >
                      Inspect Their Date ↗
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Select Person to view their individual suitor rankings */}
          <div className="card-glass" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 300px' }}>
                <div className="profile-avatar" style={{ width: '44px', height: '44px' }}>
                  {selectedPerson?.name ? selectedPerson.name.split(' ').map(n => n[0]).slice(0, 2).join('') : '??'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <label className="form-label">Inspect Rankings For:</label>
                  <select
                    className="form-input"
                    value={selectedPersonId}
                    onChange={(e) => setSelectedPersonId(e.target.value)}
                    style={{ width: '100%', marginTop: '4px' }}
                  >
                    {people.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.region === 'India' ? '🇮🇳 ' : '🌍 '}{p.name} ({p.analysis?.personalityType}) — {rankings?.[p.id]?.matches?.length || 0} suitors ranked
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Suitor Region & Tier Filters */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Suitors:</span>
                  <button
                    className={`btn btn-sm ${suitorRegionFilter === 'ALL' ? 'btn-secondary' : 'btn-ghost'}`}
                    onClick={() => setSuitorRegionFilter('ALL')}
                  >
                    All
                  </button>
                  <button
                    className={`btn btn-sm ${suitorRegionFilter === 'India' ? 'btn-secondary' : 'btn-ghost'}`}
                    onClick={() => setSuitorRegionFilter('India')}
                  >
                    🇮🇳 India
                  </button>
                  <button
                    className={`btn btn-sm ${suitorRegionFilter === 'Global' ? 'btn-secondary' : 'btn-ghost'}`}
                    onClick={() => setSuitorRegionFilter('Global')}
                  >
                    🌍 Global
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Tier:</span>
                  {['ALL', 'soulmate', 'great', 'good'].map(t => (
                    <button
                      key={t}
                      className={`btn btn-sm ${tierFilter === t ? 'btn-secondary' : 'btn-ghost'}`}
                      onClick={() => setTierFilter(t)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selectedPerson && personRankings && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <div>
                  <strong>Archetype:</strong> {selectedPerson.analysis?.personalityType}
                </div>
                <div>
                  <strong>Average Suitor Fit:</strong> {personRankings.averageCompatibility}%
                </div>
                <div>
                  <strong>Top Match:</strong> <span style={{ color: 'var(--primary-300)', fontWeight: 600 }}>{personRankings.topMatch?.partnerName}</span> ({personRankings.topMatch?.overallScore}%)
                </div>
              </div>
            )}
          </div>

          {/* Individual Matches Leaderboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredMatches.length === 0 ? (
              <div className="empty-state">
                <p>No matches in this tier.</p>
              </div>
            ) : (
              filteredMatches.map((m) => {
                const partnerInitials = m.partnerName
                  ? m.partnerName.split(' ').map(n => n[0]).slice(0, 2).join('')
                  : '??';

                return (
                  <div
                    key={m.partnerId}
                    className="card"
                    style={{
                      background: 'var(--bg-card)',
                      border: m.rank === 1 ? '1px solid var(--primary-500)' : '1px solid var(--border-default)',
                      boxShadow: m.rank === 1 ? 'var(--shadow-glow)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span className={`rank-number ${m.rank === 1 ? 'rank-1' : m.rank === 2 ? 'rank-2' : m.rank === 3 ? 'rank-3' : 'rank-default'}`}>
                          #{m.rank}
                        </span>

                        <div className="profile-avatar" style={{ width: '42px', height: '42px', fontSize: '1rem' }}>
                          {partnerInitials}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {m.partnerName}
                            </h4>
                            <span className={`tag ${
                              m.tier === 'soulmate' ? 'tag-personality' :
                              m.tier === 'great' ? 'tag-interest' :
                              m.tier === 'good' ? 'tag-hobby' : 'tag-value'
                            }`}>
                              {m.tier.toUpperCase()}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                            Chemistry Score: {m.chemistryScore}%
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 900, color: 'var(--primary-400)' }}>
                            {m.overallScore}%
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            Overall Fit
                          </div>
                        </div>

                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => onSelectDate(selectedPersonId, m.partnerId)}
                          title="Simulate / Re-read their autonomous date"
                        >
                          💬 View Date
                        </button>
                      </div>
                    </div>

                    {/* Breakdown Progress Bars */}
                    {m.breakdown && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Interests</span>
                            <span>{Math.round(m.breakdown.interests)}%</span>
                          </div>
                          <div className="compat-bar-track" style={{ height: '4px', marginTop: '3px' }}>
                            <div className="compat-bar-fill" style={{ width: `${Math.round(m.breakdown.interests)}%` }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Hobbies</span>
                            <span>{Math.round(m.breakdown.hobbies)}%</span>
                          </div>
                          <div className="compat-bar-track" style={{ height: '4px', marginTop: '3px' }}>
                            <div className="compat-bar-fill" style={{ width: `${Math.round(m.breakdown.hobbies)}%` }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Values</span>
                            <span>{Math.round(m.breakdown.values)}%</span>
                          </div>
                          <div className="compat-bar-track" style={{ height: '4px', marginTop: '3px' }}>
                            <div className="compat-bar-fill" style={{ width: `${Math.round(m.breakdown.values)}%` }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Personality</span>
                            <span>{Math.round(m.breakdown.personality)}%</span>
                          </div>
                          <div className="compat-bar-track" style={{ height: '4px', marginTop: '3px' }}>
                            <div className="compat-bar-fill" style={{ width: `${Math.round(m.breakdown.personality)}%` }} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reasons why & Highlights */}
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {m.sharedInterests?.slice(0, 2).map((item, idx) => (
                        <span key={`si-${idx}`} className="tag tag-interest" style={{ fontSize: '0.75rem' }}>
                          Shared Interest: {item}
                        </span>
                      ))}
                      {m.sharedHobbies?.slice(0, 2).map((item, idx) => (
                        <span key={`sh-${idx}`} className="tag tag-hobby" style={{ fontSize: '0.75rem' }}>
                          Shared Hobby: {item}
                        </span>
                      ))}
                      {m.sharedValues?.slice(0, 2).map((item, idx) => (
                        <span key={`sv-${idx}`} className="tag tag-value" style={{ fontSize: '0.75rem' }}>
                          Shared Value: {item}
                        </span>
                      ))}
                    </div>

                    {/* Agent Rationale text if present */}
                    {m.highlights && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px', fontStyle: 'italic' }}>
                        💡 Match Rationale: {m.highlights}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
