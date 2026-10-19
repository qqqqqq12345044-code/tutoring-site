/**
 * Builds data/official/admin-dongs.json — the nationwide 행정동(읍·면·동) table with each 행정동's 법정동/리 —
 * from 행정안전부 주민등록 행정기관 코드 files. Re-runnable; dry run by default.
 *
 *   1. Download jscodeYYYYMMDD.zip (current codes, not "말소코드포함") from the latest post on
 *      https://www.mois.go.kr/frt/bbs/type001/commonSelectBoardList.do?bbsId=BBSMSTR_000000000052
 *      ("행정기관(행정동) 및 관할구역(법정동) 변경내역") and unzip it.
 *   2. npx tsx scripts/official/admin-dongs.ts --src <unzipped dir> --source-url <post URL>          (dry run: stats + diff)
 *      npx tsx scripts/official/admin-dongs.ts --src <dir> --source-url <post URL> --write            (writes the JSON)
 *
 * Nothing is inferred: every row is copied from the two files. Pages are NOT created from this table —
 * src/data/dongs.ts stays the list of page-enabled 행정동 and is checked against it (validate:quick).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { readKikcdH, readKikmix } from "./lib/mois-jscode";
import type { OfficialAdminDongTable } from "./lib/admin-dong-table";

const OUT = "data/official/admin-dongs.json";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function main() {
  const src = arg("--src");
  const sourceUrl = arg("--source-url");
  if (!src || !sourceUrl) {
    console.error("usage: --src <unzipped jscode dir> --source-url <MOIS post URL> [--write]");
    process.exit(2);
  }
  const files = readdirSync(src);
  const hFile = files.find((f) => /^KIKcd_H\.\d{8}$/.test(f));
  const mixFile = files.find((f) => /^KIKmix\.\d{8}$/.test(f));
  if (!hFile || !mixFile) throw new Error(`KIKcd_H.YYYYMMDD / KIKmix.YYYYMMDD not found in ${src}`);
  const asOf = hFile.slice(-8);
  if (mixFile.slice(-8) !== asOf) throw new Error(`file dates differ: ${hFile} / ${mixFile}`);

  const admin = readKikcdH(path.join(src, hFile)).filter((r) => !r.deleted);
  const mix = readKikmix(path.join(src, mixFile)).filter((r) => !r.deleted);

  const sido = admin.filter((r) => r.code.endsWith("00000000"));
  const sigungu = admin.filter((r) => !r.code.endsWith("00000000") && r.code.endsWith("00000"));
  const emd = admin.filter((r) => !r.code.endsWith("00000"));

  const legalByCode = new Map<string, [string, string][]>();
  for (const m of mix) {
    if (m.code.endsWith("00000")) continue; // 시도·시군구 self rows
    const list = legalByCode.get(m.code) ?? [];
    if (!list.some(([c]) => c === m.legalCode)) list.push([m.legalCode, m.legalName]);
    legalByCode.set(m.code, list);
  }

  const missingLegal = emd.filter((d) => !legalByCode.has(d.code));
  if (missingLegal.length > 0) throw new Error(`${missingLegal.length} 행정동 without 법정동 rows, e.g. ${missingLegal[0].code}`);

  const table: OfficialAdminDongTable = {
    source: {
      label: `행정안전부 주민등록 행정기관(행정동) 코드 jscode${asOf} (KIKcd_H·KIKmix)`,
      url: sourceUrl,
      asOf: `${asOf.slice(0, 4)}-${asOf.slice(4, 6)}-${asOf.slice(6, 8)}`,
    },
    sido: sido.map((r) => ({ code: r.code, name: r.sido })),
    sigungu: sigungu.map((r) => ({ code: r.code, sido: r.sido, name: r.sigungu })),
    dongs: emd.map((r) => ({
      code: r.code,
      sido: r.sido,
      sigungu: r.sigungu,
      name: r.emd,
      created: r.created,
      legal: legalByCode.get(r.code)!,
    })),
  };

  // Stats
  const generalGu = table.sigungu.filter((s) => s.name.includes(" "));
  const byKind = (suffix: string) => table.dongs.filter((d) => d.name.endsWith(suffix)).length;
  const legalCount = new Map<string, number>();
  for (const d of table.dongs) for (const [c] of d.legal) legalCount.set(c, (legalCount.get(c) ?? 0) + 1);
  const uniqueLegal = [...legalCount.values()].filter((n) => n === 1).length;
  console.log(`source: ${table.source.label} (${table.source.asOf})`);
  console.log(`시도 ${table.sido.length} / 시군구 ${table.sigungu.length - generalGu.length} + 일반구 ${generalGu.length} / 읍면동 ${table.dongs.length} (동 ${byKind("동")}·읍 ${byKind("읍")}·면 ${byKind("면")})`);
  console.log(`법정동·리 ${legalCount.size}: 행정동 1곳에만 속함 ${uniqueLegal} (${((uniqueLegal / legalCount.size) * 100).toFixed(1)}%), 여러 행정동에 걸침 ${legalCount.size - uniqueLegal}`);

  if (existsSync(OUT)) {
    const prev = JSON.parse(readFileSync(OUT, "utf-8")) as OfficialAdminDongTable;
    const prevCodes = new Set(prev.dongs.map((d) => d.code));
    const nextCodes = new Set(table.dongs.map((d) => d.code));
    const added = table.dongs.filter((d) => !prevCodes.has(d.code));
    const removed = prev.dongs.filter((d) => !nextCodes.has(d.code));
    console.log(`diff vs ${prev.source.asOf}: +${added.length} / -${removed.length} 행정동`);
    for (const d of [...added.slice(0, 10)]) console.log(`  + ${d.code} ${d.sido} ${d.sigungu} ${d.name}`);
    for (const d of [...removed.slice(0, 10)]) console.log(`  - ${d.code} ${d.sido} ${d.sigungu} ${d.name}`);
  }

  if (process.argv.includes("--write")) {
    mkdirSync(path.dirname(OUT), { recursive: true });
    writeFileSync(OUT, JSON.stringify(table) + "\n");
    console.log(`wrote ${OUT}`);
  } else {
    console.log("dry run (pass --write to save)");
  }
}

main();
