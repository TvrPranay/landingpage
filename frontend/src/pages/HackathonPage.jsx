import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Trophy, Calendar, Users, Clock, Sparkles, CheckCircle2,
  ArrowRight, Shield, Terminal, Zap, Code2, Globe, HeartHandshake,
  ExternalLink, ChevronDown, ChevronUp, AlertCircle, FileText, Check
} from 'lucide-react';

export const HACKATHON_TRACKS = [
  {
    id: 'ai-agents',
    title: 'Generative AI & Autonomous Agents',
    bounty: '₹1,50,000 / $3,000',
    icon: Sparkles,
    color: '#38bdf8',
    description: 'Engineer multi-agent workflows, tool-calling autonomous systems, reasoning harnesses, or domain-specific generative models.',
    challenges: [
      'Self-healing code repair and CI/CD debugger agent',
      'Multi-modal student tutor with socratic voice feedback',
      'Autonomous research analyst synthesizing arXiv literature'
    ]
  },
  {
    id: 'distributed-systems',
    title: 'High-Performance Distributed Systems & Cloud',
    bounty: '₹1,00,000 / $2,000',
    icon: Terminal,
    color: '#a855f7',
    description: 'Architect resilient event-driven systems, custom consensus implementations, edge data routing, or sub-millisecond database caches.',
    challenges: [
      'Distributed log-structured cache with raft failover',
      'Zero-overhead telemetry proxy for microservice topologies',
      'Serverless function runner over WebAssembly isolates'
    ]
  },
  {
    id: 'dev-tools',
    title: 'Next-Gen Web & Developer Tooling',
    bounty: '₹1,00,000 / $2,000',
    icon: Code2,
    color: '#10b981',
    description: 'Reimagine developer workflows: real-time visual debuggers, browser-native IDE extensions, or zero-config deployment platforms.',
    challenges: [
      'AST-based automated refactoring engine for legacy codebases',
      'In-browser collaborative coding terminal with WebRTC',
      'Declarative schema migration tool with visual diffing'
    ]
  },
  {
    id: 'fintech-web3',
    title: 'FinTech, Web3 & Open Finance',
    bounty: '₹75,000 / $1,500',
    icon: Zap,
    color: '#f59e0b',
    description: 'Build algorithmic execution engines, zero-knowledge credential verifiers, transparent payroll splitters, or fraud detection models.',
    challenges: [
      'Privacy-preserving verifiable credentials for university diplomas',
      'High-throughput simulated order matching engine in Rust',
      'Automated recurring escrow payments for open source contributors'
    ]
  },
  {
    id: 'social-impact',
    title: 'Open Innovation & Social Impact',
    bounty: '₹75,000 / $1,500',
    icon: Globe,
    color: '#ec4899',
    description: 'Tackle pressing real-world challenges in public health, rural education accessibility, green energy tracking, or emergency logistics.',
    challenges: [
      'Low-bandwidth offline education hub for rural schools',
      'Hyperlocal emergency resource coordination network',
      'Open carbon footprint estimator for supply chain fleets'
    ]
  }
];

const SCHEDULE_ITEMS = [
  { day: 'Day 1 — Saturday, 19 Dec 2026', time: '09:00 AM IST', title: 'Opening Keynote & Track Reveal', desc: 'Welcome ceremony, judge introductions, and official release of challenge bonus bounties.' },
  { day: 'Day 1 — Saturday, 19 Dec 2026', time: '10:00 AM IST', title: 'Hacking Begins & Git Repositories Unlocked', desc: 'Teams start coding. First commit required within 2 hours.' },
  { day: 'Day 1 — Saturday, 19 Dec 2026', time: '04:00 PM IST', title: 'Mentor Checkpoint 1 (Architecture Review)', desc: '1-on-1 virtual design reviews with senior engineers from Google, Microsoft and Teklozy.' },
  { day: 'Day 1 — Saturday, 19 Dec 2026', time: '11:59 PM IST', title: 'Midnight Mini-Challenge (+500 XP)', desc: 'Surprise speed coding sprint. Highest-scoring team wins exclusive Teklozy swag bundles.' },
  { day: 'Day 2 — Sunday, 20 Dec 2026', time: '10:00 AM IST', title: 'Mentor Checkpoint 2 & Pitch Prep', desc: 'Dry-run presentations and slide polish with product leaders.' },
  { day: 'Day 2 — Sunday, 20 Dec 2026', time: '04:00 PM IST', title: 'Hacking Concludes & Code Freeze', desc: 'All commits pushed to GitHub and Loom demo videos submitted.' },
  { day: 'Day 2 — Sunday, 20 Dec 2026', time: '05:30 PM IST', title: 'Top 10 Finalist Demos & Q&A', desc: 'Live pitch session in front of our grand jury panel.' },
  { day: 'Day 2 — Sunday, 20 Dec 2026', time: '07:30 PM IST', title: 'Grand Award Ceremony & Closing Celebration', desc: 'Winners announced, prize bounties distributed, and certificates minted.' }
];

