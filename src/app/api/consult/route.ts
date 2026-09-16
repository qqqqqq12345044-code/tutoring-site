import { NextResponse } from "next/server";

const MAX_FIELD_LENGTH = 500;
const REQUIRED_STRING_FIELDS = ["contactName", "phone", "grade", "subject", "lessonType", "province", "agree"] as const;

function isNonEmptyString(value: unknown, maxLength = MAX_FIELD_LENGTH): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

function mask(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) return "(empty)";
  if (value.length <= 2) return "*".repeat(value.length);
  return `${value[0]}${"*".repeat(value.length - 2)}${value[value.length - 1]}`;
}

// TODO: 실제 운영 시 이 위치에서 CRM/DB/알림 연동을 처리합니다.
// 현재는 실제 백엔드 연동 전이므로 요청 내용을 로그로만 남기고 성공 응답을 반환합니다.
export async function POST(request: Request) {
  let body: Record<string, unknown> = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  for (const field of REQUIRED_STRING_FIELDS) {
    if (!isNonEmptyString(body[field])) {
      return NextResponse.json({ ok: false, error: "missing required fields" }, { status: 400 });
    }
  }
  if (typeof body.cityDetail === "string" && body.cityDetail.length > MAX_FIELD_LENGTH) {
    return NextResponse.json({ ok: false, error: "invalid field" }, { status: 400 });
  }
  if (typeof body.availableTime === "string" && body.availableTime.length > MAX_FIELD_LENGTH) {
    return NextResponse.json({ ok: false, error: "invalid field" }, { status: 400 });
  }
  if (typeof body.message === "string" && body.message.length > MAX_FIELD_LENGTH * 4) {
    return NextResponse.json({ ok: false, error: "invalid field" }, { status: 400 });
  }

  const submittedAt = new Date().toISOString();
  const privacyConsent = body.agree === "on" || body.agree === true;

  // PII (name/phone) is masked before logging — this console.log is currently
  // the only place this mock request is recorded.
  console.log("[consult] new inquiry (mock, not persisted):", {
    ...body,
    contactName: mask(body.contactName),
    phone: mask(body.phone),
    agree: privacyConsent,
    submittedAt,
  });

  return NextResponse.json({ ok: true, submittedAt });
}
