// 전화 CTA 클릭(PhoneClickEvent) ↔ 실제 통화(NormalizedCallEvent) 연결.
// 기존 번호 하나를 그대로 쓰므로 "어느 클릭이 어느 통화인지"는 provider가 click id를 돌려줄 때만
// 확정(CONFIRMED)이다. 시각 근접만으로는 LIKELY(추정)까지만 주고, 절대 확정으로 올리지 않는다.
import type { CallAttributionConfidence, CallMatchStatus, NormalizedCallEvent, PhoneClickEvent } from "./types";

export interface MatchOptions {
  /** 클릭 후 통화 시작까지 허용 시간. 기본 3분. */
  windowMs?: number;
  /** 서버/단말 시계 오차 허용(통화가 클릭보다 약간 먼저 찍히는 경우). 기본 30초. */
  clockSkewMs?: number;
  /** 이미 다른 통화에 연결된 클릭(재사용 금지). */
  usedClickIds?: ReadonlySet<string>;
}

export interface CallMatchResult {
  status: CallMatchStatus;
  confidence: CallAttributionConfidence;
  click?: PhoneClickEvent;
  /** window 안 후보 수. 2 이상이면 추정이 흔들릴 수 있다. */
  candidateCount: number;
  /** 후보들의 유입 분류가 서로 달라 추정 attribution이 모호한 경우. */
  ambiguous: boolean;
  /** 클릭 → 통화 시작 간격(초). */
  deltaSeconds?: number;
}

export const DEFAULT_MATCH_WINDOW_MS = 3 * 60_000;
const DEFAULT_SKEW_MS = 30_000;

const UNMATCHED: CallMatchResult = { status: "UNMATCHED", confidence: "UNKNOWN", candidateCount: 0, ambiguous: false };

export function matchCallToClick(
  call: NormalizedCallEvent,
  clicks: readonly PhoneClickEvent[],
  { windowMs = DEFAULT_MATCH_WINDOW_MS, clockSkewMs = DEFAULT_SKEW_MS, usedClickIds }: MatchOptions = {},
): CallMatchResult {
  const sameProject = clicks.filter((c) => c.project === call.project);
  const callStart = Date.parse(call.callStartedAt);

  // 1) 확정: provider가 click id를 그대로 돌려준 경우.
  if (call.clickEventId) {
    const exact = sameProject.find((c) => c.clickEventId === call.clickEventId);
    if (exact) {
      const delta = Number.isFinite(callStart) ? Math.round((callStart - Date.parse(exact.clickedAt)) / 1000) : undefined;
      return { status: "MATCHED", confidence: "CONFIRMED", click: exact, candidateCount: 1, ambiguous: false, deltaSeconds: delta };
    }
  }

  // 2) 추정: 같은 프로젝트에서 통화 시작 직전 window 안의 클릭.
  if (!Number.isFinite(callStart)) return UNMATCHED;
  const candidates = sameProject
    .filter((c) => !usedClickIds?.has(c.clickEventId))
    .map((c) => ({ click: c, delta: callStart - Date.parse(c.clickedAt) }))
    .filter(({ delta }) => Number.isFinite(delta) && delta >= -clockSkewMs && delta <= windowMs)
    .sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta));

  if (candidates.length === 0) return UNMATCHED;

  const sources = new Set(candidates.map(({ click }) => `${click.attribution.attributionSource}|${click.attribution.campaign}`));
  const best = candidates[0];
  return {
    status: "LIKELY",
    confidence: "LIKELY",
    click: best.click,
    candidateCount: candidates.length,
    ambiguous: sources.size > 1,
    deltaSeconds: Math.round(best.delta / 1000),
  };
}
