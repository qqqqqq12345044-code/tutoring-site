import { createHash, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { validateConsultBody } from "@/lib/consult/validate";
import type { ConsultPayload } from "@/lib/consult/types";
import {
  googleSheetsPersistence,
  ConsultPersistenceError,
  isIdempotentWebhook,
} from "@/lib/consult/googleSheetsPersistence";
import { isRateLimited, wasRecentlySubmitted, markSubmitted } from "@/lib/consult/rateLimit";

// Persists via a Google Apps Script Web App + Google Sheets (see
// docs/setup/consult-google-apps-script.md) — the script also sends the
// admin email notification, so no separate notifier call is needed here.
// See src/lib/consult/notification.ts if a second channel (e.g. Slack) is
// ever added independently of the sheet.

/** Same shape the Apps Script accepts (docs/setup/consult-apps-script.gs). */
const SUBMISSION_ID_PATTERN = /^[A-Za-z0-9-]{16,64}$/;

/** Hash of every user-entered field, so only a byte-identical resubmission counts as a duplicate. */
function contentFingerprint(payload: ConsultPayload): string {
  const fields = [
    payload.studentName,
    payload.phone.replace(/[^0-9]/g, ""),
    payload.grade,
    payload.subject,
    payload.province,
    payload.cityDetail ?? "",
    payload.availableTime ?? "",
    payload.message ?? "",
  ].map((v) => v.trim());
  return createHash("sha256").update(JSON.stringify(fields)).digest("hex");
}

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

  const submissionId =
    typeof body.submissionId === "string" && SUBMISSION_ID_PATTERN.test(body.submissionId)
      ? body.submissionId
      : randomUUID();

  // Best-effort duplicate guard for rapid repeat submissions (double-tap,
  // client retry). Keyed on the submission's idempotency key AND on its full
  // content — never on name+phone alone, which would swallow a genuinely
  // different request from the same family (e.g. a second subject). Only
  // checked here — marked below, after a confirmed (or ambiguous) save, so a
  // failed attempt never blocks a legitimate retry.
  const dedupeKeys = [`id:${submissionId}`, `content:${contentFingerprint(result.payload)}`];
  if (dedupeKeys.some(wasRecentlySubmitted)) {
    return NextResponse.json({ ok: true, submittedAt: new Date().toISOString() });
  }

  const record = {
    ...result.payload,
    submittedAt: new Date().toISOString(),
    sourceUrl: request.headers.get("referer") ?? "",
    submissionId,
  };

  try {
    await googleSheetsPersistence.save(record);
  } catch (err) {
    const kind = err instanceof ConsultPersistenceError ? err.kind : "unknown";
    // Never log the record itself — only the failure category.
    console.error(`[consult] persistence failed: ${kind}`);

    // Apps Script Web Apps occasionally return a malformed/non-JSON response
    // (a Google-side response-delivery quirk, not a script failure — see
    // docs/setup/consult-google-apps-script.md) even though the script's own
    // execution (Sheets append + email) completed. In that case ("webhook"
    // kind: we received *some* response from Apps Script, just not a
    // validated ok:true) we can't tell success from failure — so we treat it
    // as "possibly submitted" and gate a same-content retry the same as a
    // confirmed success, rather than risk a duplicate Sheets row + email.
    // "config"/"network" failures mean the request never reached Apps
    // Script at all, so those stay freely retryable.
    // Once the idempotent (v2) script is live, a retry can never duplicate —
    // the script answers "duplicate" by submissionId — so nothing is gated and
    // a submission that genuinely failed before saving can still get through.
    if (kind === "webhook" && !isIdempotentWebhook()) {
      dedupeKeys.forEach(markSubmitted);
    }
    return NextResponse.json({ ok: false, error: "submission failed" }, { status: 503 });
  }

  dedupeKeys.forEach(markSubmitted);
  return NextResponse.json({ ok: true, submittedAt: record.submittedAt });
}
