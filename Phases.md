# Phased Implementation Roadmap (Phases.md) — SAGAR RAKSHAK
**Project Title:** SAGAR RAKSHAK (AI-Powered Maritime Oil-Spill Detection & Vessel Attribution Platform)  
**Problem Statement ID:** SIH PS 26143 / NTRO / Space Technology / Software  
**Version:** 2.0.0 (Master Execution Plan)  
**Status:** ACTIVE TRACKER & MASTER PLAN  

---

### Phase 1: Six Steering Documents & Repository Baseline
- [X] **TASK-01A: Create the Six Steering Documents at Repo Root**  
  *Done When:* `Prd.md`, `Architecture.md`, `Design.md`, `Rules.md`, `Phases.md`, and `Memory.md` exist at the root directory with complete specifications.
- [X] **TASK-01B: Verify Baseline Integrity & Git Checkpoint**  
  *Done When:* `npm test` passes (20/20 Vitest passing), `npm run build` exits 0, and git status is clean.

---

### Phase 2: High-Fidelity UI Screen Mockups via Stitch MCP
- [X] **TASK-02A: Initialize Stitch MCP Project**  
  *Done When:* Stitch project `sagar_rakshak_c4i` created via `StitchMCP` tool with design system `Aegis Command HUD`.
- [X] **TASK-02B: Generate Tactical Control Room Home Screen Mockup**  
  *Done When:* Screen generated in Stitch showing full-bleed dark map, HUD overlays, active alert ticker, and KPI ribbon.
- [X] **TASK-02C: Generate Spill Detail & Lagrangian Drift View Mockup**  
  *Done When:* Screen generated in Stitch displaying slick geometry and 48h drift cone.
- [X] **TASK-02D: Generate Ranked Suspect Leaderboard Mockup**  
  *Done When:* Screen generated in Stitch showcasing leaderboard cards with driving factor pills.
- [X] **TASK-02E: Generate MARPOL Annex I Forensic Dossier Mockup**  
  *Done When:* Screen generated in Stitch displaying formal printable evidence sheet with cryptographic hash.

---

### Phase 3: Backend REST API Service & PostGIS Database Contract
- [X] **TASK-03A: Establish Python FastAPI Microservice Skeleton**  
  *Done When:* `backend/main.py` initialized with FastAPI, Pydantic schemas, and CORS middleware.
- [X] **TASK-03B: Implement Core REST API Endpoints**  
  *Done When:* 12 core REST endpoints implemented and tested (12/12 automated API tests passing).
- [X] **TASK-03C: Generate Postman Collection**  
  *Done When:* `docs/api/sagar_rakshak_postman_collection.json` generated covering all endpoints with assertions.

---

### Phase 4: Full-Bleed Map Canvas & Interactive Timeline Scrubber
- [X] **TASK-04A: Refactor Layout to Full-Bleed Map Workspace**  
  *Done When:* Primary layout gives 100% viewport to map canvas with floating HUD panels.
- [X] **TASK-04B: Build Interactive Timeline Scrubber Component**  
  *Done When:* Scrubber renders at bottom with Play/Pause, speed selector, hindcast step ticker, and forecast slider.
- [X] **TASK-04C: Synchronize Map Animations with Scrubber**  
  *Done When:* Backward Lagrangian particle movement and forward forecast cone animate dynamically.

---

### Phase 5: Ranked Suspect Leaderboard & Forensic Factor Drilldown
- [X] **TASK-05A: Re-style Attribution Panel as a Tactical Leaderboard**  
  *Done When:* Suspects presented in ranked leaderboard with score bars and top factor badges.
- [X] **TASK-05B: Implement Intercept Vector & Evidence Highlighting on Map**  
  *Done When:* Tactical intercept vector connects suspect track to origin zone on map.
- [X] **TASK-05C: Enhance "Why This Vessel?" Forensic Breakdown Modal**  
  *Done When:* Modal displays 5-factor Bayesian weights, raw sensor telemetry, and MARPOL checklist.

---

