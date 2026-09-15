import { NextResponse } from "next/server";

// TODO: 실제 운영 시 이 위치에서 CRM/DB/알림 연동을 처리합니다.
// 현재는 실제 백엔드 연동 전이므로 요청 내용을 로그로만 남기고 성공 응답을 반환합니다.
export async function POST(request: Request) {
  let body: Record<string, unknown> = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  if (!body.contactName || !body.phone || !body.grade || !body.subject) {
    return NextResponse.json({ ok: false, error: "missing required fields" }, { status: 400 });
  }

  console.log("[consult] new inquiry (mock, not persisted):", body);

  return NextResponse.json({ ok: true });
}
