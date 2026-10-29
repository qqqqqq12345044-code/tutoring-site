// 상담 유입(Lead) / 전화 클릭 / 통화 이벤트 공통 schema. DORAN과 교과설계소가 같은 구조를 쓴다
// (두 repo의 lib/leads/는 import 확장자만 다르고 내용이 같다 — 한쪽을 바꾸면 다른 쪽도 맞춘다).
//
// 개인정보 원칙: 이 schema에는 이름·연락처·이메일·주소·상담 내용·transcript 원문을 넣지 않는다.
// 원본 상담 데이터는 각 사이트의 기존 저장소(Apps Script/Sheet)에만 있고, 여기는 비식별 메타데이터만 다룬다.

export const LEAD_EVENT_VERSION = 1;

export type LeadProject = "DORAN" | "GYOGWASEOLGYE";

export type LeadChannel = "WEB_FORM" | "PHONE" | "EMAIL" | "OTHER";

export type LeadStatus = "NEW" | "CONTACTED" | "CONSULTING" | "CONVERTED" | "LOST" | "UNKNOWN";

/**
 * 유입 분류(파생값). NaPm만으로는 광고로 단정하지 않는다 — 광고는 utm_source=naver AND
 * utm_medium=cpc가 명시된 경우(UTM_NAVER_CPC)에만 분류한다.
 */
export type AttributionSource =
  | "UTM_NAVER_CPC"
  | "NAVER_SEARCH_WITH_NAPM"
  | "NAVER_SEARCH"
  | "OTHER_REFERRER"
  | "DIRECT"
  | "UNKNOWN";

/** 전화 클릭 ↔ 실제 통화 연결 상태. */
export type CallMatchStatus = "MATCHED" | "LIKELY" | "UNMATCHED";

/**
 * 전화 lead의 attribution 신뢰도.
 * CONFIRMED: provider가 click/session id를 직접 돌려줬거나 명확한 identifier로 연결됨.
 * LIKELY: 같은 프로젝트 + 클릭 시각과 통화 시작 시각 근접(추정). 확정값처럼 표시하지 않는다.
 * UNKNOWN: 통화는 있으나 웹 attribution과 연결하지 못함.
 */
export type CallAttributionConfidence = "CONFIRMED" | "LIKELY" | "UNKNOWN";

/** 한 시점의 유입 스냅샷(비식별). */
export interface TouchSnapshot {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  referrer: string;
  /** 유입 페이지(pathname+search, 200자 제한). */
  landingPage: string;
  hasNaPm: boolean;
  /** ISO 시각. 알 수 없으면 "". */
  capturedAt: string;
}

export interface LeadAttribution {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  referrer: string;
  landingPage: string;
  hasNaPm: boolean;
  attributionSource: AttributionSource;
  firstTouch: TouchSnapshot | null;
  lastTouch: TouchSnapshot | null;
}

/** 상담 맥락(선택값만). 자유 입력 텍스트는 넣지 않는다. */
export interface LeadContext {
  service?: string;
  language?: string;
  subject?: string;
  studyGoal?: string;
  /** DORAN: 현재 수준 / 교과설계소: 학년. */
  currentLevel?: string;
}

export type TranscriptStatus = "DISABLED" | "UNAVAILABLE" | "PENDING" | "READY" | "FAILED";
export type SummaryStatus = "DISABLED" | "UNAVAILABLE" | "PENDING" | "READY" | "FAILED";

/** 전화 CTA 클릭 시점 스냅샷. 실제 전화번호는 저장하지 않고 displayedNumberId만 둔다. */
export interface PhoneClickEvent {
  version: number;
  clickEventId: string;
  project: LeadProject;
  clickedAt: string;
  /** 클릭한 페이지 pathname(query 제외). */
  currentPage: string;
  /** 어떤 번호 CTA였는지 식별자(번호 값 아님). 예: "main". */
  displayedNumberId: string;
  /** CTA 위치 힌트(floating/footer/header/content 등). */
  ctaLocation: string;
  /** 탭 세션 식별자(랜덤, 개인 식별 불가). */
  sessionId: string;
  attribution: LeadAttribution;
  context: LeadContext;
}

export type CallStatus = "RINGING" | "ANSWERED" | "COMPLETED" | "MISSED" | "UNKNOWN";

/** provider 원본 payload를 정규화한 통화 이벤트. */
export interface NormalizedCallEvent {
  provider: string;
  /** webhook 재전송 중복 제거 키(provider event id). */
  providerEventId: string;
  providerCallId: string;
  project: LeadProject;
  status: CallStatus;
  callStartedAt: string;
  callCompletedAt?: string;
  durationSeconds?: number;
  answered?: boolean;
  recorded?: boolean;
  /** provider가 click id를 그대로 돌려주는 경우(CONFIRMED 매칭 근거). */
  clickEventId?: string;
  /** 마스킹된 발신번호("010-****-1234") — provider가 줄 때만. 원문 번호는 보관하지 않는다. */
  callerMasked?: string;
}

export interface LeadPhoneInfo {
  displayedNumberId: string;
  clickEventId?: string;
  clickedAt?: string;
  clickedPage?: string;
  clickAttribution?: LeadAttribution;
  provider?: string;
  providerCallId?: string;
  callStartedAt?: string;
  callCompletedAt?: string;
  durationSeconds?: number;
  answered?: boolean;
  recorded?: boolean;
  matchStatus: CallMatchStatus;
  attributionConfidence: CallAttributionConfidence;
  transcriptStatus: TranscriptStatus;
  summaryStatus: SummaryStatus;
}

export interface LeadEvent {
  version: number;
  leadId: string;
  project: LeadProject;
  createdAt: string;
  channel: LeadChannel;
  attribution: LeadAttribution;
  context: LeadContext;
  phone?: LeadPhoneInfo;
  status: LeadStatus;
}

/** AI 통화 요약(전체 transcript가 아니라 짧은 bullet만). */
export interface CallSummary {
  status: SummaryStatus;
  bullets: string[];
  nextAction?: string;
}

export interface CallTranscript {
  status: TranscriptStatus;
  /** 서버 메모리 안에서만 요약 입력으로 쓰고, 저장/로그/알림에는 넣지 않는다. */
  text?: string;
}
