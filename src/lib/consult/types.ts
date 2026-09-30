/** Validated shape of a consult submission, before a server timestamp is attached. */
export interface ConsultPayload {
  studentName: string;
  phone: string;
  grade: string;
  subject: string;
  province: string;
  cityDetail?: string;
  availableTime?: string;
  message?: string;
  agree: boolean;
}

/** A payload plus server-assigned metadata — what persistence/notification receive. */
export interface ConsultRecord extends ConsultPayload {
  submittedAt: string;
  /** Page the request originated from (derived server-side from the Referer header, never user input). */
  sourceUrl: string;
  /**
   * Idempotency key for this submission (client-generated and reused when the
   * same content is resubmitted; server-generated for clients that don't send
   * one). The Apps Script uses it to skip duplicate rows/emails.
   */
  submissionId: string;
}
