// Run: npx tsx --test scripts/official/lib/operating.test.ts   (fixtures only; never touches repo data files)
import { test } from "node:test";
import assert from "node:assert/strict";
import { disclosedFromManifest, previouslyDisclosed, resolveOperating } from "./operating";

const manifest = (o: Record<string, object>) => disclosedFromManifest(o as never);
const files = { "0": {} };

test("A: saved disclosed survives an empty manifest", () => {
  const prev = previouslyDisclosed([{ code: "A", operating: "disclosed-2026-3" }]);
  assert.equal(resolveOperating("A", manifest({}), prev), "disclosed-2026-3");
});

test("B: new disclosure is promoted while a saved one is kept", () => {
  const prev = previouslyDisclosed([{ code: "A", operating: "unverified" }, { code: "B", operating: "disclosed-2026-3" }]);
  const cur = manifest({ A: { term: "3", files } });
  assert.equal(resolveOperating("A", cur, prev), "disclosed-2026-3");
  assert.equal(resolveOperating("B", cur, prev), "disclosed-2026-3");
});

test("C: unverified stays unverified without evidence", () => {
  const prev = previouslyDisclosed([{ code: "A", operating: "unverified" }]);
  assert.equal(resolveOperating("A", manifest({}), prev), "unverified");
  assert.equal(resolveOperating("Z", manifest({}), prev), "unverified");
});

test("manifest entries with another term, an error or no files do not count", () => {
  const cur = manifest({ T: { term: "2", files }, E: { term: "3", files, error: "x" }, N: { term: "3", files: {} } });
  for (const c of ["T", "E", "N"]) assert.equal(resolveOperating(c, cur, new Set()), "unverified");
});
