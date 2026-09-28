/**
 * Best-effort, in-memory abuse guards for the consult API route. Deliberately
 * not a database-backed system — per-instance memory is enough to blunt
 * accidental double-submits and basic scripted abuse, without adding
 * infrastructure. On serverless deployments each warm instance keeps its own
 * state, so this is a speed bump, not a hard guarantee.
 */

const RATE_LIMIT_WINDOW_MS = 60_000;
// Deliberately generous — a shared office/school IP behind NAT can send
// several legitimate submissions in a minute. This is a floor against
// scripted flooding, not a per-user throttle (that's wasRecentlySubmitted()).
const RATE_LIMIT_MAX_REQUESTS = 20;
const DUPLICATE_WINDOW_MS = 10_000;
/** Prevents the maps below from growing unbounded on a long-lived instance. */
const MAX_TRACKED_KEYS = 5_000;

const requestTimestampsByIp = new Map<string, number[]>();
const lastSubmittedAtByKey = new Map<string, number>();

function pruneIfTooLarge<K, V>(map: Map<K, V>) {
  if (map.size <= MAX_TRACKED_KEYS) return;
  const oldestKey = map.keys().next().value;
  if (oldestKey !== undefined) map.delete(oldestKey);
}

/** True when this IP has made too many requests in the current window. Counts every call, success or failure. */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestTimestampsByIp.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestTimestampsByIp.set(ip, timestamps);
  pruneIfTooLarge(requestTimestampsByIp);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

/** Read-only check — does not itself count as a submission. Call markSubmitted() only after a confirmed save. */
export function wasRecentlySubmitted(key: string): boolean {
  const last = lastSubmittedAtByKey.get(key);
  return last !== undefined && Date.now() - last < DUPLICATE_WINDOW_MS;
}

/** Marks a submission as saved so a rapid repeat of the same request is recognized as a duplicate. */
export function markSubmitted(key: string): void {
  lastSubmittedAtByKey.set(key, Date.now());
  pruneIfTooLarge(lastSubmittedAtByKey);
}
