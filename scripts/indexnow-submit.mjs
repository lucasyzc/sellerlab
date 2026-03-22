#!/usr/bin/env node

/**
 * Usage examples:
 * 1) Submit explicit URLs:
 *    node scripts/indexnow-submit.mjs https://sellerlab.tools/updates/a https://sellerlab.tools/compare/b
 *
 * 2) Submit URLs from file (one URL per line):
 *    node scripts/indexnow-submit.mjs --file urls.txt
 *
 * Required environment variables:
 * - INDEXNOW_KEY
 *
 * Optional environment variables:
 * - INDEXNOW_HOST (default: sellerlab.tools)
 * - INDEXNOW_KEY_LOCATION (default: https://<host>/<key>.txt)
 */

import fs from "node:fs";

function fail(message) {
  console.error(`[indexnow] ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = [...argv];
  const fileFlagIndex = args.indexOf("--file");

  if (fileFlagIndex >= 0) {
    const filePath = args[fileFlagIndex + 1];
    if (!filePath) fail("Missing file path after --file");
    return { mode: "file", filePath };
  }

  return { mode: "urls", urls: args };
}

function readUrlsFromFile(filePath) {
  if (!fs.existsSync(filePath)) fail(`File not found: ${filePath}`);

  const raw = fs.readFileSync(filePath, "utf8");
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function validateUrls(urls) {
  const valid = [];
  for (const url of urls) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:") {
        fail(`IndexNow requires HTTPS URLs: ${url}`);
      }
      valid.push(url);
    } catch {
      fail(`Invalid URL: ${url}`);
    }
  }
  return valid;
}

async function main() {
  const { mode, filePath, urls: argUrls } = parseArgs(process.argv.slice(2));

  const key = process.env.INDEXNOW_KEY;
  if (!key) fail("Missing INDEXNOW_KEY environment variable");

  const host = (process.env.INDEXNOW_HOST || "sellerlab.tools").trim();
  const keyLocation =
    process.env.INDEXNOW_KEY_LOCATION || `https://${host}/${key}.txt`;

  const inputUrls = mode === "file" ? readUrlsFromFile(filePath) : argUrls;
  if (!inputUrls || inputUrls.length === 0) {
    fail("No URLs provided. Pass URLs directly or use --file <path>");
  }

  const urlList = validateUrls(inputUrls);

  const payload = {
    host,
    key,
    keyLocation,
    urlList,
  };

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    fail(`Submit failed (${response.status}): ${text}`);
  }

  console.log(`[indexnow] Submitted ${urlList.length} URL(s) for host ${host}.`);
}

main().catch((error) => {
  fail(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
});

