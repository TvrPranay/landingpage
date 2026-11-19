import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, Check, Clock3, ExternalLink, FileText, Layers, Lock, Maximize, NotebookPen, Play,
  Settings, Target, Construction, Ticket,
} from 'lucide-react';
import { api, errorMessage } from '../../lib/api';

const KIND_LABEL = { lesson: 'Lesson', guided: 'Guided problem', challenge: 'Ticket' };
const FORMATS = [
  { id: 'video', label: 'Video', icon: Play },
  { id: 'visual', label: 'Visual', icon: Layers },
  { id: 'reading', label: 'Reading', icon: BookOpen },
];

function UnderDevelopment({ title, brief }) {
  return (
    <div className="ls-dev">
      <Construction size={26} />
      <strong>{title}</strong>
      <span>Under development{brief ? ` — ${brief}` : '.'}</span>
    </div>
  );
}

function Paragraphs({ text }) {
  return String(text ?? '').split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>);
}

function Notes({ initial, refInput }) {
  const [note, setNote] = useState(initial ?? { body: '', revision: 0 });
  const [body, setBody] = useState(initial?.body ?? '');
  const [status, setStatus] = useState('');
  async function save() {
    setStatus('Saving…');
    try {
      const updated = await api.put('stage2/lessons/notes', { batchId: refInput.batchId, conceptId: refInput.conceptId, body, revision: note.revision });
      setNote(updated);
      setStatus('Notes saved.');
    } catch (e) { setStatus(errorMessage(e)); }
  }
  return (
    <>
      <textarea className="notes-textarea" rows={5} maxLength={10000} value={body} placeholder="Write what you learned, questions to ask, or links to revisit." onChange={(e) => setBody(e.target.value)} />
      <div className="ls-notes-row">
        <small className="ls-muted" role="status">{status}</small>
        <button type="button" className="btn-outline-small" onClick={save} disabled={body === note.body}>Save notes</button>
      </div>
    </>
  );
}

/**
 * A Stage 2 / tunnel lesson in the lesson-player layout: module items on the left, the lesson with
 * Video / Visual / Reading formats in the centre, module progress and what comes next on the right.
 * Everything comes from `stage2/lessons` and `stage2/modules/outline`; missing content says "Under development".
 */
