// STT/요약 결정 로직. 원칙:
// - CALL_RECORDING_ENABLED가 OFF면 transcript를 조회조차 하지 않는다(DISABLED).
// - CALL_AI_SUMMARY_ENABLED가 OFF면 요약하지 않는다(DISABLED).
// - provider가 summary를 주면 그것만 쓴다(별도 STT/LLM으로 중복 전송 금지).
// - provider summary가 없을 때만 별도 SummaryAdapter를 쓴다. 이번 작업에는 실제(외부 AI) adapter가 없다 —
//   실제 음성/transcript를 외부로 보내는 구현은 사용자 승인 + 개인정보 고지 후에만 추가한다.
import type { CallSummary, CallTranscript } from "./types";
import type { CallProvider } from "./callProvider";
import { withTimeout } from "./callProvider";
import type { LeadFlags } from "./flags";

export interface CallSummaryAdapter {
  readonly name: string;
  summarize(transcriptText: string): Promise<CallSummary>;
}

/** 로컬 테스트용 fake 요약(키워드 규칙). 외부 전송 없음. */
export const mockSummaryAdapter: CallSummaryAdapter = {
  name: "mock-keywords",
  async summarize(text) {
    const rules: [RegExp, string][] = [
      [/회화|말하기|대화/, "회화 목적"],
      [/시험|자격증|JLPT|HSK|TOEIC|토익|내신|성적/, "시험/성적 목적"],
      [/수업 방식|화상|온라인|방문/, "수업 방식 문의"],
      [/가격|비용|수강료|얼마/, "비용 문의"],
      [/시간|요일|일정/, "일정 문의"],
    ];
    const bullets = rules.filter(([re]) => re.test(text)).map(([, label]) => label);
    return { status: "READY", bullets: bullets.length ? bullets : ["상담 내용 확인 필요"], nextAction: "담당자 확인" };
  },
};

export interface SummaryOutcome {
  transcript: Pick<CallTranscript, "status">;
  summary: CallSummary;
}

export async function resolveCallSummary(
  provider: CallProvider,
  providerCallId: string,
  { flags, adapter, timeoutMs = 5_000 }: { flags: Pick<LeadFlags, "callRecording" | "callAiSummary">; adapter?: CallSummaryAdapter | null; timeoutMs?: number },
): Promise<SummaryOutcome> {
  const disabledSummary: CallSummary = { status: "DISABLED", bullets: [] };
  if (!flags.callRecording) return { transcript: { status: "DISABLED" }, summary: disabledSummary };

  const failedTranscript: CallTranscript = { status: "FAILED" };
  const transcript = await withTimeout(provider.getTranscript(providerCallId), timeoutMs, failedTranscript);
  if (!flags.callAiSummary) return { transcript: { status: transcript.status }, summary: disabledSummary };

  const failedSummary: CallSummary = { status: "FAILED", bullets: [] };
  const fromProvider = await withTimeout(provider.getSummary(providerCallId), timeoutMs, failedSummary);
  if (fromProvider.status === "READY" || fromProvider.status === "PENDING") {
    return { transcript: { status: transcript.status }, summary: fromProvider };
  }
  if (adapter && transcript.status === "READY" && transcript.text) {
    const own = await withTimeout(adapter.summarize(transcript.text), timeoutMs, failedSummary);
    return { transcript: { status: transcript.status }, summary: own };
  }
  return { transcript: { status: transcript.status }, summary: { status: "UNAVAILABLE", bullets: [] } };
}
