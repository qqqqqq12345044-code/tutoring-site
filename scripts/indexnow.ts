/**
 * IndexNow change notification (Naver Search Advisor) — two-phase, dry-run by default.
 *
 *   1. BEFORE deploy:  npx tsx scripts/indexnow.ts prepare
 *      Diffs the live production sitemap.xml (= previous deploy) against the
 *      local sitemap() (= this deploy) and stores only new / removed /
 *      lastmod-changed URLs in a pending file. Read-only against production.
 *   (any time)         npx tsx scripts/indexnow.ts status            (readiness check; sends nothing)
 *   2. AFTER deploy:   npx tsx scripts/indexnow.ts submit            (dry-run: prints the request)
 *                      npx tsx scripts/indexnow.ts submit --send     (actually POSTs, once)
 *      Re-checks each pending URL on production (new/changed must be 200,
 *      removed must be gone from the live sitemap), POSTs one batch, then
 *      deletes the pending file so the same change is never pinged twice.
 *
 * Protocol (indexnow.org/documentation): POST https://<engine>/indexnow,
 * JSON { host, key, keyLocation, urlList }, ≤10,000 URLs, key 8–128 chars
 * [a-zA-Z0-9-]. Naver is listed as a participating engine at
 * indexnow.org/searchengines.json (searchadvisor.naver.com). Re-verify
 * Naver's own guide before the first real --send.
 *
 * The key is never hardcoded: INDEXNOW_KEY env, and the matching
 * public/{key}.txt (containing the key) must be deployed first.
 */
import fs from "fs";
import path from "path";
import { siteConfig } from "@/config/site";
import sitemap from "../src/app/sitemap";

const ENDPOINT = "https://searchadvisor.naver.com/indexnow";
const MAX_URLS_PER_RUN = 500; // well under the protocol's 10,000 — one deploy should never need more
const PENDING = path.join(__dirname, "..", "node_modules", ".cache", "indexnow-pending.json");

interface Pending {
  preparedAt: string;
  added: string[];
  removed: string[];
  changed: string[];
}

async function liveSitemap(): Promise<Map<string, string>> {
  const res = await fetch(`${siteConfig.domain}/sitemap.xml`);
  if (!res.ok) throw new Error(`production sitemap.xml → ${res.status}`);
  const xml = await res.text();
  const out = new Map<string, string>();
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = m[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? "";
    if (loc) out.set(loc.trim(), lastmod.trim().slice(0, 10));
  }
  return out;
}

function localSitemap(): Map<string, string> {
  return new Map(sitemap().map((e) => [e.url, String(e.lastModified ?? "").slice(0, 10)]));
}

async function prepare() {
  const [live, local] = [await liveSitemap(), localSitemap()];
  const added = [...local.keys()].filter((u) => !live.has(u));
  const removed = [...live.keys()].filter((u) => !local.has(u));
  // Before contentDates.ts ships, every live lastmod is the same build timestamp —
  // that's not a content signal, so "changed" is skipped for that one transition deploy.
  const liveIsBuildTime = new Set(live.values()).size <= 1;
  const changed = liveIsBuildTime
    ? []
    : [...local.keys()].filter((u) => live.has(u) && live.get(u) !== local.get(u));
  if (liveIsBuildTime) console.log("Live lastmod is a single build timestamp — skipping lastmod-based changes this time.");
  const pending: Pending = { preparedAt: new Date().toISOString(), added, removed, changed };
  fs.mkdirSync(path.dirname(PENDING), { recursive: true });
  fs.writeFileSync(PENDING, JSON.stringify(pending, null, 2));
  console.log(`IndexNow prepare: added ${added.length} / removed ${removed.length} / changed ${changed.length}`);
  console.log(`Pending file: ${PENDING}`);
}

