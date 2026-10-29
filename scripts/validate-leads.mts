// lib/leads(Lead/전화 클릭/통화 webhook/Telegram/요약/대시보드) 시나리오 검증. fake 데이터만 쓴다.
// 실행: npm run validate:leads (tsx)  (네트워크/Telegram/provider 실제 호출 없음)
import { readLeadFlags, ALL_FLAGS_OFF, type LeadFlags } from "../src/lib/leads/flags";
import { createMemoryLeadStore } from "../src/lib/leads/store";
import { createMemoryNotifier, createTelegramNotifier, telegramNotifierFromEnv } from "../src/lib/leads/telegram";
import { handleCallWebhook, handlePhoneClick, handleWebLeadBeacon, type CallWebhookDeps } from "../src/lib/leads/service";
import { matchCallToClick } from "../src/lib/leads/callMatching";
import { signHmac } from "../src/lib/leads/callProvider";
import { createMockCallProvider } from "../src/lib/leads/providers/mock";
import { createTwilioCallProvider, twilioSignature } from "../src/lib/leads/providers/twilio";
import { resolveCallProvider } from "../src/lib/leads/providers/index";
import { mockSummaryAdapter } from "../src/lib/leads/summary";
import { aggregateLeadDashboard } from "../src/lib/leads/dashboard";
import { maskPhoneNumber } from "../src/lib/leads/sanitize";
import type { LeadProject, PhoneClickEvent } from "../src/lib/leads/types";

