import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users, Code2, Sparkles, Palette, Shield, Rocket,
  Calendar, CheckCircle2, ArrowRight, ExternalLink, Award,
  Clock, MapPin, Search, ChevronRight, Check
} from 'lucide-react';

export const CLUBS_DATA = [
  {
    id: 'software-dev',
    name: 'Software Development Club',
    category: 'Engineering & Systems',
    tagline: 'Architecting resilient full-stack applications, distributed services & developer tooling.',
    icon: Code2,
    color: '#38bdf8',
    activeMembers: 640,
    projectsShipped: 16,
    meetupTime: 'Every Tuesday · 7:00 PM IST',
    leads: 'Aarav Mehta & Priya Sharma',
    tags: ['React & Next.js', 'Go & Rust', 'PostgreSQL', 'Docker & K8s', 'GraphQL'],
    about: 'The flagship software chapter where students build real-world applications, collaborate on open-source repositories, and conduct weekly code reviews with industry mentors.'
  },
  {
    id: 'ai-data',
    name: 'Artificial Intelligence & Data Science Club',
    category: 'Machine Learning & Intelligence',
    tagline: 'Exploring generative models, autonomous agents, neural architectures & practical LLM deployment.',
    icon: Sparkles,
    color: '#a855f7',
    activeMembers: 780,
    projectsShipped: 22,
    meetupTime: 'Every Thursday · 6:30 PM IST',
    leads: 'Rohan Iyer & Sneha Patel',
    tags: ['PyTorch', 'Hugging Face', 'LangChain', 'Agentic AI', 'Vector DBs'],
    about: 'Dedicated to machine learning theory, paper reading circles, and building practical generative AI applications. Members train vision models, fine-tune LLMs, and host hack sprints.'
  },
  {
    id: 'design-creative',
    name: 'Design & Creative Tech Club',
    category: 'UI/UX & Interactive Design',
    tagline: 'Crafting intuitive digital experiences, design systems, interactive 3D & product typography.',
    icon: Palette,
    color: '#ec4899',
    activeMembers: 390,
    projectsShipped: 11,
    meetupTime: 'Every Wednesday · 7:00 PM IST',
    leads: 'Ananya Sen & Daniel Kim',
    tags: ['Figma', 'Design Systems', 'Spline 3D', 'Micro-interactions', 'Design Thinking'],
    about: 'Focusing on the craft of modern product design. Members design real user flows, critique UI trends, create reusable Figma design tokens, and build aesthetic web interfaces.'
  },
  {
    id: 'cyber-cloud',
    name: 'Cybersecurity & Cloud Club',
    category: 'Infrastructure & Defense',
    tagline: 'Mastering ethical hacking, cloud architecture, network security & infrastructure automation.',
    icon: Shield,
    color: '#10b981',
    activeMembers: 350,
    projectsShipped: 9,
    meetupTime: 'Every Friday · 8:00 PM IST',
    leads: 'Vikram Rao & Tanvi Kulkarni',
    tags: ['Linux Hardening', 'AWS & GCP', 'Terraform', 'CTF Challenges', 'DevSecOps'],
    about: 'Hands-on security testing, vulnerability research, and multi-cloud infrastructure orchestration. Weekly Capture-The-Flag (CTF) drills and cloud architectural teardowns.'
  },
  {
    id: 'product-venture',
    name: 'Product & Entrepreneurship Club',
    category: 'Product & Startup Leadership',
    tagline: 'Bridging technical engineering with product management, market validation & venture building.',
    icon: Rocket,
    color: '#f59e0b',
    activeMembers: 320,
    projectsShipped: 8,
    meetupTime: 'Every Saturday · 5:00 PM IST',
    leads: 'Meera Nambiar & Karan Verma',
    tags: ['Product Strategy', 'User Research', 'Agile Sprints', 'Financial Modeling', 'Pitching'],
    about: 'Designed for future tech founders and product leaders. Learn how to identify painful problems, craft PRDs, conduct customer discovery interviews, and pitch to venture investors.'
  }
];

