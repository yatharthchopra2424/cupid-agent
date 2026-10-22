'use client';

import { useState, useRef, useEffect } from 'react';

export default function AddPersonModal({ onClose, onPersonAdded }) {
  const [name, setName] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [summary, setSummary] = useState('');
  const [bio, setBio] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [useSelenium, setUseSelenium] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const dialogRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter a name');
      return;
    }
    if (!linkedin.includes('linkedin.com')) {
      setErrorMsg('Please enter a valid LinkedIn URL (e.g. https://www.linkedin.com/in/username/)');
      return;
    }
    if (!instagram.includes('instagram.com')) {
      setErrorMsg('Please enter a valid Instagram URL (e.g. https://www.instagram.com/username/)');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        linkedin: linkedin.trim(),
        instagram: instagram.trim(),
        linkedinSummary: summary.trim(),
        instagramBio: bio.trim(),
        themes: hobbies.split(',').map(h => h.trim()).filter(Boolean),
        useSelenium
      };

      const res = await fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to add person');
      }

      if (onPersonAdded) {
        onPersonAdded(data.person);
      }
      if (dialogRef.current) dialogRef.current.close();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="add-modal-title"
      style={{
        margin: 'auto',
        maxWidth: '600px',
        width: '92%',
        maxHeight: '85vh',
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        padding: '0',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <div style={{
        padding: '1.5rem 2rem',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h2 id="add-modal-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700 }}>
          ➕ Ingest New Real Profile
        </h2>
        <button
          className="modal-close"
          onClick={() => dialogRef.current && dialogRef.current.close()}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: 'calc(85vh - 120px)', overflowY: 'auto' }}>
        {errorMsg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid var(--accent-500)',
            color: 'var(--accent-400)',
            fontSize: '0.85rem'
          }}>
            {errorMsg}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Satya Nadella"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Official Public LinkedIn URL *</label>
          <input
            type="url"
            className="form-input"
            placeholder="https://www.linkedin.com/in/satyanadella/"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Official Public Instagram URL *</label>
          <input
            type="url"
            className="form-input"
            placeholder="https://www.instagram.com/satyanadella/"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Professional Summary / Bio (Optional)</label>
          <textarea
            className="form-input"
            rows="3"
            placeholder="Brief professional background, passions, or keywords..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Hobbies & Passions (Comma separated)</label>
          <input
            type="text"
            className="form-input"
            placeholder="Cricket, Reading poetry, Cloud computing, Meditation"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
          />
        </div>

        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <input
            type="checkbox"
            id="seleniumToggle"
            checked={useSelenium}
            onChange={(e) => setUseSelenium(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--primary-500)', cursor: 'pointer' }}
          />
          <label htmlFor="seleniumToggle" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <strong>Enable Selenium Live Scraper</strong> (Requires local Chrome/Chromedriver; automatically falls back to intelligent NLP extraction if headless browser is unavailable).
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => dialogRef.current && dialogRef.current.close()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Analyzing & Building Agent...' : '🤖 Create Agent & Analyze'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
