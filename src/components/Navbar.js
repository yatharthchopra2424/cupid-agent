'use client';

export default function Navbar({ activeTab, setActiveTab, onRunAllDates, onReset, isSimulating, stats }) {
  return (
    <header className="navbar">
      <div className="navbar-brand" onClick={() => setActiveTab('explore')} style={{ cursor: 'pointer' }}>
        <span className="logo-icon">💘</span>
        <span>CupidAgent</span>
      </div>

      <nav className="navbar-links" aria-label="Main Navigation">
        <button
          className={`nav-link ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          <span className="icon">🌟</span>
          <span>Explore Agents</span>
        </button>

        <button
          className={`nav-link ${activeTab === 'direct-date' ? 'active' : ''}`}
          onClick={() => setActiveTab('direct-date')}
        >
          <span className="icon">💌</span>
          <span>Date 1-on-1</span>
        </button>

        <button
          className={`nav-link ${activeTab === 'date' ? 'active' : ''}`}
          onClick={() => setActiveTab('date')}
        >
          <span className="icon">💬</span>
          <span>Date Simulator</span>
        </button>

        <button
          className={`nav-link ${activeTab === 'rankings' ? 'active' : ''}`}
          onClick={() => setActiveTab('rankings')}
        >
          <span className="icon">🏆</span>
          <span>Rankings</span>
        </button>

        <button
          className={`nav-link ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <span className="icon">➕</span>
          <span>Add Profile</span>
        </button>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          className="btn btn-sm btn-primary"
          onClick={onRunAllDates}
          disabled={isSimulating}
          title="Run autonomous dates across all agent pairs"
        >
          <span>{isSimulating ? '⏳ Dating...' : '⚡ Simulate All Dates'}</span>
        </button>

        <button
          className="btn btn-sm btn-ghost"
          onClick={onReset}
          title="Reset store to original seed profiles"
        >
          <span>🔄 Reset</span>
        </button>
      </div>
    </header>
  );
}
