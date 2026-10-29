// 교과설계소 브라우저 연결부. flag("true")가 없으면 sessionStorage 쓰기/네트워크 전송을 하지 않는다.
import type { LeadAttribution, LeadContext } from "./types";
import { captureAttribution, classifyAttribution, getAttribution } from "./attribution";
import { buildLeadAttribution, installPhoneClickTracking, readFirstTouch, rememberFirstTouch } from "./clientCore";
import { getSubjectBySlug } from "@/data/subjects";

const PREFIX = "gg";

export const leadEventsEnabled = process.env.NEXT_PUBLIC_LEAD_EVENTS_ENABLED === "true";
export const phoneClickTrackingEnabled = process.env.NEXT_PUBLIC_PHONE_CLICK_TRACKING_ENABLED === "true";

export function getLeadAttribution(): LeadAttribution {
  const raw = getAttribution();
  return buildLeadAttribution(raw, classifyAttribution(raw), readFirstTouch(PREFIX));
}

/** /consult 제출 body에 실어 보낼 유입 정보. flag OFF면 undefined(= 기존 payload 그대로). */
export function getConsultLeadAttribution(): LeadAttribution | undefined {
  if (!leadEventsEnabled) return undefined;
  try {
    return getLeadAttribution();
  } catch {
    return undefined;
  }
}

/** /subject/<slug>/... 페이지면 과목명. */
function pageContext(): LeadContext {
  const [, first, slug] = window.location.pathname.split("/");
  if (first !== "subject" || !slug) return {};
  const subject = getSubjectBySlug(slug);
  return subject ? { subject: subject.name } : {};
}

/** layout 마운트 시 1회. route가 바뀌어도 다시 호출할 필요 없다(위임 listener). */
export function startLeadTracking(): () => void {
  if (!leadEventsEnabled && !phoneClickTrackingEnabled) return () => {};
  try {
    captureAttribution();
    rememberFirstTouch(PREFIX, getAttribution());
  } catch {
    // 무시
  }
  if (!phoneClickTrackingEnabled) return () => {};
  return installPhoneClickTracking({
    project: "GYOGWASEOLGYE",
    storagePrefix: PREFIX,
    endpoint: "/api/leads/phone-click",
    getAttribution: getLeadAttribution,
    getContext: pageContext,
  });
}
