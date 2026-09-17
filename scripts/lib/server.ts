import { spawn, execSync, type ChildProcess } from "child_process";

const PORT = 3100;
export const BASE_URL = `http://localhost:${PORT}`;
const NEXT_BIN = require.resolve("next/dist/bin/next");

async function waitForReady(timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok || res.status === 404) return;
    } catch {
      // server not up yet
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Production server did not become ready on ${BASE_URL} within ${timeoutMs}ms`);
}

/**
 * Starts `next start` on a dedicated port against the existing .next build.
 * Spawns the `next` binary directly (no shell wrapper) so stopServer() can
 * actually terminate it — on Windows, killing a `shell: true` process only
 * kills the cmd.exe wrapper and leaves the real server listening.
 */
export async function startServer(): Promise<ChildProcess> {
  const child = spawn(process.execPath, [NEXT_BIN, "start", "-p", String(PORT)], { stdio: "pipe" });
  await waitForReady(20_000);
  return child;
}

export function stopServer(child: ChildProcess): void {
  if (!child.pid) return;
  if (process.platform === "win32") {
    try {
      execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: "ignore" });
    } catch {
      // already exited
    }
  } else {
    child.kill();
  }
}
