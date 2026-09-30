import type { ConsultPersistence } from "./persistence";
import type { ConsultRecord } from "./types";

export type ConsultPersistenceErrorKind = "config" | "network" | "webhook";

/** Thrown by googleSheetsPersistence.save() — route.ts logs `.kind` only, never the record. */
export class ConsultPersistenceError extends Error {
  constructor(
    public readonly kind: ConsultPersistenceErrorKind,
    message: string,
    /** False when a retry can't help (missing config, rejected secret). */
    public readonly retryable = true
  ) {
    super(message);
    this.name = "ConsultPersistenceError";
  }
}

interface WebhookResponseBody {
  ok?: boolean;
  message?: string;
}

/**
 * One automatic retry is only safe once the deployed Apps Script dedupes by
 * submissionId (docs/setup/consult-apps-script.gs, v2). Against the old v1
 * script a retry after a lost response would append a second row and send a
 * second email, so this stays off until CONSULT_WEBHOOK_IDEMPOTENT=true is set
 * *after* deploying v2.
 */
const RETRY_DELAY_MS = 1_000;
/** Don't start a retry this late — ambiguous failures already take 20-40s. */
const RETRY_START_BUDGET_MS = 45_000;
/** A v2 duplicate answer comes from CacheService/the sheet lookup, so a retry should be quick. */
const RETRY_TIMEOUT_MS = 15_000;

export function isIdempotentWebhook(): boolean {
  return process.env.CONSULT_WEBHOOK_IDEMPOTENT === "true";
}

/** fetch()'s own default redirect limit, so manual following gives up at the same point. */
const MAX_REDIRECTS = 20;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

/**
 * Where a hop went, safe to log: hostname + a coarse path kind only. Never the
 * full URL — the webhook path carries the deployment ID and the echo URL
 * carries a reusable user_content_key.
 */
function describeHop(url: string): string {
  try {
    const { hostname, pathname } = new URL(url);
    const kind = pathname.endsWith("/exec") ? "exec" : pathname.includes("/echo") ? "echo" : "other";
    return `${hostname}/${kind}`;
  } catch {
    return "invalid-url";
  }
}

/**
 * Same semantics as fetch()'s default redirect: "follow" (303, and 301/302 after
 * a POST, become a GET without a body; 307/308 repeat the method and body), but
 * each hop is timed so the Apps Script POST (answered with a 302 only after
 * doPost() returns) can be told apart from the echo GET that delivers the
 * result. Logs one [consult-webhook-timing] line per call — status,
 * content-type, elapsed ms and hop host/kind only, no PII.
 */
async function fetchWithTimedRedirects(url: string, payload: string, signal?: AbortSignal): Promise<Response> {
  const start = Date.now();
  const hops: string[] = [];
  let method = "POST";
  let body: string | undefined = payload;
  let currentUrl = url;

  try {
    for (let hop = 0; ; hop++) {
      const hopStart = Date.now();
      const response = await fetch(currentUrl, {
        method,
        headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
        body,
        redirect: "manual",
        signal,
      });
      const location = response.headers.get("location");
      const label = hop === 0 ? "post" : `hop${hop}`;
      hops.push(
        `${label}=${response.status}/${Date.now() - hopStart}ms(${response.headers.get("content-type") ?? "-"})@${describeHop(currentUrl)}`
      );

      if (!REDIRECT_STATUSES.has(response.status) || !location) {
        console.info(`[consult-webhook-timing] ${hops.join(" ")} total=${Date.now() - start}ms`);
        return response;
      }
      if (hop >= MAX_REDIRECTS) throw new TypeError("redirect count exceeded");

      // Drain the redirect body so the connection can be reused.
      await response.arrayBuffer().catch(() => undefined);
      if (response.status === 303 || ((response.status === 301 || response.status === 302) && method === "POST")) {
        method = "GET";
        body = undefined;
      }
      currentUrl = new URL(location, currentUrl).toString();
    }
  } catch (err) {
    hops.push(`threw@${describeHop(currentUrl)}`);
    console.info(`[consult-webhook-timing] ${hops.join(" ")} total=${Date.now() - start}ms`);
    throw err;
  }
}

