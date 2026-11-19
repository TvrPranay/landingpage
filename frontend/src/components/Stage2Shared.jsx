import React from 'react';
import { Check, X } from 'lucide-react';

export const WRITTEN_FIELDS = [
  ['understanding', 'Understanding', 'What is the problem, in your own words?'],
  ['evidence', 'Evidence', 'Which evidence supports it? Quote numbers and sources.'],
  ['diagnosis', 'Diagnosis', 'Why does it happen? Where exactly does it go wrong?'],
  ['change', 'Change', 'What do you change or propose?'],
  ['verification', 'Verification', 'How will you check that it worked?'],
];

export function AttemptFeedback({ attempt }) {
  const result = attempt.result;
  return (
    <div className={`stage2-attempt ${attempt.passed ? 'is-passed' : 'is-failed'}`}>
      <div className="stage2-attempt-head">
        <strong>{attempt.state === 'graded' ? `${attempt.score}/100` : attempt.state === 'grading_failed' ? 'Grading failed' : 'Grading…'}</strong>
        <span>{attempt.passed ? 'Passed' : attempt.state === 'graded' ? 'Not passed yet' : ''}</span>
        <small>{new Date(attempt.createdAt).toLocaleString()} · version {attempt.challengeVersion}</small>
      </div>
      {result?.dimensions?.map((d) => (
        <div key={d.dimension} className="stage2-dimension">
          <span className="stage2-dimension-name">{d.dimension}</span>
          <span className="stage2-dimension-score">{d.earned}/{d.max}</span>
          <ul>
            {d.criteria.map((c) => (
              <li key={c.id} className={c.met ? 'is-met' : 'is-missed'}>
                {c.met ? <Check size={13} /> : <X size={13} />} {c.description}
                {!c.met && c.feedback && <p>{c.feedback}</p>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

