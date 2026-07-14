# stack.config.yaml — Fill once, one prompt = install everything

## Purpose

Architecture.md describes the stack in prose → AI still guesses versions / forgets packages.  
`stack.config.yaml` is the **source of truth** for language, framework, lib versions, feature flags, and deploy targets.

## Rules

1. Install only packages listed in config.
2. Pin exact versions (no `latest`, no silent bumps).
3. To add a lib → edit YAML → confirm with user → then install.
4. `features.*: false` → do not generate / do not install matching optional deps.

## Minimal example

```yaml
project:
  name: taskflow
  locale: en
  packageManager: pnpm
  node: "20"
  monorepo: true

presets:
  profile: nest-react-prisma

frontend:
  appDir: apps/web
  language: typescript
  framework: react
  frameworkVersion: "18.3.1"
  bundler: vite
  bundlerVersion: "5.4.0"
  styling: tailwindcss
  ui: shadcn
  packages:
    react: "18.3.1"
    react-dom: "18.3.1"
    "@tanstack/react-query": "5.59.0"
    zustand: "5.0.0"
    axios: "1.7.7"
    react-hook-form: "7.53.0"
    zod: "3.23.8"
    "@hookform/resolvers": "3.9.0"

backend:
  appDir: apps/api
  language: typescript
  framework: nestjs
  frameworkVersion: "10.4.0"
  orm: prisma
  ormVersion: "5.20.0"
  packages:
    "@nestjs/core": "10.4.0"
    "@nestjs/common": "10.4.0"
    "@nestjs/jwt": "10.2.0"
    "@nestjs/passport": "10.0.3"
    passport-jwt: "4.0.1"
    cookie-parser: "1.4.6"
    bcrypt: "5.1.1"
    class-validator: "0.14.1"
    class-transformer: "0.5.1"
    "@prisma/client": "5.20.0"

database:
  engine: postgresql
  provider: supabase   # supabase | neon | local-docker
  redis: false

deploy:
  web: vercel
  api: railway
  container: docker

tooling:
  typescript: "5.6.0"
  eslint: "9.0.0"
  prettier: "3.3.0"
  test:
    frontend: vitest
    backend: jest

features:
  auth: true
  softDelete: true
  fileUpload: false
  jobs: false
  observability: false

constraints:
  allowNewDependencies: false
  pinExactVersions: true
  forbidAny: true
```

## Bootstrap prompt (copy-paste)

> Read `stack.config.yaml` + `prompts/bootstrap-from-config.md`. Validate config. Scaffold the monorepo per config, write `package.json` with exact pins, run package-manager install, create `.env.example` and `docker-compose` if `database.provider=local-docker`. Do not add packages outside config. Report a checklist when done.

## Companion files (when implementing)

| File | Role |
|---|---|
| `stack.config.schema.json` | IDE + CI validation |
| `scripts/validate-stack-config.mjs` | Fail-fast before install |
| `scripts/apply-stack-config.mjs` | Generate `package.json` from YAML (less hallucination) |
| `.cursor/rules/05-stack-config.mdc` | Forbid installs outside config |
| `.claude/skills/bootstrap/` | `/bootstrap` |
