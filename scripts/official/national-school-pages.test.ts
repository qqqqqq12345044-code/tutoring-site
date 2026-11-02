import { test } from "node:test";
import assert from "node:assert/strict";
import { buildNationalSchoolRows } from "./national-school-pages";

const base = { code: "1", name: "가나중학교", level: "중학교", office: "H10", state: "CONFIRMED", status: "candidate", slug: "gana-middle-school", dongCode: "3114059500", dongName: "무거동", citySlug: "ulsan-nam" };

test("only CONFIRMED candidates with a city and 행정동 become PAGE_ONLY hubs", () => {
  const rows = buildNationalSchoolRows([
    base,
    { ...base, code: "2", slug: "registered", status: "registered" },
    { ...base, code: "3", slug: "pending", status: "pending", state: "PENDING" },
    { ...base, code: "4", slug: "excluded", status: "excluded", state: "EXCLUDED" },
    { ...base, code: "5", slug: "gwangju", status: "unmapped-region", citySlug: undefined },
    { ...base, code: "6", slug: "no-dong", dongCode: undefined },
  ]);
  assert.deepEqual(rows.map((r) => r[1]), ["gana-middle-school"]);
});

test("NEIS names marked (폐교) are left out", () => {
  const rows = buildNationalSchoolRows([base, { ...base, code: "7", slug: "closed", name: "가나초등학교다라분교장(폐교)" }]);
  assert.deepEqual(rows.map((r) => r[1]), ["gana-middle-school"]);
});

test("row columns follow NATIONAL_SCHOOL_COLUMNS, districtSlug empty when absent", () => {
  const [row] = buildNationalSchoolRows([base]);
  assert.deepEqual(row, ["1", "gana-middle-school", "가나중학교", "중학교", "H10", "ulsan-nam", "", "3114059500", "무거동"]);
});
