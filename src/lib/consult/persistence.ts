import type { ConsultRecord } from "./types";

/**
 * Persistence seam for consult submissions. Implement this against a real
 * backend (Google Sheets, a database, a CRM API, ...) and swap the export
 * `route.ts` imports — no other code needs to change.
 */
export interface ConsultPersistence {
  save(record: ConsultRecord): Promise<void>;
}

function mask(value: string): string {
  if (value.length === 0) return "(empty)";
  if (value.length <= 2) return "*".repeat(value.length);
  return `${value[0]}${"*".repeat(value.length - 2)}${value[value.length - 1]}`;
}

/**
 * Mock persistence: logs a PII-masked record to the console, for local
 * development only. Not used by the API route in production — see
 * googleSheetsPersistence.ts for the real backend. `message` (free-text
 * consult notes) is deliberately omitted, not just masked, since it can
 * contain arbitrary personal detail.
 */
export const consolePersistence: ConsultPersistence = {
  async save(record) {
    console.log("[consult] new inquiry (mock, not persisted):", {
      submittedAt: record.submittedAt,
      studentName: mask(record.studentName),
      phone: mask(record.phone),
      grade: record.grade,
      subject: record.subject,
      hasMessage: Boolean(record.message),
    });
  },
};
