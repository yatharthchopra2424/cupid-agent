'use client';

export default function HeroSection({ peopleCount, datesCount, onStartDating, onExplore, onRunAll }) {
  return (
    <section className="hero">
      <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <span>✨</span> Autonomous AI Dating Network • Powered by <strong>NVIDIA Nemotron 120B Super-VL</strong>
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
          <span>👥 Explore {peopleCount || 25}+ Agents</span>
        </button>
        <button className="btn btn-lg btn-ghost" onClick={onRunAll}>
          <span>⚡ Run All {peopleCount ? Math.round((peopleCount * (peopleCount - 1)) / 2) : 300} Dates</span>
        </button>
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-number">{peopleCount || 25}+</div>
          <div className="hero-stat-label">Real People & Agents</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-number">{datesCount || 0}</div>
          <div className="hero-stat-label">Dates Simulated</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-number">
            {peopleCount ? Math.round((peopleCount * (peopleCount - 1)) / 2) : 300}
          </div>
          <div className="hero-stat-label">Possible Pairings</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-number">🇮🇳 + 🌍</div>
          <div className="hero-stat-label">Indian & Global Cohorts</div>
        </div>
      </div>

      <div className="steps-grid" style={{ marginTop: '3.5rem', textAlign: 'left' }}>
        <div className="step-card">
          <div className="step-number">1</div>
          <h3 className="step-title">Real Profiles Sourced</h3>
          <p className="step-description">
            Real public figures with verified LinkedIn & Instagram links. Features Indian visionaries at the top alongside global pioneers.
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
          <h3 className="step-title">Nemotron 120B Dates</h3>
          <p className="step-description">
            Agents converse through multi-turn dates with internal monologue reasoning using NVIDIA Nemotron 120B and 4 swappable keys (40 RPM).
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
