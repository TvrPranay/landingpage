import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Github, GraduationCap,
  Code2, ChartNoAxesColumnIncreasing, BriefcaseBusiness, CheckCircle2, ChevronRight
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function AuthPage() {
  const { navigate, setDisplayName, triggerToast, loginAsGuest, apiStatus } = useApp();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ text: '', type: '' });

  const guestEmail = 'guest@teklozy.demo';
  const guestPassword = 'TeklozyGuest@2026';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMessage({ text: '', type: '' });

    const trimmedEmail = email.trim().toLowerCase();

    // Check if user entered guest credentials
    if (mode === 'signin' && trimmedEmail === guestEmail && password === guestPassword) {
      loginAsGuest();
      setIsSubmitting(false);
      return;
    }

    try {
      const { supabase } = await import('../lib/supabase.js');

      if (supabase) {
        if (mode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email: trimmedEmail,
            password,
            options: { emailRedirectTo: window.location.origin }
          });
          if (error) throw error;
          setFeedbackMessage({
            text: 'Account created! Check your email to verify your address.',
            type: 'success'
          });
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password
          });
          if (error) throw error;

          const userName = data.user?.user_metadata?.full_name || data.user?.email?.split('@')[0] || 'Learner';
          setDisplayName(userName);
          localStorage.setItem('teklozyUserId', data.user.id);
          localStorage.setItem('teklozyUserEmail', data.user.email);
          localStorage.setItem('teklozyUserName', userName);
          triggerToast(`Welcome back, ${userName}!`);
          navigate('home');
        }
      } else {
        // Fallback to local FastAPI or demo
        if (mode === 'signup') {
          throw new Error('Configure Supabase in frontend/.env to register new production accounts.');
        }

        const res = await fetch(`${API}/api/demo-signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail })
        });

        if (!res.ok) {
          throw new Error('Backend server is offline. Use the 1-click Guest Preview below.');
        }

        const data = await res.json();
        const userName = data.user.name || trimmedEmail.split('@')[0];
        setDisplayName(userName);
        localStorage.setItem('teklozyUserId', String(data.user.id));
        localStorage.setItem('teklozyUserEmail', data.user.email);
        localStorage.setItem('teklozyUserName', userName);
        triggerToast(`Welcome, ${userName}!`);
        navigate('home');
      }
    } catch (err) {
      setFeedbackMessage({
        text: err.message || 'Authentication failed. Please verify credentials.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (provider) => {
    try {
      const { supabase } = await import('../lib/supabase.js');
      if (!supabase) {
        setFeedbackMessage({
          text: `Configure Supabase in frontend/.env to enable ${provider} sign-in.`,
          type: 'error'
        });
        return;
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err) {
      setFeedbackMessage({ text: err.message, type: 'error' });
    }
  };

  return (
    <div className="auth-split-layout">
      {/* Left Brand & Story Panel */}
      <section className="auth-story-panel">
        <div className="auth-story-bg-img" aria-hidden="true" />
        <div className="auth-story-gradient-overlay" aria-hidden="true" />

        <div className="auth-story-content">
          {/* Top Header Logo */}
          <div className="auth-story-brand-header">
            <img src="/teklozy-logo-on-dark.png" alt="Teklozy" className="auth-white-logo" />
            <span className="brand-badge-tag">Venture Career Studio</span>
          </div>

          {/* Stepper Pill */}
          <div className="auth-steps-pill" aria-label="Career path sequence">
            <span>Learn</span>
            <ChevronRight size={12} />
            <span>Build</span>
            <ChevronRight size={12} />
            <span>Showcase</span>
            <ChevronRight size={12} />
            <span className="step-highlight">Get Hired</span>
          </div>

          {/* Main Hero Copy */}
          <div className="auth-hero-copy">
            <span className="auth-eyebrow">YOUR NEXT CHAPTER IN TECH</span>
            <h1 className="auth-title">
              Build Your Tech Career with <span className="blue-gradient-text">Teklozy</span>
            </h1>
            <p className="auth-subtitle">
              A structured, hands-on platform to master in-demand skills, build verified production projects, and connect directly with hiring teams.
            </p>
          </div>

          {/* Feature Grid Pills */}
          <div className="auth-feature-pills-grid">
            <div className="feature-pill-card">
              <div className="feature-pill-icon"><GraduationCap size={18} /></div>
              <div className="feature-pill-text">
                <strong>Learn</strong>
                <small>In-Demand Skills</small>
              </div>
            </div>

            <div className="feature-pill-card">
              <div className="feature-pill-icon"><Code2 size={18} /></div>
              <div className="feature-pill-text">
                <strong>Build</strong>
                <small>Real Projects</small>
              </div>
            </div>

            <div className="feature-pill-card">
              <div className="feature-pill-icon"><ChartNoAxesColumnIncreasing size={18} /></div>
              <div className="feature-pill-text">
                <strong>Track</strong>
                <small>Your Growth</small>
              </div>
            </div>

            <div className="feature-pill-card">
              <div className="feature-pill-icon"><BriefcaseBusiness size={18} /></div>
              <div className="feature-pill-text">
                <strong>Get Hired</strong>
                <small>with Confidence</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Form Card Panel */}
      <section className="auth-form-panel">
        <div className="auth-form-card-container">
          {/* Card Header */}
          <div className="auth-card-top">
            <img src="/teklozy-logo-original.png" alt="Teklozy" className="auth-card-logo" />
            <span className="card-kicker">{mode === 'signin' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}</span>
            <h2 className="card-heading">{mode === 'signin' ? 'Sign in to Teklozy' : 'Join the Tech Journey'}</h2>
            <p className="card-subheading">
              {mode === 'signin'
                ? 'Enter your credentials to resume your 10-level career mastery path.'
                : 'Start your tech journey and build your portfolio from day one.'}
            </p>
          </div>

          {/* Main Form */}
          <form className="auth-inputs-form" onSubmit={handleSubmit}>
            <div className="form-field-group">
              <label htmlFor="auth-email-input">Email address</label>
              <div className="form-input-shell">
                <Mail size={16} className="input-affix-icon" />
                <input
                  id="auth-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-field-group">
              <div className="label-with-link-row">
                <label htmlFor="auth-pass-input">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    className="inline-link-btn"
                    onClick={() => {
                      if (!email) {
                        setFeedbackMessage({ text: 'Please enter your email above first.', type: 'error' });
                      } else {
                        setFeedbackMessage({ text: `Password reset link dispatched to ${email}`, type: 'success' });
                      }
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="form-input-shell">
                <Lock size={16} className="input-affix-icon" />
                <input
                  id="auth-pass-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {feedbackMessage.text && (
              <div className={`form-feedback-alert ${feedbackMessage.type}`} role="alert">
                <span>{feedbackMessage.text}</span>
              </div>
            )}

            <button type="submit" className="btn-primary-action" disabled={isSubmitting}>
              {isSubmitting ? 'Authenticating...' : mode === 'signin' ? 'Sign In to Dashboard' : 'Create Free Account'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Social Divider */}
          <div className="divider-label-row">
            <span>or continue with</span>
          </div>

          {/* OAuth Buttons */}
          <div className="oauth-buttons-row">
            <button type="button" className="oauth-btn" onClick={() => handleOAuth('google')}>
              <span className="google-color-g">G</span>
              <span>Google</span>
            </button>
            <button type="button" className="oauth-btn" onClick={() => handleOAuth('github')}>
              <Github size={17} />
              <span>GitHub</span>
            </button>
          </div>

          {/* Dedicated 1-Click Guest Preview Access Banner */}
          <div className="guest-preview-box">
            <div className="guest-preview-header">
              <span className="guest-status-dot" />
              <strong>Instant Guest Preview</strong>
            </div>
            <p className="guest-preview-desc">
              Explore all 10 milestones, interactive lessons, quizzes and AI paths with a pre-configured learner account.
            </p>
            <div className="guest-creds-strip">
              <span><code>{guestEmail}</code></span>
              <span className="cred-dot">•</span>
              <span><code>{guestPassword}</code></span>
            </div>
            <button type="button" className="btn-guest-enter" onClick={loginAsGuest}>
              <span>Enter Guest Workspace</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Bottom Switcher */}
          <div className="card-mode-switch-footer">
            {mode === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button type="button" className="switch-mode-btn" onClick={() => { setMode('signup'); setFeedbackMessage({ text: '', type: '' }); }}>
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button type="button" className="switch-mode-btn" onClick={() => { setMode('signin'); setFeedbackMessage({ text: '', type: '' }); }}>
                  Sign in
                </button>
              </p>
            )}
            <div className="backend-health-tag">
              <span className={`status-indicator-dot ${apiStatus === 'connected' ? 'is-connected' : 'is-offline'}`} />
              <span>{apiStatus === 'connected' ? 'Backend API Active' : 'Offline Mode (Guest Ready)'}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