async function submit(send: boolean) {
  if (!fs.existsSync(PENDING)) {
    console.log("IndexNow submit: no pending changes (run `prepare` before deploy). Nothing sent.");
    return;
  }
  const pending: Pending = JSON.parse(fs.readFileSync(PENDING, "utf-8"));
  const key = process.env.INDEXNOW_KEY ?? "";
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error("INDEXNOW_KEY env missing or not 8–128 chars [a-zA-Z0-9-]");
  const keyLocation = `${siteConfig.domain}/${key}.txt`;

  const keyRes = await fetch(keyLocation);
  if (!keyRes.ok || (await keyRes.text()).trim() !== key) {
    throw new Error(`key file not live at ${keyLocation} (deploy public/${key}.txt first)`);
  }

  const live = await liveSitemap();
  const urlList: string[] = [];
  for (const u of [...pending.added, ...pending.changed]) {
    const res = await fetch(u, { method: "HEAD" });
    if (res.ok && live.has(u)) urlList.push(u);
    else console.log(`  skip (not live yet): ${u}`);
  }
  for (const u of pending.removed) {
    if (!live.has(u)) urlList.push(u);
    else console.log(`  skip (still in live sitemap): ${u}`);
  }
  if (urlList.length === 0) {
    console.log("IndexNow submit: 0 URLs after live re-check. Nothing sent.");
    return;
  }
  if (urlList.length > MAX_URLS_PER_RUN) {
    throw new Error(`${urlList.length} URLs exceeds MAX_URLS_PER_RUN (${MAX_URLS_PER_RUN}) — review before sending`);
  }

  const body = { host: new URL(siteConfig.domain).host, key, keyLocation, urlList };
  if (!send) {
    console.log(`IndexNow submit (dry-run): would POST ${urlList.length} URLs to ${ENDPOINT}`);
    urlList.slice(0, 20).forEach((u) => console.log(`  ${u}`));
    if (urlList.length > 20) console.log(`  … +${urlList.length - 20}`);
    return;
  }
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow submit: ${res.status} for ${urlList.length} URLs`);
  if (res.status === 200 || res.status === 202) fs.unlinkSync(PENDING); // never ping the same change twice
  else console.log(`  pending file kept; response: ${(await res.text()).slice(0, 200)}`);
}

/**
 * Readiness check before the first real --send. Read-only, sends nothing, and
 * never prints the key. Exit code 1 while anything is missing.
 */
async function status() {
  const key = process.env.INDEXNOW_KEY ?? "";
  const keyFormatOk = /^[a-zA-Z0-9-]{8,128}$/.test(key);
  const keyFile = keyFormatOk ? path.join(__dirname, "..", "public", `${key}.txt`) : "";
  const localKeyFile = keyFormatOk && fs.existsSync(keyFile) && fs.readFileSync(keyFile, "utf-8").trim() === key;
  let liveKeyFile = false;
  if (localKeyFile) {
    try {
      const res = await fetch(`${siteConfig.domain}/${key}.txt`);
      liveKeyFile = res.ok && (await res.text()).trim() === key;
    } catch {
      liveKeyFile = false;
    }
  }
  const pending: Pending | null = fs.existsSync(PENDING) ? JSON.parse(fs.readFileSync(PENDING, "utf-8")) : null;
  const rows: [string, boolean, string][] = [
    ["INDEXNOW_KEY env (8–128자 [a-zA-Z0-9-])", keyFormatOk, key ? "" : "미설정"],
    ["public/{key}.txt (내용 = key)", localKeyFile, keyFormatOk ? "" : "key 필요"],
    ["운영 서버의 /{key}.txt (배포 완료)", liveKeyFile, localKeyFile ? "배포 전이면 정상" : "key 파일 필요"],
    [
      "pending 변경분 (prepare 결과)",
      Boolean(pending),
      pending ? `added ${pending.added.length} / removed ${pending.removed.length} / changed ${pending.changed.length}` : "prepare 필요",
    ],
  ];
  for (const [label, ok, note] of rows) console.log(`${ok ? "OK " : "NO "} ${label}${note ? ` — ${note}` : ""}`);
  const ready = rows.every(([, ok]) => ok);
  console.log(ready ? "IndexNow status: READY (submit --send 가능)" : "IndexNow status: NOT READY — 전송하지 마세요");
  if (!ready) process.exit(1);
}

const [cmd] = process.argv.slice(2);
(cmd === "prepare"
  ? prepare()
  : cmd === "submit"
    ? submit(process.argv.includes("--send"))
    : cmd === "status"
      ? status()
      : Promise.reject(new Error("usage: indexnow.ts prepare | status | submit [--send]"))
).catch((err) => {
  console.error(`IndexNow: ${(err as Error).message}`);
  process.exit(1);
});
