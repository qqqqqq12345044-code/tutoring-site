import { createServer, type Server } from "http";

/**
 * Stand-in for the Google Apps Script Web App during validate:full, so the
 * consult API smoke test can exercise the real success path
 * (googleSheetsPersistence.save -> HTTP POST -> `{ ok: true }`) without a
 * real Google account. Mirrors the Apps Script's own contract: always
 * answers HTTP 200, with `ok: false` in the body when the shared secret is
 * wrong — see docs/setup/consult-google-apps-script.md.
 */
export interface MockWebhook {
  server: Server;
  url: string;
  receivedCount: () => number;
}

export function startMockWebhook(secret: string): Promise<MockWebhook> {
  let received = 0;

  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        res.writeHead(200, { "Content-Type": "application/json" });
        try {
          const data = JSON.parse(body);
          if (data.secret !== secret) {
            res.end(JSON.stringify({ ok: false, message: "unauthorized" }));
            return;
          }
          received += 1;
          res.end(JSON.stringify({ ok: true, message: "ok" }));
        } catch {
          res.end(JSON.stringify({ ok: false, message: "bad json" }));
        }
      });
    });

    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      resolve({ server, url: `http://127.0.0.1:${port}`, receivedCount: () => received });
    });
  });
}

export function stopMockWebhook(server: Server): void {
  server.close();
}
