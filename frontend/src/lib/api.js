
export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message || code || `Request failed (${status})`);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request(url, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(url, {
      method,
      credentials: 'include',
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'The Teklozy server is not reachable. Check that the backend is running.');
  }
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }
  if (!response.ok) {
    if (!payload && response.status >= 500) {
      throw new ApiError(response.status, 'BACKEND_UNAVAILABLE', 'The Teklozy API is unavailable. Try again when the backend is running.');
    }
    const error = payload?.error ?? payload ?? {};
    if (response.status === 401 && url.startsWith('/api/v1/') && typeof window !== 'undefined')
      window.dispatchEvent(new CustomEvent('teklozy:session-expired'));
    throw new ApiError(response.status, error.code, error.message, error.details);
  }
  if (!payload && url.startsWith('/api/v1/')) {
    throw new ApiError(response.status, 'INVALID_API_RESPONSE', 'The Teklozy API returned an unexpected response. Check the API proxy.');
  }
  return payload;
}

const query = (params = {}) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params))
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  const text = search.toString();
  return text ? `?${text}` : '';
};

/** True while the visitor is in the guest workspace: calls are answered by the in-browser demo API. */
const isDemoSession = () => {
  try { return typeof localStorage !== 'undefined' && localStorage.getItem('teklozyGuestSession') === 'true'; }
  catch { return false; }
};

async function demo(method, path, params, body) {
  const { demoRequest } = await import('./demoBackend');
  try {
    return await demoRequest(method, path, params, body);
  } catch (e) {
    throw new ApiError(e.status ?? 500, e.code, e.message, e.details);
  }
}

export const api = {
  get: async (path, params) => (isDemoSession() ? demo('GET', path, params) : (await request(`/api/v1/${path}${query(params)}`))?.data),
  post: async (path, body = {}) => (isDemoSession() ? demo('POST', path, {}, body) : (await request(`/api/v1/${path}`, { method: 'POST', body }))?.data),
  put: async (path, body = {}) => (isDemoSession() ? demo('PUT', path, {}, body) : (await request(`/api/v1/${path}`, { method: 'PUT', body }))?.data),
  patch: async (path, body = {}) => (isDemoSession() ? demo('PATCH', path, {}, body) : (await request(`/api/v1/${path}`, { method: 'PATCH', body }))?.data),
};

export const auth = {
  session: () => request('/api/auth/get-session'),
  signIn: (email, password) => request('/api/auth/sign-in/email', { method: 'POST', body: { email, password } }),
  signUp: (name, email, password) =>
    request('/api/auth/sign-up/email', {
      method: 'POST',
      body: { name, email, password, callbackURL: `${window.location.origin}/#/home` },
    }),
  signOut: () => request('/api/auth/sign-out', { method: 'POST', body: {} }),
  requestPasswordReset: (email) =>
    request('/api/auth/request-password-reset', {
      method: 'POST',
      body: { email, redirectTo: `${window.location.origin}/#/reset-password` },
    }),
  resetPassword: (token, newPassword) =>
    request('/api/auth/reset-password', { method: 'POST', body: { token, newPassword } }),
  resendVerification: (email) =>
    request('/api/auth/send-verification-email', {
      method: 'POST',
      body: { email, callbackURL: `${window.location.origin}/#/home` },
    }),
};

export function errorMessage(error) {
  if (!(error instanceof ApiError)) return 'Something went wrong. Please try again.';
  const known = {
    INVALID_EMAIL_OR_PASSWORD: 'Email or password is incorrect.',
    EMAIL_NOT_VERIFIED: 'Please verify your email first. We sent you a link.',
    USER_ALREADY_EXISTS: 'An account with this email already exists. Sign in instead.',
    PASSWORD_TOO_SHORT: 'Use a password of at least 12 characters.',
    RATE_LIMITED: 'Too many attempts. Please wait a minute and try again.',
    UNAUTHENTICATED: 'Your session ended. Please sign in again.',
  };
  return known[error.code] || error.message || 'Something went wrong. Please try again.';
}
