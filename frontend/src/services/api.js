/**
 * Centralized API Service Layer
 * All backend calls go through here. When deploying, change API_URL in ONE place.
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://fake-news-detection-chcj.onrender.com';

/**
 * Generic fetch wrapper with auth and error handling
 */
async function apiFetch(endpoint, options = {}) {
  const { token, method = 'GET', body } = options;

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}${endpoint}`, config);
  const data = await res.json();

  if (res.status === 429) {
    throw new Error('Too many requests. Please slow down and try again.');
  }

  return { res, data };
}

// --- AUTH ---

export async function loginUser(username, password) {
  const { res, data } = await apiFetch('/login', {
    method: 'POST',
    body: { username, password },
  });
  if (!res.ok) throw new Error(data.msg || 'Login failed');
  return data;
}

export async function registerUser(username, password) {
  const { res, data } = await apiFetch('/register', {
    method: 'POST',
    body: { username, password },
  });
  if (!res.ok) throw new Error(data.msg || 'Registration failed');
  return data;
}

// --- PREDICTION ---

export async function predictNews(newsText, token) {
  const { res, data } = await apiFetch('/predict', {
    method: 'POST',
    token,
    body: { news: newsText },
  });
  if (res.status === 401) throw { status: 401, message: 'Session expired' };
  if (!res.ok) throw new Error(data.error || 'Analysis failed');
  return data;
}

// --- LIME EXPLANATION (On-demand) ---

export async function getExplanation(newsText, token) {
  const { res, data } = await apiFetch('/explain', {
    method: 'POST',
    token,
    body: { news: newsText },
  });
  if (res.status === 401) throw { status: 401, message: 'Session expired' };
  if (!res.ok) throw new Error(data.error || 'Failed to get explanation');
  return data;
}

// --- HISTORY ---

export async function fetchHistory(token) {
  const { res, data } = await apiFetch('/history', { token });
  if (res.status === 401) throw { status: 401, message: 'Session expired' };
  if (!res.ok) throw new Error('Failed to fetch history');
  return data;
}
