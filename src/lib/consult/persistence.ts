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
 * Mock persistence: logs a PII-masked record to the console. This is
 * currently the only place a consult submission is recorded — there is no
 * real backend connected yet.
 */
export const consolePersistence: ConsultPersistence = {
  async save(record) {
    console.log("[consult] new inquiry (mock, not persisted):", {
      ...record,
      contactName: mask(record.contactName),
      phone: mask(record.phone),
    });
  },
};
