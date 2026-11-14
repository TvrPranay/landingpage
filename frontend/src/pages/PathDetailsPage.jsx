import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft, BookOpen, Clock, Zap, Check, ArrowRight,
  Play, Sparkles, Code2, Target, Trophy, Star, Layers, RefreshCw
} from 'lucide-react';

export default function PathDetailsPage() {
  const { paths, selectedPath, navigate, completedLessons } = useApp();

  // Active path
  const currentPath = selectedPath || paths[1]; // default to AI if undefined
  const isAI = currentPath.id === 'ai';

  const modulesList = currentPath.modules || [];

  const handleOpenLesson = (moduleIdx) => {
    navigate('lesson', { module: moduleIdx, tab: 'About' });
  };

  const completedCount = completedLessons.length;
  const progressPercent = Math.round((completedCount / modulesList.length) * 100);

  return (
    <div className="path-details-page-wrap">
      {/* Breadcrumb Header */}
      <div className="page-breadcrumb-header">
        <button className="back-nav-btn" onClick={() => navigate('home')}>
          <ChevronLeft size={16} />
          <span>Dashboard</span>
        </button>
        <span className="breadcrumb-divider">/</span>
        <button className="breadcrumb-link-btn" onClick={() => navigate('discover')}>
          Level 1: Discover
        </button>
        <span className="breadcrumb-divider">/</span>
        <span className="breadcrumb-current">{currentPath.name} Path</span>
      </div>

      {/* Path Detail Hero */}
      <section className={`path-details-hero-card ${isAI ? 'hero-ai' : 'hero-dev'}`}>
        <div className="hero-details-copy">
          <div className="hero-eyebrow-pill">
            <Sparkles size={12} />
            <span>ACTIVE CAREER PATH · LEVEL 1</span>
          </div>

          <h1 className="hero-details-title">{currentPath.title}</h1>
          <p className="hero-details-desc">
            {currentPath.desc} Build rock-solid foundations, practice with guided coding exercises, and connect what you build to industry career opportunities.
          </p>

          <div className="hero-meta-stats-row">
            <div className="stat-item"><BookOpen size={15} /> <span>{currentPath.modulesCount} Modules</span></div>
            <div className="stat-item"><Clock size={15} /> <span>{currentPath.estimatedTime}</span></div>
            <div className="stat-item"><Zap size={15} /> <span>{currentPath.totalXp} XP Available</span></div>
            <div className="stat-item"><Check size={15} /> <span>{completedCount} Completed</span></div>
          </div>

          <div className="enrolled-status-pill">
            <Check size={13} strokeWidth={3} />
            <span>Enrolled & Synced to Profile</span>
          </div>
        </div>

        <div className="hero-details-art-col" aria-hidden="true">
          <div className="art-orbital-spin" />
          <div className="art-icon-circle">
            {isAI ? <Sparkles size={76} /> : <Code2 size={76} />}
          </div>
          <span className="art-caption-tag">{currentPath.badge}</span>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="path-details-content-grid">
        {/* Left: Curriculum Roadmap */}
        <div className="curriculum-roadmap-col">
          <div className="roadmap-heading-bar">
            <div>
              <span className="section-eyebrow">STRUCTURED CURRICULUM</span>
              <h2>Module Roadmap</h2>
              <p>Work through each progressive module to complete Level 1 and unlock Level 2.</p>
            </div>
            <div className="roadmap-progress-badge">
              <span>{completedCount} of {modulesList.length} Finished</span>
            </div>
          </div>

          {/* Module Cards Grid */}
          <div className="modules-roadmap-grid">
            {modulesList.map((m, idx) => {
              const isDone = completedLessons.includes(idx);
              const isCurrent = !isDone && (idx === 0 || completedLessons.includes(idx - 1));

              return (
                <div
                  key={m.id || idx}
                  className={`roadmap-module-card ${isDone ? 'is-completed' : ''} ${isCurrent ? 'is-current-module' : ''}`}
                  onClick={() => handleOpenLesson(idx)}
                >
                  <div className="module-card-top-row">
                    <span className="module-index-pill">
                      MODULE {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="module-xp-pill">
                      +{m.xp || 125} XP
                    </span>
                  </div>

                  <div className="module-card-body">
                    <div className="module-icon-box">
                      {isDone ? (
                        <Check size={20} className="icon-done" />
                      ) : (
                        <Play size={20} className="icon-play" />
                      )}
                    </div>
                    <h3 className="module-title">{m.title}</h3>
                    <p className="module-desc">{m.desc}</p>
                  </div>

                  <div className="module-card-bottom-row">
                    <span className="module-format-tag">
                      <Clock size={12} /> {m.duration} • {m.type}
                    </span>
                    <button className="btn-module-action" onClick={() => handleOpenLesson(idx)}>
                      <span>{isDone ? 'Review' : isCurrent ? 'Resume' : 'Start'}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Learning Strip */}
          <div className="curriculum-continue-strip">
            <div className="strip-art-icon">
              {isAI ? <Sparkles size={24} /> : <Code2 size={24} />}
            </div>
            <div className="strip-info">
              <span className="strip-eyebrow">READY WHEN YOU ARE</span>
              <h4>{modulesList[0]?.title}</h4>
              <p>Video lessons • Concept reading • Live knowledge check quiz</p>
            </div>
            <button className="btn-strip-cta" onClick={() => handleOpenLesson(0)}>
              <span>Launch Studio</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Outcomes & Track Switching */}
        <aside className="path-sidebar-col">
          <div className="sidebar-summary-card">
            <div className="summary-card-icon"><Target size={20} /></div>
            <h3>Beginner to Pro</h3>
            <p>Every concept is explained with intuitive visual models before moving to production code.</p>
          </div>

          <div className="sidebar-summary-card">
            <div className="summary-card-icon"><Trophy size={20} /></div>
            <h3>Verified XP Rewards</h3>
            <p>Complete quizzes and save lesson notes to earn verified XP towards your Level 2 milestone.</p>
          </div>

          <div className="sidebar-summary-card">
            <div className="summary-card-icon"><Star size={20} /></div>
            <h3>Portfolio Ready</h3>
            <p>The code you write directly integrates into your public Teklozy developer portfolio.</p>
          </div>

          <div className="switch-track-box">
            <div className="switch-track-top">
              <RefreshCw size={16} />
              <strong>Want to change tracks?</strong>
            </div>
            <p>You can switch to the other track or complete both to earn fullstack + AI credentials.</p>
            <button className="btn-switch-track" onClick={() => navigate('discover')}>
              <span>Browse All Paths</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
