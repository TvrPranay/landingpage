import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useApp } from '../context/AppContext';
import {
  Play, Send, CheckCircle2, XCircle, AlertCircle, Clock, Zap,
  Sparkles, Terminal, FileCode, RotateCcw, ChevronDown, ChevronRight,
  PanelRightClose, PanelRightOpen, ShieldAlert, BookOpen, Layers,
  Trash2, Square, Lock, HelpCircle, Lightbulb, MessageSquare
} from 'lucide-react';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname || 'localhost';
    return `${window.location.protocol}//${host}:8000`;
  }
  return 'http://localhost:8000';
};
const API = getApiUrl();

export default function CodeLabPage() {
  const { xp, awardXp, triggerToast } = useApp();

  // Active Mode: 'playground' or challenge ID
  const [activeMode, setActiveMode] = useState('target-sum');
  const [challenges, setChallenges] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);

  // Language state
  const [language, setLanguage] = useState('python');

  // Files state
  const [activeFile, setActiveFile] = useState('solution.py');
  const [code, setCode] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Terminal & Execution State
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'system', text: 'Teklozy CodeLab Terminal v1.0.0 [Isolated Sandbox Ready]' },
    { type: 'info', text: 'Python 3.11.9 runtime loaded. Write your code and click "Run Code" (or press Ctrl+Enter).' }
  ]);
  const [stdinInput, setStdinInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionStats, setExecutionStats] = useState(null);
  const [lastErrorContext, setLastErrorContext] = useState('');

  // AI Mentor State
  const [aiMentorOpen, setAiMentorOpen] = useState(true);
  const [mentorMessages, setMentorMessages] = useState([
    {
      role: 'assistant',
      text: "👋 Hi! I'm your **Teklozy AI Mentor**.\n\nMy role is to guide you, ask thoughtful questions and explain concepts — **not** to write code for you. You'll build the muscle memory and logic yourself!\n\nStuck on something? Ask for a hint or click **Explain Runtime Error** whenever you hit a bug.",
      hintLevel: 1,
      suggestions: [
        'Give me a conceptual hint',
        'What data structure fits best?',
        'How should I approach this problem?'
      ]
    }
  ]);
  const [mentorPrompt, setMentorPrompt] = useState('');
  const [mentorLoading, setMentorLoading] = useState(false);
  const [currentHintLevel, setCurrentHintLevel] = useState(1);

  // Challenge test results modal / panel
  const [testResults, setTestResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Anti-paste deterrence modal
  const [pasteWarningOpen, setPasteWarningOpen] = useState(false);

  // Problem description panel open
  const [problemPanelOpen, setProblemPanelOpen] = useState(true);

  // Terminal bottom sheet height state
  const [terminalExpanded, setTerminalExpanded] = useState(false);
  const [activeTerminalTab, setActiveTerminalTab] = useState('terminal');

  const editorRef = useRef(null);
  const terminalEndRef = useRef(null);
  const chatEndRef = useRef(null);

  // Fetch challenges on mount
  useEffect(() => {
    async function loadChallenges() {
      try {
        const res = await fetch(`${API}/api/codelab/challenges`);
        if (res.ok) {
          const data = await res.json();
          setChallenges(data.challenges || []);
          if (data.challenges.length > 0) {
            const first = data.challenges[0];
            setActiveChallenge(first);
            setActiveMode(first.id);
            loadCodeForTarget(first.id, first.starter_code);
          }
        }
      } catch (err) {
        console.warn('Using offline challenge set:', err);
      }
    }
    loadChallenges();
  }, []);

  // Load code from localStorage
  const loadCodeForTarget = (targetId, fallbackCode = '') => {
    const saved = localStorage.getItem(`teklozy-codelab-${targetId}`);
    if (saved) {
      setCode(saved);
    } else {
      setCode(fallbackCode || '# Write your Python program here\nprint("Hello, Teklozy CodeLab!")\n');
    }
    setHasUnsavedChanges(false);
  };

  // Handle challenge switch
  const handleSelectChallenge = (chId) => {
    if (chId === 'playground') {
      setActiveMode('playground');
      setActiveChallenge(null);
      loadCodeForTarget('playground', '# Freeform Python Playground\ndef main():\n    print("Welcome to your sandbox playground!")\n\nif __name__ == "__main__":\n    main()\n');
    } else {
      const ch = challenges.find(c => c.id === chId);
      if (ch) {
        setActiveMode(ch.id);
        setActiveChallenge(ch);
        loadCodeForTarget(ch.id, ch.starter_code);
      }
    }
    setTestResults(null);
  };

  // Autosave code to localStorage on change
  const handleCodeChange = (newVal) => {
    const value = newVal || '';
    setCode(value);
    setHasUnsavedChanges(true);
    localStorage.setItem(`teklozy-codelab-${activeMode}`, value);
  };

  // Manual save
  const handleSave = async () => {
    localStorage.setItem(`teklozy-codelab-${activeMode}`, code);
    setHasUnsavedChanges(false);
    triggerToast('Code saved successfully.');
    try {
      await fetch(`${API}/api/codelab/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1,
          file_key: `${activeMode}_${activeFile}`,
          code: code,
          language: language
        })
      });
    } catch (e) {}
  };

  // Reset code to default starter
  const handleResetCode = () => {
    if (activeChallenge) {
      setCode(activeChallenge.starter_code);
      localStorage.setItem(`teklozy-codelab-${activeMode}`, activeChallenge.starter_code);
    } else {
      const defaultPlayground = '# Freeform Python Playground\nprint("Hello, Teklozy CodeLab!")\n';
      setCode(defaultPlayground);
      localStorage.setItem(`teklozy-codelab-playground`, defaultPlayground);
    }
    setHasUnsavedChanges(false);
    triggerToast('Editor reset to original starter template.');
  };

  // Run Code in isolated Sandbox
  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setTerminalOutput(prev => [
      ...prev,
      { type: 'command', text: `$ python ${activeFile}` }
    ]);

    try {
      const res = await fetch(`${API}/api/codelab/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          stdin: stdinInput,
          timeout: 4.0
        })
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      setExecutionStats({
        timeMs: data.execution_time_ms,
        exitCode: data.exit_code,
        timedOut: data.timed_out
      });

      if (data.stdout) {
        setTerminalOutput(prev => [...prev, { type: 'stdout', text: data.stdout }]);
      }

      if (data.stderr) {
        setTerminalOutput(prev => [...prev, { type: 'stderr', text: data.stderr }]);
        setLastErrorContext(data.stderr);
      } else {
        setLastErrorContext('');
      }

      if (data.timed_out) {
        setTerminalOutput(prev => [
          ...prev,
          { type: 'error', text: 'Process terminated: Maximum execution time (4.0s) exceeded.' }
        ]);
      } else if (data.exit_code === 0) {
        setTerminalOutput(prev => [
          ...prev,
          { type: 'success', text: `\n[Process completed successfully in ${data.execution_time_ms} ms]` }
        ]);
      } else {
        setTerminalOutput(prev => [
          ...prev,
          { type: 'error', text: `\n[Process exited with non-zero code ${data.exit_code}]` }
        ]);
      }

    } catch (err) {
      setTerminalOutput(prev => [
        ...prev,
        { type: 'error', text: `Execution failed: ${err.message}. Is backend running on port 8000?` }
      ]);
    } finally {
      setIsRunning(false);
      setTimeout(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  // Submit Challenge Solution against hidden test suite
  const handleSubmitChallenge = async () => {
    if (!activeChallenge || submitting) return;
    setSubmitting(true);
    setTestResults(null);

    try {
      const res = await fetch(`${API}/api/codelab/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_id: activeChallenge.id,
          code: code,
          user_id: 1
        })
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setTestResults(data);
      setActiveTerminalTab('tests');
      setTerminalExpanded(true);

      if (data.all_passed) {
        awardXp(data.xp_awarded || 150);
        triggerToast(`🎉 Challenge Accepted! +${data.xp_awarded || 150} XP added to your summit ascent!`);
      } else {
        triggerToast(`Test failed: ${data.passed_count}/${data.total_tests} passed. Ask AI Mentor for hints!`);
      }
    } catch (err) {
      triggerToast(`Submission error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Send query to AI Mentor
  const handleSendToMentor = async (queryText) => {
    const textToSend = queryText || mentorPrompt;
    if (!textToSend.trim() || mentorLoading) return;

    const userMsg = { role: 'user', text: textToSend };
    setMentorMessages(prev => [...prev, userMsg]);
    setMentorPrompt('');
    setMentorLoading(true);

    try {
      const res = await fetch(`${API}/api/codelab/mentor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          code: code,
          error_context: lastErrorContext,
          hint_level: currentHintLevel,
          challenge_id: activeChallenge?.id
        })
      });

      if (!res.ok) throw new Error('Mentor API error');
      const data = await res.json();

      setMentorMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: data.message,
          hintLevel: data.hint_level,
          suggestions: data.suggested_questions || []
        }
      ]);

      if (data.hint_level) {
        setCurrentHintLevel(data.hint_level);
      }
    } catch (e) {
      setMentorMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "I'm having trouble connecting to the mentor service right now, but remember: break the problem down into smaller steps and verify your data inputs line by line!",
          hintLevel: currentHintLevel,
          suggestions: ['Explain how to read input properly', 'What is an array complement?']
        }
      ]);
    } finally {
      setMentorLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  // Keyboard shortcut Ctrl+Enter to run & Global paste deterrence
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
        setPasteWarningOpen(true);
      }
    };
    const handlePaste = (e) => {
      setPasteWarningOpen(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('paste', handlePaste);
    };
  }, [code, stdinInput, isRunning]);

  // Anti-paste and anti-cheating hook inside Monaco Editor
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Intercept Paste command to reinforce independent typing philosophy
    editor.onKeyDown((e) => {
      if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyV) {
        // Show deterrence notice
        setPasteWarningOpen(true);
        // We still allow small pastes (< 100 chars), but alert student on large code blocks
      }
    });

    // Configure Monaco options
    editor.updateOptions({
      fontFamily: "'Fira Code', 'JetBrains Mono', 'Menlo', monospace",
      fontSize: 13.5,
      lineHeight: 22,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      bracketPairColorization: { enabled: true },
      formatOnPaste: false,
      dragAndDrop: false, // disable drag and drop code injection
      wordWrap: 'on'
    });
  };

  return (
    <div className="codelab-studio-root">
      {/* =====================================================================
          1. TOP BAR: Branding, Challenge Picker, Language, Actions
          ===================================================================== */}
      <header className="codelab-topbar-strip" role="banner">
        <div className="codelab-topbar-left">
          <div className="codelab-brand-pill">
            <Terminal size={16} className="terminal-brand-icon" />
            <span className="brand-name">Teklozy CodeLab</span>
            <span className="badge-env">SANDBOX v1.0</span>
          </div>

          <div className="codelab-divider-vert" />

          {/* Challenge / Project Selector */}
          <div className="challenge-picker-wrap">
            <select
              className="codelab-select-input"
              value={activeMode}
              onChange={(e) => handleSelectChallenge(e.target.value)}
              aria-label="Select Coding Challenge or Playground"
            >
              <optgroup label="Curated Coding Challenges">
                {challenges.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.difficulty})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Freeform Development">
                <option value="playground">Python Scratchpad Playground</option>
              </optgroup>
            </select>
          </div>

          {/* Language Selector */}
          <div className="language-selector-wrap">
            <select
              className="codelab-select-input lang-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select Programming Language"
            >
              <option value="python">Python 3.11</option>
              <option value="javascript" disabled>JavaScript (Coming Soon)</option>
              <option value="cpp" disabled>C / C++ (Coming Soon)</option>
              <option value="java" disabled>Java (Coming Soon)</option>
            </select>
          </div>

          {/* Save Status Badge */}
          <div className={`save-status-indicator ${hasUnsavedChanges ? 'unsaved' : 'saved'}`}>
            <span className="save-status-dot" />
            <span>{hasUnsavedChanges ? 'Unsaved edits' : 'Saved'}</span>
          </div>
        </div>

        <div className="codelab-topbar-right">
          {/* Toggle Problem Description */}
          {activeChallenge && (
            <button
              className={`codelab-action-btn ${problemPanelOpen ? 'active' : ''}`}
              onClick={() => setProblemPanelOpen(!problemPanelOpen)}
              title="Toggle Challenge Description"
            >
              <BookOpen size={14} />
              <span>Problem</span>
            </button>
          )}

          {/* Toggle AI Mentor Panel */}
          <button
            className={`codelab-action-btn ${aiMentorOpen ? 'active' : ''}`}
            onClick={() => setAiMentorOpen(!aiMentorOpen)}
            title="Toggle AI Mentor Panel"
          >
            <Sparkles size={14} className="sparkle-ai-icon" />
            <span>AI Mentor</span>
          </button>

          {/* Reset Code */}
          <button
            className="codelab-action-btn"
            onClick={handleResetCode}
            title="Reset code to original starter template"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          {/* Run Code Button */}
          <button
            className="codelab-btn-run"
            onClick={handleRunCode}
            disabled={isRunning}
            title="Execute Python program in isolated sandbox (Ctrl+Enter)"
          >
            <Play size={14} fill="currentColor" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          {/* Submit Solution Button (Only for challenges) */}
          {activeChallenge && (
            <button
              className="codelab-btn-submit"
              onClick={handleSubmitChallenge}
              disabled={submitting}
              title="Submit solution and test against hidden backend test suite"
            >
              <CheckCircle2 size={14} />
              <span>{submitting ? 'Testing...' : 'Submit Solution'}</span>
            </button>
          )}
        </div>
      </header>

      {/* =====================================================================
          2. MAIN WORKSPACE: Problem (Optional) | Editor & Terminal | AI Mentor
          ===================================================================== */}
      <div className={`codelab-workspace-body ${!aiMentorOpen ? 'mentor-collapsed' : ''} ${problemPanelOpen && activeChallenge ? 'problem-visible' : ''}`}>

        {/* -------------------------------------------------------------------
            PANEL A1: CHALLENGE PROBLEM STATEMENT (Collapsible Left Pane)
            ------------------------------------------------------------------- */}
        {activeChallenge && problemPanelOpen && (
          <aside className="codelab-problem-pane" aria-label="Challenge Description">
            <div className="problem-pane-header">
              <span className={`diff-tag ${activeChallenge.difficulty.toLowerCase()}`}>
                {activeChallenge.difficulty}
              </span>
              <span className="category-tag">{activeChallenge.category}</span>
              <span className="xp-tag">+{activeChallenge.xp_reward} XP</span>
            </div>

            <h2 className="problem-title">{activeChallenge.title}</h2>

            <div className="problem-description-body">
              <p>{activeChallenge.description}</p>

              <h3>Input Format</h3>
              <pre className="format-box">{activeChallenge.input_format}</pre>

              <h3>Output Format</h3>
              <pre className="format-box">{activeChallenge.output_format}</pre>

              <h3>Constraints</h3>
              <pre className="format-box">{activeChallenge.constraints}</pre>

              <h3>Sample Test Cases</h3>
              {activeChallenge.sample_cases.map((sc, i) => (
                <div key={i} className="sample-test-case-box">
                  <div className="sample-label">Sample Case {i + 1}</div>
                  <div className="io-sub-block">
                    <strong>Input:</strong>
                    <code>{sc.input}</code>
                  </div>
                  <div className="io-sub-block">
                    <strong>Expected Output:</strong>
                    <code>{sc.expected_output}</code>
                  </div>
                  {sc.explanation && (
                    <small className="explanation-text">{sc.explanation}</small>
                  )}
                </div>
              ))}
            </div>

            <div className="problem-hint-banner">
              <Lightbulb size={16} className="bulb-icon" />
              <div>
                <strong>Need Guidance?</strong>
                <p>Click "Get Progressive Hint" in the AI Mentor panel for Socratic hints without spoiling the solution.</p>
              </div>
            </div>
          </aside>
        )}

        {/* -------------------------------------------------------------------
            PANEL A2: MONACO CODE EDITOR & INTEGRATED REAL TERMINAL
            ------------------------------------------------------------------- */}
        <section className="codelab-editor-terminal-column">
          {/* Editor Header / File Tabs */}
          <div className="editor-file-tabs-bar">
            <div className="tab-item is-active">
              <FileCode size={13} className="file-icon" />
              <span>{activeFile}</span>
              {hasUnsavedChanges && <span className="tab-dirty-bullet">●</span>}
            </div>

            <button
              className="anti-cheat-pill"
              onClick={() => setPasteWarningOpen(true)}
              title="Students must write their own code. Click to view Learning Honor Code."
            >
              <ShieldAlert size={12} className="shield-icon" />
              <span>Independent Practice Environment</span>
            </button>
          </div>

          {/* Monaco Editor Container */}
          <div className="monaco-canvas-container">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
              options={{
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: 'line',
                automaticLayout: true
              }}
            />
          </div>

          {/* Real Integrated Execution Terminal */}
          <div className={`codelab-terminal-bottom-pane ${terminalExpanded ? 'is-expanded' : ''}`}>
            {/* Terminal Header */}
            <div className="terminal-header-strip">
              <div className="terminal-tabs-left">
                <button
                  className={`terminal-title-tab ${activeTerminalTab === 'terminal' ? 'active' : ''}`}
                  onClick={() => setActiveTerminalTab('terminal')}
                >
                  <Terminal size={13} />
                  <span>Interactive Terminal</span>
                </button>
                {testResults && (
                  <button
                    className={`terminal-title-tab ${activeTerminalTab === 'tests' ? 'active' : ''} ${testResults.all_passed ? 'test-passed' : 'test-failed'}`}
                    onClick={() => setActiveTerminalTab('tests')}
                  >
                    {testResults.all_passed ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    <span>Test Results ({testResults.passed_count}/{testResults.total_tests})</span>
                  </button>
                )}
              </div>

              <div className="terminal-controls-right">
                {executionStats && (
                  <span className="terminal-stat-tag">
                    <Clock size={11} /> {executionStats.timeMs} ms · Exit {executionStats.exitCode}
                  </span>
                )}
                <button
                  className="terminal-ctrl-btn"
                  onClick={() => setTerminalOutput([])}
                  title="Clear Terminal"
                >
                  <Trash2 size={13} />
                </button>
                <button
                  className="terminal-ctrl-btn"
                  onClick={() => setTerminalExpanded(!terminalExpanded)}
                  title={terminalExpanded ? 'Collapse Terminal' : 'Expand Terminal'}
                >
                  {terminalExpanded ? '▼' : '▲'}
                </button>
              </div>
            </div>

            {/* Terminal Stdin Bar for Interactive Inputs */}
            {activeTerminalTab === 'terminal' && (
              <div className="terminal-stdin-input-bar">
                <span className="stdin-prefix">stdin:</span>
                <input
                  type="text"
                  placeholder="Provide standard input for input() statements (e.g. 2,7,11,15\n9)..."
                  value={stdinInput}
                  onChange={(e) => setStdinInput(e.target.value)}
                  className="stdin-text-field"
                />
              </div>
            )}

            {/* Terminal Content Area */}
            <div className="terminal-output-scroll">
              {activeTerminalTab === 'terminal' ? (
                <>
                  {terminalOutput.map((line, idx) => (
                    <div key={idx} className={`term-line line-${line.type}`}>
                      <pre>{line.text}</pre>
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </>
              ) : (
                /* Challenge Evaluation Results View */
                testResults && (
                  <div className="test-results-verdict-box">
                    <div className={`verdict-header ${testResults.all_passed ? 'passed' : 'failed'}`}>
                      {testResults.all_passed ? (
                        <>
                          <CheckCircle2 size={18} />
                          <strong>Accepted — All {testResults.total_tests} Tests Passed!</strong>
                          <span className="xp-congrats">+{testResults.xp_awarded} XP Earned</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={18} />
                          <strong>{testResults.status} — {testResults.passed_count} of {testResults.total_tests} Tests Passed</strong>
                        </>
                      )}
                    </div>

                    <div className="test-cases-table">
                      {testResults.test_results.map((tr) => (
                        <div key={tr.test_num} className={`test-row ${tr.passed ? 'passed' : 'failed'}`}>
                          <span className="test-idx">Test #{tr.test_num}</span>
                          <span className="test-status-pill">{tr.passed ? '✓ Passed' : '✗ Failed'}</span>
                          <span className="test-time">{tr.execution_time_ms} ms</span>
                          {tr.error && <pre className="test-error-log">{tr.error}</pre>}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------
            PANEL B: DEDICATED AI MENTOR (Pedagogical Socratic Teacher)
            ------------------------------------------------------------------- */}
        {aiMentorOpen && (
          <aside className="codelab-ai-mentor-panel" aria-label="AI Coding Mentor">
            {/* Mentor Header */}
            <div className="mentor-header-top">
              <div className="mentor-identity-row">
                <div className="mentor-avatar-halo">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3>Teklozy AI Mentor</h3>
                  <span className="mentor-role-badge">Pedagogical Teacher</span>
                </div>
              </div>
              <button
                className="close-mentor-btn"
                onClick={() => setAiMentorOpen(false)}
                title="Collapse AI Mentor"
              >
                <PanelRightClose size={16} />
              </button>
            </div>

            {/* Mentor Strict Teaching Philosophy Banner */}
            <div className="mentor-philosophy-banner">
              <strong>Socratic Learning Mode Active:</strong>
              <p>I will guide your problem-solving logic and debug your errors, but I will never provide direct answers or code solutions.</p>
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="mentor-quick-actions-strip">
              <button
                className="quick-action-pill"
                onClick={() => handleSendToMentor(`Give me progressive Hint Level ${currentHintLevel}`)}
              >
                <Lightbulb size={12} />
                <span>Hint #{currentHintLevel}</span>
              </button>
              {lastErrorContext && (
                <button
                  className="quick-action-pill error-pill"
                  onClick={() => handleSendToMentor("Please explain why this runtime error is happening without rewriting the code")}
                >
                  <AlertCircle size={12} />
                  <span>Explain Error</span>
                </button>
              )}
              <button
                className="quick-action-pill"
                onClick={() => handleSendToMentor("What is the optimal time and space complexity strategy for this problem?")}
              >
                <HelpCircle size={12} />
                <span>Complexity</span>
              </button>
            </div>

            {/* Chat Thread Messages */}
            <div className="mentor-chat-thread">
              {mentorMessages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.role}`}>
                  <div className="message-content-bubble">
                    <pre className="message-text">{msg.text}</pre>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="bubble-suggestions-wrap">
                        {msg.suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            className="suggestion-chip"
                            onClick={() => handleSendToMentor(s)}
                          >
                            <span>{s}</span>
                            <ChevronRight size={11} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {mentorLoading && (
                <div className="chat-message assistant">
                  <div className="message-content-bubble loading-bubble">
                    <span className="loading-dot" />
                    <span className="loading-dot" />
                    <span className="loading-dot" />
                    <small>Analyzing problem logic...</small>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Box */}
            <form
              className="mentor-chat-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendToMentor();
              }}
            >
              <input
                type="text"
                placeholder="Ask your AI Mentor for guidance or error explanation..."
                value={mentorPrompt}
                onChange={(e) => setMentorPrompt(e.target.value)}
                className="mentor-input-field"
              />
              <button
                type="submit"
                className="mentor-send-btn"
                disabled={!mentorPrompt.trim() || mentorLoading}
                aria-label="Send message to AI Mentor"
              >
                <Send size={14} />
              </button>
            </form>
          </aside>
        )}
      </div>

      {/* =====================================================================
          3. ANTI-PASTE LEARNING PHILOSOPHY MODAL
          ===================================================================== */}
      {pasteWarningOpen && (
        <div className="codelab-modal-overlay" role="dialog" aria-modal="true">
          <div className="codelab-modal-box">
            <div className="modal-icon-header">
              <ShieldAlert size={28} className="shield-warning-icon" />
              <h3>Independent Coding Practice</h3>
            </div>
            <p>
              Teklozy CodeLab is engineered to build <strong>genuine algorithmic muscle memory</strong> and independent reasoning.
            </p>
            <p>
              Copying and pasting pre-written code prevents you from mastering syntax, debugging edge cases, and passing technical interviews.
            </p>
            <div className="modal-tips-list">
              <div>✓ Use the <strong>AI Mentor</strong> for progressive hints if you are stuck.</div>
              <div>✓ Type each line manually to reinforce programming concepts.</div>
            </div>
            <div className="modal-actions-row">
              <button
                className="btn-modal-understand"
                onClick={() => setPasteWarningOpen(false)}
              >
                I Understand — I will write my own code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