async function postOnce(webhookUrl: string, payload: string, signal?: AbortSignal): Promise<void> {
  const start = Date.now();
  let response: Response;
  try {
    response = await fetchWithTimedRedirects(webhookUrl, payload, signal);
  } catch (err) {
    // No PII here, only timing/error shape.
    console.error(
      `[consult] webhook fetch threw after ${Date.now() - start}ms: ${err instanceof Error ? err.message : "unknown"}`
    );
    throw new ConsultPersistenceError("network", "failed to reach the Google Sheets webhook");
  }
  const elapsedMs = Date.now() - start;

  // Read as text first so a non-JSON response body can still be logged
  // (safely — Apps Script's own error pages never echo submitted PII back).
  let rawText: string;
  try {
    rawText = await response.text();
  } catch {
    console.error(`[consult] webhook body read failed: status=${response.status} elapsed=${elapsedMs}ms`);
    throw new ConsultPersistenceError("webhook", "webhook response body could not be read");
  }
  let body: WebhookResponseBody = {};
  try {
    body = JSON.parse(rawText) as WebhookResponseBody;
  } catch {
    console.error(
      `[consult] webhook non-JSON response: status=${response.status} content-type=${response.headers.get("content-type")} elapsed=${elapsedMs}ms bodyPrefix=${JSON.stringify(rawText.slice(0, 200))}`
    );
    throw new ConsultPersistenceError("webhook", "webhook returned a non-JSON response");
  }

  if (!response.ok || body.ok !== true) {
    console.error(
      `[consult] webhook rejected: status=${response.status} ok=${body.ok} message=${body.message ?? ""} elapsed=${elapsedMs}ms`
    );
    throw new ConsultPersistenceError(
      "webhook",
      `webhook rejected the submission (status ${response.status})`,
      body.message !== "unauthorized" && body.message !== "bad request"
    );
  }
  if (body.message === "duplicate") {
    console.info(`[consult] webhook recognized a duplicate submissionId elapsed=${elapsedMs}ms`);
  }
}

/**
 * Persists a consult submission via a Google Apps Script Web App bound to a
 * Google Sheet (see docs/setup/consult-google-apps-script.md for setup and
 * docs/setup/consult-apps-script.gs for the script). The script also sends the
 * admin email notification in the same execution, so this is the only
 * outbound call this app makes — no separate notifier round-trip is needed.
 *
 * Apps Script Web Apps always answer HTTP 200 for a completed execution, even
 * when the script's own logic rejects the request (e.g. bad secret) — so a
 * failure is only visible in the JSON body's `ok` field, not the HTTP status.
 * Both are checked.
 */
export const googleSheetsPersistence: ConsultPersistence = {
  async save(record: ConsultRecord) {
    const webhookUrl = process.env.CONSULT_GOOGLE_SHEETS_WEBHOOK_URL;
    const secret = process.env.CONSULT_WEBHOOK_SECRET;
    const adminEmail = process.env.CONSULT_ADMIN_EMAIL;

    if (!webhookUrl) {
      throw new ConsultPersistenceError("config", "CONSULT_GOOGLE_SHEETS_WEBHOOK_URL is not configured", false);
    }

    const payload = JSON.stringify({
      secret,
      adminEmail,
      submissionId: record.submissionId,
      submittedAt: record.submittedAt,
      studentName: record.studentName,
      phone: record.phone,
      grade: record.grade,
      subject: record.subject,
      province: record.province,
      cityDetail: record.cityDetail ?? "",
      availableTime: record.availableTime ?? "",
      message: record.message ?? "",
      sourceUrl: record.sourceUrl,
      agree: record.agree,
    });

    const start = Date.now();
    try {
      await postOnce(webhookUrl, payload);
    } catch (err) {
      const retryable = err instanceof ConsultPersistenceError && err.retryable;
      if (!retryable || !isIdempotentWebhook() || Date.now() - start > RETRY_START_BUDGET_MS) throw err;

      // Same submissionId: the v2 script answers "duplicate" if the first
      // attempt was actually saved, or saves it now if it wasn't.
      console.error(`[consult] retrying webhook once after ${(err as ConsultPersistenceError).kind} failure`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      await postOnce(webhookUrl, payload, AbortSignal.timeout(RETRY_TIMEOUT_MS));
    }
  },
};
