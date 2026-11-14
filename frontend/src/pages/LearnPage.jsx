import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Video, Sparkles, FileText, ArrowRight, Clock, Zap, Search, Filter } from 'lucide-react';

export default function LearnPage() {
  const { paths, selectedPath, navigate } = useApp();
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const currentPath = selectedPath || paths[1];
  const allModules = currentPath.modules || [];

  const filtered = allModules.filter(m => {
    const matchesFilter = filterType === 'ALL' || m.type.toUpperCase() === filterType;
    const matchesSearch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="learn-catalog-page">
      <div className="learn-header-bar">
        <div>
          <span className="section-eyebrow">CURATED LESSON STUDIO</span>
          <h1>Learning Space</h1>
          <p>Pick up where you left off or deep-dive into specific engineering concepts in {currentPath.name}.</p>
        </div>

        <button className="btn-switch-track-top" onClick={() => navigate('discover')}>
          <span>Switch Track ({currentPath.name})</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="learn-filter-toolbar">
        <div className="search-input-shell">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search lessons, concepts, and keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="format-filter-pills">
          {['ALL', 'READING', 'VISUAL', 'VIDEO'].map((f) => (
            <button
              key={f}
              className={`filter-pill-btn ${filterType === f ? 'active' : ''}`}
              onClick={() => setFilterType(f)}
            >
              {f === 'ALL' ? 'All Formats' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="learn-cards-grid">
        {filtered.map((m, idx) => {
          const originalIndex = allModules.findIndex(x => x.title === m.title);
          const Icon = m.type === 'Video' ? Video : m.type === 'Visual' ? Sparkles : FileText;

          return (
            <div
              key={m.title}
              className="learn-course-card"
              onClick={() => navigate('lesson', { module: originalIndex >= 0 ? originalIndex : idx, tab: 'About' })}
            >
              <div className="card-top-icon-strip">
                <div className="learn-card-icon-box">
                  <Icon size={20} />
                </div>
                <span className="learn-card-format-tag">{m.type} • {m.duration}</span>
              </div>

              <div className="learn-card-body">
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>

              <div className="learn-card-footer">
                <span className="xp-earn-tag"><Zap size={13} /> +{m.xp || 125} XP</span>
                <span className="open-lesson-link">
                  <span>Start Studio</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Box */}
      <div className="learn-bottom-cta-banner">
        <div>
          <h3>Ready to put your knowledge into practice?</h3>
          <p>Join the weekly coding sprints or form a hackathon squad in the Build workspace.</p>
        </div>
        <button className="btn-banner-action" onClick={() => navigate('build')}>
          <span>Explore Build Workspace</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
