// Encode/decode quiz data into URL-safe strings
// We use base64url encoding of JSON to embed quiz data directly in shareable links

export function encodeQuiz(quiz) {
  const json = JSON.stringify(quiz);
  const bytes = new TextEncoder().encode(json);
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeQuiz(encoded) {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch {
    return null;
  }
}
