// 서버 측 feature flag. 값이 정확히 "true"일 때만 켜지고, env가 없으면 전부 OFF —
// 그 상태의 동작은 이 기능이 생기기 전 Production과 같다.
// 클라이언트 flag(NEXT_PUBLIC_*)는 build 시 inline되어야 하므로 각 client 파일에서 직접 읽는다.

export interface LeadFlags {
  /** 웹 상담 성공 시 LeadEvent 생성(저장/대시보드). */
  leadEvents: boolean;
  /** 웹 문의 / 통화 이벤트 Telegram 알림. */
  telegram: boolean;
  /** /api/leads/phone-click 수신. */
  phoneClickTracking: boolean;
  /** 전화 CTA 클릭 직후 알림(노이즈가 많아 기본 OFF). */
  phoneClickTelegram: boolean;
  /** /api/calls/webhook 수신. */
  callProvider: boolean;
  /** 녹취/transcript 조회. OFF면 transcriptStatus=DISABLED. */
  callRecording: boolean;
  /** AI 통화 요약. OFF면 summaryStatus=DISABLED. */
  callAiSummary: boolean;
}

type Env = Record<string, string | undefined>;

const on = (value: string | undefined) => value === "true";

export function readLeadFlags(env: Env = process.env): LeadFlags {
  return {
    leadEvents: on(env.LEAD_EVENTS_ENABLED),
    telegram: on(env.LEAD_TELEGRAM_ENABLED),
    phoneClickTracking: on(env.PHONE_CLICK_TRACKING_ENABLED),
    phoneClickTelegram: on(env.PHONE_CLICK_TELEGRAM_ENABLED),
    callProvider: on(env.CALL_PROVIDER_ENABLED),
    callRecording: on(env.CALL_RECORDING_ENABLED),
    callAiSummary: on(env.CALL_AI_SUMMARY_ENABLED),
  };
}

export const ALL_FLAGS_OFF: LeadFlags = readLeadFlags({});
