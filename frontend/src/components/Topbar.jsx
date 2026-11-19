import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu, X, ChevronRight, ChevronDown, Flame, Zap, Bell, Settings,
  LogOut, Compass, BookOpen, Sparkles
} from 'lucide-react';

export default function Topbar() {
  const {
    currentRoute,
    navigate,
    displayName,
    xp,
    selectedPath,
    logout,
    mobileMenuOpen,
    setMobileMenuOpen,
    sidebarCollapsed
  } = useApp();

  const [profileOpen, setProfileOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  const profileRef = useRef(null);
  const noticeRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (noticeRef.current && !noticeRef.current.contains(e.target)) {
        setNoticeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Compute breadcrumbs
  const getBreadcrumbs = () => {
    const { path, query } = currentRoute;

    if (path === 'home') {
      return [];
    }
    if (path === 'discover') {
      return [
        { label: 'Home', route: 'home' },
        { label: 'Level 1: Discover', route: 'level/1' },
        { label: 'Career Path Selection', active: true }
      ];
    }
    if (path.startsWith('path/')) {
      const pathName = selectedPath ? selectedPath.name + ' Path' : 'Career Path';
      return [
        { label: 'Home', route: 'home' },
        { label: 'Level 1: Discover', route: 'discover' },
        { label: pathName, active: true }
      ];
    }
    if (path === 'lesson') {
      const pathName = selectedPath ? selectedPath.name + ' Path' : 'Curriculum';
      const modNum = Number(query.module || 0) + 1;
      return [
        { label: 'Home', route: 'home' },
        { label: pathName, route: selectedPath ? `path/${selectedPath.id}` : 'discover' },
        { label: `Module ${modNum}`, active: true }
      ];
    }
    if (path.startsWith('level/')) {
      const lvlNum = path.replace('level/', '');
      return [
        { label: 'Home', route: 'home' },
        { label: `Level ${lvlNum} Milestone`, active: true }
      ];
    }
    if (path === 'dungeon') {
      if (query.problem) {
        return [
          { label: 'Home', route: 'home' },
          { label: 'DSA Dungeon', route: 'dungeon' },
          { label: 'Chapter', route: query.chapter ? `dungeon?chapter=${query.chapter}` : 'dungeon' },
          { label: 'Problem Solving', active: true }
        ];
      }
      if (query.chapter) {
        return [
          { label: 'Home', route: 'home' },
          { label: 'DSA Dungeon', route: 'dungeon' },
          { label: `Chapter ${query.chapter}`, active: true }
        ];
      }
      return [
        { label: 'Home', route: 'home' },
        { label: 'Journey', route: 'home' },
        { label: 'Level 2', route: 'level/2' },
        { label: 'Side Quest', route: 'level/2' },
        { label: 'DSA Dungeon', active: true }
      ];
    }
    if (path === 'learn') {
      return [{ label: 'Home', route: 'home' }, { label: 'Learning Space', active: true }];
    }
    if (path === 'build') {
      return [{ label: 'Dashboard', route: 'home' }, { label: 'Teklozy CodeLab', active: true }];
    }
    if (path === 'challenges') {
      return [{ label: 'Home', route: 'home' }, { label: 'Coding Challenges', active: true }];
    }
    if (path === 'profile') {
      return [{ label: 'Home', route: 'home' }, { label: 'Profile Settings', active: true }];
    }

    return [{ label: 'Teklozy', route: 'home' }, { label: path, active: true }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="global-topbar">
      {/* Left branding & mobile trigger */}
      <div className={`topbar-brand-area ${sidebarCollapsed ? 'is-collapsed' : ''}`}>
        <button
          className="mobile-nav-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <a href="#/home" className="topbar-logo-link" aria-label="Teklozy Home">
          <img src="/teklozy-logo-original.png" alt="Teklozy" className="topbar-logo-img" />
        </a>
      </div>

      {/* Center contextual breadcrumbs */}
      <nav className="topbar-breadcrumbs" aria-label="Breadcrumb navigation">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.label}>
            {idx > 0 && <ChevronRight size={13} className="bc-sep" />}
            {crumb.active ? (
              <span className="bc-item bc-active">{crumb.label}</span>
            ) : (
              <button className="bc-item bc-link" onClick={() => navigate(crumb.route)}>
                {crumb.label}
              </button>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Right stats & profile actions */}
      <div className="topbar-actions-area">
        {/* Streak Pill */}
        <div className="stat-badge-pill streak-pill" title="12 consecutive days of learning">
          <Flame size={15} className="streak-icon" />
          <span className="pill-text">12 Day Streak</span>
        </div>

        {/* XP Pill */}
        <div className="stat-badge-pill xp-pill" title="Total experience points earned">
          <Zap size={15} className="xp-icon" />
          <span className="pill-text">{xp.toLocaleString()} XP</span>
        </div>

        {/* Notifications */}
        <div className="dropdown-wrapper" ref={noticeRef}>
          <button
            className="icon-action-btn notification-btn"
            onClick={() => { setNoticeOpen(!noticeOpen); setProfileOpen(false); }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="notification-dot" />
          </button>

          {noticeOpen && (
            <div className="flyout-menu notice-flyout" role="dialog" aria-label="Notifications">
              <div className="flyout-header">
                <strong>Notifications</strong>
                <span className="unread-count">1 new</span>
              </div>
              <div className="notice-item unread">
                <div className="notice-icon-box"><Sparkles size={14} /></div>
                <div className="notice-body">
                  <b>Teklozy Hackathon '26 Live</b>
                  <p>Register today to build with peers and earn verified XP.</p>
                  <small>2 hours ago</small>
                </div>
              </div>
              <div className="notice-item">
                <div className="notice-icon-box"><Compass size={14} /></div>
                <div className="notice-body">
                  <b>Milestone 1 Completed</b>
                  <p>You unlocked the Level 1 Discover achievement badge.</p>
                  <small>Yesterday</small>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="dropdown-wrapper" ref={profileRef}>
          <button
            className="profile-trigger-btn"
            onClick={() => { setProfileOpen(!profileOpen); setNoticeOpen(false); }}
            aria-label="User account menu"
          >
            <div className="user-avatar-circle">
              {(displayName[0] || 'L').toUpperCase()}
            </div>
            <span className="user-firstname-label">{displayName.split(' ')[0]}</span>
            <ChevronDown size={14} className="chevron-icon" />
          </button>

          {profileOpen && (
            <div className="flyout-menu profile-flyout" role="menu">
              <div className="profile-flyout-user">
                <strong>{displayName}</strong>
                <span className="role-tag">Level 1 · Tech Apprentice</span>
                <span className="xp-tag">{xp.toLocaleString()} Total XP</span>
              </div>

              <div className="flyout-divider" />

              <button className="flyout-action-item" role="menuitem" onClick={() => { setProfileOpen(false); navigate('profile'); }}>
                <Settings size={15} />
                <span>Profile Settings</span>
              </button>

              <button className="flyout-action-item" role="menuitem" onClick={() => { setProfileOpen(false); navigate('learn'); }}>
                <BookOpen size={15} />
                <span>My Courses</span>
              </button>

              <div className="flyout-divider" />

              <button className="flyout-action-item danger-item" role="menuitem" onClick={() => { setProfileOpen(false); logout(); }}>
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
