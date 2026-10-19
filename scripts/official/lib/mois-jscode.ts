/**
 * Parser for 행정안전부 주민등록 행정기관 코드 (jscodeYYYYMMDD.zip, MOIS board BBSMSTR_000000000052,
 * "행정기관(행정동) 및 관할구역(법정동) 변경내역"). The zip holds fixed-width CP949 text files:
 * - KIKcd_H.YYYYMMDD: 행정동코드 / 시도명 / 시군구명 / 읍면동명 / 생성일자 / 말소일자
 * - KIKmix.YYYYMMDD:  행정동코드 / 시도명 / 시군구명 / 읍면동명 / 법정동코드 / 동리명 / 생성일자 / 말소일자
 * Field offsets are byte offsets read from each file's own header line (checked 2026-10-19 on jscode20261012).
 */
import { readFileSync } from "fs";

const decoder = new TextDecoder("euc-kr");

type Field = [name: string, start: number, end: number];

const H_FIELDS: Field[] = [
  ["code", 0, 10],
  ["sido", 11, 41],
  ["sigungu", 42, 72],
  ["emd", 73, 103],
  ["created", 104, 112],
  ["deleted", 113, 121],
];

const MIX_FIELDS: Field[] = [
  ["code", 0, 10],
  ["sido", 11, 41],
  ["sigungu", 42, 72],
  ["emd", 73, 103],
  ["legalCode", 104, 114],
  ["legalName", 115, 145],
  ["created", 146, 154],
  ["deleted", 155, 163],
];

function parse(path: string, fields: Field[], headerLabels: string[]): Record<string, string>[] {
  const lines = readFileSync(path).toString("latin1").split("\n");
  const header = Buffer.from(lines[0], "latin1");
  // Guard: the header must carry the labels at the offsets this parser assumes.
  for (let i = 0; i < headerLabels.length; i++) {
    const label = Buffer.from(new TextEncoderCp949().encode(headerLabels[i]));
    if (header.indexOf(label) !== fields[i][1]) {
      throw new Error(`${path}: header label "${headerLabels[i]}" not at byte ${fields[i][1]} — file layout changed`);
    }
  }
  return lines
    .slice(1)
    .filter((l) => l.trim().length > 0)
    .map((l) => {
      const bytes = Buffer.from(l, "latin1");
      const row: Record<string, string> = {};
      for (const [name, start, end] of fields) row[name] = decoder.decode(bytes.subarray(start, end)).trim();
      return row;
    });
}

/** Minimal CP949 encoder for the fixed header labels (Node has no built-in EUC-KR encoder). */
class TextEncoderCp949 {
  private static table: Map<string, number[]> | null = null;
  encode(text: string): Uint8Array {
    if (!TextEncoderCp949.table) {
      // Build a reverse table for Hangul syllables by decoding the KS X 1001 Hangul block.
      const t = new Map<string, number[]>();
      for (let hi = 0xb0; hi <= 0xc8; hi++) {
        for (let lo = 0xa1; lo <= 0xfe; lo++) {
          const ch = decoder.decode(Uint8Array.from([hi, lo]));
          if (ch.length === 1 && !t.has(ch)) t.set(ch, [hi, lo]);
        }
      }
      TextEncoderCp949.table = t;
    }
    const out: number[] = [];
    for (const ch of text) {
      const code = TextEncoderCp949.table.get(ch);
      if (code) out.push(...code);
      else if (ch.charCodeAt(0) < 0x80) out.push(ch.charCodeAt(0));
      else throw new Error(`cannot encode header label char ${ch}`);
    }
    return Uint8Array.from(out);
  }
}

export interface MoisAdminRow {
  code: string;
  sido: string;
  sigungu: string;
  emd: string;
  created: string;
  deleted: string;
}

export interface MoisMixRow extends MoisAdminRow {
  legalCode: string;
  legalName: string;
}

export function readKikcdH(path: string): MoisAdminRow[] {
  return parse(path, H_FIELDS, ["행정동코드", "시도명", "시군구명", "읍면동명", "생성일자", "말소일자"]) as unknown as MoisAdminRow[];
}

export function readKikmix(path: string): MoisMixRow[] {
  return parse(path, MIX_FIELDS, ["행정동코드", "시도명", "시군구명", "읍면동명", "법정동코드", "동리명", "생성일자", "말소일자"]) as unknown as MoisMixRow[];
}
