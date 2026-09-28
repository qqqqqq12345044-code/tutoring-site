import type { ConsultPayload } from "./types";

const MAX_FIELD_LENGTH = 500;
const MAX_MESSAGE_LENGTH = MAX_FIELD_LENGTH * 4;
const REQUIRED_STRING_FIELDS = [
  "studentName",
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

/** Accepts Korean phone numbers in common formats (010-1234-5678, 01012345678, 02-123-4567, etc). */
export function isValidPhone(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const digits = value.replace(/[^0-9]/g, "");
  return /^0\d{8,10}$/.test(digits);
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
  if (!isValidPhone(body.phone)) {
    return { ok: false, error: "invalid phone" };
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
