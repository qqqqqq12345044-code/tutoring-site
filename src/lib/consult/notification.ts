import type { ConsultRecord } from "./types";

/**
 * Notification seam for consult submissions (e.g. email/Slack/CRM alert to
 * staff). Implement this against a real channel and swap the export
 * `route.ts` imports — no other code needs to change.
 */
export interface ConsultNotifier {
  notify(record: ConsultRecord): Promise<void>;
}

/** Mock notifier: no-op. No real-time notification channel is connected yet. */
export const noopNotifier: ConsultNotifier = {
  async notify() {
    // Intentionally empty until a real notification channel is connected.
  },
};
