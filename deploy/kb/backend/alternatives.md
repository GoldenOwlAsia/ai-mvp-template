# Backend Hosting Alternatives

> **Purpose:** Select a backend platform when Railway is not the correct fit.

---

## Coverage status

This file is a provider comparison and selection aid. It is **not** a complete executable deployment runbook for every provider listed here.

Before Claude implements one of these alternatives, add a provider-specific runbook with current official commands, authentication, CI/CD, verification, and rollback instructions.

---

## 1. Decision matrix

| Platform | Best fit | Deployment unit | Operational complexity |
|---|---|---|---|
| Render | Small/medium web services, workers, cron jobs | Source or Docker | Low to medium |
| Fly.io | Region-distributed container applications | Docker image | Medium |
| Google Cloud Run | Stateless request-driven containers | Docker image | Medium |
| AWS ECS/Fargate | AWS-governed production services | Docker image | Medium to high |
| EC2 | Legacy or full-OS control | VM | High |
| Kubernetes | Mature multi-service platform | Containers | Very high |

Do not choose Kubernetes for an MVP without a platform-team requirement.

---

## 2. Render

Use for straightforward web services, workers, and scheduled jobs.

**Executable runbook:** [`render.md`](./render.md) (when `stack.config.yaml` → `deploy.api: render`).

Minimum configuration:

- Build/start commands or Dockerfile (`deploy/Dockerfile.api` for Nest/Node).
- Health-check path (`/health`).
- Environment groups separated by environment.
- Persistent disk only when required.
- Production branch and auto-deploy policy.
- Preview environment policy.
- Blueprint: root `render.yaml` (sync with `deploy/render.yaml`).

Verify current blueprint syntax before committing `render.yaml`.

Official documentation: https://docs.render.com/

---

## 3. Fly.io

Use when applications need placement near multiple regions and the team can operate distributed containers.

Minimum controls:

- `fly.toml` reviewed.
- Internal and public ports correct.
- Health checks configured.
- Secrets set using Fly secret management.
- Volumes created only for workloads that require them.
- Region placement documented.
- Database latency and consistency evaluated.

Common risk: placing stateless app replicas in multiple regions while using a single distant database.

Official documentation: https://fly.io/docs/

---

## 4. Google Cloud Run

Use for stateless containers with request-driven scaling.

Minimum controls:

- Artifact Registry.
- Dedicated service account.
- Workload identity from CI.
- Secret Manager.
- Concurrency and timeout settings.
- Min/max instances.
- VPC connector only when needed.
- Cloud SQL connection strategy.
- Revision traffic splitting and rollback.

Do not store durable data on the container filesystem.

Official documentation: https://cloud.google.com/run/docs

---

## 5. AWS ECS/Fargate

Use when AWS governance, IAM, VPC controls, and production scalability justify the setup.

Required infrastructure:

- ECR repository.
- ECS cluster/service/task definition.
- Load balancer and target-group health check.
- IAM execution and task roles.
- VPC/subnets/security groups.
- Secrets Manager or Parameter Store.
- CloudWatch logs and alarms.
- Autoscaling.
- Deployment rollback or blue/green strategy.
- Infrastructure as code.

Prefer OIDC from CI over long-lived AWS access keys.

Official documentation: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html

---

## 6. EC2

Choose only when VM-level control is genuinely required.

The team becomes responsible for:

- OS patching.
- Runtime installation.
- Process supervision.
- TLS and reverse proxy.
- Firewall.
- Backups.
- Scaling.
- Monitoring.
- Deployment atomicity.
- Disaster recovery.

Use immutable images or release directories and a service manager. Do not copy source manually to a live server as the primary release process.

---

## 7. Provider selection record

```markdown
## Backend provider decision

- Workload types:
- Selected platform:
- Alternatives considered:
- Expected traffic:
- Regions:
- Networking requirements:
- Persistent storage:
- Scaling model:
- Required secrets:
- Deployment strategy:
- Rollback strategy:
- Cost assumptions:
- Open risks:
```
