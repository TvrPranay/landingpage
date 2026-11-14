import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Code2, Sparkles, BookOpen, Clock, Zap, Check, ArrowRight,
  Target, Layers, Trophy, ChartNoAxesColumnIncreasing, ChevronLeft, Lock
} from 'lucide-react';

export default function PathSelectionPage() {
  const { paths, selectedPath, setSelectedPath, navigate, triggerToast } = useApp();

  const handleSelect = async (pathObj) => {
    await setSelectedPath(pathObj);
    triggerToast(`${pathObj.title} chosen and saved to your account!`);
    navigate(`path/${pathObj.id}`);
  };

  return (
    <div className="path-selection-page-wrap">
      {/* Navigation Breadcrumb & Back */}
      <div className="page-breadcrumb-header">
        <button className="back-nav-btn" onClick={() => navigate('home')}>
          <ChevronLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
        <span className="breadcrumb-divider">/</span>
        <span className="breadcrumb-static">Level 1: Discover</span>
        <span className="breadcrumb-divider">/</span>
        <span className="breadcrumb-current">Career Path Selection</span>
      </div>

      {/* Hero Section */}
      <section className="path-selection-hero-card">
        <div className="hero-content-col">
          <span className="hero-eyebrow-chip">LEVEL 1 · DISCOVER</span>
          <h1 className="hero-main-title">
            Choose the direction<br />
            <span className="text-gradient-sky">you want to grow.</span>
          </h1>
          <p className="hero-lead-text">
            Explore two career paths engineered around high-demand engineering skills, guided projects and verified job-ready outcomes. Choose your primary focus to unlock your learning roadmap.
          </p>

          <div className="hero-assurance-pills">
            <div className="assurance-pill">
              <Check size={14} className="pill-check" />
              <span>Structured Curriculum</span>
            </div>
            <div className="assurance-pill">
              <Check size={14} className="pill-check" />
              <span>Production Code Projects</span>
            </div>
            <div className="assurance-pill">
              <Check size={14} className="pill-check" />
              <span>Industry Verified Skills</span>
            </div>
          </div>
        </div>

        <div className="hero-visual-col" aria-hidden="true">
          <div className="hero-orbital-ring-1" />
          <div className="hero-orbital-ring-2" />
          <div className="hero-core-badge">
            <img src="/teklozy-logo-original.png" alt="Teklozy" className="hero-core-logo" />
          </div>
          <span className="floating-discipline-chip chip-left">
            <Code2 size={14} /> Fullstack Dev
          </span>
          <span className="floating-discipline-chip chip-right">
            <Sparkles size={14} /> AI & LLMs
          </span>
        </div>
      </section>

      {/* Selection Cards Heading */}
      <div className="path-cards-heading-bar">
        <div>
          <span className="section-eyebrow">CURATED LEARNING PATHS</span>
          <h2>Select Your Career Specialization</h2>
          <p>Your choice is saved permanently to your profile. You can switch tracks or complete both over time.</p>
        </div>
        <span className="path-count-badge">2 Tracks Available</span>
      </div>

      {/* Path Cards Grid */}
      <div className="path-cards-dual-grid">
        {paths.map((p) => {
          const isSelected = selectedPath?.id === p.id;
          const isAI = p.id === 'ai';

          return (
            <article
              key={p.id}
              className={`path-selection-card ${isAI ? 'track-ai' : 'track-dev'} ${isSelected ? 'is-active-selection' : ''}`}
            >
              {/* Card Illustration Banner */}
              <div className="path-card-banner">
                <div className="card-ambient-glow" />
                <div className="card-orbital-line" />
                <div className="card-hero-icon-wrap">
                  {isAI ? (
                    <Sparkles size={64} className="card-icon-svg" />
                  ) : (
                    <Code2 size={64} className="card-icon-svg" />
                  )}
                </div>
                <span className="card-discipline-badge">{p.badge}</span>
                {isSelected && (
                  <span className="active-enrolled-ribbon">
                    <Check size={12} strokeWidth={3} /> Currently Enrolled
                  </span>
                )}
              </div>

              {/* Card Content Body */}
              <div className="path-card-content">
                <div className="path-meta-metrics">
                  <span><BookOpen size={13} /> {p.modulesCount} Modules</span>
                  <span><Clock size={13} /> {p.estimatedTime}</span>
                  <span><Zap size={13} /> {p.totalXp} XP</span>
                </div>

                <h3 className="path-card-title">{p.title}</h3>
                <p className="path-card-desc">{p.desc}</p>

                {/* Tags */}
                <div className="path-card-tag-cloud">
                  {p.tags.map((t) => (
                    <span key={t} className="skill-tag-pill">{t}</span>
                  ))}
                </div>

                {/* Core Competencies Checklist */}
                <div className="path-card-skills-checklist">
                  {p.skills.map((s) => (
                    <div key={s} className="skill-check-item">
                      <Check size={13} className="skill-check-icon" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                {/* Action CTA Button */}
                <div className="path-card-action-bar">
                  <button
                    className={`btn-select-path ${isSelected ? 'btn-active-path' : ''}`}
                    onClick={() => handleSelect(p)}
                  >
                    <span>{isSelected ? 'Continue ' + p.name : 'Select ' + p.name + ' Path'}</span>
                    <ArrowRight size={15} />
                  </button>
                  <small className="path-persistence-caption">
                    <Lock size={11} /> Saved to your profile • Switch tracks anytime
                  </small>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Benefits Footer Strip */}
      <section className="path-benefits-row">
        <div className="benefit-card">
          <div className="benefit-icon-box"><Target size={20} /></div>
          <div className="benefit-text">
            <strong>Understand Careers</strong>
            <p>Explore real-world software & AI roles and hiring criteria.</p>
          </div>
        </div>

        <div className="benefit-card">
          <div className="benefit-icon-box"><Layers size={20} /></div>
          <div className="benefit-text">
            <strong>Learn by Doing</strong>
            <p>Write real code and build deployment-ready artifacts.</p>
          </div>
        </div>

        <div className="benefit-card">
          <div className="benefit-icon-box"><Trophy size={20} /></div>
          <div className="benefit-text">
            <strong>Earn XP & Badges</strong>
            <p>Get recognized and level up with verified achievements.</p>
          </div>
        </div>

        <div className="benefit-card">
          <div className="benefit-icon-box"><ChartNoAxesColumnIncreasing size={20} /></div>
          <div className="benefit-text">
            <strong>Grow with Purpose</strong>
            <p>Follow a proven 10-level ascent from learner to hired engineer.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
