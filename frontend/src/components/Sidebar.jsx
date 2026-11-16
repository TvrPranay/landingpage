import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home, Compass, BookOpen, Code2, Trophy, ArrowRight,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, route: 'home' },
  { id: 'learn', label: 'Learn', icon: BookOpen, route: 'learn' },
  { id: 'build', label: 'CodeLab', icon: Code2, route: 'build', badge: 'New' },
  { id: 'challenges', label: 'Challenges', icon: Trophy, route: 'challenges' }
];

export default function Sidebar() {
  const {
    currentRoute,
    navigate,
    xp,
    selectedPath,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen
  } = useApp();

  const currentPath = currentRoute.path;

  // Mutually exclusive active state
  const isNavActive = (item) => {
    if (item.id === 'home') {
      return currentPath === 'home' || currentPath.startsWith('level/');
    }
    return currentPath === item.route;
  };

  const handleNavClick = (item) => {
    navigate(item.route);
    setMobileMenuOpen(false);
  };

  const xpProgress = Math.min(100, Math.round(((xp % 3000) / 3000) * 100));

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`app-sidebar ${sidebarCollapsed ? 'is-collapsed' : ''} ${mobileMenuOpen ? 'mobile-visible' : ''}`}
        aria-label="Main sidebar navigation"
      >
        <div className="sidebar-inner-scroll">
          {/* User Rank Card */}
          <div className="sidebar-user-rank-box">
            <div className="rank-badge-icon" aria-label="Level 1">
              <span className="rank-lvl-text">Lv.1</span>
            </div>
            <div className="rank-details">
              <span className="rank-title">Tech Apprentice</span>
              <div className="rank-bar-bg" title={`${xp} of 3,000 XP towards Level 2`}>
                <div className="rank-bar-fill" style={{ width: `${Math.max(12, xpProgress)}%` }} />
              </div>
              <span className="rank-xp-caption">{xp.toLocaleString()} / 3,000 XP</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="sidebar-nav-list" aria-label="Primary sections">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item);

              return (
                <button
                  key={item.id}
                  className={`sidebar-nav-btn ${active ? 'is-active' : ''}`}
                  onClick={() => handleNavClick(item)}
                  title={sidebarCollapsed ? item.label : undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={18} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-tag-badge">{item.badge}</span>}
                </button>
              );
            })}
          </nav>

          {/* Promotional Hackathon Card */}
          <div className="sidebar-event-card">
            <div className="event-icon-circle">
              <Trophy size={18} />
            </div>
            <div className="event-content">
              <strong>Teklozy Hackathon '26</strong>
              <p>Build verified production projects & get scouted by hiring teams.</p>
              <button
                className="event-cta-btn"
                onClick={() => {
                  navigate('challenges');
                  setMobileMenuOpen(false);
                }}
              >
                <span>Explore Event</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Collapse Sidebar Trigger */}
        <div className="sidebar-footer-collapse">
          <button
            className="collapse-action-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <>
                <PanelLeftClose size={18} />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
