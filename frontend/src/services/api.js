const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function proxyMediaUrl(url) {
  if (!url) return null;
  if (url.includes("sldict.korean.go.kr")) {
    return `${BASE_URL}/dictionary/media-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `서버 오류: ${res.status}`);
  }
  return res.json();
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 번역 API
export async function searchSign(word) {
  return fetchJSON(`${BASE_URL}/dictionary/search?word=${encodeURIComponent(word)}`);
}

export async function getImage(word) {
  return fetchJSON(`${BASE_URL}/dictionary/image?word=${encodeURIComponent(word)}`);
}

export async function translateWords(words) {
  return fetchJSON(`${BASE_URL}/translate/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ words }),
  });
}

export async function recognizeFrame(imageBase64) {
  return fetchJSON(`${BASE_URL}/translate/webcam-frame`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageBase64 }),
  });
}

// 인증 API
export async function loginUser(username, password) {
  return fetchJSON(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

export async function registerUser(username, email, password) {
  return fetchJSON(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
}

// 번역 기록 API
export async function getHistory(token) {
  return fetchJSON(`${BASE_URL}/history/`, {
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
  });
}

export async function addHistory(data, token) {
  return fetchJSON(`${BASE_URL}/history/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(data),
  });
}

export async function deleteHistory(id, token) {
  return fetchJSON(`${BASE_URL}/history/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
  });
}

export async function deleteAllHistory(token) {
  return fetchJSON(`${BASE_URL}/history/all`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
  });
}
