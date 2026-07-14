#!/usr/bin/env node
/**
 * Validate stack.config.yaml against stacks/catalog.json + adapter consistency.
 * Usage: node scripts/validate-stack-config.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

async function loadYaml(path) {
  const text = readFileSync(path, "utf8");
  try {
    const yaml = await import("yaml");
    return yaml.parse(text);
  } catch {
    console.error("Missing dependency `yaml`. Run: pnpm install (root)");
    process.exit(1);
  }
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

const configPath = resolve(root, "stack.config.yaml");
const catalogPath = resolve(root, "stacks/catalog.json");

if (!existsSync(configPath)) {
  console.error("stack.config.yaml not found. Copy an example from stack.config.examples/");
  process.exit(1);
}
if (!existsSync(catalogPath)) {
  console.error("stacks/catalog.json missing");
  process.exit(1);
}

const config = await loadYaml(configPath);
const catalog = loadJson(catalogPath);
const errors = [];

const beFw = config?.backend?.framework;
const feFw = config?.frontend?.framework;
const beLang = config?.backend?.language;
const feLang = config?.frontend?.language;

if (!beFw || !catalog.backends[beFw]) {
  errors.push(
    `backend.framework must be one of: ${Object.keys(catalog.backends).join(", ")} (got ${beFw})`,
  );
} else {
  const entry = catalog.backends[beFw];
  if (beLang !== entry.language) {
    errors.push(
      `backend.language must be "${entry.language}" for framework "${beFw}" (got ${beLang})`,
    );
  }
  if (config.backend.orm && config.backend.orm !== entry.orm) {
    errors.push(
      `backend.orm should be "${entry.orm}" for "${beFw}" (got ${config.backend.orm})`,
    );
  }
  const adapterConv = resolve(root, entry.path, "CONVENTION.md");
  if (!existsSync(adapterConv)) {
    errors.push(`Missing adapter file: ${entry.path}/CONVENTION.md`);
  }
}

if (!feFw || !catalog.frontends[feFw]) {
  errors.push(
    `frontend.framework must be one of: ${Object.keys(catalog.frontends).join(", ")} (got ${feFw})`,
  );
} else if (feFw !== "none") {
  const entry = catalog.frontends[feFw];
  if (feLang !== entry.language) {
    errors.push(
      `frontend.language must be "${entry.language}" for framework "${feFw}" (got ${feLang})`,
    );
  }
  if (entry.path && !existsSync(resolve(root, entry.path, "CONVENTION.md"))) {
    errors.push(`Missing adapter file: ${entry.path}/CONVENTION.md`);
  }
  if (!config?.frontend?.packages || Object.keys(config.frontend.packages).length === 0) {
    errors.push("frontend.packages must not be empty when frontend.framework !== none");
  }
}

if (!config?.backend?.packages || Object.keys(config.backend.packages).length === 0) {
  errors.push("backend.packages must not be empty");
}

if (config?.constraints?.pinExactVersions) {
  const checkPins = (pkgs, label) => {
    for (const [name, ver] of Object.entries(pkgs || {})) {
      if (ver === "latest" || String(ver).includes("^") || String(ver).includes("~")) {
        errors.push(`${label}.${name} must be exact version (got ${ver})`);
      }
    }
  };
  checkPins(config.backend.packages, "backend.packages");
  if (feFw !== "none") checkPins(config.frontend.packages, "frontend.packages");
}

if (config?.features?.softDelete !== true) {
  errors.push("features.softDelete must be true (product contract)");
}

const hints = catalog.featurePackageHints || {};
const pkgKeys = Object.keys(config.backend?.packages || {});
const hasAny = (names) => names.some((n) => pkgKeys.includes(n));

if (beFw && config?.features?.jobs === true) {
  const need = hints.jobs?.[beFw] || [];
  if (need.length && !hasAny(need)) {
    errors.push(`features.jobs=true but none of [${need.join(", ")}] in backend.packages`);
  }
}
if (beFw && config?.features?.fileUpload === true) {
  const need = hints.fileUpload?.[beFw] || [];
  if (need.length && !hasAny(need)) {
    errors.push(
      `features.fileUpload=true but none of [${need.join(", ")}] in backend.packages`,
    );
  }
}
if (beFw && config?.database?.redis === true) {
  const need = hints.redis?.[beFw] || [];
  if (need.length && !hasAny(need)) {
    errors.push(`database.redis=true but none of [${need.join(", ")}] in backend.packages`);
  }
}

if (config?.presets?.profile) {
  errors.push(
    "presets.profile is removed — use backend.framework + frontend.framework from stacks/catalog.json",
  );
}

if (errors.length) {
  console.error("stack.config validation FAILED:");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

const bePath = catalog.backends[beFw].path;
const fePath = feFw === "none" ? null : catalog.frontends[feFw].path;
console.log("stack.config.yaml OK");
console.log(` backend=${beFw} (${beLang}) → ${bePath}`);
console.log(` frontend=${feFw}${fePath ? ` → ${fePath}` : ""}`);
console.log(
  ` packages: be=${Object.keys(config.backend.packages).length}` +
    (feFw !== "none" ? ` fe=${Object.keys(config.frontend.packages).length}` : ""),
);
