// Encode/decode answers into compact URL-safe strings
// Format: name + answers as A/B string, e.g. "Steve:AABBABBA" + question IDs

export function encodeResults(name, answersMap) {
  const ids = Object.keys(answersMap).sort((a, b) => a - b);
  const answers = ids.map((id) => answersMap[id]).join('');
  const data = JSON.stringify({ n: name, q: ids.map(Number), a: answers });
  const bytes = new TextEncoder().encode(data);
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeResults(encoded) {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const data = JSON.parse(new TextDecoder().decode(bytes));
    const answersMap = {};
    data.q.forEach((id, i) => {
      answersMap[id] = data.a[i];
    });
    return { name: data.n, answers: answersMap };
  } catch {
    return null;
  }
}

export function getCompatibility(answers1, answers2) {
  const sharedIds = Object.keys(answers1).filter((id) => id in answers2);
  if (sharedIds.length === 0) return { score: 0, total: 0, matches: [] };
  let matches = 0;
  const details = sharedIds.map((id) => {
    const same = answers1[id] === answers2[id];
    if (same) matches++;
    return { id: Number(id), same };
  });
  return {
    score: matches,
    total: sharedIds.length,
    pct: Math.round((matches / sharedIds.length) * 100),
    details,
  };
}
