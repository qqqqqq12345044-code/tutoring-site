import type { ConsultPayload } from "./types";

const MAX_FIELD_LENGTH = 500;
const MAX_MESSAGE_LENGTH = MAX_FIELD_LENGTH * 4;
const REQUIRED_STRING_FIELDS = [
  "studentName",
  "phone",
  "grade",
  "subject",
  "province",
  "agree",
] as const;

type ValidationResult =
  | { ok: true; payload: ConsultPayload }
  | { ok: false; error: string };

function isNonEmptyString(value: unknown, maxLength = MAX_FIELD_LENGTH): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

function optionalString(value: unknown, maxLength = MAX_FIELD_LENGTH): string | undefined {
  return typeof value === "string" && value.length <= maxLength ? value : undefined;
}

/** Validates a raw request body against the consult form's required fields. */
export function validateConsultBody(body: Record<string, unknown>): ValidationResult {
  for (const field of REQUIRED_STRING_FIELDS) {
    if (!isNonEmptyString(body[field])) {
      return { ok: false, error: "missing required fields" };
    }
  }
  if (typeof body.cityDetail === "string" && body.cityDetail.length > MAX_FIELD_LENGTH) {
    return { ok: false, error: "invalid field" };
  }
  if (typeof body.availableTime === "string" && body.availableTime.length > MAX_FIELD_LENGTH) {
    return { ok: false, error: "invalid field" };
  }
  if (typeof body.message === "string" && body.message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: "invalid field" };
  }

  return {
    ok: true,
    payload: {
      studentName: body.studentName as string,
      phone: body.phone as string,
      grade: body.grade as string,
      subject: body.subject as string,
      province: body.province as string,
      cityDetail: optionalString(body.cityDetail),
      availableTime: optionalString(body.availableTime),
      message: optionalString(body.message, MAX_MESSAGE_LENGTH),
      agree: body.agree === "on" || body.agree === true,
    },
  };
}
