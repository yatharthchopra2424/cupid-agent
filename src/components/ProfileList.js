'use client';

import { useState, useMemo } from 'react';

export default function ProfileList({ people, onSelectPerson, onDatePerson, rankings }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMbti, setSelectedMbti] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');

  // Compute available MBTI types
  const mbtiOptions = useMemo(() => {
    const set = new Set();
    people.forEach(p => {
      if (p.analysis?.personalityType) set.add(p.analysis.personalityType);
    });
    return ['ALL', ...Array.from(set).sort()];
  }, [people]);

  // Filtered people
  const filteredPeople = useMemo(() => {
    return people.filter(p => {
      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const nameMatch = p.name?.toLowerCase().includes(term);
        const headlineMatch = p.scraped?.linkedin?.headline?.toLowerCase().includes(term);
        const bioMatch = p.scraped?.instagram?.bio?.toLowerCase().includes(term);
        const interestMatch = p.analysis?.interests?.some(i => i.toLowerCase().includes(term));
        const hobbyMatch = p.analysis?.hobbies?.some(h => h.toLowerCase().includes(term));
        const valueMatch = p.analysis?.values?.some(v => v.toLowerCase().includes(term));
        if (!nameMatch && !headlineMatch && !bioMatch && !interestMatch && !hobbyMatch && !valueMatch) {
          return false;
        }
      }

      // MBTI filter
      if (selectedMbti !== 'ALL' && p.analysis?.personalityType !== selectedMbti) {
        return false;
      }

      // Gender filter
      if (selectedGender !== 'ALL' && p.analysis?.gender !== selectedGender) {
        return false;
      }

      return true;
    });
  }, [people, searchTerm, selectedMbti, selectedGender]);

  return (
    <div style={{ marginTop: '2rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="page-title">People & AI Dating Agents</h2>
          <p className="page-subtitle">
            Browse 28 verified public figures. Each person is paired with an autonomous agent analyzing their needs, hobbies, and interests.
          </p>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredPeople.length}</strong> of {people.length} agents
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="card-glass" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 280px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, hobby, interest, keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            className="form-input"
            value={selectedMbti}
            onChange={(e) => setSelectedMbti(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="ALL">All Personality Types</option>
            {mbtiOptions.filter(m => m !== 'ALL').map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            className="form-input"
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="ALL">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>

          {(searchTerm || selectedMbti !== 'ALL' || selectedGender !== 'ALL') && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedMbti('ALL');
                setSelectedGender('ALL');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Profile grid */}
      {filteredPeople.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>No agents match your search</h3>
          <p>Try searching for different keywords or clearing your filters to see all 28 real agents.</p>
        </div>
      ) : (
        <div className="profile-grid">
          {filteredPeople.map((person) => {
            const initials = person.name
              ? person.name.split(' ').map(n => n[0]).slice(0, 2).join('')
              : '??';
            
            const headline = person.scraped?.linkedin?.headline || 'Professional Profile';
            const location = person.scraped?.linkedin?.location || 'Global';
            const mbti = person.analysis?.personalityType || 'ENFP';
            const topMatch = rankings?.[person.id]?.topMatch;

            return (
              <div
                key={person.id}
                className="profile-card"
                onClick={() => onSelectPerson(person)}
              >
                <div className="profile-card-header">
                  <div className="profile-avatar">{initials}</div>
                  <div className="profile-card-info" style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <h3 style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {person.name}
                      </h3>
                      <span className="profile-mbti">{mbti}</span>
                    </div>
                    <p className="headline">{headline}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                      📍 {location}
                    </div>
                  </div>
                </div>

                <div className="profile-card-body">
                  {/* Top Match Preview if available */}
                  {topMatch && (
                    <div style={{
                      background: 'rgba(217, 70, 239, 0.08)',
                      border: '1px solid rgba(217, 70, 239, 0.2)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 12px',
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem'
                    }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Top Fit: <strong style={{ color: 'var(--primary-300)' }}>{topMatch.partnerName}</strong>
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--accent-400)' }}>
                        {topMatch.overallScore}%
                      </span>
                    </div>
                  )}

                  {/* Needs & Interests tags */}
                  <div className="profile-card-tags">
                    {person.analysis?.needs?.slice(0, 2).map((need, idx) => (
                      <span key={`need-${idx}`} className="tag tag-value" title="Core Need">
                        ❤️ {need}
                      </span>
                    ))}
                    {person.analysis?.hobbies?.slice(0, 2).map((hobby, idx) => (
                      <span key={`hobby-${idx}`} className="tag tag-hobby" title="Active Hobby">
                        🎯 {hobby}
                      </span>
                    ))}
                    {person.analysis?.interests?.slice(0, 2).map((int, idx) => (
                      <span key={`int-${idx}`} className="tag tag-interest" title="Intellectual Interest">
                        💡 {int}
                      </span>
                    ))}
                  </div>

                  {/* Verified Links */}
                  <div className="profile-card-links" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      title="Verified LinkedIn Profile"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span>LinkedIn</span>
                    </a>

                    <a
                      href={person.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      title="Verified Instagram Profile"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span>{person.scraped?.instagram?.followers ? `${person.scraped.instagram.followers}` : 'Instagram'}</span>
                    </a>

                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDatePerson(person);
                        }}
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        title="Simulate a date with this person"
                      >
                        💘 Date
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
