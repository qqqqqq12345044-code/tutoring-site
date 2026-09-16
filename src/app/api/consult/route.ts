import { NextResponse } from "next/server";
import { validateConsultBody } from "@/lib/consult/validate";
import { consolePersistence } from "@/lib/consult/persistence";
import { noopNotifier } from "@/lib/consult/notification";

// TODO: 실제 운영 시 src/lib/consult/persistence.ts, notification.ts의
// mock 구현을 실제 저장소/알림 채널로 교체합니다. 이 파일은 바뀌지 않아도 됩니다.
export async function POST(request: Request) {
  let body: Record<string, unknown> = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  const result = validateConsultBody(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  const record = { ...result.payload, submittedAt: new Date().toISOString() };

  await consolePersistence.save(record);
  await noopNotifier.notify(record);

  return NextResponse.json({ ok: true, submittedAt: record.submittedAt });
}
