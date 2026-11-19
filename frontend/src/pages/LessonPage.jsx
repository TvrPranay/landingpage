import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft, BookOpen, Target, Layers, NotebookPen, CircleHelp,
  Check, Play, Pause, ArrowRight, Clock, Zap, Bookmark, FileText, Sparkles,
  RefreshCw, Lock, Lightbulb, Tv, Mail, Navigation, MessageSquare,
  HelpCircle, Eye, CheckCircle2, ChevronRight, Volume2, VolumeX, Maximize2,
  Subtitles, Download, ExternalLink, Award
} from 'lucide-react';

// Timed captions for educational video lessons
const LESSON_CAPTIONS = {
  0: [
    { start: 0, end: 5, text: "Welcome to Introduction to AI: Why Are We Building Machines That Can Think?" },
    { start: 5, end: 12, text: "For centuries, computers followed strict, deterministic rules written by human programmers." },
    { start: 12, end: 20, text: "Traditional code can calculate formulas, but it struggles with perception, speech, and reasoning." },
    { start: 20, end: 30, text: "Machine learning flips this paradigm: instead of coding the rules, we train algorithms on real-world data." },
    { start: 30, end: 42, text: "By minimizing error through loss functions, neural networks learn to recognize subtle multidimensional patterns." },
    { start: 42, end: 55, text: "Today, intelligence powers recommendation systems, autonomous vehicles, and generative AI agents." },
    { start: 55, end: 68, text: "In this module, you will master the foundational principles that allow models to generalize and reason." }
  ],
  4: [
    { start: 0, end: 6, text: "How Does AI Actually Learn? Understanding Training, Weights, and Gradient Descent." },
    { start: 6, end: 14, text: "A model begins with randomized numerical weights across its interconnected network layers." },
    { start: 14, end: 24, text: "During forward propagation, input data flows through the layers to generate a preliminary prediction." },
    { start: 24, end: 35, text: "A loss function calculates the mathematical delta between the prediction and the ground truth." },
    { start: 35, end: 48, text: "Backpropagation uses calculus and gradient descent to nudge each weight in the optimal direction." },
    { start: 48, end: 60, text: "Repeating this process over thousands of epochs is what enables models to reach production-grade accuracy." }
  ]
};

// Curated quiz bank per module
const MODULE_QUIZZES = {
  0: {
    question: "What is the primary difference between traditional software and machine learning?",
    options: [
      { id: 'a', text: "Traditional software uses hardcoded human rules; machine learning learns mathematical patterns from data.", correct: true },
      { id: 'b', text: "Traditional software is slower and only works on mainframe computers.", correct: false },
      { id: 'c', text: "Machine learning does not require computer hardware or processors.", correct: false },
      { id: 'd', text: "There is no difference; they are identical programming techniques.", correct: false }
    ],
    explanation: "Traditional software requires humans to specify every condition manually. Machine learning extracts rules automatically by training numerical models on datasets."
  },
  1: {
    question: "Which of the following best defines artificial intelligence in modern technology?",
    options: [
      { id: 'a', text: "Systems capable of performing tasks that historically required human cognition, such as visual recognition and reasoning.", correct: true },
      { id: 'b', text: "A computer program that simply executes static SQL queries.", correct: false },
      { id: 'c', text: "A hardware device that increases internet bandwidth.", correct: false }
    ],
    explanation: "AI encompasses algorithms and systems designed to mimic, augment, and automate cognitive capabilities like pattern perception and decision-making."
  },
  2: {
    question: "Why does AI exist as a distinct engineering discipline?",
    options: [
      { id: 'a', text: "To automate complex, high-dimensional problems that are too intricate for static heuristic rules.", correct: true },
      { id: 'b', text: "To replace human memory with simple spreadsheet calculators.", correct: false },
      { id: 'c', text: "To render web page HTML buttons faster.", correct: false }
    ],
    explanation: "Real-world phenomena (like natural language, medical imaging, and driving) contain millions of variables that cannot be captured with manual if-else statements."
  },
  3: {
    question: "Which everyday service heavily relies on machine learning recommendation engines?",
    options: [
      { id: 'a', text: "Streaming platforms like Netflix and Spotify that analyze behavioral vectors to suggest content.", correct: true },
      { id: 'b', text: "A standard digital desk alarm clock.", correct: false },
      { id: 'c', text: "A basic offline text notepad.", correct: false }
    ],
    explanation: "Recommendation systems utilize collaborative filtering and embeddings to model personal tastes and predict future engagement."
  },
  4: {
    question: "How do neural networks iteratively refine their accuracy during training?",
    options: [
      { id: 'a', text: "Through backpropagation and gradient descent, which adjust model weights to minimize the loss function.", correct: true },
      { id: 'b', text: "By randomly rebooting the operating system whenever an error occurs.", correct: false },
      { id: 'c', text: "By rewriting the computer's CPU firmware.", correct: false }
    ],
    explanation: "Gradient descent computes partial derivatives with respect to weights, adjusting parameters in the direction of steepest descent to minimize loss."
  }
};

