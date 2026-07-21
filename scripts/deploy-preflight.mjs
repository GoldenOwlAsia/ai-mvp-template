#!/usr/bin/env node
/**
 * Deploy preflight for the interactive deploy agent.
 * Reads stack.config.yaml, scans stubs/CLIs/env presence (never prints secret values),
 * and emits gaps + questions for the human.
 *
 * Usage:
 *   node scripts/deploy-preflight.mjs
 *   node scripts/deploy-preflight.mjs --json
 *   pnpm preflight:deploy
 *
 * Exit codes:
 *   0 — ready (local + auth signals enough to attempt preview)
 *   2 — needs_input (ask questions; do not invent answers)
 *   1 — blocked (config/stubs/convention hard fail)
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const jsonMode = process.argv.includes("--json");

async function loadYaml(path) {
  const text = readFileSync(path, "utf8");
  try {
    const yaml = await import("yaml");
    return yaml.parse(text);
  } catch {
    failHard("Missing dependency `yaml`. Run: pnpm install (root)");
  }
}

function failHard(msg) {
  if (jsonMode) {
    console.log(JSON.stringify({ status: "blocked", error: msg }, null, 2));
  } else {
    console.error(`blocked: ${msg}`);
  }
  process.exit(1);
}

function cmdExists(bin) {
  try {
    execSync(`command -v ${bin}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function envPresent(name) {
  const v = process.env[name];
  return typeof v === "string" && v.trim().length > 0;
}

function readPkgName(appDir) {
  const p = join(root, appDir, "package.json");
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8")).name ?? null;
  } catch {
    return null;
  }
}

function runbookPath(kind, provider) {
  const map = {
    web: {
      vercel: "deploy/kb/web/vercel.md",
    },
    api: {
      railway: "deploy/kb/backend/railway.md",
      render: "deploy/kb/backend/render.md",
    },
    database: {
      neon: "deploy/kb/database/neon.md",
      supabase: "deploy/kb/database/supabase.md",
      "local-docker": null,
    },
  };
  const rel = map[kind]?.[provider];
  if (rel === null) return { required: false, path: null, exists: true };
  if (!rel) return { required: true, path: null, exists: false };
  const abs = join(root, rel);
  return { required: true, path: rel, exists: existsSync(abs) };
}

const configPath = resolve(root, "stack.config.yaml");
if (!existsSync(configPath)) {
  failHard("stack.config.yaml not found. Copy from stack.config.examples/");
}

const config = await loadYaml(configPath);
const web = config.deploy?.web ?? null;
const api = config.deploy?.api ?? null;
const database = config.database?.provider ?? null;
const backendFw = config.backend?.framework ?? null;
const frontendFw = config.frontend?.framework ?? null;
const monorepo = config.project?.monorepo === true;
const webDir = config.frontend?.appDir ?? "apps/web";
const apiDir = config.backend?.appDir ?? "apps/api";

const checks = [];
const gaps = [];
const questions = [];

function addCheck(id, ok, okDetail, failDetail) {
  const detail = ok ? okDetail : failDetail ?? okDetail;
  checks.push({ id, ok, detail });
  if (!ok) gaps.push({ id, detail });
}

// --- convention / stubs ---
if (monorepo && (backendFw === "nestjs" || frontendFw === "react-vite")) {
  addCheck(
    "pnpm_workspace",
    existsSync(join(root, "pnpm-workspace.yaml")),
    "Root pnpm-workspace.yaml present",
    "Root pnpm-workspace.yaml must list apps/*",
  );
}

if (frontendFw === "react-vite") {
  const name = readPkgName(webDir);
  addCheck(
    "pkg_web",
    name === "@app/web",
    `${webDir} name=@app/web`,
    name
      ? `${webDir}/package.json name is "${name}" (expected @app/web)`
      : `${webDir}/package.json missing (bootstrap first?)`,
  );
  const vercelRoot = existsSync(join(root, "vercel.json"));
  const vercelDeploy = existsSync(join(root, "deploy/vercel.json"));
  addCheck(
    "stub_vercel",
    web !== "vercel" || vercelRoot || vercelDeploy,
    "vercel.json stub present",
    "vercel.json missing at repo root (and deploy/vercel.json)",
  );
}

if (backendFw === "nestjs") {
  const name = readPkgName(apiDir);
  addCheck(
    "pkg_api",
    name === "@app/api",
    `${apiDir} name=@app/api`,
    name
      ? `${apiDir}/package.json name is "${name}" (expected @app/api)`
      : `${apiDir}/package.json missing (bootstrap first?)`,
  );
  addCheck(
    "stub_dockerfile",
    existsSync(join(root, "deploy/Dockerfile.api")),
    "deploy/Dockerfile.api present",
    "deploy/Dockerfile.api missing",
  );
  if (api === "render") {
    addCheck(
      "stub_render",
      existsSync(join(root, "render.yaml")) ||
        existsSync(join(root, "deploy/render.yaml")),
      "render.yaml stub present",
      "render.yaml missing at repo root (and deploy/render.yaml)",
    );
  }
  if (api === "railway") {
    addCheck(
      "stub_railway",
      existsSync(join(root, "deploy/railway.toml")),
      "deploy/railway.toml present",
      "deploy/railway.toml missing",
    );
  }
}

// --- runbooks ---
for (const [kind, provider] of [
  ["web", web],
  ["api", api],
  ["database", database],
]) {
  if (!provider) {
    addCheck(
      `provider_${kind}`,
      false,
      "",
      `stack.config missing ${kind} provider`,
    );
    continue;
  }
  const rb = runbookPath(kind, provider);
  if (!rb.required) {
    addCheck(
      `runbook_${kind}_${provider}`,
      true,
      `${provider} uses local compose / no dedicated kb file`,
    );
    continue;
  }
  addCheck(
    `runbook_${kind}_${provider}`,
    rb.exists,
    `Runbook OK: ${rb.path}`,
    `No runbook for ${kind}=${provider} — stop and ask human (do not invent steps)`,
  );
}

// --- CLIs / docker ---
addCheck(
  "cli_docker",
  cmdExists("docker"),
  "docker CLI present",
  "docker CLI missing (needed for Nest Dockerfile builds)",
);

if (web === "vercel") {
  const vercelOk = cmdExists("vercel") || envPresent("VERCEL_TOKEN");
  addCheck(
    "cli_vercel",
    vercelOk,
    "Vercel CLI or VERCEL_TOKEN present",
    "Install Vercel CLI (`npm i -g vercel`) or set VERCEL_TOKEN; then login",
  );
}

if (api === "render") {
  const renderOk = cmdExists("render") || envPresent("RENDER_API_KEY");
  addCheck(
    "cli_render",
    renderOk,
    "Render CLI or RENDER_API_KEY present",
    "Install Render CLI or set RENDER_API_KEY; link/create service from render.yaml",
  );
}

if (api === "railway") {
  const railwayOk = cmdExists("railway") || envPresent("RAILWAY_TOKEN");
  addCheck(
    "cli_railway",
    railwayOk,
    "Railway CLI or RAILWAY_TOKEN present",
    "Install Railway CLI or set RAILWAY_TOKEN",
  );
}

if (database === "neon") {
  const neonOk = envPresent("DATABASE_URL") || cmdExists("neonctl");
  addCheck(
    "db_neon_signal",
    neonOk,
    "DATABASE_URL or neonctl present (value not printed)",
    "Set DATABASE_URL from Neon console (sslmode=require) or install neonctl",
  );
}

if (database === "local-docker") {
  addCheck(
    "compose_file",
    existsSync(join(root, "docker-compose.yml")),
    "docker-compose.yml present",
    "docker-compose.yml missing for local-docker",
  );
}

// --- env name presence (never print values) ---
const envNamesApi = [
  "DATABASE_URL",
  "JWT_ACCESS_SECRET",
  "WEB_ORIGIN",
  "PORT",
  "NODE_ENV",
  "REFRESH_DAYS",
];
const envNamesWeb = ["VITE_API_URL"];

for (const name of envNamesApi) {
  checks.push({
    id: `env_${name}`,
    ok: envPresent(name),
    detail: envPresent(name)
      ? `${name} is set in this shell (value hidden)`
      : `${name} not set in this shell — set on provider dashboard and/or local .env (do not commit)`,
  });
}
for (const name of envNamesWeb) {
  checks.push({
    id: `env_${name}`,
    ok: envPresent(name),
    detail: envPresent(name)
      ? `${name} is set in this shell (value hidden)`
      : `${name} not set — for hosted web use absolute https://<api>/api/v1`,
  });
}

// --- questions (always include scope) ---
questions.push({
  id: "scope",
  type: "choice",
  prompt: "Deploy target?",
  options: [
    { value: "preview", label: "Preview / staging only (default)" },
    { value: "local", label: "Local demo only (compose + docker/api + vite)" },
    { value: "production", label: "Production (requires explicit typed confirm)" },
  ],
  default: "preview",
});

if (web === "vercel" && !cmdExists("vercel") && !envPresent("VERCEL_TOKEN")) {
  questions.push({
    id: "vercel_auth",
    type: "choice",
    prompt: "How will you authenticate Vercel?",
    options: [
      { value: "login_cli", label: "I will run `npx vercel login` then tell the agent to continue" },
      { value: "token", label: "I will set VERCEL_TOKEN in this shell / Cursor env" },
      { value: "dashboard", label: "I will deploy via Vercel dashboard; agent only prepares checklist" },
    ],
  });
}

if (api === "render" && !cmdExists("render") && !envPresent("RENDER_API_KEY")) {
  questions.push({
    id: "render_auth",
    type: "choice",
    prompt: "How will you authenticate Render?",
    options: [
      { value: "login_cli", label: "Install/login Render CLI, then continue" },
      { value: "api_key", label: "Set RENDER_API_KEY in this shell" },
      { value: "dashboard", label: "Blueprint/dashboard only; agent prepares checklist" },
    ],
  });
}

if (api === "railway" && !cmdExists("railway") && !envPresent("RAILWAY_TOKEN")) {
  questions.push({
    id: "railway_auth",
    type: "choice",
    prompt: "How will you authenticate Railway?",
    options: [
      { value: "login_cli", label: "railway login, then continue" },
      { value: "token", label: "Set RAILWAY_TOKEN" },
      { value: "dashboard", label: "Dashboard only; agent prepares checklist" },
    ],
  });
}

if (database === "neon" && !envPresent("DATABASE_URL")) {
  questions.push({
    id: "database_url",
    type: "secret",
    prompt:
      "Paste Neon DATABASE_URL for staging (agent must not echo/commit it). Or choose local-docker demo instead.",
    alternatives: [
      { value: "switch_local_docker", label: "Temporarily use local-docker for this demo" },
    ],
  });
}

if (!envPresent("JWT_ACCESS_SECRET")) {
  questions.push({
    id: "jwt_secret",
    type: "choice",
    prompt: "JWT_ACCESS_SECRET is missing in this shell. How to proceed?",
    options: [
      { value: "provide", label: "I will set JWT_ACCESS_SECRET (do not paste in chat if avoidable — use env)" },
      { value: "provider_only", label: "I already set it on the API provider dashboard" },
      { value: "generate_local", label: "Generate a local-only secret for preview (show once, never commit)" },
    ],
  });
}

if (!envPresent("WEB_ORIGIN") && frontendFw !== "none") {
  questions.push({
    id: "web_origin",
    type: "text",
    prompt:
      "WEB_ORIGIN for API CORS/cookies — leave blank until Vercel URL exists, then set https://<vercel-host>",
    optional: true,
  });
}

if (!envPresent("VITE_API_URL") && frontendFw === "react-vite") {
  questions.push({
    id: "vite_api_url",
    type: "text",
    prompt:
      "VITE_API_URL for hosted web — leave blank until API URL exists, then set https://<api-host>/api/v1",
    optional: true,
  });
}

questions.push({
  id: "continue_after_answers",
  type: "confirm",
  prompt: "After answering, should the agent continue the deploy pipeline (build → migrate → preview → smoke)?",
  default: true,
});

// Hard blocked if convention/runbook missing
const hardGapIds = new Set(
  gaps
    .filter((g) =>
      /^(pnpm_workspace|pkg_|stub_|runbook_|provider_|compose_file)/.test(g.id),
    )
    .map((g) => g.id),
);

const authGaps = gaps.filter((g) =>
  /^(cli_|db_neon_signal)/.test(g.id),
);

let status = "ready";
if (hardGapIds.size > 0) status = "blocked";
else if (questions.some((q) => q.id !== "continue_after_answers" && q.id !== "scope") || authGaps.length > 0)
  status = "needs_input";
// scope is always asked — if only soft env missing, still needs_input when auth gaps or secret questions exist
if (status === "ready" && (authGaps.length > 0 || !envPresent("DATABASE_URL") && database === "neon")) {
  status = "needs_input";
}

const requiredQuestions = questions.filter((q) => q.optional !== true);
const nextQuestion = requiredQuestions[0] ?? questions[0] ?? null;

const report = {
  status,
  askMode: "sequential",
  nextQuestion: nextQuestion
    ? { id: nextQuestion.id, type: nextQuestion.type, prompt: nextQuestion.prompt }
    : null,
  project: {
    name: config.project?.name ?? null,
    slug: config.project?.slug ?? null,
    monorepo,
  },
  providers: { web, api, database, backend: backendFw, frontend: frontendFw },
  appDirs: { web: webDir, api: apiDir },
  checks,
  gaps,
  questions,
  next: {
    blocked: "Fix hard gaps (bootstrap / stubs / runbook) before deploy.",
    needs_input:
      "Ask exactly ONE question (nextQuestion / first unanswered). Wait for reply before the next. Never invent secrets.",
    ready: "Run local builds, then provider preview per deploy/kb runbooks. Production requires typed human confirm.",
  }[status],
  safety: {
    neverInventSecrets: true,
    neverAutoProduction: true,
    doNotPrintSecretValues: true,
    askSequentially: true,
  },
};

if (jsonMode) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`# Deploy preflight — ${status}\n`);
  console.log(`Providers: web=${web} api=${api} database=${database} (backend=${backendFw})\n`);
  console.log("## Checks");
  for (const c of checks) {
    console.log(`- [${c.ok ? "x" : " "}] ${c.id}: ${c.detail}`);
  }
  if (gaps.length) {
    console.log("\n## Gaps");
    for (const g of gaps) console.log(`- ${g.id}: ${g.detail}`);
  }
  console.log("\n## Next question (ask only this)");
  if (nextQuestion) {
    console.log(`- ${nextQuestion.id} (${nextQuestion.type}): ${nextQuestion.prompt}`);
  } else {
    console.log("- (none)");
  }
  console.log("\n## Full question queue (for agent state; do not dump to human)");
  for (const q of questions) {
    console.log(`- ${q.id} (${q.type})${q.optional ? " [optional]" : ""}`);
  }
  console.log(`\n## Next\n${report.next}`);
}

if (status === "blocked") process.exit(1);
if (status === "needs_input") process.exit(2);
process.exit(0);
