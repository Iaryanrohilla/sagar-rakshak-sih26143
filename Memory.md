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
- Need to generate Stitch screen mockups before refactoring components to ensure pixel-close alignment with the C4I design spec.
- Ensure all simulated data has prominent `[SIMULATED]` badges with tooltips.

### Exact Next Task
- Run `npm test` and `npm run build` to confirm baseline integrity [TASK-01B], commit Phase 1 steering documents to GitHub, and proceed to Phase 2 (Stitch screen mockup generation).
