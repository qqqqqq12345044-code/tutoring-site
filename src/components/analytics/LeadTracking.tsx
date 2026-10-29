"use client";

import { useEffect } from "react";
import { startLeadTracking } from "@/lib/leads/gyogwaseolgyeClient";

/**
 * Renders nothing. Captures first-touch attribution (UTM/referrer/landing, NaPm presence) and sends a
 * phone-click snapshot for every tel: link via one delegated listener (src/lib/leads/clientCore.ts) —
 * the call itself is never delayed or blocked. Inert unless NEXT_PUBLIC_LEAD_EVENTS_ENABLED /
 * NEXT_PUBLIC_PHONE_CLICK_TRACKING_ENABLED is "true".
 */
export default function LeadTracking() {
  useEffect(() => startLeadTracking(), []);
  return null;
}
