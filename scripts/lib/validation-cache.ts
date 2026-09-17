/**
 * Tiny local cache so validate-quick/validate-full can record their last
 * result, and update-ai-handoff can reuse it without re-running validation.
 * Generated file — not committed (see .gitignore).
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const CACHE_PATH = path.join(__dirname, "..", ".validation-cache.json");

export interface CacheEntry {
  timestamp: string;
  headHash: string;
  pass: boolean;
  results: Record<string, string | number>;
}

export type ValidationCache = Partial<Record<"quick" | "full", CacheEntry>>;

function currentHead(): string {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
  } catch {
    return "unknown";
  }
}

export function readCache(): ValidationCache {
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

export function writeCacheEntry(
  kind: "quick" | "full",
  pass: boolean,
  results: Record<string, string | number>
): void {
  const cache = readCache();
  cache[kind] = { timestamp: new Date().toISOString(), headHash: currentHead(), pass, results };
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}