export default function LessonPage() {
  const { currentRoute, navigate, selectedPath, paths, completedLessons, markLessonComplete, triggerToast, awardXp } = useApp();

  const routePathSlug = currentRoute.path.split('/')[1];
  const currentPath = paths.find(p => p.id === routePathSlug) || selectedPath || paths[1];
  const modulesList = currentPath.modules || [];

  const rawModule = Number(currentRoute.query.module ?? 0);
  const moduleIndex = Math.min(modulesList.length - 1, Math.max(0, isNaN(rawModule) ? 0 : rawModule));
  const currentModule = modulesList[moduleIndex] || modulesList[0];

  const isVideoModule = currentModule.type === 'Video';

  // Active tab state: 'About' | 'Takeaways' | 'Resources' | 'Notes' | 'Quiz'
  const [activeTab, setActiveTab] = useState(currentRoute.query.tab || 'About');

  // Video playback engine state
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(384); // 6:24 default
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [currentCaption, setCurrentCaption] = useState('');

  // Notes state
  const [noteContent, setNoteContent] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  // Quiz state
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScoreAwarded, setQuizScoreAwarded] = useState(false);

  // Load saved notes and quiz state on module change
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);

    const savedNote = localStorage.getItem(`teklozy-note-${currentPath.id}-${moduleIndex}`) || '';
    setNoteContent(savedNote);
    setNoteSaved(Boolean(savedNote));

    const savedQuiz = localStorage.getItem(`teklozy-quiz-${currentPath.id}-${moduleIndex}`);
    if (savedQuiz) {
      try {
        const parsed = JSON.parse(savedQuiz);
        setSelectedQuizOption(parsed.selectedOption);
        setQuizSubmitted(true);
      } catch (e) {}
    } else {
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
    }
  }, [moduleIndex, currentPath.id]);

  // Timed captions tracker
  useEffect(() => {
    if (!isVideoModule || !subtitlesEnabled) {
      setCurrentCaption('');
      return;
    }
    const captions = LESSON_CAPTIONS[moduleIndex] || LESSON_CAPTIONS[0];
    const match = captions.find(c => currentTime >= c.start && currentTime <= c.end);
    setCurrentCaption(match ? match.text : '');
  }, [currentTime, moduleIndex, isVideoModule, subtitlesEnabled]);

  // Video playback time updater
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackSpeed]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(duration, Math.round(pos * duration)));
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSaveNote = () => {
    localStorage.setItem(`teklozy-note-${currentPath.id}-${moduleIndex}`, noteContent);
    setNoteSaved(true);
    triggerToast('Notes saved successfully.');
  };

  const currentQuiz = MODULE_QUIZZES[moduleIndex] || MODULE_QUIZZES[0];

  const handleQuizSubmit = () => {
    if (!selectedQuizOption) {
      triggerToast('Please select an option first.');
      return;
    }
    setQuizSubmitted(true);
    localStorage.setItem(
      `teklozy-quiz-${currentPath.id}-${moduleIndex}`,
      JSON.stringify({ selectedOption: selectedQuizOption })
    );

    const chosen = currentQuiz.options.find(o => o.id === selectedQuizOption);
    if (chosen?.correct) {
      if (!quizScoreAwarded) {
        awardXp(50);
        setQuizScoreAwarded(true);
      }
      triggerToast('🎉 Correct answer! +50 XP awarded.');
    } else {
      triggerToast('Incorrect. Review the explanation and try again.');
    }
  };

  const handleNextLesson = () => {
    markLessonComplete(moduleIndex);
    if (moduleIndex < modulesList.length - 1) {
      navigate('lesson', { module: moduleIndex + 1, tab: 'About' });
    } else {
      triggerToast('🎉 Level 1 Complete! Ascending to Level 2: Learn Basics!');
      navigate('level/2');
    }
  };

  const handlePrevLesson = () => {
    if (moduleIndex > 0) {
      navigate('lesson', { module: moduleIndex - 1, tab: 'About' });
    }
  };

  const progressPercent = Math.round((completedLessons.length / modulesList.length) * 100);

  return (
    <div className="lesson-focused-studio-shell">
      {/* Top Studio Bar */}
      <header className="lesson-studio-topbar">
        <div className="studio-topbar-left">
          <button className="btn-studio-back" onClick={() => navigate(`path/${currentPath.id}`)} title="Back to Path Overview">
            <ChevronLeft size={16} />
            <span>{currentPath.name} Path</span>
          </button>
          <span className="studio-divider">/</span>
          <span className="studio-current-crumb">Module {moduleIndex + 1}: {currentModule.title}</span>
        </div>

        <div className="studio-topbar-right">
          <span className="studio-progress-pill">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span>{completedLessons.length} of {modulesList.length} Complete ({progressPercent}%)</span>
          </span>
          <span className="studio-xp-tag">+{currentModule.xp || 125} XP</span>
        </div>
      </header>

      {/* Main Studio Workspace Grid */}
      <div className="lesson-studio-main-grid">
        {/* LEFT COLUMN: Module Drawer Navigation */}
        <aside className="lesson-module-nav-drawer" aria-label="Course Modules Navigation">
          <div className="module-nav-header">
            <span className="module-nav-kicker">LEVEL 1 · FOUNDATIONS</span>
            <h3>{currentPath.title}</h3>
            <div className="module-track-progress-bar">
              <div className="module-track-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="module-nav-items-list" role="list">
            {modulesList.map((mod, idx) => {
              const isCompleted = completedLessons.includes(idx);
              const isActive = idx === moduleIndex;

              return (
                <button
                  key={mod.id || idx}
                  className={`module-nav-item-btn ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}`}
                  onClick={() => navigate('lesson', { module: idx, tab: activeTab })}
                  role="listitem"
                >
                  <div className="nav-item-status-icon">
                    {isCompleted ? (
                      <Check size={14} className="text-emerald-400" strokeWidth={3} />
                    ) : isActive ? (
                      <Play size={12} className="text-blue-400" fill="currentColor" />
                    ) : (
                      <span className="nav-item-number">{idx + 1}</span>
                    )}
                  </div>
                  <div className="nav-item-copy">
                    <span className="nav-item-title">{mod.title}</span>
                    <span className="nav-item-meta">{mod.duration} • {mod.type}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* CENTER COLUMN: Interactive Player & Lesson Content */}
        <main className="lesson-content-central-stage">
          {/* Lesson Header Title */}
          <div className="lesson-hero-header">
            <div className="lesson-eyebrow-row">
              <span className="lesson-format-badge">
                {currentModule.type === 'Video' ? <Tv size={12} /> : currentModule.type === 'Visual' ? <Sparkles size={12} /> : <BookOpen size={12} />}
                <span>{currentModule.type} Masterclass</span>
              </span>
              <span className="lesson-duration-badge"><Clock size={12} /> {currentModule.duration}</span>
            </div>
            <h1 className="lesson-h1-title">{currentModule.title}</h1>
            <p className="lesson-lead-desc">{currentModule.desc}</p>
          </div>

          {/* MEDIA PLAYER SECTION */}
          {isVideoModule ? (
            <div className="lesson-video-player-frame">
              <div className="video-player-aspect-box">
                {/* Real HTML5 Video Element with Fallback Poster */}
                <video
                  ref={videoRef}
                  className="lesson-html5-video"
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  poster="/video-player-art.jpg"
                  onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.target.duration || 384)}
                  onEnded={() => setIsPlaying(false)}
                  muted={isMuted}
                  playsInline
                />

                {/* Big Center Play Trigger (when paused) */}
                {!isPlaying && (
                  <button className="video-center-glow-play" onClick={togglePlay} aria-label="Play Lesson Video">
                    <Play size={36} fill="currentColor" />
                  </button>
                )}

                {/* Subtitles Overlay (ONLY FOR VIDEO) */}
                {subtitlesEnabled && currentCaption && (
                  <div className="video-subtitles-caption-banner" role="status" aria-live="polite">
                    <span>{currentCaption}</span>
                  </div>
                )}

                {/* Custom Interactive Player Controls */}
                <div className="video-controls-bottom-bar">
                  <button className="ctrl-btn" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
                    {isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
                  </button>

                  <button className="ctrl-btn" onClick={() => setIsMuted(!isMuted)} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                    {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                  </button>

                  <span className="ctrl-timer">{formatTime(currentTime)} / {formatTime(duration)}</span>

                  {/* Interactive Scrubber Rail */}
                  <div className="ctrl-scrubber-container" onClick={handleSeek} role="slider" aria-valuenow={currentTime} aria-valuemax={duration}>
                    <div className="ctrl-scrubber-track">
                      <div className="ctrl-scrubber-progress" style={{ width: `${(currentTime / duration) * 100}%` }}>
                        <div className="ctrl-scrubber-thumb" />
                      </div>
                    </div>
                  </div>

                  {/* Subtitles Toggle Button (Video Only) */}
                  <button
                    className={`ctrl-pill-toggle ${subtitlesEnabled ? 'is-active' : ''}`}
                    onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                    title="Toggle Subtitles"
                  >
                    <Subtitles size={14} />
                    <span>CC</span>
                  </button>

                  {/* Speed Selector */}
                  <button className="ctrl-pill-toggle" onClick={cycleSpeed} title="Playback Speed">
                    <span>{playbackSpeed}x</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Visual / Concept Interactive Reading View */
            <div className="lesson-reading-card-frame">
              <div className="reading-interactive-hero">
                <div className="reading-hero-icon">
                  <Sparkles size={32} className="text-blue-400" />
                </div>
                <div>
                  <h3>Interactive Deep-Dive: Core Technical Concepts</h3>
                  <p>Read through the architectural principles, examine real-world examples, and test your retention below.</p>
                </div>
              </div>
            </div>
          )}

          {/* LESSON NAVIGATION TABS */}
          <div className="lesson-tabs-container">
            <div className="lesson-tabs-nav-bar" role="tablist">
              <button className={`lesson-tab-btn ${activeTab === 'About' ? 'is-active' : ''}`} onClick={() => setActiveTab('About')}>
                <Target size={15} />
                <span>About</span>
              </button>
              <button className={`lesson-tab-btn ${activeTab === 'Takeaways' ? 'is-active' : ''}`} onClick={() => setActiveTab('Takeaways')}>
                <CheckCircle2 size={15} />
                <span>Key Takeaways</span>
              </button>
              <button className={`lesson-tab-btn ${activeTab === 'Resources' ? 'is-active' : ''}`} onClick={() => setActiveTab('Resources')}>
                <FileText size={15} />
                <span>Resources</span>
              </button>
              <button className={`lesson-tab-btn ${activeTab === 'Notes' ? 'is-active' : ''}`} onClick={() => setActiveTab('Notes')}>
                <NotebookPen size={15} />
                <span>Notes</span>
              </button>
              <button className={`lesson-tab-btn ${activeTab === 'Quiz' ? 'is-active' : ''}`} onClick={() => setActiveTab('Quiz')}>
                <HelpCircle size={15} />
                <span>Quiz & Checkpoint</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="lesson-tab-panel-viewport">
              {/* 1. ABOUT TAB */}
              {activeTab === 'About' && (
                <div className="tab-pane-content pane-about">
                  <h3>Learning Objectives</h3>
                  <ul className="learning-objectives-checklist">
                    <li><Check size={16} className="text-emerald-400" /><span>Understand why classical imperative programming falls short on non-deterministic data.</span></li>
                    <li><Check size={16} className="text-emerald-400" /><span>Grasp the mathematical foundation of loss optimization and parameter updates.</span></li>
                    <li><Check size={16} className="text-emerald-400" /><span>Connect conceptual machine intelligence models to modern engineering pipelines.</span></li>
                  </ul>
                  <div className="about-context-callout">
                    <Lightbulb size={18} className="text-amber-400" />
                    <p><strong>Pro-Tip:</strong> Machine learning does not replace software architecture; it introduces dynamic probabilistic components into existing distributed architectures.</p>
                  </div>
                </div>
              )}

              {/* 2. KEY TAKEAWAYS */}
              {activeTab === 'Takeaways' && (
                <div className="tab-pane-content pane-takeaways">
                  <div className="takeaways-grid-cards">
                    <div className="takeaway-card">
                      <div className="takeaway-num">01</div>
                      <h4>Pattern Recognition</h4>
                      <p>Models discover statistical regularities across millions of inputs, allowing them to generalize to unseen test data.</p>
                    </div>
                    <div className="takeaway-card">
                      <div className="takeaway-num">02</div>
                      <h4>Loss & Optimization</h4>
                      <p>Training is an iterative mathematical search through weight space using gradient vectors to find optimal minima.</p>
                    </div>
                    <div className="takeaway-card">
                      <div className="takeaway-num">03</div>
                      <h4>Continuous Iteration</h4>
                      <p>Unlike static code that never changes once compiled, AI systems adapt continuously as new data distributions emerge.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. RESOURCES TAB */}
              {activeTab === 'Resources' && (
                <div className="tab-pane-content pane-resources">
                  <div className="resources-downloads-list">
                    <a className="resource-download-row" href="#/resources" onClick={(e) => { e.preventDefault(); triggerToast('Downloading module reference cheatsheet (PDF)...'); }}>
                      <div className="res-icon-wrap"><FileText size={18} /></div>
                      <div className="res-meta-col">
                        <strong>Official Module Cheat Sheet & Summary</strong>
                        <span>PDF Reference Guide • 2.4 MB</span>
                      </div>
                      <Download size={16} className="text-blue-400" />
                    </a>
                    <a className="resource-download-row" href="https://github.com" target="_blank" rel="noopener noreferrer">
                      <div className="res-icon-wrap"><ExternalLink size={18} /></div>
                      <div className="res-meta-col">
                        <strong>Interactive Jupyter Notebook Playground</strong>
                        <span>GitHub Repository • Open Source Code</span>
                      </div>
                      <ExternalLink size={16} className="text-blue-400" />
                    </a>
                  </div>
                </div>
              )}

              {/* 4. NOTES TAB */}
              {activeTab === 'Notes' && (
                <div className="tab-pane-content pane-notes">
                  <div className="notes-editor-card">
                    <div className="notes-card-header">
                      <span>Personal Learning Scratchpad</span>
                      {noteSaved && <span className="notes-saved-indicator"><Check size={13} /> Saved in local storage</span>}
                    </div>
                    <textarea
                      className="notes-custom-textarea"
                      placeholder="Type your notes here... Key equations, architectural ideas, or questions for mentors."
                      value={noteContent}
                      onChange={(e) => {
                        setNoteContent(e.target.value);
                        setNoteSaved(false);
                      }}
                    />
                    <div className="notes-actions-bar">
                      <button className="btn-save-notes" onClick={handleSaveNote}>
                        <Bookmark size={14} />
                        <span>Save Notes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. QUIZ TAB */}
              {activeTab === 'Quiz' && (
                <div className="tab-pane-content pane-quiz">
                  <div className="quiz-interactive-card">
                    <div className="quiz-card-top-tag">
                      <Zap size={14} className="text-amber-400" />
                      <span>Knowledge Checkpoint • +50 XP</span>
                    </div>

                    <h3 className="quiz-question-heading">{currentQuiz.question}</h3>

                    <div className="quiz-options-container">
                      {currentQuiz.options.map((opt) => {
                        const isSelected = selectedQuizOption === opt.id;
                        let optionClass = 'quiz-option-choice';
                        if (quizSubmitted) {
                          if (opt.correct) optionClass += ' is-correct-answer';
                          else if (isSelected && !opt.correct) optionClass += ' is-wrong-answer';
                        } else if (isSelected) {
                          optionClass += ' is-selected';
                        }

                        return (
                          <button
                            key={opt.id}
                            className={optionClass}
                            onClick={() => !quizSubmitted && setSelectedQuizOption(opt.id)}
                            disabled={quizSubmitted}
                          >
                            <span className="quiz-radio-indicator">
                              {quizSubmitted && opt.correct ? (
                                <Check size={14} strokeWidth={3} className="text-white" />
                              ) : quizSubmitted && isSelected && !opt.correct ? (
                                '✕'
                              ) : isSelected ? (
                                '●'
                              ) : null}
                            </span>
                            <span className="quiz-option-text">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {!quizSubmitted ? (
                      <button className="btn-submit-quiz" onClick={handleQuizSubmit}>
                        <span>Submit Answer</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <div className="quiz-explanation-box">
                        <div className="explanation-title">
                          <CheckCircle2 size={16} className="text-emerald-400" />
                          <span>Concept Explanation</span>
                        </div>
                        <p>{currentQuiz.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Next/Prev Pagination Controls */}
          <div className="lesson-bottom-stepper-bar">
            <button
              className="btn-stepper-prev"
              onClick={handlePrevLesson}
              disabled={moduleIndex === 0}
            >
              <ChevronLeft size={16} />
              <span>Previous Lesson</span>
            </button>

            <button className="btn-stepper-next" onClick={handleNextLesson}>
              <span>{moduleIndex === modulesList.length - 1 ? 'Complete Level 1 & Ascend' : 'Complete & Continue Next'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