export default function Stage2LessonView({ q, lesson: data, outline, onOpen, onBack, onReload }) {
  const [format, setFormat] = useState('video');
  const [tab, setTab] = useState('About');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { setFormat('video'); setTab('About'); setError(''); }, [data?.itemId]);

  const awaiting = data?.status === 'awaiting_content';
  const items = outline?.items ?? [];
  const moduleTitle = outline?.module?.title ?? data?.moduleTitle;
  const here = items.findIndex((i) => i.itemId === data?.itemId);
  const upNext = here >= 0 ? items.slice(here + 1) : [];
  const nextItem = upNext.find((i) => i.state !== 'awaiting_content') ?? null;
  const prevItem = here > 0 ? items[here - 1] : null;
  const percent = outline?.progress?.percent ?? 0;
  const isGuided = data?.kind === 'guided';
  const guided = data?.guided?.evidence ? data.guided : null;
  const video = data?.media?.video;
  const visual = data?.media?.visual;
  const refInput = { batchId: q.batch, conceptId: q.concept, part: q.part === 'guided' ? 'guided' : 'lesson' };

  async function complete() {
    setBusy(true);
    setError('');
    try { await api.post('stage2/lessons/complete', refInput); await onReload(); }
    catch (e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  }

  const readingBody = awaiting ? (
    <UnderDevelopment title={`${data?.title ?? 'This lesson'}`} brief={data?.guided?.brief} />
  ) : guided ? (
    <>
      <section className="ls-read"><h3>The report</h3><Paragraphs text={guided.report} /></section>
      {guided.evidence.map((e) => <section className="ls-read" key={e.id}><h3>{e.label}</h3><pre>{e.content}</pre></section>)}
      {[['Reproduce', guided.reproduction], ['Hypothesis', guided.hypothesis], ['Diagnostic action', guided.diagnosticAction], ['Cause', guided.cause], ['Repair', guided.repair], ['Verification', guided.verification]]
        .filter(([, b]) => b).map(([t, b]) => <section className="ls-read" key={t}><h3>{t}</h3><Paragraphs text={b} /></section>)}
      {guided.before && <section className="ls-read"><h3>Before</h3><pre>{guided.before}</pre></section>}
      {guided.after && <section className="ls-read"><h3>After</h3><pre>{guided.after}</pre></section>}
    </>
  ) : (
    <>
      {data?.opening && <section className="ls-read ls-read--lead"><Paragraphs text={data.opening} /></section>}
      {(data?.sections ?? []).map((sec) => <section className="ls-read" key={sec.id}><h3>{sec.title}</h3><Paragraphs text={sec.body} /></section>)}
      {data?.example && <section className="ls-read"><h3>{data.example.title}</h3><pre>{data.example.code}</pre>{data.example.walkthrough && <Paragraphs text={data.example.walkthrough} />}</section>}
      {data?.issues?.length > 0 && (
        <section className="ls-read"><h3>Common workplace issues</h3>
          {data.issues.map((i) => <div className="ls-issue" key={i.name}><strong>{i.name}</strong><p><b>Symptom:</b> {i.symptom}</p>{i.cause && <p><b>Cause:</b> {i.cause}</p>}{i.fix && <p><b>Fix:</b> {i.fix}</p>}</div>)}
        </section>
      )}
    </>
  );

  return (
    <div className="ls-shell">
      <aside className="ls-left" aria-label="Module items">
        <button type="button" className="ls-back" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="ls-kicker">{outline?.module?.code ?? data?.moduleCode ?? 'Module'}{outline?.module?.trackTitle ? ` · ${outline.module.trackTitle}` : ''}</span>
        <h2 className="ls-module">{moduleTitle}</h2>
        <div className="ls-progress"><span className="ls-bar"><span style={{ width: `${percent}%` }} /></span><b>{percent}%</b></div>
        <nav className="ls-lessons">
          {items.map((it, idx) => {
            const current = it.itemId === data?.itemId;
            const dev = it.state === 'awaiting_content';
            const done = it.state === 'completed';
            return (
              <button key={it.itemId} type="button" className={`ls-lesson ${current ? 'is-current' : ''} ${done ? 'is-done' : ''} ${dev ? 'is-dev' : ''}`}
                onClick={() => onOpen(it)} disabled={dev || it.state === 'locked'}>
                <span className="ls-lesson__icon">{done ? <Check size={16} strokeWidth={3} /> : dev ? <Clock3 size={15} /> : it.state === 'locked' ? <Lock size={15} /> : it.kind === 'challenge' ? <Ticket size={15} /> : <Play size={14} fill="currentColor" />}</span>
                <span className="ls-lesson__text"><strong>{idx + 1}. {it.title}</strong><small>{KIND_LABEL[it.kind] ?? it.kind}{it.minutes ? ` · ${it.minutes} min` : ''}{dev ? ' · Under development' : ''}</small></span>
              </button>
            );
          })}
          {!items.length && <p className="ls-muted">Loading module…</p>}
        </nav>
        <div className="ls-complete-card">
          <h3>Complete this module</h3>
          <ul>{items.map((it) => <li key={it.itemId} className={it.state === 'completed' ? 'is-done' : ''}><span>{it.state === 'completed' ? <Check size={13} strokeWidth={3} /> : null}</span>{it.title}</li>)}</ul>
          <small>{outline?.progress?.itemsCompleted ?? 0} of {outline?.progress?.itemsTotal ?? items.length} activities complete</small>
        </div>
      </aside>

      <main className="ls-center">
        <div className="ls-toprow">
          <span className="ls-pill">{isGuided ? 'Guided problem' : 'Lesson'} {data?.position ? `${data.position.index} of ${data.position.of}` : ''}</span>
          <div className="ls-formats" role="tablist" aria-label="Lesson format">
            {FORMATS.map((f) => (
              <button key={f.id} type="button" role="tab" aria-selected={format === f.id} className={format === f.id ? 'is-active' : ''} onClick={() => setFormat(f.id)}>
                <f.icon size={15} /> {f.label}
              </button>
            ))}
          </div>
        </div>
        <h1 className="ls-title">{guided?.title?.replace(/^Workplace simulation: /, '') ?? data?.title}</h1>
        {awaiting && <div className="ls-devbar"><Construction size={16} /> This lesson is under development. The outline below shows what it will cover.</div>}

        {format === 'video' && (
          <>
            <div className="ls-player">
              <div className="ls-player__placeholder">
                <span className="ls-player__play"><Play size={34} fill="currentColor" /></span>
                <strong>{video?.status === 'published' ? 'Lesson video' : 'Video under development'}</strong>
                <small>{video?.brief ?? `The video for “${data?.title ?? 'this lesson'}” will play here.`}</small>
              </div>
              <div className="ls-player__bar" aria-hidden="true">
                <Play size={18} fill="currentColor" /><span>0:00 / {data?.minutes ?? '--'}:00</span>
                <span className="ls-player__track"><span /></span>
                <span className="ls-chip">CC</span><span>1x</span><Settings size={18} /><Maximize size={18} />
              </div>
            </div>
            <section className="ls-card ls-summary">
              <h3><FileText size={18} /> Video summary</h3>
              {awaiting ? <UnderDevelopment title="Summary" brief={null} /> : (
                <>
                  <p>{guided ? guided.report : data?.opening}</p>
                  {!guided && data?.sections?.length > 0 && (
                    <ul className="ls-chapters">{data.sections.map((sec, i) => <li key={sec.id}><span>{String(i + 1).padStart(2, '0')}</span> {sec.title}</li>)}</ul>
                  )}
                </>
              )}
            </section>
          </>
        )}
        {format === 'visual' && (
          <section className="ls-card">
            <UnderDevelopment title="Visual lesson" brief={visual?.brief} />
          </section>
        )}
        {format === 'reading' && <section className="ls-card ls-reading">{readingBody}</section>}

        <div className="ls-tabs" role="tablist">
          {[['About', BookOpen, 'About'], ['Takeaways', Target, 'Key Takeaways'], ['Resources', Layers, 'Resources'], ['Notes', NotebookPen, 'Notes']].map(([key, Icon, label]) => (
            <button key={key} type="button" className={tab === key ? 'is-active' : ''} onClick={() => setTab(key)} role="tab" aria-selected={tab === key}><Icon size={18} /> {label}</button>
          ))}
        </div>
        <div className="ls-card ls-tabpanel">
          {tab === 'About' && (awaiting ? <UnderDevelopment title="What you’ll learn" brief={null} /> : (
            <>
              <h3><Target size={20} className="ls-blue" /> What you’ll learn</h3>
              {data?.tabs?.about?.outcome && <p className="ls-outcome">{data.tabs.about.outcome}</p>}
              <ul className="ls-checks">{(data?.tabs?.about?.learn ?? []).map((o) => <li key={o}><Check size={16} strokeWidth={3} />{o}</li>)}</ul>
            </>
          ))}
          {tab === 'Takeaways' && ((data?.tabs?.takeaways ?? []).length ? (
            <ul className="ls-checks">{data.tabs.takeaways.map((t) => <li key={t}><Check size={16} strokeWidth={3} />{t}</li>)}</ul>
          ) : <UnderDevelopment title="Key takeaways" brief={null} />)}
          {tab === 'Resources' && ((data?.tabs?.resources ?? []).length ? data.tabs.resources.map((r) => (
            <div className="ls-resource" key={r.url}><FileText size={16} /><span><strong>{r.title}</strong>{r.publisher && <small> · {r.publisher}</small>}{r.supports && <small className="ls-res-why">{r.supports}</small>}</span><a href={r.url} target="_blank" rel="noreferrer noopener">Open <ExternalLink size={12} /></a></div>
          )) : <UnderDevelopment title="Resources" brief={null} />)}
          {tab === 'Notes' && (awaiting ? <UnderDevelopment title="Notes" brief={null} /> : <Notes key={data?.itemId} initial={data?.tabs?.notes} refInput={refInput} />)}
        </div>
        {error && <div className="form-feedback-alert error" role="alert"><span>{error}</span></div>}

        <footer className="ls-footer">
          {prevItem ? <button type="button" className="ls-prev" onClick={() => onOpen(prevItem)}><ArrowLeft size={18} /> Previous</button> : <span />}
          {!awaiting && !data?.completed ? (
            <button type="button" className="ls-next" onClick={complete} disabled={busy}>{busy ? 'Saving…' : 'Mark complete'} <Check size={18} strokeWidth={3} /></button>
          ) : nextItem ? (
            <button type="button" className="ls-next" onClick={() => onOpen(nextItem)}>Next: {nextItem.title} <ArrowRight size={18} /></button>
          ) : (
            <button type="button" className="ls-next" onClick={onBack}>Back to the stage <ArrowRight size={18} /></button>
          )}
        </footer>
      </main>

      <aside className="ls-right" aria-label="Module progress">
        <section className="ls-card ls-modprog">
          <div><h3>Module Progress</h3><span>{outline?.progress?.itemsCompleted ?? 0} of {outline?.progress?.itemsTotal ?? items.length} activities</span></div>
          <div className="ls-progress"><span className="ls-bar"><span style={{ width: `${percent}%` }} /></span><b>{percent}%</b></div>
        </section>
        <section className="ls-card ls-upnext">
          <h3>Up Next in this Module</h3>
          {upNext.length === 0 && <p className="ls-muted">This is the last activity in this module.</p>}
          {upNext.map((it, i) => (
            <button key={it.itemId} type="button" className="ls-upnext__row" onClick={() => onOpen(it)} disabled={it.state === 'awaiting_content'}>
              <span className="ls-upnext__icon">{it.state === 'completed' ? <Check size={16} strokeWidth={3} /> : it.state === 'awaiting_content' ? <Clock3 size={15} /> : it.kind === 'challenge' ? <Ticket size={15} /> : <Play size={14} fill="currentColor" />}</span>
              <strong>{here + i + 2}. {it.title}</strong><small>{it.state === 'awaiting_content' ? 'Soon' : it.minutes ? `${it.minutes} min` : KIND_LABEL[it.kind]}</small>
            </button>
          ))}
        </section>
        {outline?.module?.concepts?.length > 0 && (
          <section className="ls-card ls-coursecard">
            <h3>Concepts in this module</h3>
            <ul className="ls-checks">{outline.module.concepts.map((c) => <li key={c.id}><Check size={16} strokeWidth={3} /><span>{c.title}{!c.authored && <small className="ls-devtag"> · Under development</small>}</span></li>)}</ul>
          </section>
        )}
      </aside>
    </div>
  );
}
