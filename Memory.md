# Project Memory & Session Ledger (Memory.md) — SAGAR RAKSHAK
**Project Title:** SAGAR RAKSHAK (AI-Powered Maritime Oil-Spill Detection & Vessel Attribution Platform)  
**Problem Statement ID:** SIH PS 26143 / NTRO / Space Technology / Software  
**Initial Entry Date:** 2026-09-20  

This document preserves architectural memory, key technical decisions, known issues, and immediate next steps across sessions. Every work session appends a dated entry.

---

## Session Ledger: 2026-09-20 (Phase 1 Baseline)

### Active Phase
- **Phase 1:** Six Steering Documents & Baseline Integrity [TASK-01]

### Accomplished in this Session
1. Initialized the project's six root steering documents:
   - `Prd.md`: Comprehensive product requirements, agency personas (ICG, NTRO, DG Shipping, Port Authorities, MoEFCC), pilot zones, core epics, MVP vs stretch scope, out-of-scope boundaries, demo success criteria.
   - `Architecture.md`: System diagram, module contracts, FastAPI backend justification over Express, PostGIS schema, prototype-to-production swap points table.
   - `Design.md`: C4I maritime control room visual design doctrine, full-bleed map layout, dark obsidian tokens, dual-encoding color/label rules, component inventory, simulation disclosure.
   - `Rules.md`: Mandatory agent behaviour rules (SIMULATED badging, git commits per slice, Playwright/Postman verification, Chrome DevTools audit, CodeRabbit review).
   - `Phases.md`: 8-phase sequential build plan with granular tasks and explicit self-verifiable "Done When" conditions.
   - `Memory.md`: Session ledger initialized for stateless continuity.
2. Verified existing unit, domain, and E2E pipeline test suite: all 20 tests pass cleanly in Vitest.

### Decisions Made & Rationale
- **Backend Architecture:** Chose Python FastAPI for the REST backend to align directly with Python's geospatial/scientific ecosystem (`NumPy`, `SciPy`, `Shapely`, `OpenDrift`, `PyTorch`) and automated OpenAPI specs. Kept an in-memory client-side adapter in React to ensure 100% offline demonstration reliability.
- **UI Architecture:** Transitioning from a standard split-pane layout to a full-bleed dark nautical map canvas with docked translucent glassmorphism HUD panels (`backdrop-filter: blur(12px)`).
- **Dual Encoding:** Mandated that severity and confidence must always display both a color AND an explicit label/percentage (e.g. `CRITICAL (94%)`) to comply with professional maritime operations standards.

### Known Issues & Technical Debt
- None in Phase 1 or 2.

### Exact Next Task
- Proceed to Phase 3: Backend REST API Architecture (FastAPI), PostGIS Database Schema & Postman Collection.

---

## Session Ledger: 2026-09-20 (Phase 2 Stitch Generation)

### Active Phase
- **Phase 2:** High-Fidelity UI Screen Mockups via Stitch MCP [TASK-02]

### Accomplished in this Session
1. Initialized Stitch project `sagar_rakshak_c4i` (`projects/10543003000504841347`) with design system **Aegis Command HUD** (`assets/ce46d33731134c549d5fa792e53739a3`).
2. Generated Screen 1 (`c839ac735a314ef584496c4117489602`): *SAGAR RAKSHAK // C4I Maritime Intelligence Dashboard* — full-bleed tactical map, active alerts ticker, floating KPI ribbon, dual-sensor satellite ingestion panel, and bottom timeline scrubber.
3. Generated Screen 2 (`24f8465ff4de488690034edf83d6794e`): *SAGAR RAKSHAK // Slick Detail & Lagrangian Drift Analysis* — reverse hindcast origin trajectory, 48h forward forecast cone, coupled HYCOM/ECMWF vectors, Mackay weathering curve, and coastal hazard checklist.
4. Generated Screen 3 (`543905b78c494970aa3ee11832883af4`): *SAGAR RAKSHAK // Ranked Suspect Leaderboard & AIS Correlation View* — leaderboard cards with score progress bars, top driving factor pills (CPA, $\Delta t$, AIS gap, course deviation), and 5-factor Bayesian forensics modal.
5. Generated Screen 4 (`b879cd42c4674dff9ca04cad68e40abf`): *SAGAR RAKSHAK // MARPOL Annex I Forensic Evidence Dossier* — court-admissible forensic dossier with SHA-256 cryptographic digest, sensor telemetry, and statutory sanctions.

### Exact Next Task
- Execute Phase 3: Backend REST API Service & PostGIS Database Contract (`backend/main.py`, models, and Postman collection) [TASK-03].
