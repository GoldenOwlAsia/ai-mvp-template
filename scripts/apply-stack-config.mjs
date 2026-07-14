#!/usr/bin/env node
/**
 * Apply stack.config.yaml → root tooling + stack.manifest.json with adapter paths.
 * Does NOT create application source (see adapter BOOTSTRAP.md + prompts/bootstrap).
 * Usage: node scripts/apply-stack-config.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

async function loadYaml(path) {
  const text = readFileSync(path, "utf8");
  const yaml = await import("yaml");
  return yaml.parse(text);
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

const configPath = resolve(root, "stack.config.yaml");
const catalogPath = resolve(root, "stacks/catalog.json");

if (!existsSync(configPath)) {
  console.error("stack.config.yaml not found");
  process.exit(1);
}

const config = await loadYaml(configPath);
const catalog = loadJson(catalogPath);
const name = config.project.slug || config.project.name;
const beFw = config.backend.framework;
const feFw = config.frontend.framework;
const beEntry = catalog.backends[beFw];
const feEntry = catalog.frontends[feFw];

if (!beEntry) {
  console.error(`Unknown backend.framework: ${beFw}. Run validate first.`);
  process.exit(1);
}
if (!feEntry) {
  console.error(`Unknown frontend.framework: ${feFw}. Run validate first.`);
  process.exit(1);
}

const packageManagers = [
  ...new Set([
    ...(beEntry.packageManagers || []),
    ...((feFw !== "none" && feEntry.packageManagers) || []),
  ]),
];

const rootPkg = {
  name,
  private: true,
  description:
    "Claude MVP base — docs + stack config. Apps generated via bootstrap + stack adapters.",
  packageManager: packageManagers.includes("pnpm") ? "pnpm@9.12.0" : undefined,
  scripts: {
    "validate:stack": "node scripts/validate-stack-config.mjs",
    "apply:stack": "node scripts/apply-stack-config.mjs",
  },
  engines: config.project.node ? { node: `>=${config.project.node}` } : undefined,
  devDependencies: {
    yaml: "2.5.1",
    prettier: config.tooling?.prettier || "3.3.3",
    ...(config.tooling?.typescript
      ? { typescript: config.tooling.typescript }
      : {}),
  },
};

writeFileSync(resolve(root, "package.json"), JSON.stringify(rootPkg, null, 2) + "\n");

const manifest = {
  generatedAt: new Date().toISOString(),
  note: "No apps code in this base. Bootstrap uses adapters below.",
  adapters: {
    backend: beEntry.path,
    frontend: feFw === "none" ? null : feEntry.path,
    backendRuntime: beEntry.runtime,
    packageManagers,
  },
  frontend: {
    appDir: config.frontend.appDir || feEntry.defaultAppDir,
    framework: feFw,
    language: config.frontend.language,
    packages: feFw === "none" ? {} : config.frontend.packages || {},
  },
  backend: {
    appDir: config.backend.appDir || beEntry.defaultAppDir,
    framework: beFw,
    language: config.backend.language,
    orm: config.backend.orm || beEntry.orm,
    packages: config.backend.packages,
  },
  database: config.database,
  deploy: config.deploy,
  features: config.features,
  constraints: config.constraints,
};

writeFileSync(
  resolve(root, "stack.manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);

if (config.database?.provider === "local-docker") {
  const compose = `services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ${name}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
`;
  writeFileSync(resolve(root, "docker-compose.yml"), compose);
}

console.log("Applied stack.config.yaml → package.json + stack.manifest.json");
console.log(` adapters: backend=${beEntry.path} frontend=${manifest.adapters.frontend}`);
console.log(` packageManagers: ${packageManagers.join(", ")}`);
console.log(
  ` Next: read ${beEntry.path}/BOOTSTRAP.md then prompts/bootstrap-from-config.md`,
);
