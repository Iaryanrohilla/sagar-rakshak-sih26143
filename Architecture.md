# System Architecture Document (Architecture.md) — SAGAR RAKSHAK
**Project Title:** SAGAR RAKSHAK (AI-Powered Maritime Oil-Spill Detection & Vessel Attribution Platform)  
**Problem Statement ID:** SIH PS 26143 / NTRO / Space Technology / Software  
**Version:** 2.0.0 (Full-Stack Prototype Architecture)  
**Status:** ACTIVE ARCHITECTURAL SPECIFICATION  

---

## 1. System Topology & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 SAGAR RAKSHAK PLATFORM                                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
         ▼                                 ▼                                 ▼
┌──────────────────┐             ┌───────────────────┐             ┌─────────────────────┐
│   Auth Gateway   │             │   Landing Room    │             │ Operations Console  │
│  (Supabase Auth) │             │ (Live Telemetry & │             │  (Full-Bleed Map,   │
│  + Maritime SSO  │             │   Pilot Zones)    │             │   Views & Drawer)   │
└──────────────────┘             └───────────────────┘             └─────────────────────┘
                                                                             │
                    ┌────────────────────────┬───────────────────────────────┼──────────────────────────────┐
                    ▼                        ▼                               ▼                              ▼
          ┌───────────────────┐    ┌───────────────────┐           ┌───────────────────┐          ┌───────────────────┐
          │ Tactical Map View │    │  Evidence Graph   │           │ Suspects & WhatIf │          │ Legal Dossier &   │
          │ (Animated Drift,  │    │  (8-Node Causal   │           │ (5-Factor Scores, │          │ AI Copilot Drawer │
          │  Presets, Toggles)│    │   Chain & Glow)   │           │  Metocean Sliders)│          │ (SHA-256 Seal)    │
          └───────────────────┘    └───────────────────┘           └───────────────────┘          └───────────────────┘
```

---

## 2. Technology Stack & Core Modules

### Frontend Presentation Layer
- **Core Framework:** React 19 + TypeScript (Strict typing enabled).
- **Bundler & Tooling:** Vite 6 with React Fast Refresh.
- **Geospatial Canvas:** High-performance dark tactical map with Leaflet & HTML5 Canvas particle animation overlay for live Lagrangian hydrodynamic vector visualization.
- **Design System:** Custom C4I tactical tokens in `src/styles/index.css` featuring deep-ocean obsidian surfaces, bioluminescent teal, navigational amber, and coral-red alerts.
- **Icons & Telemetry:** Lucide React icons.

### Authentication & Database Layer
- **Managed Provider:** Supabase Cloud (`calculus-nominated`, ID: `ixynpnpavmorppvltbxf`, Region: `ap-northeast-1`).
- **Client Integration:** `@supabase/supabase-js` initializing direct connection with publishable key and anon fallback.
- **Resilient Fallback Profiles:** Pre-seeded with authentic government operator profiles (`commander.icg@sagarrakshak.gov.in`, `ntro.analyst@gov.in`, `dgshipping.inspector@nic.in`) ensuring 100% demo reliability offline or online.

### Mathematical & Domain Engine Layer
- **What-If Sensitivity Engine (`src/services/whatIfService.ts`):**
  - Numerical perturbation of current velocity $\vec{u}_{curr}$, wind leeway factor $\alpha$, and release time window $T_{release}$.
  - Gaussian kernel spatial dispersion overlap calculation:
    $$\text{Overlap} = 100 \times \exp\left(-\frac{1}{2}\left(\frac{\Delta x}{\sigma}\right)^2\right)$$
  - Monte Carlo rank retention evaluation across $N=100$ stochastic iterations.
- **AI Forensics Copilot Engine (`src/services/copilotService.ts`):**
  - Grounded contextual reasoning engine analyzing active scene SAR damping attenuation, spill weathering age, metocean drift vectors, AIS blackout duration, and statutory MARPOL violations.
- **Report & Cryptographic Service (`src/services/reportService.ts`):**
  - SHA-256 hashing over serialized incident evidence bundle for court admissibility under Section 65B of the Indian Evidence Act.

### Backend Microservice (`backend/`)
- **Framework:** Python FastAPI (`backend/main.py`) with Pydantic domain models (`backend/models.py`).
- **Endpoints:**
  - `GET /api/v1/health`
  - `GET /api/v1/regions` & `GET /api/v1/regions/{id}`
  - `GET /api/v1/incidents` & `GET /api/v1/incidents/{id}`
  - `GET /api/v1/incidents/{id}/detections`
  - `GET /api/v1/incidents/{id}/drift/hindcast` & `/forecast`
  - `GET /api/v1/incidents/{id}/suspects`
  - `GET /api/v1/incidents/{id}/dossier`

---

## 3. Data Flow & Forensic Pipeline

1. **Satellite Pass Ingestion:** Radar backscatter values evaluated for capillary wave attenuation ($\Delta \sigma_0 > 8.5\text{ dB}$).
2. **Dual-Sensor Optical Validation:** Negative contrast index in Sentinel-2 SWIR/NIR spectrum rules out look-alikes.
3. **Mackay Weathering Physical Ageing:** Evaporative mass loss kinetics establish the spill release window ($T_0$).
4. **Lagrangian Reverse Hindcasting:** OpenDrift numerical particles backtrack under coupled current and wind forcing to localize the discharge origin centroid.
5. **AIS Spatio-Temporal Intercept:** Correlating vessel tracks within $P_{origin} \pm \Delta t$ identifies candidate ships and flags deliberate AIS blackouts.
6. **Multi-Factor Attribution Scoring:** Transparent Bayesian sub-scores determine suspect rankings.
7. **What-If Robustness Proof:** Sensitivity testing proves the attribution remains stable under metocean shifts.
8. **Digital Dossier Seal:** An immutable SHA-256 digest is generated for court prosecution.
