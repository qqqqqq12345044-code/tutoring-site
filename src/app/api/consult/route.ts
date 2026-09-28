import { NextResponse } from "next/server";
import { validateConsultBody } from "@/lib/consult/validate";
import { googleSheetsPersistence, ConsultPersistenceError } from "@/lib/consult/googleSheetsPersistence";
import { isRateLimited, wasRecentlySubmitted, markSubmitted } from "@/lib/consult/rateLimit";

// Persists via a Google Apps Script Web App + Google Sheets (see
// docs/setup/consult-google-apps-script.md) — the script also sends the
// admin email notification, so no separate notifier call is needed here.
// See src/lib/consult/notification.ts if a second channel (e.g. Slack) is
// ever added independently of the sheet.

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "too many requests" }, { status: 429 });
  }

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

  // Best-effort duplicate guard for rapid repeat submissions (double-tap,
  // client retry). Only checked here — marked as submitted below, after a
  // confirmed save, so a failed attempt never blocks a legitimate retry.
  const dedupeKey = `${result.payload.phone}:${result.payload.studentName}`;
  if (wasRecentlySubmitted(dedupeKey)) {
    return NextResponse.json({ ok: true, submittedAt: new Date().toISOString() });
  }

  const record = {
    ...result.payload,
    submittedAt: new Date().toISOString(),
    sourceUrl: request.headers.get("referer") ?? "",
  };

  try {
    await googleSheetsPersistence.save(record);
  } catch (err) {
    const kind = err instanceof ConsultPersistenceError ? err.kind : "unknown";
    // Never log the record itself — only the failure category.
    console.error(`[consult] persistence failed: ${kind}`);
    return NextResponse.json({ ok: false, error: "submission failed" }, { status: 503 });
  }

  markSubmitted(dedupeKey);
  return NextResponse.json({ ok: true, submittedAt: record.submittedAt });
}
