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
}
