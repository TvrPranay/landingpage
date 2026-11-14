import React from 'react';
import { useApp } from '../context/AppContext';
import MountainMap from '../components/MountainMap';
import {
  Sparkles, Code2, ArrowRight, Bell, Trophy, BookOpen,
  Calendar, CheckCircle, ChevronRight, Zap, Target
} from 'lucide-react';

export default function HomePage() {
  const { displayName, selectedPath, navigate, completedLessons, xp } = useApp();

  const currentModuleIdx = completedLessons.length % 4;
  const currentPath = selectedPath;

  const currentLessonTitle = currentPath?.modules[currentModuleIdx]?.title || 'How AI Learns — Pattern Recognition';

  return (
    <div className="home-dashboard-page">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-hero">
        <div className="welcome-hero-copy">
          <div className="welcome-eyebrow-badge">
            <Sparkles size={13} className="sparkle-gold" />
            <span>LEVEL 1 · TECH APPRENTICE</span>
          </div>
          <h1 className="welcome-title">
            Welcome back, <span className="user-name-highlight">{displayName}</span>
          </h1>
          <p className="welcome-desc">
            You're on track to complete your foundational milestone. Keep your momentum going and level up your skills today.
          </p>
        </div>

        <div className="welcome-quick-metrics">
          <div className="metric-badge-box">
            <span className="metric-sub">CURRENT XP</span>
            <strong className="metric-val">{xp.toLocaleString()}</strong>
            <span className="metric-caption">+125 XP per lesson</span>
          </div>
          <div className="metric-badge-box">
            <span className="metric-sub">STREAK</span>
            <strong className="metric-val">12 Days</strong>
            <span className="metric-caption">Top 5% consistency</span>
          </div>
        </div>
      </div>

      {/* Centerpiece: The 10-Level Mountain Career Journey */}
      <section className="mountain-journey-section">
        <MountainMap />
      </section>

      {/* Lower Dashboard Multi-column Content Grid */}
      <div className="dashboard-grid-layout">
        {/* Continue Learning Widget */}
        <section className="dashboard-card continue-learning-card">
          <div className="card-header-row">
            <div className="card-header-title">
              <BookOpen size={18} className="header-icon-blue" />
              <h3>Continue Learning</h3>
            </div>
            <button className="text-action-link" onClick={() => navigate('learn')}>
              <span>View all courses</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="continue-course-card">
            <div className="course-lead-art">
              {currentPath?.id === 'development' ? (
                <Code2 size={28} className="art-dev-icon" />
              ) : (
                <Sparkles size={28} className="art-ai-icon" />
              )}
            </div>

            <div className="course-lead-body">
              <span className="course-track-chip">
                {currentPath ? currentPath.title : 'Discover Track'}
              </span>
              <h4 className="course-lesson-heading">{currentLessonTitle}</h4>
              <p className="course-lesson-desc">
                Module {currentModuleIdx + 1} of 4 • Practical exercises and knowledge check.
              </p>

              <div className="course-progress-indicator">
                <div className="course-bar-wrap">
                  <div
                    className="course-bar-fill"
                    style={{ width: `${Math.min(100, (completedLessons.length / 4) * 100)}%` }}
                  />
                </div>
                <span className="progress-fraction-label">
                  {completedLessons.length} / 4 completed
                </span>
              </div>
            </div>

            <div className="course-action-wrap">
              <button
                className="btn-resume-lesson"
                onClick={() => {
                  if (currentPath) {
                    navigate('lesson', { module: currentModuleIdx, tab: 'About' });
                  } else {
                    navigate('discover');
                  }
                }}
              >
                <span>{currentPath ? 'Resume Lesson' : 'Choose Path'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* Featured Event / Hackathon Announcement */}
        <section className="dashboard-card announcement-event-card">
          <div className="card-header-row">
            <div className="card-header-title">
              <Bell size={18} className="header-icon-gold" />
              <h3>Featured Milestone</h3>
            </div>
            <span className="live-status-pill">UPCOMING</span>
          </div>

          <div className="hackathon-banner-box">
            <div className="hackathon-trophy-circle">
              <Trophy size={24} />
            </div>
            <div className="hackathon-details">
              <span className="event-kicker">ANNUAL HACKATHON '26</span>
              <h4>Build, Deploy & Showcase Real Products</h4>
              <p>Form squads, build open-source projects, and showcase directly to startup partners.</p>
              <div className="event-pills-row">
                <span><Calendar size={13} /> Dec 12–14</span>
                <span><Zap size={13} /> +1,000 XP Bounty</span>
              </div>
            </div>
            <button className="btn-event-participate" onClick={() => navigate('challenges')}>
              <span>View Challenges</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </section>
      </div>

      {/* Competencies & Milestone Roadmap Highlights */}
      <section className="competencies-strip-card">
        <div className="strip-title-row">
          <Target size={18} className="target-icon" />
          <h3>Core Technical Competencies Tracked</h3>
        </div>
        <div className="competencies-grid">
          <div className="competency-box">
            <div className="comp-top">
              <strong>System Architecture</strong>
              <span>Level 1</span>
            </div>
            <div className="comp-bar"><div className="comp-fill" style={{ width: '45%' }} /></div>
            <small>Client/Server, Cloud APIs</small>
          </div>

          <div className="competency-box">
            <div className="comp-top">
              <strong>Machine Learning & Data</strong>
              <span>Level 1</span>
            </div>
            <div className="comp-bar"><div className="comp-fill" style={{ width: '60%' }} /></div>
            <small>Neural Nets, Embeddings</small>
          </div>

          <div className="competency-box">
            <div className="comp-top">
              <strong>Production Deployment</strong>
              <span>Level 1</span>
            </div>
            <div className="comp-bar"><div className="comp-fill" style={{ width: '30%' }} /></div>
            <small>CI/CD, Docker, Vercel</small>
          </div>

          <div className="competency-box">
            <div className="comp-top">
              <strong>Interview Readiness</strong>
              <span>Unlocks at Lv 7</span>
            </div>
            <div className="comp-bar"><div className="comp-fill" style={{ width: '10%' }} /></div>
            <small>Algorithms, Whiteboard</small>
          </div>
        </div>
      </section>
    </div>
  );
}