const FAQS = [
  { q: 'Who is eligible to participate?', a: 'Undergraduate and postgraduate students from any recognized university worldwide, as well as early-career developers graduating within the last 12 months.' },
  { q: 'What is the required team size?', a: 'Teams can consist of 1 to 4 members. You can register as a solo hacker or invite up to 3 peers.' },
  { q: 'Is the hackathon online or in-person?', a: 'Teklozy Hackathon 2026 is hybrid! You can participate 100% online from anywhere in the world, or join physical hacker hub meetups in select tech hubs.' },
  { q: 'Are pre-built projects allowed?', a: 'No. All project code must be authored during the official 36-hour hacking period. Open source frameworks, libraries, APIs, and boilerplate scaffolding are welcomed and encouraged.' },
  { q: 'What are the judging criteria?', a: 'Submissions are scored on: Technical Execution & Architecture (30%), Innovation & Creativity (30%), Practical Impact & Utility (25%), and Demo Quality (15%).' }
];

export default function HackathonPage() {
  const { navigate, awardXp, triggerToast } = useApp();

  // Registration state stored in localStorage
  const [registration, setRegistration] = useState(() => {
    try {
      const saved = localStorage.getItem('teklozy_hackathon_reg');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrackFilter, setSelectedTrackFilter] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    teamName: '',
    leadName: '',
    leadEmail: '',
    college: '',
    phone: '',
    teamSize: '3',
    selectedTrack: 'ai-agents',
    member2Name: '',
    member2Email: '',
    member3Name: '',
    member3Email: '',
    member4Name: '',
    member4Email: '',
    projectConcept: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const handleOpenModal = () => {
    if (registration) {
      setFormData({
        ...formData,
        teamName: registration.teamName || '',
        leadName: registration.leadName || '',
        leadEmail: registration.leadEmail || '',
        college: registration.college || '',
        phone: registration.phone || '',
        teamSize: registration.teamSize || '3',
        selectedTrack: registration.selectedTrack || 'ai-agents',
        projectConcept: registration.projectConcept || ''
      });
    }
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.teamName.trim()) errs.teamName = 'Team name is required';
    if (!formData.leadName.trim()) errs.leadName = 'Team lead name is required';
    if (!formData.leadEmail.trim() || !formData.leadEmail.includes('@')) {
      errs.leadEmail = 'A valid email is required';
    }
    if (!formData.college.trim()) errs.college = 'College / University is required';
    if (!formData.phone.trim() || formData.phone.length < 8) {
      errs.phone = 'Valid phone number is required';
    }
    if (!formData.projectConcept.trim()) {
      errs.projectConcept = 'Brief elevator pitch / concept is required';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      registeredAt: new Date().toISOString(),
      registrationId: 'TKZ-HACK-' + Math.floor(100000 + Math.random() * 900000)
    };

    localStorage.setItem('teklozy_hackathon_reg', JSON.stringify(payload));
    setRegistration(payload);
    setIsModalOpen(false);
    awardXp(300);
    triggerToast(`🎉 Team "${payload.teamName}" successfully registered for Teklozy Hackathon 2026! +300 XP awarded.`);
  };

  const handleCancelRegistration = () => {
    if (window.confirm('Are you sure you want to withdraw your hackathon registration?')) {
      localStorage.removeItem('teklozy_hackathon_reg');
      setRegistration(null);
      triggerToast('Registration withdrawn.');
    }
  };

  return (
    <div className="hackathon-page-shell">
      <div className="hackathon-page-container">
        {/* 1. HERO BANNER */}
      <section className="hackathon-hero-section">
        <div className="hackathon-hero-badge-row">
          <span className="hackathon-live-pill">
            <span className="live-dot" /> REGISTRATIONS OPEN
          </span>
          <span className="hackathon-date-pill">
            <Calendar size={14} /> 19–20 DECEMBER 2026
          </span>
          <span className="hackathon-mode-pill">
            <Globe size={14} /> HYBRID · 36 HOURS
          </span>
        </div>

        <h1 className="hackathon-hero-title">
          Teklozy Hackathon <span className="text-gold-gradient">2026</span>
        </h1>
        <p className="hackathon-hero-tagline">
          Intelligent Engineering — Building Autonomous, Resilient & Human-Centric Software
        </p>
        <p className="hackathon-hero-desc">
          Join 1,000+ top student developers, AI researchers and product builders worldwide.
          Form your team, build production-grade solutions across 5 frontier tracks, and compete for ₹5,00,000 in bounties.
        </p>

        {/* Registration CTA or Registered Status */}
        <div className="hackathon-cta-row">
          {registration ? (
            <div className="registered-confirmation-banner">
              <div className="reg-badge-left">
                <CheckCircle2 size={24} className="text-green" />
                <div>
                  <h4 className="reg-team-title">Registered: Team {registration.teamName}</h4>
                  <p className="reg-id-text">ID: {registration.registrationId} · Track: {HACKATHON_TRACKS.find(t => t.id === registration.selectedTrack)?.title || registration.selectedTrack}</p>
                </div>
              </div>
              <div className="reg-actions">
                <button className="btn-edit-reg" onClick={handleOpenModal}>Update Details</button>
                <button className="btn-withdraw-reg" onClick={handleCancelRegistration}>Withdraw</button>
              </div>
            </div>
          ) : (
            <button className="btn-primary-glow btn-lg" onClick={handleOpenModal}>
              <Trophy size={18} />
              <span>Register Your Team Now</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="hackathon-stats-grid">
          <div className="hack-stat-card">
            <span className="stat-number text-gold">₹5,00,000</span>
            <span className="stat-label">Prize Pool ($10,000 USD)</span>
          </div>
          <div className="hack-stat-card">
            <span className="stat-number text-cyan">36 Hours</span>
            <span className="stat-label">Non-Stop Building</span>
          </div>
          <div className="hack-stat-card">
            <span className="stat-number text-purple">1,000+</span>
            <span className="stat-label">Student Hackers</span>
          </div>
          <div className="hack-stat-card">
            <span className="stat-number text-green">5 Tracks</span>
            <span className="stat-label">Frontier Challenges</span>
          </div>
        </div>
      </section>

      {/* 2. TRACKS & BOUNTIES */}
      <section className="hackathon-tracks-section">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">COMPETITION TRACKS</span>
            <h2 className="section-heading">Frontier Problem Statements</h2>
          </div>
          <p className="section-subtext">
            Choose your specialization or build across disciplines. Each track carries a dedicated prize bounty and industry mentorship.
          </p>
        </div>

        <div className="tracks-cards-grid">
          {HACKATHON_TRACKS.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.id} className="track-card" style={{ borderColor: `${t.color}35` }}>
                <div className="track-card-top">
                  <div className="track-icon-box" style={{ background: `${t.color}20`, color: t.color }}>
                    <Icon size={24} />
                  </div>
                  <span className="track-bounty-pill" style={{ color: t.color, borderColor: `${t.color}50` }}>
                    {t.bounty}
                  </span>
                </div>

                <h3 className="track-card-title">{t.title}</h3>
                <p className="track-card-desc">{t.description}</p>

                <div className="track-challenges-box">
                  <span className="challenges-title">Sample Challenges:</span>
                  <ul className="challenges-list">
                    {t.challenges.map((c, i) => (
                      <li key={i}>
                        <Check size={13} style={{ color: t.color, flexShrink: 0 }} />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="track-card-footer">
                  <button
                    className="btn-select-track"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, selectedTrack: t.id }));
                      setIsModalOpen(true);
                    }}
                  >
                    Register for this Track →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SCHEDULE TIMELINE */}
      <section className="hackathon-timeline-section">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">36-HOUR RUN OF SHOW</span>
            <h2 className="section-heading">Event Schedule</h2>
          </div>
        </div>

        <div className="timeline-items-list">
          {SCHEDULE_ITEMS.map((item, idx) => (
            <div key={idx} className="timeline-schedule-item">
              <div className="timeline-left-time">
                <span className="schedule-time">{item.time}</span>
                <span className="schedule-day">{item.day}</span>
              </div>
              <div className="timeline-node-marker">
                <div className="node-dot" />
                {idx < SCHEDULE_ITEMS.length - 1 && <div className="node-line" />}
              </div>
              <div className="timeline-right-content">
                <h4 className="schedule-title">{item.title}</h4>
                <p className="schedule-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. RULES & EVALUATION */}
      <section className="hackathon-rules-section">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">INTEGRITY & CRITERIA</span>
            <h2 className="section-heading">Rules & Evaluation Rubric</h2>
          </div>
        </div>

        <div className="rules-rubric-grid">
          <div className="rules-panel-card">
            <h3>Participation Guidelines</h3>
            <ul className="rules-bullet-list">
              <li><strong>Team Size:</strong> 1 to 4 members. Inter-college teams are fully permitted.</li>
              <li><strong>Original Code:</strong> All core application logic must be developed between 10:00 AM on 19 Dec and 04:00 PM on 20 Dec.</li>
              <li><strong>Open Source:</strong> Standard third-party libraries, public APIs, and open-source models are permitted with clear attribution in README.</li>
              <li><strong>Submissions:</strong> Public GitHub repository with clean commit history, deployment link, and a 3-minute video walkthrough.</li>
            </ul>
          </div>

          <div className="rubric-panel-card">
            <h3>Judging Weightage</h3>
            <div className="rubric-bars-list">
              <div className="rubric-item">
                <div className="rubric-row">
                  <span>Technical Execution & Architecture</span>
                  <strong>30%</strong>
                </div>
                <div className="rubric-bar"><div className="rubric-fill" style={{ width: '30%', background: '#38bdf8' }} /></div>
              </div>
              <div className="rubric-item">
                <div className="rubric-row">
                  <span>Innovation & Creative Depth</span>
                  <strong>30%</strong>
                </div>
                <div className="rubric-bar"><div className="rubric-fill" style={{ width: '30%', background: '#a855f7' }} /></div>
              </div>
              <div className="rubric-item">
                <div className="rubric-row">
                  <span>Practical Utility & User Value</span>
                  <strong>25%</strong>
                </div>
                <div className="rubric-bar"><div className="rubric-fill" style={{ width: '25%', background: '#10b981' }} /></div>
              </div>
              <div className="rubric-item">
                <div className="rubric-row">
                  <span>Presentation Polish & Documentation</span>
                  <strong>15%</strong>
                </div>
                <div className="rubric-bar"><div className="rubric-fill" style={{ width: '15%', background: '#f59e0b' }} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQS ACCORDION */}
      <section className="hackathon-faqs-section">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">FREQUENTLY ASKED</span>
            <h2 className="section-heading">Questions & Answers</h2>
          </div>
        </div>

        <div className="faqs-accordion-list">
          {FAQS.map((faq, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <div key={i} className={`faq-item-card ${isOpen ? 'is-open' : ''}`}>
                <button className="faq-question-btn" onClick={() => setOpenFaqIndex(isOpen ? -1 : i)}>
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div className="faq-answer-content">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop-fixed" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog-card hackathon-reg-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div>
                <span className="modal-eyebrow">TEKLOZY HACKATHON 2026</span>
                <h3 className="modal-title">Team Registration</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitRegistration} className="hackathon-reg-form">
              <div className="form-grid-2col">
                <div className="form-group">
                  <label>Team Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Neural Pioneers"
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  />
                  {formErrors.teamName && <span className="field-error-msg">{formErrors.teamName}</span>}
                </div>

                <div className="form-group">
                  <label>Competition Track *</label>
                  <select
                    value={formData.selectedTrack}
                    onChange={(e) => setFormData({ ...formData, selectedTrack: e.target.value })}
                  >
                    {HACKATHON_TRACKS.map(t => (
                      <option key={t.id} value={t.id}>{t.title} ({t.bounty})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label>Team Lead Name *</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={formData.leadName}
                    onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                  />
                  {formErrors.leadName && <span className="field-error-msg">{formErrors.leadName}</span>}
                </div>

                <div className="form-group">
                  <label>Lead Email *</label>
                  <input
                    type="email"
                    placeholder="lead@university.edu"
                    value={formData.leadEmail}
                    onChange={(e) => setFormData({ ...formData, leadEmail: e.target.value })}
                  />
                  {formErrors.leadEmail && <span className="field-error-msg">{formErrors.leadEmail}</span>}
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label>College / University *</label>
                  <input
                    type="text"
                    placeholder="Institution name"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  />
                  {formErrors.college && <span className="field-error-msg">{formErrors.college}</span>}
                </div>

                <div className="form-group">
                  <label>Contact Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {formErrors.phone && <span className="field-error-msg">{formErrors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Team Size</label>
                <div className="team-size-selector">
                  {['1', '2', '3', '4'].map(num => (
                    <button
                      key={num}
                      type="button"
                      className={`size-btn ${formData.teamSize === num ? 'is-selected' : ''}`}
                      onClick={() => setFormData({ ...formData, teamSize: num })}
                    >
                      {num} {num === '1' ? 'Solo' : 'Members'}
                    </button>
                  ))}
                </div>
              </div>

              {Number(formData.teamSize) > 1 && (
                <div className="additional-members-box">
                  <h5 className="members-subheading">Teammate Details</h5>
                  <div className="form-grid-2col">
                    <input
                      type="text"
                      placeholder="Member 2 Name"
                      value={formData.member2Name}
                      onChange={(e) => setFormData({ ...formData, member2Name: e.target.value })}
                    />
                    <input
                      type="email"
                      placeholder="Member 2 Email"
                      value={formData.member2Email}
                      onChange={(e) => setFormData({ ...formData, member2Email: e.target.value })}
                    />
                  </div>
                  {Number(formData.teamSize) > 2 && (
                    <div className="form-grid-2col" style={{ marginTop: '8px' }}>
                      <input
                        type="text"
                        placeholder="Member 3 Name"
                        value={formData.member3Name}
                        onChange={(e) => setFormData({ ...formData, member3Name: e.target.value })}
                      />
                      <input
                        type="email"
                        placeholder="Member 3 Email"
                        value={formData.member3Email}
                        onChange={(e) => setFormData({ ...formData, member3Email: e.target.value })}
                      />
                    </div>
                  )}
                  {Number(formData.teamSize) > 3 && (
                    <div className="form-grid-2col" style={{ marginTop: '8px' }}>
                      <input
                        type="text"
                        placeholder="Member 4 Name"
                        value={formData.member4Name}
                        onChange={(e) => setFormData({ ...formData, member4Name: e.target.value })}
                      />
                      <input
                        type="email"
                        placeholder="Member 4 Email"
                        value={formData.member4Email}
                        onChange={(e) => setFormData({ ...formData, member4Email: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="form-group">
                <label>Elevator Pitch / Problem You Intend to Solve *</label>
                <textarea
                  rows={3}
                  placeholder="Summarize the core bottleneck or opportunity and your proposed technical solution..."
                  value={formData.projectConcept}
                  onChange={(e) => setFormData({ ...formData, projectConcept: e.target.value })}
                />
                {formErrors.projectConcept && <span className="field-error-msg">{formErrors.projectConcept}</span>}
              </div>

              <div className="modal-dialog-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-glow">
                  <CheckCircle2 size={16} />
                  <span>Confirm Team Registration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