const PROJECT: LeadProject = (process.env.LEADS_TEST_PROJECT as LeadProject) || "GYOGWASEOLGYE";
let failures = 0;
let passes = 0;
function check(name: string, ok: boolean, detail = "") {
  if (ok) passes += 1;
  else {
    failures += 1;
    console.log(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const FAKE_PHONE = "010-0000-0000";
const FAKE_NAME = "테스트학생";
const SECRET = "test-secret-not-real";
const T0 = Date.parse("2026-10-27T03:00:00.000Z");
const ON: LeadFlags = { ...readLeadFlags({}), leadEvents: true, telegram: true, phoneClickTracking: true, callProvider: true, callRecording: true, callAiSummary: true };

function deps(flags: LeadFlags, nowMs = T0) {
  const notifier = createMemoryNotifier();
  const store = createMemoryLeadStore();
  let n = 0;
  return {
    notifier,
    store,
    d: { project: PROJECT, flags, store, notifier, now: () => new Date(nowMs), newId: () => `lead-${++n}`, log: () => {} },
  };
}

const attribution = {
  source: "naver", medium: "cpc", campaign: "doran_ja", content: "", term: "", referrer: "https://search.naver.com/",
  landingPage: "/japanese?utm_source=naver&utm_medium=cpc&NaPm=ct%3Dabc", hasNaPm: true, attributionSource: "UTM_NAVER_CPC",
  firstTouch: { source: "naver", medium: "cpc", campaign: "doran_ja", content: "", term: "", referrer: "", landingPage: "/japanese?utm_source=naver", hasNaPm: true, capturedAt: "2026-10-27T02:50:00.000Z" },
  lastTouch: null,
};

function clickBody(id: string, atMs: number, extra: Record<string, unknown> = {}) {
  return JSON.stringify({
    project: PROJECT, clickEventId: id, clickedAt: new Date(atMs).toISOString(), currentPage: "/japanese?x=1",
    displayedNumberId: "main", ctaLocation: "floating", sessionId: "sess-12345678", attribution, context: { language: "일본어" },
    phone: FAKE_PHONE, name: FAKE_NAME, ...extra,
  });
}

function signed(body: Record<string, unknown>, nowMs = T0, secret = SECRET) {
  const rawBody = JSON.stringify(body);
  const ts = String(Math.floor(nowMs / 1000));
  const headers = new Map([["x-mock-timestamp", ts], ["x-mock-signature", signHmac(secret, ts, rawBody)]]);
  return { rawBody, headers: { get: (k: string) => headers.get(k.toLowerCase()) ?? null } };
}

function webhookDeps(flags: LeadFlags, nowMs = T0) {
  const base = deps(flags, nowMs);
  const d: CallWebhookDeps = { ...base.d, provider: createMockCallProvider(SECRET), summaryAdapter: mockSummaryAdapter };
  return { ...base, d };
}

const noPii = (text: string) => !text.includes("0000-0000") && !text.includes(FAKE_NAME) && !text.includes("NaPm=");

// ---------------------------------------------------------------- flags OFF
{
  check("flags: env 없음 → 전부 OFF", Object.values(readLeadFlags({})).every((v) => v === false));
  check("flags: 'true'만 ON", readLeadFlags({ LEAD_TELEGRAM_ENABLED: "1" }).telegram === false && readLeadFlags({ LEAD_TELEGRAM_ENABLED: "true" }).telegram === true);
  const { d, notifier, store } = deps(ALL_FLAGS_OFF);
  const web = await handleWebLeadBeacon(JSON.stringify({ project: PROJECT, attribution, context: {} }), d);
  const click = await handlePhoneClick(clickBody("c-off", T0), d);
  const wh = await handleCallWebhook({ headers: { get: () => null }, rawBody: "{}" }, { ...d, provider: createMockCallProvider(SECRET) });
  const snap = await store.snapshot();
  check("flags OFF: web 404", web.status === 404);
  check("flags OFF: phone-click 404", click.status === 404);
  check("flags OFF: webhook 404", wh.status === 404);
  check("flags OFF: 저장/알림 0", snap.leads.length + snap.clicks.length === 0 && notifier.sent.length === 0);
  check("telegram env 없음 → notifier null", telegramNotifierFromEnv(true, {}) === null && telegramNotifierFromEnv(false, { TELEGRAM_LEAD_BOT_TOKEN: "x", TELEGRAM_LEAD_CHAT_ID: "y" }) === null);
  check("provider: env 없음 → null", resolveCallProvider({}) === null);
  check("provider: mock은 Production에서 null", resolveCallProvider({ CALL_PROVIDER: "mock", CALL_WEBHOOK_SECRET: "s", VERCEL_ENV: "production" }) === null);
}

// ---------------------------------------------------------------- web lead
{
  const { d, notifier, store } = deps(ON);
  const res = await handleWebLeadBeacon(
    JSON.stringify({ project: PROJECT, attribution, context: { language: "일본어", studyGoal: "회화", message: "상담 내용 원문", name: FAKE_NAME }, phone: FAKE_PHONE }),
    d,
  );
  const msg = notifier.sent[0] ?? "";
  const lead = (await store.snapshot()).leads[0];
  check("web: 202", res.status === 202);
  check("web: LeadEvent WEB_FORM/NEW", lead?.channel === "WEB_FORM" && lead.status === "NEW" && lead.project === PROJECT);
  check("web: context 허용 필드만", lead && !("message" in lead.context) && !("name" in lead.context));
  check("web: telegram 1건 + 유입/캠페인/랜딩", notifier.sent.length === 1 && msg.includes("UTM_NAVER_CPC") && msg.includes("doran_ja") && msg.includes("랜딩: /japanese"));
  check("web: telegram에 PII/query 없음", noPii(msg) && !msg.includes("상담 내용 원문"), msg);
  const wrong = await handleWebLeadBeacon(JSON.stringify({ project: "OTHER" }), d);
  check("web: 다른 project 400", wrong.status === 400);
  check("web: 깨진 JSON 400", (await handleWebLeadBeacon("{not json", d)).status === 400);
  const telegramOff = deps({ ...ON, telegram: false });
  await handleWebLeadBeacon(JSON.stringify({ project: PROJECT, attribution, context: {} }), { ...telegramOff.d, notifier: null });
  check("web: telegram OFF여도 LeadEvent는 기록", (await telegramOff.store.snapshot()).leads.length === 1);
}

// ---------------------------------------------------------------- telegram adapter 실패 격리
{
  const slow = createTelegramNotifier({ token: "fake", chatId: "fake", timeoutMs: 50, fetchImpl: (_u, init) => new Promise((_, rej) => {
    // AbortSignal.timeout 타이머는 unref라서, 테스트 프로세스가 먼저 끝나지 않게 ref 타이머를 하나 잡아 둔다.
    const keep = setTimeout(() => {}, 1_000);
    init.signal?.addEventListener("abort", () => { clearTimeout(keep); rej(Object.assign(new Error("t"), { name: "TimeoutError" })); });
  }) });
  const r1 = await slow.send("x");
  const http = createTelegramNotifier({ token: "fake", chatId: "fake", fetchImpl: async () => ({ ok: false, status: 500 }) });
  const r2 = await http.send("x");
  const net = createTelegramNotifier({ token: "fake", chatId: "fake", fetchImpl: async () => { throw new TypeError("fetch failed"); } });
  const r3 = await net.send("x");
  check("telegram: timeout 분류", !r1.ok && r1.reason === "timeout");
  check("telegram: http 실패 분류", !r2.ok && r2.reason === "http");
  check("telegram: network 실패 분류(throw 안 함)", !r3.ok && r3.reason === "network");
  const failing = deps(ON);
  const res = await handleWebLeadBeacon(JSON.stringify({ project: PROJECT, attribution, context: {} }), { ...failing.d, notifier: net });
  check("web: telegram 실패해도 202", res.status === 202);
}

// ---------------------------------------------------------------- phone click
{
  const { d, store } = deps(ON);
  const res = await handlePhoneClick(clickBody("click-1", T0), d);
  const saved = (await store.snapshot()).clicks[0];
  check("click: 202", res.status === 202);
  check("click: query 제거된 pathname", saved?.currentPage === "/japanese");
  check("click: 번호/이름 필드 저장 안 함", saved && !JSON.stringify(saved).includes("0000-0000") && !JSON.stringify(saved).includes(FAKE_NAME));
  await handlePhoneClick(clickBody("click-old", T0 - 60 * 60_000), d);
  const old = (await store.snapshot()).clicks.find((c) => c.clickEventId === "click-old");
  check("click: 시계 크게 틀린 clickedAt → 서버 시각", old?.clickedAt === new Date(T0).toISOString());
  check("click: id 없으면 400", (await handlePhoneClick(JSON.stringify({ project: PROJECT }), d)).status === 400);
  check("click: 과대 본문 400", (await handlePhoneClick("x".repeat(7_000), d)).status === 400);
  const notifyOff = deps(ON);
  await handlePhoneClick(clickBody("c2", T0), notifyOff.d);
  check("click: 클릭 즉시 알림 기본 OFF", notifyOff.notifier.sent.length === 0);
}

// ---------------------------------------------------------------- matching
{
  const mk = (id: string, atMs: number, source = "UTM_NAVER_CPC", project: LeadProject = PROJECT): PhoneClickEvent => ({
    version: 1, clickEventId: id, project, clickedAt: new Date(atMs).toISOString(), currentPage: "/", displayedNumberId: "main",
    ctaLocation: "floating", sessionId: "s", context: {},
    attribution: { ...attribution, attributionSource: source as PhoneClickEvent["attribution"]["attributionSource"], firstTouch: null, lastTouch: null },
  });
  const call = (extra: Record<string, unknown> = {}) => ({
    provider: "mock", providerEventId: "e", providerCallId: "c", project: PROJECT, status: "COMPLETED" as const,
    callStartedAt: new Date(T0).toISOString(), ...extra,
  });
  const confirmed = matchCallToClick(call({ clickEventId: "k1" }), [mk("k0", T0 - 10_000), mk("k1", T0 - 100_000)]);
  check("match: provider click id → MATCHED/CONFIRMED", confirmed.status === "MATCHED" && confirmed.confidence === "CONFIRMED" && confirmed.click?.clickEventId === "k1");
  const likely = matchCallToClick(call(), [mk("a", T0 - 20_000), mk("b", T0 - 150_000)]);
  check("match: 시각 근접 → LIKELY(확정 아님)", likely.status === "LIKELY" && likely.confidence === "LIKELY" && likely.click?.clickEventId === "a");
  check("match: 같은 유입이면 ambiguous=false", likely.ambiguous === false && likely.candidateCount === 2);
  const amb = matchCallToClick(call(), [mk("a", T0 - 20_000), mk("b", T0 - 30_000, "DIRECT")]);
  check("match: 후보 유입이 다르면 ambiguous", amb.ambiguous === true && amb.confidence === "LIKELY");
  const none = matchCallToClick(call(), [mk("late", T0 - 10 * 60_000), mk("future", T0 + 5 * 60_000)]);
  check("match: window 밖 → UNMATCHED/UNKNOWN", none.status === "UNMATCHED" && none.confidence === "UNKNOWN");
  const other = matchCallToClick(call(), [mk("x", T0 - 5_000, "DIRECT", PROJECT === "DORAN" ? "GYOGWASEOLGYE" : "DORAN")]);
  check("match: 다른 프로젝트 클릭 무시", other.status === "UNMATCHED");
  const used = matchCallToClick(call(), [mk("a", T0 - 20_000)], { usedClickIds: new Set(["a"]) });
  check("match: 이미 쓴 클릭 재사용 안 함", used.status === "UNMATCHED");
  const unknownId = matchCallToClick(call({ clickEventId: "nope" }), [mk("a", T0 - 20_000)]);
  check("match: 모르는 click id → 시각 기반 LIKELY로만", unknownId.confidence === "LIKELY");
}

// ---------------------------------------------------------------- webhook
{
  const completed = {
    eventId: "evt-1", callId: "call-1", type: "call.completed", startedAt: new Date(T0).toISOString(),
    endedAt: new Date(T0 + 402_000).toISOString(), durationSeconds: 402, answered: true, recorded: true,
    transcript: `안녕하세요 ${FAKE_NAME}입니다 일본어 회화 수업 방식이 궁금해요 번호는 ${FAKE_PHONE}`,
    summary: ["회화 목적", "수업 방식 문의", "후속 상담 필요"],
  };
  const { d, store, notifier } = webhookDeps(ON);
  await handlePhoneClick(clickBody("click-w", T0 - 40_000), d);
  const ok = signed(completed);
  const r1 = await handleCallWebhook(ok, d);
  const msg = notifier.sent[0] ?? "";
  check("webhook valid: 200 + LIKELY", r1.status === 200 && r1.body.confidence === "LIKELY", JSON.stringify(r1.body));
  check("webhook: PHONE lead 필드", r1.lead?.channel === "PHONE" && r1.lead.phone?.durationSeconds === 402 && r1.lead.phone.summaryStatus === "READY" && r1.lead.phone.transcriptStatus === "READY");
  check("webhook: 알림에 LIKELY 표시 + 요약 + 6분 42초", msg.includes("LIKELY (추정") && msg.includes("- 회화 목적") && msg.includes("6분 42초"), msg);
  check("webhook: 알림/저장에 transcript·PII 없음", noPii(msg) && !msg.includes("궁금해요") && !JSON.stringify(await store.snapshot()).includes("궁금해요"));
  const dup = await handleCallWebhook(signed(completed), d);
  check("webhook duplicate: 200 duplicate, 알림 추가 없음", dup.status === 200 && dup.body.duplicate === true && notifier.sent.length === 1);

  const bad = signed(completed, T0, "wrong-secret");
  check("webhook invalid signature: 401", (await handleCallWebhook(bad, d)).status === 401);
  const tampered = { ...signed(completed), rawBody: JSON.stringify({ ...completed, durationSeconds: 1 }) };
  check("webhook 본문 변조: 401", (await handleCallWebhook(tampered, d)).status === 401);
  const replay = webhookDeps(ON, T0 + 10 * 60_000);
  check("webhook replay(timestamp 10분 전): 401", (await handleCallWebhook(signed({ ...completed, eventId: "evt-r" }, T0), replay.d)).status === 401);
  check("webhook 알 수 없는 형식: 400", (await handleCallWebhook(signed({ eventId: "x" }), d)).status === 400);
  check("webhook 헤더 없음: 401", (await handleCallWebhook({ headers: { get: () => null }, rawBody: "{}" }, d)).status === 401);

  // CONFIRMED: provider가 click id를 돌려줌
  const conf = webhookDeps(ON);
  await handlePhoneClick(clickBody("click-c", T0 - 100_000), conf.d);
  const rc = await handleCallWebhook(signed({ ...completed, eventId: "evt-c", clickEventId: "click-c" }), conf.d);
  check("webhook: click id 반환 → CONFIRMED", rc.body.confidence === "CONFIRMED" && conf.notifier.sent[0]?.includes("CONFIRMED"));

  // UNKNOWN: 클릭 없음 → attribution 비움
  const unk = webhookDeps(ON);
  const ru = await handleCallWebhook(signed({ ...completed, eventId: "evt-u" }), unk.d);
  check("webhook: 클릭 없음 → UNKNOWN + attribution 비움", ru.body.confidence === "UNKNOWN" && ru.lead?.attribution.campaign === "" && unk.notifier.sent[0]?.includes("유입: UNKNOWN"));

  // 부재중
  const missed = webhookDeps(ON);
  const rm = await handleCallWebhook(signed({ eventId: "evt-m", callId: "call-m", type: "call.missed", startedAt: new Date(T0).toISOString(), callerLast4: FAKE_PHONE }), missed.d);
  const mmsg = missed.notifier.sent[0] ?? "";
  check("webhook missed: 부재중 알림 + 마스킹 번호", rm.status === 200 && mmsg.includes("부재중") && mmsg.includes("010-****-0000") && !mmsg.includes("0000-0000") && mmsg.includes("콜백 필요"), mmsg);

  // 진행 중 이벤트는 저장만
  const started = webhookDeps(ON);
  const rs = await handleCallWebhook(signed({ eventId: "evt-s", callId: "call-s", type: "call.started", startedAt: new Date(T0).toISOString() }), started.d);
  check("webhook started: 저장만, 알림 없음", rs.body.stored === true && started.notifier.sent.length === 0);

  // 녹취 OFF → transcript/summary DISABLED
  const recOff = webhookDeps({ ...ON, callRecording: false });
  const rr = await handleCallWebhook(signed({ ...completed, eventId: "evt-ro" }), recOff.d);
  check("recording OFF: transcript/summary DISABLED, recorded=false", rr.lead?.phone?.transcriptStatus === "DISABLED" && rr.lead.phone.summaryStatus === "DISABLED" && rr.lead.phone.recorded === false && recOff.notifier.sent[0]?.includes("AI 요약: OFF"));
  const sumOff = webhookDeps({ ...ON, callAiSummary: false });
  const rso = await handleCallWebhook(signed({ ...completed, eventId: "evt-so" }), sumOff.d);
  check("AI summary OFF: summary DISABLED", rso.lead?.phone?.summaryStatus === "DISABLED");

  // provider summary 없음 → 별도 adapter(fake)
  const own = webhookDeps(ON);
  const noSummary: Record<string, unknown> = { ...completed };
  delete noSummary.summary;
  const ro = await handleCallWebhook(signed({ ...noSummary, eventId: "evt-own" }), own.d);
  check("fake transcript → mock adapter 요약", ro.lead?.phone?.summaryStatus === "READY" && (own.notifier.sent[0] ?? "").includes("회화 목적"));
  const noAdapter = webhookDeps(ON);
  const rna = await handleCallWebhook(signed({ ...noSummary, eventId: "evt-na" }), { ...noAdapter.d, summaryAdapter: null });
  check("adapter 없음 → UNAVAILABLE(외부 전송 없음)", rna.lead?.phone?.summaryStatus === "UNAVAILABLE");

  // 같은 클릭이 두 통화에 재사용되지 않음
  const reuse = webhookDeps(ON);
  await handlePhoneClick(clickBody("click-once", T0 - 30_000), reuse.d);
  await handleCallWebhook(signed({ ...completed, eventId: "e1", callId: "c1" }), reuse.d);
  const second = await handleCallWebhook(signed({ ...completed, eventId: "e2", callId: "c2" }), reuse.d);
  check("click 1개 → 두 번째 통화는 UNKNOWN", second.body.confidence === "UNKNOWN");
}

// ---------------------------------------------------------------- twilio scaffold
{
  const url = "https://example.test/api/calls/webhook";
  const provider = createTwilioCallProvider({ authToken: "fake-token", webhookUrl: url });
  const rawBody = new URLSearchParams({ CallSid: "CA123", CallStatus: "completed", CallDuration: "65", From: "+821000000000", Timestamp: "Tue, 27 Oct 2026 03:00:00 +0000" }).toString();
  const sig = twilioSignature("fake-token", url, new URLSearchParams(rawBody));
  const ok = await provider.verifyWebhook({ headers: { get: (k) => (k === "x-twilio-signature" ? sig : null) }, rawBody, receivedAt: T0 });
  const bad = await provider.verifyWebhook({ headers: { get: (k) => (k === "x-twilio-signature" ? "AAAA" : null) }, rawBody, receivedAt: T0 });
  const ev = provider.normalizeCallEvent(Object.fromEntries(new URLSearchParams(rawBody)), PROJECT);
  check("twilio: 서명 OK/NG", ok && !bad);
  check("twilio: 정규화", ev?.status === "COMPLETED" && ev.durationSeconds === 65 && ev.callStartedAt === "2026-10-27T03:00:00.000Z");
  check("twilio: 발신번호 원문 미보관", ev?.callerMasked === undefined || !ev.callerMasked.includes("0000000000"));
  check("twilio: credential 없으면 resolve null", resolveCallProvider({ CALL_PROVIDER: "twilio" }) === null);
}

// ---------------------------------------------------------------- dashboard + misc
{
  const { d, store } = webhookDeps(ON);
  await handleWebLeadBeacon(JSON.stringify({ project: PROJECT, attribution, context: { language: "일본어" } }), d);
  await handlePhoneClick(clickBody("dash-1", T0 - 20_000), d);
  await handleCallWebhook(signed({ eventId: "d1", callId: "dc1", type: "call.completed", startedAt: new Date(T0).toISOString(), durationSeconds: 100, answered: true }), d);
  await handleCallWebhook(signed({ eventId: "d2", callId: "dc2", type: "call.missed", startedAt: new Date(T0).toISOString() }), d);
  const dash = aggregateLeadDashboard(await store.snapshot(), { now: new Date(T0) });
  const total = (k: "leadCount" | "phoneClickCount" | "likelyCalls" | "unmatchedCalls" | "answeredCalls" | "missedCalls") => dash.rows.reduce((s, r) => s + r[k], 0);
  check("dashboard: 집계", total("leadCount") === 3 && total("phoneClickCount") === 1 && total("likelyCalls") === 1 && total("unmatchedCalls") === 1 && total("answeredCalls") === 1 && total("missedCalls") === 1, JSON.stringify(dash.rows));
  check("dashboard: conversion 미수집 → UNKNOWN", dash.rows.every((r) => r.conversion === "UNKNOWN"));
  check("dashboard: PII 없음", !JSON.stringify(dash).includes("0000-0000"));
  check("mask: 010", maskPhoneNumber("010-1234-5678") === "010-****-5678");
  check("mask: 이상한 값 → undefined", maskPhoneNumber("12") === undefined && maskPhoneNumber(undefined) === undefined);
}

console.log(`Leads(${PROJECT}): ${failures === 0 ? "PASS" : "FAIL"} (${passes} passed, ${failures} failed)`);
if (failures > 0) process.exit(1);
