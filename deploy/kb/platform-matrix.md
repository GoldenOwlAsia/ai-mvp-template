# Platform Selection Matrix

> **Purpose:** Provide a consistent, evidence-based process for selecting deployment platforms.

---

## 1. Decision principles

Do not select a provider only because it offers the fastest first deployment.

Evaluate:

- Supported framework and runtime.
- Deployment model: static, serverless, container, VM, or orchestrated workload.
- Preview and staging support.
- Region availability and data residency.
- Private networking requirements.
- Scaling model and operational limits.
- Logging, monitoring, and audit capabilities.
- Secrets and identity management.
- Rollback and artifact promotion support.
- Current and projected cost.
- Vendor lock-in.
- Compliance requirements.
- Team operational experience.
- Required uptime and recovery objectives.

Claude must document the selected provider, rejected alternatives, assumptions, and known limitations.

---

## 2. Web hosting matrix

| Provider | Best fit | Strengths | Important trade-offs |
|---|---|---|---|
| Vercel | Next.js and modern frontend applications | Git integration, preview deployments, CDN, managed build pipeline | Platform-specific behavior and cost must be evaluated at scale |
| Cloudflare Pages | Static sites, SPAs, edge-oriented applications | Global edge network and Workers integration | Some server workloads require an edge-compatible design |
| Netlify | Static/Jamstack projects and small teams | Preview deployments and simple project setup | Functions and pricing limits must be reviewed |
| Firebase Hosting | SPAs, PWAs, Firebase-centered products | Strong Firebase integration and CDN support | Non-Firebase backend services require separate deployment |
| AWS Amplify | Teams already operating in AWS | Integrates with AWS services and IAM | More configuration and AWS knowledge may be required |
| S3 + CloudFront | Static applications requiring AWS control | Flexible, mature, and auditable | The team owns cache invalidation, certificates, and pipeline design |

### Default guidance

- Next.js: start with Vercel unless compliance, cost, or infrastructure constraints require another provider.
- Static SPA: evaluate Cloudflare Pages and Netlify.
- Firebase-heavy frontend: evaluate Firebase Hosting.
- AWS-controlled production: evaluate Amplify or S3 + CloudFront.

---

## 3. Backend hosting matrix

| Provider | Best fit | Strengths | Important trade-offs |
|---|---|---|---|
| Railway | MVPs and small-to-medium APIs | Fast setup, simple managed services | Review pricing, resource limits, and production guarantees |
| Render | Web services, workers, and scheduled jobs | Simple operations and Docker support | Review cold starts, scaling, and plan limits |
| Fly.io | Region-distributed container workloads | Multi-region placement and container model | Networking and operations require additional expertise |
| Cloud Run | Stateless containers on Google Cloud | Managed scaling and scale-to-zero | Workloads must be stateless and compatible with the request model |
| AWS ECS/Fargate | Production workloads requiring AWS governance | IAM, networking, scaling, and AWS integration | Higher setup and operational complexity |
| EC2 | Legacy systems or workloads requiring full OS control | Maximum control | The team owns patching, process supervision, scaling, and recovery |
| Kubernetes | Multi-service platforms with a mature platform team | Extensibility and standard orchestration | Usually excessive for an early MVP |

### Default guidance

- MVP: Railway or Render.
- Stateless containers on Google Cloud: Cloud Run.
- AWS-governed production: ECS/Fargate.
- Do not choose Kubernetes without a demonstrated operational requirement.

---

## 4. Database matrix

| Provider | Best fit | Strengths | Important trade-offs |
|---|---|---|---|
| Supabase | PostgreSQL with managed auth, storage, or realtime | Product features integrated around PostgreSQL | RLS, environment isolation, and permissions require discipline |
| Neon | Serverless PostgreSQL and database branching | Branching and developer-friendly workflows | Connection behavior and limits must be reviewed |
| AWS RDS | Production databases in AWS | Managed backups, HA options, IAM/VPC integration | More infrastructure and cost management |
| Provider-managed PostgreSQL | Applications hosted on the same platform | Simple setup | Portability, limits, and backup features vary |
| PlanetScale | MySQL-compatible workloads | Managed workflow and scaling model | Not appropriate when PostgreSQL-specific features are required |
| Self-hosted PostgreSQL | Specialized infrastructure requirements | Full control | The team owns patching, backup, replication, and availability |

