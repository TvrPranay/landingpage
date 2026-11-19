import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution.js';

globalThis.MonacoEnvironment = { getWorker: () => new EditorWorker() };
loader.config({ monaco });

export const languageFor = (path) => {
  if (!path) return 'plaintext';
  const ext = path.split('.').pop()?.toLowerCase();
  return (
    {
      js: 'javascript',
      mjs: 'javascript',
      ts: 'typescript',
      jsx: 'javascript',
      py: 'python',
      sql: 'sql',
      json: 'json',
      html: 'html',
      css: 'css',
      md: 'markdown',
      sh: 'shell',
      csv: 'plaintext',
    }[ext] || 'plaintext'
  );
};

