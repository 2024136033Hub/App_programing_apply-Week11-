const BASE_URL = "http://localhost:8000";

export function proxyMediaUrl(url) {
  if (!url) return null;
  if (url.includes("sldict.korean.go.kr")) {
    return `${BASE_URL}/dictionary/media-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`서버 오류: ${res.status}`);
  }
  return res.json();
}

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
