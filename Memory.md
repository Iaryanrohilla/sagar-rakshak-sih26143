# Project Memory & Session Ledger (Memory.md) — SAGAR RAKSHAK
**Project Title:** SAGAR RAKSHAK (AI-Powered Maritime Oil-Spill Detection & Vessel Attribution Platform)  
**Problem Statement ID:** SIH PS 26143 / NTRO / Space Technology / Software  
**Initial Entry Date:** 2026-09-20  
**Latest Update Date:** 2026-09-23  

This document preserves architectural memory, key technical decisions, known issues, and immediate next steps across sessions.

---

## Session Ledger: 2026-09-20 (Phase 1 Baseline to Phase 8 Verification)

### Active Phases
- **Phase 1 through Phase 8:** Complete core foundation, FastAPI backend, full-bleed Leaflet map, tactical suspect leaderboard, MARPOL dossier modal, Playwright E2E tests, and Postman collection.
- 20/20 Vitest tests pass; 12/12 FastAPI tests pass; 24/24 Newman Postman assertions pass.

---

## Session Ledger: 2026-09-23 (Phase 9 Full-Stack Prototype Build)

### Active Phase
- **Phase 9:** Full-Stack Interactive Prototype Build (SIH 2026 Core Delivery) [TASK-09]

### Accomplished in this Session
1. **Installed & Integrated Supabase Auth (`@supabase/supabase-js`):**
   - Connected to active Supabase project `calculus-nominated` (`https://ixynpnpavmorppvltbxf.supabase.co`) with retrieved publishable key and legacy anon fallback.
   - Built `src/services/supabaseClient.ts` with real `signInWithPassword`, `signUp`, and resilient government operator credentials (`commander.icg@sagarrakshak.gov.in`, `ntro.analyst@gov.in`, `dgshipping.inspector@nic.in`) to ensure 100% demo reliability online or offline.
2. **Built What-If Sensitivity Testing Mathematical Engine (`src/services/whatIfService.ts`):**
   - Implemented Lagrangian drift perturbation math calculating origin displacement, Gaussian kernel spatial overlap %, Monte Carlo rank retention % ($N=100$), correlation variance, and plain-language court-defensible readouts.
   - Validated with automated unit tests in `src/tests/whatIfService.test.ts` (3/3 tests passing, total 23/23 Vitest passing).
3. **Built Context-Aware AI Forensics Copilot (`src/services/copilotService.ts` & `src/components/copilot/ForensicsCopilotDrawer.tsx`):**
   - Engineered contextual QA generator grounded in active incident satellite attenuation (dB), slick area, Mackay weathering age, OpenDrift hydrodynamic vectors, AIS blackout duration, and MARPOL / Section 65B legal provisions.
4. **Overhauled Design System to Deep-Ocean Teal + Coral/Amber (`src/styles/index.css`):**
   - Strictly differentiated from SPILLX reference prototype.
   - Distinct color tokens per data source (Teal = SAR, Green = Ocean, Amber = AIS, Coral-Red = Suspects/Alerts).
   - Hero number utilities, translucent glassmorphism HUD tokens, animated particle keyframes, and print styles for formal legal dossier.
5. **Created Multi-Page App Architecture & Views:**
   - `AuthPage.tsx`: C4I Maritime Operations Console security gateway with real Supabase Auth + Gov SSO + 1-Click demo accounts.
   - `LandingPage.tsx`: Full-bleed tactical hero, persistent telemetry HUD, Incident ID / MMSI search, and 3 pilot region cards.
   - `EvidenceGraphView.tsx`: Interactive 8-node causal chain graph with confidence-scaled glows and parameter inspection card.
   - `SuspectsView.tsx`: Ranked leaderboard with expandable 5-factor scorecards, candidate exclusion action, and What-If test shortcut.
   - `WhatIfView.tsx`: Sensitivity perturbation sliders with dynamic KPI outcome panel, court defensibility rating, and recomputed suspect table.
   - `DossierView.tsx`: Formal government letterhead legal report, SHA-256 digital signature seal, and Print/PDF/JSON export controls.
6. **Updated Six Root Steering Documents:**
   - Synchronized `Prd.md`, `Architecture.md`, `Design.md`, `Rules.md`, `Phases.md`, and `Memory.md` at project root.

### Decisions Made & Rationale
- **Visual Identity:** Mandated strict avoidance of SPILLX's flat monochrome cyan; utilized curated deep-ocean teal (`#00d2b4`) with warm amber (`#f59e0b`) and coral-red (`#f43f5e`) accents.
- **Court Defensibility:** What-If sensitivity testing is treated as a first-class feature calculating mathematical rank retention under metocean noise to prove guilt beyond reasonable doubt under legal cross-examination.
- **Digital Evidence Seal:** SHA-256 hash computed over incident data package to comply with Section 65B of the Indian Evidence Act.

---

## Session Ledger: 2026-09-23 (Front-End Layout & Styling Architecture Fix)

### Accomplished in this Session
1. **Re-architected Dashboard Layout using CSS Grid with Fixed Fractional Tracks:**
   - App Shell: `grid-template-rows: auto 1fr auto` cleanly separates the top fixed header region (`TacticalHeader`, `KPIRibbon`, `PipelineStepper`), middle operational workspace (`1fr`, `overflow: hidden; min-height: 0`), and 24px operational status footer.
   - Operations Console Map Layout: Re-architected as a 2-column, 2-row CSS Grid (`grid-template-columns: 1fr 420px; grid-template-rows: 1fr auto`).
   - Column 1, Row 1: Dedicated Tactical Map Viewport (`.map-viewport-wrapper`, `z-index: 0`).
   - Column 1, Row 2: Bottom Docked Timeline Scrubber (`.timeline-scrubber-region`), docked in relative flow below the map — zero map obscuration or inspector bleed.
   - Column 2, Rows 1-2: Right Tactical Inspector (`.inspector-panel`), dedicated 420px column track (collapses into clean 38px vertical rail with expand trigger).
