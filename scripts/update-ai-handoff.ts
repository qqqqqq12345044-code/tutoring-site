/**
 * Refreshes only the mechanically-derivable parts of docs/ai/AI_HANDOFF.md
 * (current git state + last known validation result). Never runs
 * validate:quick/full itself, and never touches the human-authored
 * sections (Completed task, Files changed, Issues, Next task, Context) —
 * those are edited by Claude directly when a checkpoint finishes.
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { readCache } from "./lib/validation-cache";

const HANDOFF_PATH = path.join("docs", "ai", "AI_HANDOFF.md");

function git(args: string): string {
  return execSync(`git ${args}`, { encoding: "utf-8" }).trim();
}

function replaceBlock(content: string, marker: string, body: string): string {
  const start = `<!-- AUTO:${marker}:START -->`;
  const end = `<!-- AUTO:${marker}:END -->`;
  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!re.test(content)) {
    throw new Error(`Marker block ${marker} not found in ${HANDOFF_PATH} — was it edited by hand?`);
  }
  return content.replace(re, `${start}\n${body}\n${end}`);
}

function hasValidateScripts(): boolean {
  try {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
    return Boolean(pkg.scripts?.["validate:quick"] && pkg.scripts?.["validate:full"]);
  } catch {
    return false;
  }
}

function formatEntry(kind: "quick" | "full", headHash: string): string {
  const label = kind === "quick" ? "Quick" : "Full";
  const cache = readCache();
  const entry = cache[kind];
  if (!entry) return `- ${label}: 실행 기록 없음 (\`npm run validate:${kind}\` 필요)`;

  const summary =
    kind === "quick"
      ? `Lint ${entry.results.lint} / Typecheck ${entry.results.typecheck} / Config ${entry.results.config}`
      : `Routes ${entry.results.routes} / Sitemap ${entry.results.sitemap} / Noindex ${entry.results.noindex} / Broken links ${entry.results.brokenLinks} / Build ${entry.results.build}`;

  const stale = entry.headHash !== headHash ? ` [stale — ${entry.headHash} 기준, 현재 HEAD와 다름]` : "";
  return `- ${label}: ${entry.pass ? "PASS" : "FAIL"} — ${summary}${stale}`;
}

function main() {
  const branch = git("branch --show-current");
  const head = git("rev-parse --short HEAD");
  const porcelain = execSync("git status --porcelain", { encoding: "utf-8" }).trim();
  const working = porcelain.length === 0 ? "clean" : `dirty (${porcelain.split("\n").length}개 파일)`;

  const currentStateBody = ["## Current state", `- Branch: ${branch}`, `- HEAD: ${head}`, `- Working tree: ${working}`].join(
    "\n"
  );

  const validationLines = ["## Validation", formatEntry("quick", head), formatEntry("full", head)];
  if (!hasValidateScripts()) validationLines.push("- ⚠ package.json에 validate:quick/full 스크립트가 없습니다");

  let content = fs.readFileSync(HANDOFF_PATH, "utf-8");
  content = replaceBlock(content, "CURRENT_STATE", currentStateBody);
  content = replaceBlock(content, "VALIDATION", validationLines.join("\n"));
  fs.writeFileSync(HANDOFF_PATH, content);

  console.log("AI handoff updated");
  console.log(`Branch: ${branch}`);
  console.log(`HEAD: ${head}`);
  console.log(`Status: ${working}`);
}

main();