### Phase 6: SIMULATED Badging & Multi-Agency Alert Workflow
- [X] **TASK-06A: Add High-Visibility [SIMULATED] Badges to Synthetic Modules**  
  *Done When:* Top header and panels display prominent `[SIMULATED DATA]` badge.
- [X] **TASK-06B: Connect Multi-Agency Alert Action Tray**  
  *Done When:* Agency action buttons transition incident state and update audit log.
- [X] **TASK-06C: Validate Print & PDF Export of MARPOL Forensic Dossier**  
  *Done When:* Printable evidence view with SHA-256 integrity seal opens and renders.

---

### Phase 7: Automated Testing & DevTools Verification
- [X] **TASK-07A: Create Playwright End-to-End Test Suite**  
  *Done When:* Playwright test script executes the complete user flow with zero failures.
- [X] **TASK-07B: Execute Chrome DevTools MCP Audit**  
  *Done When:* Live session inspected with 0 console errors, 0 warnings, and 0 failing network requests.
- [X] **TASK-07C: Execute Postman Collection Tests**  
  *Done When:* Postman collection runs against REST API with 24/24 assertions passing.

---

### Phase 8: CodeRabbit Remediation & Baseline Polish
- [X] **TASK-08A: Trigger CodeRabbit Review on Diff**  
  *Done When:* CodeRabbit review executes; all findings remediated.
- [X] **TASK-08B: Final Production Build Verification**  
  *Done When:* `npm run build` produces optimized production bundle; `npm test` passes 100%.

---

### Phase 9: Full-Stack Interactive Prototype Build (SIH 2026 Core Delivery)
- [X] **TASK-09A: Supabase Auth & Multi-Page Navigation Architecture**  
  *Done When:* Real Supabase client configured with `@supabase/supabase-js`, supporting login with demo officer accounts (`commander.icg@sagarrakshak.gov.in`, `ntro.analyst@gov.in`), route switching between `AUTH`, `LANDING`, and `CONSOLE`.
- [X] **TASK-09B: Landing / Command Room Page with Live Telemetry & Pilot Zones**  
  *Done When:* `LandingPage.tsx` renders full-bleed hero, persistent Incident Reconstruction Telemetry HUD, Incident ID / MMSI search bar, and quick-launch pilot region cards.
- [X] **TASK-09C: What-If Sensitivity Testing Mathematical Engine**  
  *Done When:* `whatIfService.ts` computes origin displacement, spatial overlap %, Monte Carlo rank retention %, correlation variance %, and plain-language sensitivity readout under metocean perturbation (verified with unit tests in `whatIfService.test.ts`).
- [X] **TASK-09D: Interactive 8-Node Causal Evidence Graph**  
  *Done When:* `EvidenceGraphView.tsx` renders interactive causal chain nodes with confidence glows, source color-coding, and parameter inspection card.
- [X] **TASK-09E: Suspect Leaderboard with 5-Factor Scorecards & Candidate Exclusion**  
  *Done When:* `SuspectsView.tsx` displays ranked vessels with expandable 5 sub-scores, candidate exclusion with rationale, and What-If test action.
- [X] **TASK-09F: Court-Defensible Formal Legal Dossier View**  
  *Done When:* `DossierView.tsx` renders formal government letterhead report with SHA-256 cryptographic seal, Section 65B Indian Evidence Act certification, and Print/PDF/JSON export controls.
- [X] **TASK-09G: Docked AI Forensics Copilot Drawer**  
  *Done When:* `ForensicsCopilotDrawer.tsx` provides first-class chat interface grounded in active incident satellite telemetry, drift physics, and MARPOL law.
- [X] **TASK-09H: Full-Bleed Map Canvas with Animated Drift Particles & Presets**  
  *Done When:* `TacticalMapCanvas.tsx` features animated particle flow along current+wind vectors, 5 layer toggles HUD, and 5 focus presets.
- [X] **TASK-09I: End-to-End Verification & Commit**  
  *Done When:* Vitest (23/23 tests), TypeScript (`tsc --noEmit`), Playwright E2E tests, and Chrome DevTools verification pass cleanly.
