import type { CallProvider } from "../callProvider";
import { createMockCallProvider } from "./mock";
import { createTwilioCallProvider } from "./twilio";

type Env = Record<string, string | undefined>;

/**
 * CALL_PROVIDER(env)로 provider 선택. 알 수 없는 값/credential 누락이면 null(= webhook 404).
 * mock은 Vercel Production에서 선택되지 않는다.
 */
export function resolveCallProvider(env: Env = process.env): CallProvider | null {
  switch (env.CALL_PROVIDER) {
    case "mock":
      if (env.VERCEL_ENV === "production") return null;
      return env.CALL_WEBHOOK_SECRET ? createMockCallProvider(env.CALL_WEBHOOK_SECRET) : null;
    case "twilio":
      if (!env.TWILIO_AUTH_TOKEN || !env.TWILIO_WEBHOOK_URL) return null;
      return createTwilioCallProvider({ authToken: env.TWILIO_AUTH_TOKEN, webhookUrl: env.TWILIO_WEBHOOK_URL });
    default:
      return null;
  }
}
