'use client';

export default function HeroSection({ peopleCount, datesCount, onStartDating, onExplore, onRunAll }) {
  return (
    <section className="hero">
      <div className="hero-badge">
        <span>✨</span> Autonomous AI Dating Network & Matchmaker
      </div>

      <h1 className="hero-title">
        Where AI Agents <span className="gradient-text">Date on Your Behalf</span>
      </h1>

      <p className="hero-description">
        Each real person is represented by an intelligent agent synthesized from their public LinkedIn 
        and Instagram profiles. The agents meet, converse, assess emotional needs, shared values, and chemistry, 
        and rank who fits them best.
      </p>

      <div className="hero-cta">
        <button className="btn btn-lg btn-primary" onClick={onStartDating}>
          <span>💬 Start Date Simulator</span>
        </button>
        <button className="btn btn-lg btn-secondary" onClick={onExplore}>
          <span>👥 Explore 28 Agents</span>
        </button>
        <button className="btn btn-lg btn-ghost" onClick={onRunAll}>
          <span>⚡ Run All {peopleCount ? Math.round((peopleCount * (peopleCount - 1)) / 2) : 378} Dates</span>
        </button>
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-number">{peopleCount || 28}</div>
          <div className="hero-stat-label">Real People & Agents</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-number">{datesCount || 0}</div>
          <div className="hero-stat-label">Dates Simulated</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-number">
            {peopleCount ? Math.round((peopleCount * (peopleCount - 1)) / 2) : 378}
          </div>
          <div className="hero-stat-label">Possible Pairings</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-number">100%</div>
          <div className="hero-stat-label">Autonomous Synergy</div>
        </div>
      </div>

      <div className="steps-grid" style={{ marginTop: '3.5rem', textAlign: 'left' }}>
        <div className="step-card">
          <div className="step-number">1</div>
          <h3 className="step-title">Real Profiles Sourced</h3>
          <p className="step-description">
            28 real public figures with verified LinkedIn & Instagram links. Scrapes public bios, captions, career milestones, and posts.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number">2</div>
          <h3 className="step-title">Agent Persona Engine</h3>
          <p className="step-description">
            Agents extract emotional needs, active hobbies, intellectual interests, qualities, communication styles, and MBTI types.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number">3</div>
          <h3 className="step-title">Autonomous Dates</h3>
          <p className="step-description">
            Agents converse through ice-breaking, passion topics, vulnerable questions, and chemistry evaluation with inner monologues.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number">4</div>
          <h3 className="step-title">Fit Rankings & Rationale</h3>
          <p className="step-description">
            Every person receives an ordered compatibility leaderboard from Soulmate to Incompatible with multi-factor reasons why.
          </p>
        </div>
      </div>
    </section>
  );
}
