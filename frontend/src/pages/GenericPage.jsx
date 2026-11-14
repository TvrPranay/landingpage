import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Code2, Trophy, Settings, Compass, ArrowRight, CheckCircle2,
  Lock, Zap, Star, Shield, Laptop, Terminal, ChevronLeft, Sparkles
} from 'lucide-react';

export default function GenericPage({ type }) {
  const { currentRoute, navigate, milestones, xp, displayName, email } = useApp();

  if (type === 'level') {
    const lvlNum = parseInt(currentRoute.path.replace('level/', ''), 10) || 1;
    const milestone = milestones.find(m => m.level === lvlNum) || milestones[0];

    return (
      <div className="generic-workspace-page">
        <div className="page-breadcrumb-header">
          <button className="back-nav-btn" onClick={() => navigate('home')}>
            <ChevronLeft size={16} />
            <span>Summit Roadmap</span>
          </button>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">Level {lvlNum}: {milestone.name}</span>
        </div>

        <section className="level-overview-hero">
          <div className="level-badge-large">
            <span>LVL</span>
            <strong>{lvlNum}</strong>
          </div>
          <div className="level-hero-text">
            <span className="hero-eyebrow-chip">MILESTONE {lvlNum} OF 10</span>
            <h1>{milestone.name}</h1>
            <p>{milestone.desc}</p>
            <div className="level-rewards-strip">
              <span><Zap size={14} /> +250 XP Reward</span>
              <span><Trophy size={14} /> Level {lvlNum} Badge</span>
              <span><CheckCircle2 size={14} /> Verified Competency</span>
            </div>
          </div>
        </section>

        <div className="level-actions-container">
          {lvlNum === 1 ? (
            <div className="level-active-prompt-box">
              <h3>Level 1 Focus: Define Your Specialization</h3>
              <p>Explore software engineering versus artificial intelligence systems and enroll in your primary track.</p>
              <button className="btn-level-primary" onClick={() => navigate('discover')}>
                <span>Choose Career Path</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="level-locked-prompt-box">
              <div className="locked-icon-bubble"><Lock size={28} /></div>
              <h3>Level {lvlNum} Unlocks at Milestone Completion</h3>
              <p>Complete all foundational modules in Level 1 to automatically unlock this milestone.</p>
              <button className="btn-level-primary" onClick={() => navigate('home')}>
                <span>Return to Summit Map</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (type === 'build') {
    return (
      <div className="generic-workspace-page">
        <div className="workspace-header-bar">
          <div>
            <span className="section-eyebrow">PRACTICAL ENGINEERING</span>
            <h1>Build Workspace</h1>
            <p>Turn what you learn into production-ready software artifacts, open-source repositories and portfolio projects.</p>
          </div>
          <button className="btn-banner-action" onClick={() => navigate('challenges')}>
            <Trophy size={15} />
            <span>Join Hackathon '26</span>
          </button>
        </div>

        <div className="workspace-cards-grid">
          <div className="workspace-feature-card">
            <div className="feature-card-icon"><Code2 size={24} /></div>
            <h3>Guided Capstone Projects</h3>
            <p>Step-by-step engineering blueprints with automated CI/CD checks and real-time linting.</p>
            <span className="feature-status-tag">3 Projects Active</span>
          </div>

          <div className="workspace-feature-card">
            <div className="feature-card-icon"><Terminal size={24} /></div>
            <h3>Cloud Sandbox Studio</h3>
            <p>Full-stack containerized dev environments running Node.js, Python, PostgreSQL and Docker.</p>
            <span className="feature-status-tag">Ready in Browser</span>
          </div>

          <div className="workspace-feature-card">
            <div className="feature-card-icon"><Sparkles size={24} /></div>
            <h3>Verified Developer Portfolio</h3>
            <p>Live showcase page indexed for partner hiring managers to evaluate your production code.</p>
            <span className="feature-status-tag">Public Profile Live</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'challenges') {
    return (
      <div className="generic-workspace-page">
        <div className="workspace-header-bar">
          <div>
            <span className="section-eyebrow">COMPETITIVE SKILLS</span>
            <h1>Coding Challenges & Sprints</h1>
            <p>Test your algorithmic problem solving, system design intuition, and compete for verified leaderboard XP.</p>
          </div>
        </div>

        <div className="workspace-cards-grid">
          <div className="workspace-feature-card highlight-card">
            <div className="feature-card-icon"><Trophy size={24} /></div>
            <h3>Teklozy Hackathon '26</h3>
            <p>Annual global sprint: collaborate in squads of 3, build production apps, win $10,000 in prizes and get scouted.</p>
            <span className="feature-status-tag live">Registration Open</span>
          </div>

          <div className="workspace-feature-card">
            <div className="feature-card-icon"><Zap size={24} /></div>
            <h3>DSA Speed Tunnel</h3>
            <p>Daily timed algorithmic exercises focused on arrays, trees, dynamic programming and graphs.</p>
            <span className="feature-status-tag">Daily Sprint</span>
          </div>

          <div className="workspace-feature-card">
            <div className="feature-card-icon"><Shield size={24} /></div>
            <h3>System Design Crucible</h3>
            <p>Architect distributed microservices, scale databases, and mitigate high-traffic bottlenecks.</p>
            <span className="feature-status-tag">Advanced</span>
          </div>
        </div>
      </div>
    );
  }

  // Profile Page
  return (
    <div className="generic-workspace-page profile-page">
      <div className="workspace-header-bar">
        <div>
          <span className="section-eyebrow">LEARNER ACCOUNT</span>
          <h1>Profile & Preferences</h1>
          <p>Manage your account credentials, notification settings and verified public developer profile.</p>
        </div>
      </div>

      <div className="profile-details-card">
        <div className="profile-identity-header">
          <div className="profile-large-avatar">
            {(displayName[0] || 'L').toUpperCase()}
          </div>
          <div className="profile-identity-text">
            <h2>{displayName}</h2>
            <span className="profile-role-pill">Level 1 · Tech Apprentice</span>
            <p>{email || 'guest@teklozy.demo'}</p>
          </div>
        </div>

        <div className="profile-fields-list">
          <div className="profile-field-row">
            <div>
              <strong>Display Name</strong>
              <p>Shown across discussions, challenge leaderboards and portfolio.</p>
            </div>
            <span className="field-value-text">{displayName}</span>
          </div>

          <div className="profile-field-row">
            <div>
              <strong>Email Address</strong>
              <p>Used for account security, verification and milestone certificates.</p>
            </div>
            <span className="field-value-text">{email || 'guest@teklozy.demo'}</span>
          </div>

          <div className="profile-field-row">
            <div>
              <strong>Career Path Specialization</strong>
              <p>Primary curriculum track saved to your account.</p>
            </div>
            <button className="btn-outline-small" onClick={() => navigate('discover')}>
              Change Specialization
            </button>
          </div>

          <div className="profile-field-row">
            <div>
              <strong>Total Experience Points (XP)</strong>
              <p>Points earned from verified lessons, quizzes and challenges.</p>
            </div>
            <span className="field-value-xp"><Zap size={14} /> {xp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
