import type { ConsultPersistence } from "./persistence";
import type { ConsultRecord } from "./types";

export type ConsultPersistenceErrorKind = "config" | "network" | "webhook";

/** Thrown by googleSheetsPersistence.save() — route.ts logs `.kind` only, never the record. */
export class ConsultPersistenceError extends Error {
  constructor(
    public readonly kind: ConsultPersistenceErrorKind,
    message: string
  ) {
    super(message);
    this.name = "ConsultPersistenceError";
  }
}

interface WebhookResponseBody {
  ok?: boolean;
}

/**
 * Persists a consult submission via a Google Apps Script Web App bound to a
 * Google Sheet (see docs/setup/consult-google-apps-script.md for the script
 * itself and setup steps). The script also sends the admin email notification
 * in the same execution, so this is the only outbound call this app makes —
 * no separate notifier round-trip is needed.
 *
 * Apps Script Web Apps always answer HTTP 200 for a completed execution, even
 * when the script's own logic rejects the request (e.g. bad secret) — so a
 * failure is only visible in the JSON body's `ok` field, not the HTTP status.
 * Both are checked below.
 */
export const googleSheetsPersistence: ConsultPersistence = {
  async save(record: ConsultRecord) {
    const webhookUrl = process.env.CONSULT_GOOGLE_SHEETS_WEBHOOK_URL;
    const secret = process.env.CONSULT_WEBHOOK_SECRET;
    const adminEmail = process.env.CONSULT_ADMIN_EMAIL;

    if (!webhookUrl) {
      throw new ConsultPersistenceError("config", "CONSULT_GOOGLE_SHEETS_WEBHOOK_URL is not configured");
    }

    let response: Response;
    try {
      response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          adminEmail,
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
        }),
      });
    } catch {
      throw new ConsultPersistenceError("network", "failed to reach the Google Sheets webhook");
    }

    let body: WebhookResponseBody = {};
    try {
      body = (await response.json()) as WebhookResponseBody;
    } catch {
      throw new ConsultPersistenceError("webhook", "webhook returned a non-JSON response");
    }

    if (!response.ok || body.ok !== true) {
      throw new ConsultPersistenceError("webhook", `webhook rejected the submission (status ${response.status})`);
    }
  },
};
