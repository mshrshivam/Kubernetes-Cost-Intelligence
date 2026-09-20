# 🚀 KubeCost Intelligence

Multi-Tenant Kubernetes Cost Attribution & Anomaly Detection

KubeCost Intelligence is a cloud infrastructure monitoring dashboard designed to help organizations understand and manage Kubernetes costs across multiple tenants. It attributes costs to namespaces/tenants and detects anomalous resource consumption.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Recharts
- Lucide React

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Demo flow

1. Dashboard — total cluster cost, tenant distribution, overview table
2. Cost Attribution — per-tenant breakdown; open tenant details
3. Anomaly Detection — pick a tenant, click Simulate Anomaly, watch metrics climb
4. Cost Validation — compare calculated cost vs OpenCost reference
5. Reset Simulation to restore baseline

## Project structure

```
src/
  data/          # Mock datasets (replace with API responses later)
  services/      # Data access layer (Prometheus / K8s / OpenCost ready)
  context/       # Shared cluster + simulation state
  components/    # Reusable UI, charts, tables
  app/           # Pages
```

Mock data is intentional. Services are structured so Prometheus, Kubernetes API, OpenCost, and a custom anomaly detection API can be plugged in without rewriting the UI.

