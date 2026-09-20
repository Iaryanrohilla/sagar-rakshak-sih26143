# Phased Implementation Roadmap (Phases.md) — SAGAR RAKSHAK
**Project Title:** SAGAR RAKSHAK (AI-Powered Maritime Oil-Spill Detection & Vessel Attribution Platform)  
**Problem Statement ID:** SIH PS 26143 / NTRO / Space Technology / Software  
**Status:** ACTIVE TRACKER & MASTER PLAN  

This document defines the sequential build phases for SAGAR RAKSHAK. Every task includes an explicit, self-verifiable **"Done When"** condition that must be verified before checking the box.

---

### Phase 1: Six Steering Documents & Repository Baseline
- [X] **TASK-01A: Create the Six Steering Documents at Repo Root**  
  *Done When:* `Prd.md`, `Architecture.md`, `Design.md`, `Rules.md`, `Phases.md`, and `Memory.md` exist at the root directory with complete specifications matching user directives.
- [X] **TASK-01B: Verify Baseline Integrity & Git Checkpoint**  
  *Done When:* `npm test` passes (20/20 Vitest passing), `npm run build` exits 0, and git status is clean with a commit referencing `[TASK-01]`.

---

### Phase 2: High-Fidelity UI Screen Mockups via Stitch MCP
- [X] **TASK-02A: Initialize Stitch MCP Project**  
  *Done When:* Stitch project `sagar_rakshak_c4i` (`projects/10543003000504841347`) is created via `StitchMCP` tool with design system `Aegis Command HUD`.
- [X] **TASK-02B: Generate Tactical Control Room Home Screen Mockup**  
  *Done When:* Screen `c839ac735a314ef584496c4117489602` generated in Stitch showing full-bleed dark map, HUD overlays, active alert ticker, and KPI ribbon.
- [X] **TASK-02C: Generate Spill Detail & Lagrangian Drift View Mockup**  
  *Done When:* Screen `24f8465ff4de488690034edf83d6794e` generated in Stitch displaying slick geometry, SAR/optical spectral overlay, and 48h drift cone.
- [X] **TASK-02D: Generate Ranked Suspect Leaderboard Mockup**  
  *Done When:* Screen `543905b78c494970aa3ee11832883af4` generated in Stitch showcasing leaderboard cards with driving factor pills (CPA, $\Delta t$, AIS gap).
- [X] **TASK-02E: Generate MARPOL Annex I Forensic Dossier Mockup**  
  *Done When:* Screen `b879cd42c4674dff9ca04cad68e40abf` generated in Stitch displaying formal printable evidence sheet with cryptographic hash.

---

### Phase 3: Backend REST API Service & PostGIS Database Contract
- [X] **TASK-03A: Establish Python FastAPI Microservice Skeleton**  
  *Done When:* `backend/main.py` is initialized with FastAPI, Pydantic schemas, and CORS middleware configured for Vite frontend.
- [X] **TASK-03B: Implement Core REST API Endpoints**  
  *Done When:* Endpoints `/api/v1/health`, `/api/v1/regions`, `/api/v1/incidents`, `/api/v1/incidents/{id}/detections`, `/api/v1/incidents/{id}/drift/hindcast`, `/api/v1/incidents/{id}/drift/forecast`, `/api/v1/incidents/{id}/suspects`, and `/api/v1/incidents/{id}/dossier` are implemented and return typed JSON matching PostGIS schema (12/12 automated API tests passing).
- [X] **TASK-03C: Generate Postman Collection**  
  *Done When:* `docs/api/sagar_rakshak_postman_collection.json` is generated covering all endpoints with mock tests and environment variables.

---

### Phase 4: Full-Bleed Map Canvas & Interactive Timeline Scrubber
- [X] **TASK-04A: Refactor Layout to Full-Bleed Map Workspace**  
  *Done When:* Primary layout in `App.tsx` gives 100% viewport to the map canvas, and left/right panels dock as floating translucent HUD glassmorphism overlays without letterboxing the map.