2. **Removed Absolute Positioning Wrappers & Enforced Containment:**
   - Replaced floating absolute inspector panel and timeline scrubber with relative grid cells.
   - Removed duplicate bottom-left floating pill from map canvas to eliminate clutter.
3. **Standardized Deterministic z-index Hierarchy:**
   - Base Map Canvas: `z-index: 0` (`--z-base`)
   - Particle Overlay Canvas: `z-index: 10` (`--z-overlay`)
   - Floating Toolbars / Controls: `z-index: 20` (`--z-toolbar`)
   - Dropdown Menus: `z-index: 25` (`--z-popover`)
   - Bounded Modals / Drawers: `z-index: 30` (`--z-modal`)
   - Full-Screen Dialogs / Copilot: `z-index: 1000` (`--z-dialog`)
4. **Enforced Card Min/Max Height Constraints:**
   - `IncidentSummaryCard`: Fixed `min-height: 94px; max-height: 124px; flex-shrink: 0; overflow: hidden;` prevents layout blowouts.
   - Inspector scroll body: `flex: 1; min-height: 0; overflow-y: auto;` provides clean bounded scrolling.
5. **Disk File Verification:**
   - Confirmed all six root steering files (`Architecture.md`, `Design.md`, `Memory.md`, `Phases.md`, `Prd.md`, `Rules.md`) exist at root disk and are updated.
6. **Automated Verification:**
   - `npm run typecheck`: 0 errors
   - `npm test`: 23/23 tests passing
   - `npm run test:e2e`: Playwright E2E passing (10.1s)

---

## Session Ledger: 2026-09-23 (SAGAR RAKSHAK UI Overhaul, Map High-Contrast & Visual Clearing [TASK-10])

### Accomplished in this Session
1. **Phase 1: Diagnose & Map Overhaul (Eliminated White Canvas Glare):**
   - Root-caused map tile inversion: removed destructive `filter: invert(1)` from `.leaflet-tile` in `src/styles/index.css`.
   - Preserved Esri Dark Gray Canvas as the zero-key tactical maritime base map and added Esri World Imagery as the high-resolution satellite imagery layer.
   - Enhanced the oil slick polygon with high-contrast SAR styling (`#00d2b4` stroke, `#020713` fill, permanent centroid marker).
   - Rendered the Spill Origin ($T_0$) with high-contrast Teal marker and permanent tooltip `⌖ SPILL ORIGIN (T₀) | Coords`.
   - Rendered the forensic vessel intercept trajectory with high-contrast Coral-Red badge and dashed line (`FORENSIC INTERCEPT: CPA 0.82 NM | Δt 18 min`).
   - Added continuous particle flow simulation driven by metocean current and wind vectors on an HTML5 canvas overlay.

2. **Phase 2: Strict Layout Re-Architecture (Zero Component Collisions):**
   - Restructured application shell into strict Flexbox/Grid: `h-screen w-screen overflow-hidden flex flex-col`.
   - Top Header Region (`flex-shrink-0`): Fixed TacticalHeader, KPIRibbon, and PipelineStepper.
   - Middle Workspace (`flex-1 flex flex-row overflow-hidden relative`):
     - Left/Center: Full-bleed Tactical Map Viewport (`flex-1 relative h-full overflow-hidden`).
     - Right: Docked Pipeline & Incident Summary Panel with fixed `w-[420px]` width, `border-l border-[var(--border-medium)]`, and internal `overflow-y-auto`. Strictly docked in horizontal layout flow — never floats over or obscures the map.
   - Bottom Bar: Timeline Scrubber docked strictly at the bottom (`flex-shrink-0 w-full`), spanning full width below the middle section.
   - Standardized z-index hierarchy: Base Map (`z-0`) < Particle Overlay (`z-10`) < Floating Toolbars / Badges (`z-20`) < Dropdowns (`z-25`) < Docked Inspector (`z-30`) < Dialogs (`z-1000`).

3. **Phase 3: Noise Reduction & Visual Hierarchy:**
   - Overhauled `KPIRibbon.tsx` to feature 3 Core Hero Numbers large and bold at the top left/center:
     1. **AI Detection Confidence %** (`1.42rem`, font-weight 900, glowing Teal `#00d2b4`, SAR UNet badge)
     2. **Spill Area** (`1.42rem`, font-weight 900, bright Cyan `#38bdf8`, polygon area in km², estimated volume)
     3. **Top Suspect Match %** (`1.42rem`, font-weight 900, Coral-Red `#f43f5e`, flag, vessel name)
   - Followed by compact secondary telemetry stream with strict domain color hierarchy:
     - SAR = Teal (`#00d2b4`)
     - AIS = Amber (`#f59e0b`)
     - Ocean / Metocean = Marine Green (`#10b981`)
     - Suspects / Intercepts = Coral-Red (`#f43f5e`)

4. **Phase 4: Verify & Auto-Correct (Ralph Self-Correction Loop):**
   - Created Playwright visual verification suite (`tests/e2e/visual_verify.spec.ts`).
   - Verified exact bounding boxes: right panel width `420px`, map right edge equals right panel left edge (zero horizontal overlap), timeline scrubber strictly below middle content area.
   - Verified dark tile styles without `invert(1)`.
   - Captured full dashboard screenshot to artifact directory (`dashboard_overhaul.png`).
   - Verified 100% passing tests: `npm run typecheck` (0 errors), `npm test` (23/23 tests pass), `npm run test:e2e` (2/2 test suites pass in 13.6s), and `npm run build` (production build passes in 6.13s).