export default function ClubsPage() {
  const { navigate, awardXp, triggerToast } = useApp();

  // Saved club applications in localStorage
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('teklozy_club_applications');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeModalClub, setActiveModalClub] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Application form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    yearOfStudy: '2nd Year',
    skills: '',
    statement: '',
    portfolioLink: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const handleOpenApply = (club) => {
    setActiveModalClub(club);
    setFormErrors({});
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid email is required';
    }
    if (!formData.college.trim()) errs.college = 'College/University is required';
    if (!formData.skills.trim()) errs.skills = 'Please list at least 2 relevant skills';
    if (!formData.statement.trim() || formData.statement.length < 20) {
      errs.statement = 'Please write at least 20 characters explaining your motivation';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!validateForm() || !activeModalClub) return;

    const updated = {
      ...applications,
      [activeModalClub.id]: {
        clubId: activeModalClub.id,
        clubName: activeModalClub.name,
        appliedAt: new Date().toISOString(),
        status: 'Active Member',
        applicant: { ...formData }
      }
    };

    localStorage.setItem('teklozy_club_applications', JSON.stringify(updated));
    setApplications(updated);
    setActiveModalClub(null);
    awardXp(200);
    triggerToast(`🎉 Welcome to ${activeModalClub.name}! Application approved. +200 XP earned.`);
  };

  const filteredClubs = CLUBS_DATA.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q));
  });

  return (
    <div className="clubs-page-shell">
      <div className="clubs-page-container">
        {/* 1. HERO SECTION */}
      <section className="clubs-hero-section">
        <div className="clubs-hero-badge-row">
          <span className="clubs-badge-pill">
            <Users size={14} /> PEER-DRIVEN EXCELLENCE
          </span>
          <span className="clubs-badge-pill">
            <Award size={14} /> 5 ACTIVE CHAPTERS
          </span>
        </div>

        <h1 className="clubs-hero-title">
          Teklozy Student <span className="text-gold-gradient">Clubs & Chapters</span>
        </h1>
        <p className="clubs-hero-tagline">
          Join specialized tech cohorts, collaborate on production open-source software, attend weekly hack meetups, and learn alongside ambitious peers.
        </p>

        {/* Search & Overview Metrics */}
        <div className="clubs-search-metrics-row">
          <div className="clubs-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by club name, discipline, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="clubs-metrics-chips">
            <div className="chip-metric">
              <span className="val">2,480+</span>
              <span className="lbl">Active Members</span>
            </div>
            <div className="chip-metric">
              <span className="val">66</span>
              <span className="lbl">Projects Shipped</span>
            </div>
            <div className="chip-metric">
              <span className="val">Weekly</span>
              <span className="lbl">Live Hack Nights</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CLUBS GRID */}
      <section className="clubs-grid-section">
        <div className="clubs-cards-grid">
          {filteredClubs.map((club) => {
            const Icon = club.icon;
            const app = applications[club.id];
            const isMember = !!app;

            return (
              <div
                key={club.id}
                className={`club-card ${isMember ? 'is-member-card' : ''}`}
                style={{ borderColor: isMember ? '#10b981' : `${club.color}35` }}
              >
                <div className="club-card-header">
                  <div className="club-icon-wrap" style={{ background: `${club.color}20`, color: club.color }}>
                    <Icon size={24} />
                  </div>
                  <div className="club-category-col">
                    <span className="club-category-pill" style={{ color: club.color }}>
                      {club.category}
                    </span>
                    {isMember && (
                      <span className="club-member-badge">
                        <Check size={12} /> {app.status}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="club-title">{club.name}</h3>
                <p className="club-tagline">{club.tagline}</p>
                <p className="club-about-text">{club.about}</p>

                {/* Tech Chips */}
                <div className="club-tags-wrap">
                  {club.tags.map((t, idx) => (
                    <span key={idx} className="club-tech-tag">{t}</span>
                  ))}
                </div>

                {/* Metadata Row */}
                <div className="club-meta-box">
                  <div className="meta-row">
                    <Clock size={14} className="text-muted" />
                    <span>{club.meetupTime}</span>
                  </div>
                  <div className="meta-row">
                    <Users size={14} className="text-muted" />
                    <span>{club.activeMembers} Members · Leads: {club.leads}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="club-card-actions">
                  {isMember ? (
                    <div className="member-status-bar">
                      <CheckCircle2 size={16} className="text-green" />
                      <span>Membership Active (Joined {new Date(app.appliedAt).toLocaleDateString()})</span>
                    </div>
                  ) : (
                    <button
                      className="btn-apply-club"
                      style={{ background: `linear-gradient(135deg, ${club.color}, #0284c7)` }}
                      onClick={() => handleOpenApply(club)}
                    >
                      <span>Apply to Join Chapter</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. APPLICATION MODAL */}
      {activeModalClub && (
        <div className="modal-backdrop-fixed" onClick={() => setActiveModalClub(null)}>
          <div className="modal-dialog-card club-apply-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div>
                <span className="modal-eyebrow" style={{ color: activeModalClub.color }}>
                  CHAPTER MEMBERSHIP APPLICATION
                </span>
                <h3 className="modal-title">{activeModalClub.name}</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setActiveModalClub(null)}>✕</button>
            </div>

            <form onSubmit={handleSubmitApplication} className="club-apply-form">
              <div className="form-grid-2col">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Your legal or preferred name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                  {formErrors.fullName && <span className="field-error-msg">{formErrors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label>University / College *</label>
                  <input
                    type="text"
                    placeholder="e.g. Stanford / IIT / BITS"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  />
                  {formErrors.college && <span className="field-error-msg">{formErrors.college}</span>}
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {formErrors.email && <span className="field-error-msg">{formErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Year of Study</label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                    <option value="Postgraduate">Postgraduate / Masters</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Technical Skills & Experience *</label>
                <input
                  type="text"
                  placeholder="e.g. React, Python, Docker, PyTorch, Figma..."
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
                {formErrors.skills && <span className="field-error-msg">{formErrors.skills}</span>}
              </div>

              <div className="form-group">
                <label>Statement of Motivation * (Why do you want to join this club?)</label>
                <textarea
                  rows={3}
                  placeholder="Tell the club leads what projects you want to build or what you hope to learn..."
                  value={formData.statement}
                  onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                />
                {formErrors.statement && <span className="field-error-msg">{formErrors.statement}</span>}
              </div>

              <div className="form-group">
                <label>GitHub Profile / Portfolio / LinkedIn (Optional)</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={formData.portfolioLink}
                  onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
                />
              </div>

              <div className="modal-dialog-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveModalClub(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-glow">
                  <CheckCircle2 size={16} />
                  <span>Submit Membership Application</span>
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
