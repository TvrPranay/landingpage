import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Code2, Trophy, Settings, Compass, ArrowRight, CheckCircle2,
  Lock, Zap, Star, Shield, Laptop, Terminal, ChevronLeft, Sparkles
} from 'lucide-react';

export default function GenericPage({ type }) {
  const {
    currentRoute,
    navigate,
    milestones,
    xp,
    awardXp,
    displayName,
    email,
    unlockedLevel,
    unlockLevel,
    selectedPath,
    isLevel1Complete,
    triggerToast
  } = useApp();

  if (type === 'level') {
    const lvlNum = parseInt(currentRoute.path.replace('level/', ''), 10) || 1;
    const milestone = milestones.find(m => m.level === lvlNum) || milestones[0];
    const effectiveUnlocked = unlockedLevel || (isLevel1Complete ? 2 : 1);
    const isUnlocked = lvlNum <= effectiveUnlocked;
    const isDone = lvlNum < effectiveUnlocked;
    const isCurrent = lvlNum === effectiveUnlocked;

    // Level-specific content data
    const levelContentMap = {
      1: {
        focus: 'Career Specialization & Disciplines',
        overview: 'Explore core tech disciplines (Software Engineering vs. Artificial Intelligence) and complete foundational curriculum modules.',
        tasks: ['Complete active career path modules', 'Earn foundational XP bounties', 'Establish learning streak']
      },
      2: {
        focus: 'Core Programming & Data Structures',
        overview: 'Master computational reasoning, control flow, functions, memory models, and fundamental data structures.',
        tasks: ['Practice Python algorithms in CodeLab IDE', 'Pass automated unit tests with Socratic AI Mentor', 'Analyze Big-O time and space complexity']
      },
      3: {
        focus: 'Advanced Systems & Architecture',
        overview: 'Deep-dive into object-oriented patterns, asynchronous execution, relational database schemas, and recursive data structures.',
        tasks: ['Build binary trees and graph traversals', 'Implement asynchronous event loops', 'Design scalable relational schemas']
      },
      4: {
        focus: 'Full-Stack Application Engineering',
        overview: 'Craft production-grade software applications with client-side reactive frameworks, backend APIs, and database migrations.',
        tasks: ['Design RESTful & GraphQL web endpoints', 'Implement user authentication & access controls', 'Integrate production Docker containers']
      },
      5: {
        focus: 'Engineering Peer Collaboration & Mentorship',
        overview: 'Engage with peer study cohorts, participate in synchronous architecture teardowns, and complete guided mentor code reviews.',
        tasks: ['Conduct peer pull-request code reviews', 'Attend live mentor architecture office hours', 'Form sprint teams for collaborative building']
      },
      6: {
        focus: 'Open-Source Production & Showcase',
        overview: 'Publish documented, test-covered open-source software libraries and deploy production portfolio projects with CI/CD.',
        tasks: ['Publish production GitHub repositories', 'Configure automated CI/CD test workflows', 'Record interactive video architecture demos']
      },
      7: {
        focus: 'Technical Whiteboarding & Interview Prep',
        overview: 'Master algorithmic problem solving, mock technical interviews, and systems design whiteboard architecture evaluations.',
        tasks: ['Solve blind-75 algorithmic challenge sets', 'Simulate live technical behavioral mock interviews', 'Design high-availability distributed systems']
      },
      8: {
        focus: 'Career Matching & Technical Applications',
        overview: 'Target curated high-growth engineering roles with automated competency verification directly presented to hiring partners.',
        tasks: ['Generate verified Teklozy Competency Transcript', 'Match with hiring network partner opportunities', 'Submit direct engineering applications']
      },
      9: {
        focus: 'Executive Coaching & Negotiation',
        overview: 'Work 1-on-1 with senior engineering leaders on compensation benchmarking, leadership scope, and career trajectory.',
        tasks: ['1-on-1 career strategy coaching session', 'Benchmark target salary & equity ranges', 'Evaluate competing engineering offers']
      },
      10: {
        focus: 'The Teklozy Summit & Alumni Syndicate',
        overview: 'Ascend to the mountain peak! Join the elite Teklozy Alumni Network, mentor emerging students, and access founding opportunities.',
        tasks: ['Receive verified Summit Fellow credential', 'Join global alumni investment & engineering syndicate', 'Mentor aspiring students ascending the mountain']
      }
    };

    const details = levelContentMap[lvlNum] || levelContentMap[2];

    const handleAdvanceMilestone = () => {
      const nextLvl = lvlNum + 1;
      unlockLevel(nextLvl);
      awardXp(250);

      if (lvlNum < 10) {
        const nextMilestone = milestones.find(m => m.level === nextLvl);
        triggerToast(`🎉 Level ${lvlNum} Complete! Level ${nextLvl}: ${nextMilestone?.name || ''} is now UNLOCKED! (+250 XP)`);
        navigate(`level/${nextLvl}`);
      } else {
        triggerToast('🏆 THE TEKLOZY SUMMIT REACHED! All 10 Career Levels Conquered! (+1,000 XP)');
        navigate('home');
      }
    };

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

        <section className={`level-overview-hero ${isDone ? 'hero-done' : isCurrent ? 'hero-unlocked' : 'hero-locked'}`}>
          <div className="level-badge-large">
            <span>LVL</span>
            <strong>{lvlNum}</strong>
          </div>
          <div className="level-hero-text">
            <span className="hero-eyebrow-chip">
              {isDone ? '✓ COMPLETED MILESTONE' : isCurrent ? '● ACTIVE CHECKPOINT' : '🔒 LOCKED STATION'}
            </span>
            <h1>Level {lvlNum} · {milestone.name}</h1>
            <p>{milestone.desc}</p>
            <div className="level-rewards-strip">
              <span><Zap size={14} /> +250 XP Reward</span>
              <span><Trophy size={14} /> Level {lvlNum} Verified Badge</span>
              <span><CheckCircle2 size={14} /> Technical Competency</span>
            </div>
          </div>
        </section>

        <div className="level-actions-container">
          {isUnlocked ? (
            lvlNum === 1 ? (
              <div className="level-active-prompt-box">
                <div className="celebration-top-badge">
                  <Sparkles size={15} className="sparkle-gold" />
                  <span>{isDone ? 'MILESTONE COMPLETED' : 'ACTIVE CAREER TRACK'}</span>
                </div>
                <h3>Level 1: Discover · Career Path Specialization</h3>
                <p>{details.overview}</p>
                <div className="level-btn-row">
                  <button className="btn-level-primary" onClick={() => navigate(selectedPath ? `path/${selectedPath.id}` : 'discover')}>
                    <span>{selectedPath ? 'Continue Curriculum Modules' : 'Choose Career Path'}</span>
                    <ArrowRight size={15} />
                  </button>
                  <button className="btn-level-secondary" onClick={() => navigate('home')}>
                    <span>Return to Summit Map</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="level-unlocked-celebration-box">
                <div className="celebration-top-badge">
                  <Sparkles size={15} className="sparkle-gold" />
                  <span>
                    {isDone
                      ? '✓ MILESTONE VERIFIED & COMPLETED'
                      : `● LEVEL ${lvlNum} ACTIVE CHECKPOINT`}
                  </span>
                </div>
                <h3>Level {lvlNum}: {milestone.name} · {details.focus}</h3>
                <p>{details.overview}</p>

                {/* Technical objectives list */}
                <div className="milestone-objectives-checklist">
                  <h4>Core Objectives to Master</h4>
                  <ul>
                    {details.tasks.map((task, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={15} className="task-check-icon" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="level-tracks-preview-grid">
                  <div className="level-feature-card">
                    <div className="feature-icon-circle"><Code2 size={24} /></div>
                    <h4>Teklozy CodeLab IDE</h4>
                    <p>Practice algorithmic reasoning in Python with our live browser sandbox, terminal, and Socratic AI Mentor.</p>
                    <button className="btn-card-action" onClick={() => navigate('build')}>
                      <span>Launch CodeLab</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="level-feature-card">
                    <div className="feature-icon-circle"><Trophy size={24} /></div>
                    <h4>Algorithm Challenges</h4>
                    <p>Solve data structures problem sets, optimize Big-O runtime, and earn verified XP bounties.</p>
                    <button className="btn-card-action" onClick={() => navigate('challenges')}>
                      <span>Explore Challenges</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Milestone Completion & Progression Action */}
                <div className="milestone-progression-cta-bar">
                  {isCurrent && (
                    <button
                      className="btn-complete-milestone"
                      onClick={handleAdvanceMilestone}
                    >
                      <span>
                        {lvlNum < 10
                          ? `Complete Level ${lvlNum} & Unlock Level ${lvlNum + 1}`
                          : 'Reach the Teklozy Summit (Ascent Complete!)'}
                      </span>
                      <ArrowRight size={16} />
                    </button>
                  )}

                  {isDone && lvlNum < 10 && (
                    <button
                      className="btn-level-primary"
                      onClick={() => navigate(`level/${lvlNum + 1}`)}
                    >
                      <span>Ascend to Level {lvlNum + 1}: {milestones[lvlNum]?.name}</span>
                      <ArrowRight size={15} />
                    </button>
                  )}

                  <button className="btn-level-secondary" onClick={() => navigate('home')}>
                    <ChevronLeft size={16} />
                    <span>Return to Summit Map</span>
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="level-locked-prompt-box">
              <div className="locked-icon-bubble"><Lock size={28} /></div>
              <h3>Level {lvlNum}: {milestone.name} is Locked</h3>
              <p>
                Complete Level {effectiveUnlocked}: {milestones[effectiveUnlocked - 1]?.name || 'Current'} to ascend and unlock this mountain checkpoint.
              </p>
              <div className="level-btn-row">
                <button
                  className="btn-level-primary"
                  onClick={() => navigate(`level/${effectiveUnlocked}`)}
                >
                  <span>Go to Active Station (Level {effectiveUnlocked})</span>
                  <ArrowRight size={15} />
                </button>
                <button className="btn-level-secondary" onClick={() => navigate('home')}>
                  <span>Return to Summit Map</span>
                </button>
              </div>
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
