import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const root = process.cwd();
const publicDir = join(root, "public");
const registryPath = join(publicDir, "registry.json");
const docsConfigPath = join(root, "docs.json");

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

function assertFile(relPath) {
  const path = join(publicDir, relPath);
  if (!existsSync(path) || !statSync(path).isFile()) {
    fail(`missing public/${relPath}`);
    return null;
  }
  return readFileSync(path, "utf8");
}

function scanStaticHtml(relPath) {
  const text = assertFile(relPath);
  if (!text) return;
  if (!/<html\b/i.test(text)) fail(`public/${relPath}: missing html document`);
  if (/<[^>]+\son[a-z]+\s*=/i.test(text)) fail(`public/${relPath}: inline event handler found`);
  if (/(href|src)\s*=\s*["']?\s*javascript:/i.test(text)) fail(`public/${relPath}: javascript URL found`);
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

  const workspaceDir = join(publicDir, "workspaces");
  const workspaceFiles = existsSync(workspaceDir)
    ? readdirSync(workspaceDir).filter((file) => file.endsWith(".workspace.json")).sort()
    : [];

  console.log(
    `registry check passed: ${items.length} item(s), ${itemFiles.length} item file(s), ${workspaceFiles.length} workspace manifest(s)`
  );
}

const workbenchManifestText = assertFile("hosted-route-manifest.json");
if (workbenchManifestText) {
  const manifest = JSON.parse(workbenchManifestText);
  if (manifest.targetHost !== "registry.jami.studio") fail("hosted route manifest target host drifted");
  if (manifest.publicRegistryClaimed !== true) fail("hosted route manifest must claim registry route");
  if (manifest.publicDocsClaimed !== true) fail("hosted route manifest must claim docs route");
  if (manifest.publicWorkbenchClaimed !== true) fail("hosted route manifest must claim workbench route");
  if (manifest.publicWorkspaceRoutesClaimed !== true) fail("hosted route manifest must claim workspace routes");
  if (manifest.hostedPersistenceClaimed !== false) fail("hosted route manifest must not claim persistence");
  if (manifest.backendRegistrationClaimed !== false) fail("hosted route manifest must not claim backend registration");
}

for (const [relPath, routeId] of [
  ["harness/status.json", "status"],
  ["harness/release-readiness.json", "release-readiness"],
  ["harness/provider-store-observability.json", "provider-store-observability"],
  ["harness/healthz.json", "healthz"],
]) {
  const text = assertFile(relPath);
  if (!text) continue;
  const route = JSON.parse(text);
  if (route.routeId !== routeId) fail(`public/${relPath}: expected routeId ${routeId}`);
  if (route.sourceRepo !== "jami-harness") fail(`public/${relPath}: expected jami-harness sourceRepo`);
}

for (const relPath of [
  "index.html",
  "harness/index.html",
  "preview-docs/registry.html",
  "preview-docs/workbench.html",
  "preview-docs/suites.html",
  "suites/solo/index.html",
  "suites/business-ops/index.html",
  "suites/mixed-media/index.html",
  "suites/research-writing/index.html",
]) {
  scanStaticHtml(relPath);
}

if (!existsSync(docsConfigPath)) {
  fail("missing docs.json");
} else {
  const docsConfig = readJson(docsConfigPath);
  const pages = [];

  // Recursively collect page references from a `pages` array. Entries may be a
  // string (a page path), a nested group object (`{ group, pages }`) which is how
  // the accordion sidebar nests Reference/Concepts/etc., or another nav container.
  const collectPages = (entries) => {
    for (const entry of entries ?? []) {
      if (typeof entry === "string") {
        pages.push(entry);
      } else if (entry && typeof entry === "object") {
        collectPages(entry.pages);
        // `root` is an optional landing page on a directory group.
        if (typeof entry.root === "string") pages.push(entry.root);
      }
    }
  };

  for (const tab of docsConfig.navigation?.tabs ?? []) {
    collectPages(tab.groups?.flatMap((group) => group.pages) ?? []);
    for (const group of tab.groups ?? []) {
      if (typeof group.root === "string") pages.push(group.root);
    }
  }
  // Also support a top-level `navigation.groups` shape (no tabs).
  collectPages(docsConfig.navigation?.groups?.flatMap((group) => group.pages) ?? []);

  for (const page of pages) {
    const pagePath = page.endsWith(".mdx") ? page : `${page}.mdx`;
    if (!existsSync(join(root, pagePath))) fail(`docs.json references missing page ${pagePath}`);
  }
}