### Mandatory database rules

- Staging and production must use separate databases.
- Production must have a tested backup and restore procedure.
- Schema migrations must be version-controlled.
- A free tier alone is not a valid production selection criterion.

---

## 5. Mobile build and distribution matrix

| Application type | Recommended automation | Internal distribution | Store or beta distribution |
|---|---|---|---|
| Flutter | Fastlane and Flutter CLI | Firebase App Distribution | Google Play Internal Testing and TestFlight |
| React Native bare | Fastlane and native toolchains | Firebase App Distribution | Google Play Internal Testing and TestFlight |
| Expo managed | EAS Build and EAS Submit | EAS internal distribution | Google Play and TestFlight |
| Android native | Gradle and Fastlane | Firebase App Distribution | Google Play |
| iOS native | Xcodebuild and Fastlane | TestFlight internal testing | App Store Connect |

### Automation rule

Use Fastlane as the primary release automation layer for:

- Flutter.
- React Native bare.
- Android native.
- iOS native.

For Expo managed applications, EAS may be the primary build and submission system. Do not add Fastlane unless there is a specific native workflow not covered by EAS.

---

## 6. CI/CD platform matrix

| Platform | Recommended use |
|---|---|
| GitHub Actions | Source code is hosted on GitHub and the project needs PR checks, environments, approvals, and deployment history |
| GitLab CI | Source code and delivery workflow are hosted in GitLab |
| Bitbucket Pipelines | The team uses Bitbucket and the Atlassian ecosystem |
| CircleCI | The organization already maintains reusable CircleCI configuration |
| Codemagic | The project is mobile-focused, especially Flutter |
| Provider-native pipeline | The team wants to reduce integrations and the provider supports required controls |

Default to the CI provider associated with the source repository unless there is a documented reason not to.

---

## 7. Decision tree

```text
What is being deployed?
│
├─ Web frontend
│  ├─ Next.js → Evaluate Vercel first
│  ├─ Static site / SPA → Evaluate Cloudflare Pages or Netlify
│  └─ Firebase-centered app → Evaluate Firebase Hosting
│
├─ Backend API
│  ├─ MVP → Evaluate Railway or Render
│  ├─ Stateless container → Evaluate Cloud Run or Fly.io
│  └─ AWS-controlled production → Evaluate ECS/Fargate
│
├─ Database
│  ├─ PostgreSQL + managed product services → Evaluate Supabase
│  ├─ Serverless PostgreSQL / branching → Evaluate Neon
│  └─ AWS production → Evaluate RDS
│
└─ Mobile
   ├─ Flutter / React Native bare / native → Fastlane
   └─ Expo managed → EAS
```

---

## 8. Selection record template

```markdown
## Platform decision

- Workload:
- Target environment:
- Selected provider:
- Region:
- Alternatives considered:
- Selection reasons:
- Operational owner:
- Known limitations:
- Estimated operational complexity:
- Required accounts:
- Required secrets:
- Rollback capability:
- Cost assumptions:
- Security or compliance constraints:
- Open questions:
```

Commit this decision to the project documentation when it affects long-term architecture.

---

## 9. Stop conditions

Claude must not make the final platform decision without human confirmation when:

- Data residency or regulatory requirements apply.
- The system handles sensitive or regulated data.
- Production already exists on another provider.
- Private networking or VPC requirements are unresolved.
- Cost limits are undefined and the choice could create significant spend.
- Store account or code-signing ownership is unclear.
- Multi-region failover is required.
- A provider migration may cause downtime or data loss.
