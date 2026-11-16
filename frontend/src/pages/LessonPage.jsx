import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft, BookOpen, Target, Layers, NotebookPen, CircleHelp,
  Check, Play, ArrowRight, Clock, Zap, Bookmark, FileText, Sparkles,
  RefreshCw, Lock, Lightbulb, Tv, Mail, Navigation, MessageSquare,
  HelpCircle, Eye, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function LessonPage() {
  const { currentRoute, navigate, selectedPath, paths, completedLessons, markLessonComplete, triggerToast } = useApp();

  const currentPath = selectedPath || paths[1]; // default to AI
  const modulesList = currentPath.modules || [];

  const moduleIndex = Math.min(modulesList.length - 1, Math.max(0, Number(currentRoute.query.module ?? 2))); // default to lesson 3 for instant preview
  const currentModule = modulesList[moduleIndex] || modulesList[0];

  // Learning Format Mode: 'reading' | 'visual' | 'video'
  const [learningMode, setLearningMode] = useState(() => {
    if (currentModule.type === 'Video') return 'video';
    if (currentModule.type === 'Visual') return 'visual';
    return 'reading';
  });

  // Sync mode when module changes
  useEffect(() => {
    if (currentModule.type === 'Video') setLearningMode('video');
    else if (currentModule.type === 'Visual') setLearningMode('visual');
    else setLearningMode('reading');
  }, [moduleIndex, currentModule.type]);

  // Active sub-tab below video
  const [activeTab, setActiveTab] = useState(currentRoute.query.tab || 'About'); // 'About' | 'Takeaways' | 'Resources' | 'Notes' | 'Quiz'

  // Visual example selection
  const [visualExample, setVisualExample] = useState('recommendation'); // 'recommendation' | 'spam' | 'routes'

  // Video playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Notes state
  const [noteContent, setNoteContent] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Load saved notes & quiz on module change
  useEffect(() => {
    const savedNote = localStorage.getItem(`teklozy-note-${moduleIndex}`) || '';
    setNoteContent(savedNote);
    setNoteSaved(Boolean(savedNote));

    const savedQuiz = localStorage.getItem(`teklozy-quiz-${moduleIndex}`);
    if (savedQuiz) {
      try {
        const parsed = JSON.parse(savedQuiz);
        setQuizAnswers(parsed.answers || {});
        setQuizSubmitted(true);
      } catch (e) {}
    } else {
      setQuizAnswers({});
      setQuizSubmitted(false);
    }
  }, [moduleIndex]);

  const handleSaveNote = () => {
    setNoteSaved(false);
    localStorage.setItem(`teklozy-note-${moduleIndex}`, noteContent);
    setNoteSaved(true);
    triggerToast('Notes saved successfully.');
  };

  const handleNextLesson = () => {
    markLessonComplete(moduleIndex);
    if (moduleIndex < modulesList.length - 1) {
      navigate('lesson', { module: moduleIndex + 1 });
    } else {
      triggerToast('Module 01 Complete! +125 XP added.');
      navigate(`path/${currentPath.id}`);
    }
  };

  const handlePrevLesson = () => {
    if (moduleIndex > 0) {
      navigate('lesson', { module: moduleIndex - 1 });
    }
  };

  const prevLesson = moduleIndex > 0 ? modulesList[moduleIndex - 1] : null;
  const nextLesson = moduleIndex < modulesList.length - 1 ? modulesList[moduleIndex + 1] : null;

  // Real world example data
  const exampleData = {
    recommendation: {
      title: 'Recommending Content',
      problem: {
        bubble: "There are too many shows. How do I find something I'll like?",
        brand: 'Netflix'
      },
      how: {
        bubble: 'Learns from what you watch, like and skip.'
      },
      result: {
        tag: 'Recommended for You',
        text: "Shows you content you'll likely enjoy."
      },
      bigIdea: 'AI turns large, complex tasks (like finding the right content) into simple, personalized results.'
    },
    spam: {
      title: 'Detecting Spam',
      problem: {
        bubble: 'Hundreds of suspicious phishing emails flood the inbox every hour.',
        brand: 'Gmail'
      },
      how: {
        bubble: 'Analyzes sender reputation, link signatures and semantic anomalies.'
      },
      result: {
        tag: 'Clean Inbox Guaranteed',
        text: 'Filters 99.9% of junk mail automatically before you see it.'
      },
      bigIdea: 'AI shields users from harm by spotting subtle anomalies that humans might easily overlook.'
    },
    routes: {
      title: 'Navigating Routes',
      problem: {
        bubble: 'An unexpected highway accident has caused severe delays ahead.',
        brand: 'Google Maps'
      },
      how: {
        bubble: 'Synthesizes real-time sensor speeds and vehicle movement trajectories.'
      },
      result: {
        tag: 'Fastest Reroute Found',
        text: 'Dynamically reroutes through alternate streets saving 24 minutes.'
      },
      bigIdea: 'AI continuously adapts to shifting real-world conditions faster than any static map.'
    }
  };

  const currentEx = exampleData[visualExample] || exampleData.recommendation;

  const progressPercent = Math.round(((completedLessons.length) / modulesList.length) * 100);

  return (
    <div className="lesson-experience-3col-shell">
      {/* =========================================================================
          COLUMN 1: LEFT SYLLABUS SIDEBAR
          ========================================================================= */}
      <aside className="lesson-sidebar-syllabus" aria-label="Module syllabus">
        <button
          className="syllabus-back-btn"
          onClick={() => navigate(`path/${currentPath.id}`)}
          title="Back to Module Overview"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="syllabus-module-meta">
          <span className="module-kicker">Module 01</span>
          <h2 className="module-title">Introduction to AI</h2>
          <div className="module-progress-line-row">
            <div className="progress-bar-rail">
              <div className="progress-bar-track" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="progress-pct-val">{progressPercent}%</span>
          </div>
        </div>

        <nav className="syllabus-lesson-items-list" aria-label="Module Lessons">
          {modulesList.map((m, idx) => {
            const isCompleted = completedLessons.includes(idx);
            const isCurrent = idx === moduleIndex;
            const isLocked = !isCompleted && !isCurrent;

            return (
              <button
                key={m.id || idx}
                className={`syllabus-lesson-row ${isCurrent ? 'is-active' : ''} ${isCompleted ? 'is-done' : ''} ${isLocked ? 'is-locked' : ''}`}
                onClick={() => navigate('lesson', { module: idx })}
                disabled={isLocked}
              >
                <div className="row-status-disc">
                  {isCompleted ? (
                    <span className="status-check-circle"><Check size={12} strokeWidth={3} /></span>
                  ) : isCurrent ? (
                    <span className="status-play-circle"><Play size={11} fill="currentColor" /></span>
                  ) : (
                    <span className="status-lock-circle"><Lock size={12} /></span>
                  )}
                </div>

                <div className="row-text-info">
                  <span className="row-lesson-name">{idx + 1}. {m.title}</span>
                  <span className="row-lesson-duration">{m.duration}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* =========================================================================
          COLUMN 2: CENTER LESSON STAGE
          ========================================================================= */}
      <main className="lesson-stage-center">
        {/* Lesson Heading Title */}
        <div className="lesson-title-area">
          <h1 className="lesson-primary-heading">{currentModule.title}</h1>
          <p className="lesson-secondary-lead">
            {learningMode === 'visual'
              ? 'AI was created to solve real-world problems that are too complex, repetitive or time-consuming for humans to handle efficiently.'
              : currentModule.desc}
          </p>
        </div>

        {/* -----------------------------------------------------------------
            VIEW 1: READING MODE (Matching Reference Image 1)
            ----------------------------------------------------------------- */}
        {learningMode === 'reading' && (
          <div className="reading-mode-content-stack">
            {/* The Problem Card */}
            <section className="learning-feature-card problem-card">
              <div className="card-illustration-pane">
                <div className="paper-stack-illustration" aria-hidden="true">
                  <div className="paper-sheet sheet-1" />
                  <div className="paper-sheet sheet-2" />
                  <div className="paper-sheet sheet-3" />
                  <div className="paper-sheet sheet-top">
                    <span className="doc-bar" />
                    <span className="doc-bar" />
                    <span className="doc-bar short" />
                  </div>
                </div>
              </div>

              <div className="card-copy-pane">
                <h2 className="card-block-title">The problem</h2>
                <ul className="bullet-feature-list">
                  <li>Huge amounts of data to work with</li>
                  <li>Repetitive and time-consuming tasks</li>
                  <li>Hard to make fast and accurate decisions</li>
                </ul>
              </div>
            </section>

            {/* The Solution: AI Card */}
            <section className="learning-feature-card solution-card">
              <div className="card-illustration-pane">
                <div className="laptop-ai-illustration" aria-hidden="true">
                  <div className="laptop-screen-frame">
                    <div className="laptop-screen-display">
                      <span className="ai-neon-logo">AI</span>
                    </div>
                  </div>
                  <div className="laptop-keyboard-base" />
                </div>
              </div>

              <div className="card-copy-pane">
                <h2 className="card-block-title">The solution: AI</h2>
                <p className="solution-lead-paragraph">
                  AI learns from data, automates work and finds patterns to help us make better decisions.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* -----------------------------------------------------------------
            VIEW 2: VISUAL LEARNING MODE (Matching Reference Image 2)
            ----------------------------------------------------------------- */}
        {learningMode === 'visual' && (
          <div className="visual-learning-content-stack">
            {/* Example Selection Selector */}
            <div className="visual-example-filter-bar">
              <span className="filter-prompt-label">Explore a real example:</span>
              <div className="filter-pill-buttons">
                <button
                  className={`example-pill-btn ${visualExample === 'recommendation' ? 'active' : ''}`}
                  onClick={() => setVisualExample('recommendation')}
                >
                  <Play size={12} fill="currentColor" />
                  <span>Recommending Content</span>
                </button>
                <button
                  className={`example-pill-btn ${visualExample === 'spam' ? 'active' : ''}`}
                  onClick={() => setVisualExample('spam')}
                >
                  <Mail size={12} />
                  <span>Detecting Spam</span>
                </button>
                <button
                  className={`example-pill-btn ${visualExample === 'routes' ? 'active' : ''}`}
                  onClick={() => setVisualExample('routes')}
                >
                  <Navigation size={12} />
                  <span>Navigating Routes</span>
                </button>
              </div>
            </div>

            {/* 3-Step Flow Diagram Card */}
            <div className="interactive-flow-diagram-card">
              <div className="flow-stages-grid">
                {/* Step 1: The Problem */}
                <div className="flow-stage-col problem-col">
                  <div className="stage-header-pill pill-purple">The Problem</div>
                  <div className="stage-scene-box">
                    <div className="thought-bubble-card">
                      <span className="bubble-text">"{currentEx.problem.bubble}"</span>
                    </div>
                    <div className="illustration-actor user-actor">
                      <div className="actor-avatar">👨‍💻</div>
                      <div className="actor-laptop">
                        <span className="laptop-brand-tag">{currentEx.problem.brand}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connecting Arrow */}
                <div className="flow-arrow-connector">
                  <ArrowRight size={22} className="arrow-svg" />
                </div>

                {/* Step 2: How AI Helps */}
                <div className="flow-stage-col ai-col">
                  <div className="stage-header-pill pill-blue">How AI Helps</div>
                  <div className="stage-scene-box">
                    <div className="robot-ai-avatar">
                      <div className="robot-head">
                        <div className="robot-antenna" />
                        <div className="robot-face">
                          <span className="robot-eye" />
                          <span className="robot-eye" />
                        </div>
                        <div className="robot-ai-chip">AI</div>
                      </div>
                    </div>
                    <p className="ai-mechanism-text">{currentEx.how.bubble}</p>
                  </div>
                </div>

                {/* Connecting Arrow */}
                <div className="flow-arrow-connector">
                  <ArrowRight size={22} className="arrow-svg" />
                </div>

                {/* Step 3: The Result */}
                <div className="flow-stage-col result-col">
                  <div className="stage-header-pill pill-green">The Result</div>
                  <div className="stage-scene-box">
                    <div className="result-display-tv">
                      <div className="tv-header-bar">{currentEx.result.tag}</div>
                      <div className="tv-screen-content">
                        <div className="tv-play-btn"><Play size={14} fill="currentColor" /></div>
                      </div>
                    </div>
                    <div className="result-check-row">
                      <CheckCircle2 size={16} className="green-check" />
                      <span>{currentEx.result.text}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Big Idea Mascot Callout */}
              <div className="mascot-big-idea-strip">
                <div className="mascot-fox-badge">
                  <div className="fox-ears">
                    <span className="ear-left" />
                    <span className="ear-right" />
                  </div>
                  <div className="fox-head">
                    <span className="fox-eye left" />
                    <span className="fox-eye right" />
                    <span className="fox-snout" />
                  </div>
                  <div className="fox-hoodie">T</div>
                </div>

                <div className="big-idea-text-box">
                  <div className="bulb-pill">
                    <Lightbulb size={14} className="bulb-icon" />
                    <strong>The big idea:</strong>
                  </div>
                  <p>{currentEx.bigIdea}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------
            VIEW 3: VIDEO LEARNING MODE (Matching Reference Image 3)
            ----------------------------------------------------------------- */}
        {learningMode === 'video' && (
          <div className="video-learning-content-stack">
            {/* 16:9 Video Player */}
            <div className="scenic-video-player-container">
              <div className="video-player-canvas">
                {/* Scenic Backdrop Artwork */}
                <img
                  src="/video-player-art.jpg"
                  alt="Lesson Video Preview"
                  className="video-backdrop-artwork"
                />

                {/* Central Play Trigger Button */}
                {!isPlaying && (
                  <button
                    className="video-center-orb-trigger"
                    onClick={() => setIsPlaying(true)}
                    aria-label="Play video"
                  >
                    <Play size={32} fill="currentColor" />
                  </button>
                )}

                {/* Custom Video Scrubber Bar */}
                <div className="video-custom-controls-overlay">
                  <button className="ctrl-action-btn" onClick={() => setIsPlaying(!isPlaying)}>
                    <Play size={15} fill="currentColor" />
                  </button>
                  <span className="ctrl-timestamp">0:00 / 6:24</span>
                  <div className="ctrl-scrubber-rail">
                    <div className="ctrl-scrubber-filled" style={{ width: isPlaying ? '35%' : '0%' }} />
                  </div>
                  <span className="ctrl-badge-pill">CC</span>
                  <span className="ctrl-badge-pill">1x</span>
                  <button className="ctrl-action-btn" title="Fullscreen">⛶</button>
                </div>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="video-subtabs-nav-bar" role="tablist">
              <button
                className={`tab-nav-btn ${activeTab === 'About' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('About')}
                role="tab"
              >
                <BookOpen size={14} />
                <span>About</span>
              </button>
              <button
                className={`tab-nav-btn ${activeTab === 'Takeaways' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('Takeaways')}
                role="tab"
              >
                <Target size={14} />
                <span>Key Takeaways</span>
              </button>
              <button
                className={`tab-nav-btn ${activeTab === 'Resources' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('Resources')}
                role="tab"
              >
                <Layers size={14} />
                <span>Resources</span>
              </button>
              <button
                className={`tab-nav-btn ${activeTab === 'Notes' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('Notes')}
                role="tab"
              >
                <NotebookPen size={14} />
                <span>Notes</span>
              </button>
              <button
                className={`tab-nav-btn ${activeTab === 'Quiz' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('Quiz')}
                role="tab"
              >
                <HelpCircle size={14} />
                <span>Quick Check</span>
              </button>
            </div>

            {/* Active Tab Panel Content */}
            <div className="video-tab-panel-display">
              {activeTab === 'About' && (
                <div className="about-tab-card-split">
                  <div className="about-copy-left">
                    <div className="about-target-heading">
                      <Target size={16} className="target-blue-icon" />
                      <h3>What you'll learn</h3>
                    </div>
                    <ul className="about-check-bullets">
                      <li>
                        <Check size={14} className="check-blue" />
                        <span>The idea behind intelligent machines.</span>
                      </li>
                      <li>
                        <Check size={14} className="check-blue" />
                        <span>Why this question started the AI journey.</span>
                      </li>
                      <li>
                        <Check size={14} className="check-blue" />
                        <span>How it connects to the rest of this module.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="about-mascot-right">
                    <div className="mascot-curious-avatar">
                      <div className="thinking-bubble-cloud">?</div>
                      <div className="mascot-fox-badge mini">
                        <div className="fox-head">
                          <span className="fox-eye left" />
                          <span className="fox-eye right" />
                          <span className="fox-snout" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Takeaways' && (
                <div className="takeaways-tab-display">
                  <ul className="takeaways-expanded-list">
                    <li><strong>Autonomous Generalization:</strong> AI systems detect patterns across multi-modal data.</li>
                    <li><strong>Algorithmic Efficiency:</strong> Complex queries that take hours are solved in milliseconds.</li>
                    <li><strong>Continuous Iteration:</strong> Models refine accuracy through backpropagation and feedback.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'Resources' && (
                <div className="resources-tab-display">
                  <div className="resource-link-row">
                    <FileText size={15} />
                    <div>
                      <strong>Lecture Notes: Foundations of Machine Learning</strong>
                      <small>PDF Document · 1.4 MB</small>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Notes' && (
                <div className="notes-tab-display">
                  <textarea
                    className="notes-textarea"
                    placeholder="Write private notes on this lesson... Automatically saved to your profile."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  />
                  <div className="notes-footer-action">
                    <button className="save-notes-btn" onClick={handleSaveNote}>
                      {noteSaved ? '✓ Saved' : 'Save Notes'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'Quiz' && (
                <div className="quiz-tab-display">
                  <div className="quiz-tab-card">
                    <div className="quiz-tab-card-header">
                      <div className="quiz-header-badge">
                        <Zap size={14} className="quick-bolt-icon" />
                        <span>Concept Checkpoint · +25 XP</span>
                      </div>
                    </div>
                    <h3 className="quiz-tab-q-title">Which problem is a good use for AI?</h3>
                    <p className="quiz-tab-q-sub">Select the scenario that best leverages machine intelligence and high-dimensional pattern recognition:</p>

                    <div className="quiz-tab-options-stack">
                      {[
                        { id: 'opt-a', text: 'Recommending content and shows by analyzing subtle behavioral patterns across millions of users', correct: true },
                        { id: 'opt-b', text: 'Typing an individual personal letter manually on a mechanical typewriter', correct: false },
                        { id: 'opt-c', text: 'Calculating simple static arithmetic (like 2 + 2) by hand with pencil and paper', correct: false }
                      ].map((opt) => {
                        const isChosen = quizAnswers[moduleIndex] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            className={`quiz-tab-option-btn ${isChosen ? (opt.correct ? 'is-correct' : 'is-wrong') : ''}`}
                            onClick={() => {
                              setQuizAnswers(prev => {
                                const next = { ...prev, [moduleIndex]: opt.id };
                                localStorage.setItem(`teklozy-quiz-${moduleIndex}`, JSON.stringify({ answers: next }));
                                return next;
                              });
                              setQuizSubmitted(true);
                              if (opt.correct) {
                                triggerToast('🎉 Correct! AI excels at large-scale pattern detection (+25 XP).');
                              }
                            }}
                          >
                            <span className="quiz-opt-radio">
                              {isChosen ? (opt.correct ? <Check size={12} strokeWidth={3} /> : '✕') : ''}
                            </span>
                            <span className="quiz-opt-text">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quizAnswers[moduleIndex] && (
                      <div className={`quiz-tab-explanation ${quizAnswers[moduleIndex] === 'opt-a' ? 'is-success' : 'is-error'}`}>
                        {quizAnswers[moduleIndex] === 'opt-a' ? (
                          <p>
                            <strong>✓ Spot on!</strong> AI thrives at identifying subtle preferences, habits, and latent relationships across massive multi-dimensional datasets that humans could never process manually.
                          </p>
                        ) : (
                          <p>
                            <strong>✗ Not quite.</strong> That scenario represents simple mechanical repetition or straightforward arithmetic. AI is specifically designed for complex, high-scale pattern recognition and adaptive decision making.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------
            BOTTOM NAVIGATION BAR (Matching Reference Designs)
            ----------------------------------------------------------------- */}
        <footer className="lesson-stage-footer-nav">
          {prevLesson ? (
            <button className="btn-nav-prev" onClick={handlePrevLesson}>
              <ChevronLeft size={16} />
              <span>Previous: {prevLesson.title.split('—')[0].trim()}</span>
            </button>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <button className="btn-nav-next" onClick={handleNextLesson}>
              <span>Next: {nextLesson.title.split('—')[0].trim()}</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn-nav-next finish-btn" onClick={handleNextLesson}>
              <span>Complete Module 01</span>
              <Check size={16} strokeWidth={3} />
            </button>
          )}
        </footer>
      </main>

      {/* =========================================================================
          COLUMN 3: RIGHT INSIGHTS SIDEBAR (Streamlined - No Duplicate Content)
          ========================================================================= */}
      <aside className="lesson-sidebar-insights" aria-label="Lesson insights and progress">
        {/* Real-World Examples */}
        <section className="insight-card examples-card">
          <div className="examples-header-row">
            <Layers size={16} className="box-blue-icon" />
            <h3>Real-World Examples</h3>
          </div>

          <div className="examples-brand-grid">
            <div className="brand-example-item">
              <div className="brand-logo-badge brand-netflix">N</div>
              <strong>Netflix</strong>
              <small>Recommends shows you'll like.</small>
            </div>

            <div className="brand-example-item">
              <div className="brand-logo-badge brand-maps">📍</div>
              <strong>Maps</strong>
              <small>Finds the fastest route for you.</small>
            </div>

            <div className="brand-example-item">
              <div className="brand-logo-badge brand-chatgpt">🤖</div>
              <strong>Chatbots</strong>
              <small>Answers your questions instantly.</small>
            </div>
          </div>
        </section>

        {/* Up Next in this Module (For Video View) */}
        {learningMode === 'video' && (
          <section className="insight-card up-next-card">
            <div className="card-top-header">
              <h3>Up Next in this Module</h3>
            </div>
            <div className="up-next-items-list">
              {modulesList.slice(moduleIndex + 1).map((nextMod, i) => (
                <div key={nextMod.id || i} className="up-next-row">
                  <div className="up-next-left">
                    <Lock size={13} className="lock-subtle" />
                    <span>{moduleIndex + 2 + i}. {nextMod.title.split('—')[0].trim()}</span>
                  </div>
                  <span className="up-next-duration">{nextMod.duration}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>
    </div>
  );
}
