#!/usr/bin/env node
// Continuum documentation gate. See docs/DOCUMENTATION_POLICY.md §8.
// Dependency-free. Checks the facts this repo can determine reliably:
//   1. internal relative links in docs/** resolve (anchors are advisory);
//   2. docs/catalog.yaml integrity (ids, paths, controlled vocab, related);
//   3. registry/schema coverage (every authored family has a row, vice versa).

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = join(ROOT, "docs");
const SCHEMAS = join(ROOT, "schemas");

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const TYPES = new Set([
  "tutorial", "how-to", "reference", "explanation", "troubleshooting",
  "contributor", "decision-record", "design-packet", "invariant",
  "ownership-map", "family-reference", "conformance-guide", "gate-record",
  "signpost",
]);
const CAPABILITIES = new Set([
  "ontology", "contract-families", "ownership-law", "convergence",
  "warp-cli", "method",
]);
const AUDIENCES = new Set([
  "newcomer", "maintainer", "agent", "contributor", "app-author",
  "stack-maintainer",
]);

function walk(dir, ext, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, ext, out);
    else if (extname(p) === ext) out.push(p);
  }
  return out;
}

function slug(heading) {
  return heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Remove fenced code blocks and inline code so example link or heading syntax
// inside them is not mistaken for a real link or heading.
function stripCode(md) {
  return md.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
}

// --- check 1: internal links --------------------------------------------
const headingRe = /^#{1,6}\s+(.*)$/gm;
const linkRe = /\[[^\]]*\]\(([^)]+)\)/g;
const headingSlugs = (md) => new Set([...md.matchAll(headingRe)].map((h) => slug(h[1])));
for (const file of walk(DOCS, ".md")) {
  const text = stripCode(readFileSync(file, "utf8"));
  const headings = headingSlugs(text);
  let m;
  while ((m = linkRe.exec(text)) !== null) {
    const raw = m[1].trim();
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) continue; // external scheme (http, mailto, ...)
    const [target, anchor] = raw.split("#");
    if (target === "") {
      // same-file anchor (advisory; slug matching is approximate)
      if (anchor && !headings.has(anchor)) {
        warn(`${relative(ROOT, file)}: anchor #${anchor} not found in file`);
      }
      continue;
    }
    const dest = resolve(dirname(file), target);
    if (!existsSync(dest)) {
      err(`${relative(ROOT, file)}: broken link -> ${raw}`);
      continue;
    }
    if (anchor && extname(dest) === ".md") {
      if (!headingSlugs(stripCode(readFileSync(dest, "utf8"))).has(anchor)) {
        warn(`${relative(ROOT, file)}: anchor #${anchor} not found in ${target}`);
      }
    }
  }
}

// --- check 2: catalog integrity ------------------------------------------
// Minimal YAML reader scoped to the catalog's regular structure (see file).
function parseCatalog(text) {
  const pages = [];
  const unknown = [];
  let cur = null;
  let schemaVersion = null;
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*#/.test(line) || line.trim() === "") continue;
    let mm;
    if ((mm = line.match(/^schema_version:\s*(.+)$/))) {
      schemaVersion = mm[1].trim();
    } else if (line.match(/^pages:\s*$/)) {
      // begin list
    } else if ((mm = line.match(/^ {2}- (\w+):\s*(.*)$/))) {
      cur = {};
      pages.push(cur);
      cur[mm[1]] = parseScalar(mm[2]);
    } else if ((mm = line.match(/^ {4}(\w+):\s*(.*)$/)) && cur) {
      cur[mm[1]] = parseScalar(mm[2]);
    } else {
      // Do not silently ignore structure the scoped reader does not understand.
      unknown.push({ n: i + 1, line });
    }
  }
  return { schemaVersion, pages, unknown };
}
function parseScalar(v) {
  v = v.trim();
  if (v.startsWith("[") && v.endsWith("]")) {
    return v.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
  }
  return v.replace(/^["']|["']$/g, "");
}

const catalogPath = join(DOCS, "catalog.yaml");
if (!existsSync(catalogPath)) {
  err("docs/catalog.yaml is missing");
} else {
  const { schemaVersion, pages, unknown } = parseCatalog(readFileSync(catalogPath, "utf8"));
  if (!schemaVersion) err("catalog.yaml: missing schema_version");
  for (const u of unknown) {
    err(`catalog.yaml:${u.n}: unparsed line (unexpected structure): ${u.line.trim()}`);
  }
  const ids = new Set();
  const required = ["id", "title", "type", "capability", "status", "path"];
  for (const p of pages) {
    const label = p.id || JSON.stringify(p).slice(0, 40);
    for (const k of required) {
      if (!p[k]) err(`catalog.yaml: entry ${label} missing required field "${k}"`);
    }
    if (p.id) {
      if (ids.has(p.id)) err(`catalog.yaml: duplicate id "${p.id}"`);
      ids.add(p.id);
    }
    if (p.type && !TYPES.has(p.type)) err(`catalog.yaml: ${label} has unknown type "${p.type}"`);
    if (p.capability && !CAPABILITIES.has(p.capability)) {
      err(`catalog.yaml: ${label} has unknown capability "${p.capability}"`);
    }
    for (const a of [].concat(p.audiences || [])) {
      if (!AUDIENCES.has(a)) err(`catalog.yaml: ${label} has unknown audience "${a}"`);
    }
    if (p.path && !existsSync(resolve(DOCS, p.path))) {
      err(`catalog.yaml: ${label} path does not resolve -> ${p.path}`);
    }
  }
  // related ids must resolve
  for (const p of pages) {
    for (const r of [].concat(p.related || [])) {
      if (!ids.has(r)) err(`catalog.yaml: ${p.id} related id "${r}" does not resolve`);
    }
  }
}

// --- check 3: registry / schema coverage ---------------------------------
const registryPath = join(DOCS, "contract-family-registry.md");
if (existsSync(registryPath) && existsSync(SCHEMAS)) {
  const registry = readFileSync(registryPath, "utf8");
  const schemaFiles = readdirSync(SCHEMAS).filter((f) => f.endsWith(".graphql"));
  for (const f of schemaFiles) {
    if (!registry.includes(`schemas/${f}`)) {
      err(`contract-family-registry.md: no schemas/${f} path reference (expected a registry row)`);
    }
  }
  // every schemas/*.graphql referenced in the registry must exist
  for (const m of registry.matchAll(/schemas\/([\w.-]+\.graphql)/g)) {
    if (!schemaFiles.includes(m[1])) {
      err(`contract-family-registry.md: references missing schema schemas/${m[1]}`);
    }
  }
}

// --- report ---------------------------------------------------------------
for (const w of warnings) console.log(`warning: ${w}`);
for (const e of errors) console.log(`error:   ${e}`);
console.log(
  `\ndocs-lint: ${errors.length} error(s), ${warnings.length} warning(s)`,
);
process.exit(errors.length > 0 ? 1 : 0);
