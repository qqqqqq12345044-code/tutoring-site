import fs from "fs";
import path from "path";

/**
 * Checks whether a brand asset referenced from siteConfig.brand actually
 * exists under public/. Lets components fall back to the current
 * icon+text treatment until real logo files are dropped in.
 */
export function publicAssetExists(publicPath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", publicPath));
  } catch {
    return false;
  }
}
