/**
 * Teklozy Client-Side Hash Router
 * Provides browser history, deep-linking, back/forward support, and query parameter parsing.
 */

export function parseRoute(hashString = window.location.hash) {
  const clean = (hashString || '').replace(/^#\/?/, '') || '';
  const [pathPart, queryPart] = clean.split('?');
  const path = pathPart || 'home';
  const query = {};

  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    for (const [key, val] of params.entries()) {
      query[key] = val;
    }
  }

  return { path, query, raw: hashString };
}

export function buildRoute(path, query = {}) {
  const cleanPath = (path || 'home').replace(/^\/?/, '');
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null && v !== '') {
      params.set(k, String(v));
    }
  }
  const qStr = params.toString();
  return `#/${cleanPath}${qStr ? '?' + qStr : ''}`;
}

export function navigate(path, query = {}, replace = false) {
  const targetHash = buildRoute(path, query);
  if (window.location.hash === targetHash) return;
  
  if (replace) {
    window.location.replace(targetHash);
  } else {
    window.location.hash = targetHash;
  }
}

export function goBack(fallbackRoute = 'home') {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    navigate(fallbackRoute);
  }
}
