/** Validated shape of a consult submission, before a server timestamp is attached. */
export interface ConsultPayload {
  contactName: string;
  phone: string;
  grade: string;
  subject: string;
  lessonType: string;
  province: string;
  cityDetail?: string;
  availableTime?: string;
  message?: string;
  agree: boolean;
}

/** A payload plus the server-assigned submission time — what persistence/notification receive. */
export interface ConsultRecord extends ConsultPayload {
  submittedAt: string;
}
