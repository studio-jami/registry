import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const root = process.cwd();
const publicDir = join(root, "public");
const registryPath = join(publicDir, "registry.json");

function fail(message) {
  console.error(`registry check failed: ${message}`);
  process.exitCode = 1;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function sha256(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

if (!existsSync(registryPath)) {
  fail("missing public/registry.json");
} else {
  const registry = readJson(registryPath);
  const items = Array.isArray(registry.items) ? registry.items : [];
  if (items.length === 0) fail("registry contains no items");

  const itemDir = join(publicDir, "items");
  const itemFiles = existsSync(itemDir)
    ? readdirSync(itemDir).filter((file) => file.endsWith(".json")).sort()
    : [];
  if (itemFiles.length === 0) fail("missing public/items/*.json");

  for (const file of itemFiles) {
    const path = join(itemDir, file);
    const text = readFileSync(path, "utf8");
    const item = JSON.parse(text);
    if (!item.name) fail(`${file}: missing name`);
    if (!Array.isArray(item.files)) fail(`${file}: missing files array`);
    for (const entry of item.files ?? []) {
      if (!entry.path) fail(`${file}: registry file entry missing path`);
      if (typeof entry.content === "string" && entry.hash && entry.hash !== sha256(entry.content)) {
        fail(`${file}: hash mismatch for ${entry.path}`);
      }
    }
  }

  const suiteDir = join(publicDir, "suites");
  const suiteFiles = existsSync(suiteDir)
    ? readdirSync(suiteDir).filter((file) => file.endsWith(".suite.json")).sort()
    : [];

  console.log(
    `registry check passed: ${items.length} item(s), ${itemFiles.length} item file(s), ${suiteFiles.length} suite manifest(s)`
  );
}