- [X] **TASK-04B: Build Interactive Timeline Scrubber Component**  
  *Done When:* Scrubber renders at bottom with Play/Pause button, 1x/2x/5x speed selector, reverse hindcast step ticker ($T_0 \dots T_{detect}$), and forward 48-hour forecast slider ($T_{detect} \dots T+48h$).
- [X] **TASK-04C: Synchronize Map Animations with Scrubber**  
  *Done When:* Pressing Play dynamically animates backward Lagrangian particle movement toward the origin zone and forward forecast uncertainty cone expansion.

---

### Phase 5: Ranked Suspect Leaderboard & Forensic Factor Drilldown
- [X] **TASK-05A: Re-style Attribution Panel as a Tactical Leaderboard**  
  *Done When:* Suspects are presented in a ranked leaderboard (`#01`, `#02`, `#03`) with score bars and top 2-3 driving factor badges (`CPA 0.8nm`, `AIS GAP 4.2h`, `COURSE MATCH 89%`) rather than plain percentages.
- [X] **TASK-05B: Implement Intercept Vector & Evidence Highlighting on Map**  
  *Done When:* Clicking "Show Evidence on Map" draws a tactical intercept vector connecting the suspect vessel track directly to the slick origin zone and centers the camera.
- [X] **TASK-05C: Enhance "Why This Vessel?" Forensic Breakdown Modal**  
  *Done When:* Modal clearly displays the 5-factor Bayesian weights ($w_{CPA}, w_{time}, w_{gap}, w_{course}, w_{draft}$), raw sensor telemetry, and MARPOL violation checklist.

---

### Phase 6: SIMULATED Badging & Multi-Agency Alert Workflow
- [X] **TASK-06A: Add High-Visibility [SIMULATED] Badges to All Synthetic Modules**  
  *Done When:* The top header and each relevant panel (Satellite Scene, Metocean Drift, AIS Traffic) displays an unambiguous `[SIMULATED DATA]` badge with explanatory tooltip.
- [X] **TASK-06B: Connect Multi-Agency Alert Action Tray**  
  *Done When:* Clicking agency action buttons (Coast Guard PRT dispatch, DG Shipping detention, Port Authority boom deployment) transitions incident state and updates the audit log.
- [X] **TASK-06C: Validate Print & PDF Export of MARPOL Forensic Dossier**  
  *Done When:* Clicking "Download MARPOL Dossier" opens a print-formatted evidence view with SHA-256 integrity seal, satellite coordinates, and suspect vessel proofs.

---

### Phase 7: Automated Testing & DevTools Verification
- [X] **TASK-07A: Create Playwright End-to-End Test Suite**  
  *Done When:* Playwright test script in `tests/e2e/control_room.spec.ts` executes the complete user flow: load dashboard $\rightarrow$ switch pilot region $\rightarrow$ run scrubber $\rightarrow$ select top suspect $\rightarrow$ verify modal and report generation (1/1 E2E tests passing).
- [X] **TASK-07B: Execute Chrome DevTools MCP Audit**  
  *Done When:* Live session inspected with Chrome DevTools MCP reveals 0 console errors, 0 warnings, and 0 failing network requests (79/79 HTTP 200 OK).
- [X] **TASK-07C: Execute Postman Collection Tests**  
  *Done When:* Postman collection runs against the REST API with all test assertions passing (12 requests, 24/24 assertions passing).

---

### Phase 8: CodeRabbit Remediation & Final Presentation Polish
- [X] **TASK-08A: Trigger CodeRabbit Review on Diff**  
  *Done When:* CodeRabbit review executes; all P0 and P1 issues are resolved and documented (0 P0, 0 P1 issues).
- [X] **TASK-08B: Final Production Build Verification**  
  *Done When:* `npm run build` produces optimized production bundle (built in 9.89s, 167kB gzipped); `npm test` passes 100% (20/20 vitest, 1/1 Playwright E2E, 12/12 FastAPI, 24/24 Newman Postman assertions); repository committed and synchronized on GitHub.
