# Product Requirements Document (PRD) — SAGAR RAKSHAK
**Project Title:** SAGAR RAKSHAK — "Every Slick Traced, Every Vessel Identified"  
**Problem Statement ID:** SIH PS 26143 / Ministry: National Technical Research Organisation (NTRO) / Space Technology / Software  
**Version:** 2.0.0 (SIH 2026 Full-Stack Prototype Specification)  
**Status:** ACTIVE SPECIFICATION  

---

## 1. Executive Summary & Problem Statement

Marine oil spills represent catastrophic environmental events inflicting severe economic and ecological damage across coastal zones, coral reefs, fisheries, and critical port infrastructure. While modern spaceborne Earth Observation (EO) satellites—specifically Synthetic Aperture Radar (SAR) and optical multispectral imagery—routinely detect oil slicks on the ocean surface, **the responsible polluting vessel is almost never held accountable**. 

Toxified slicks are discovered hours or days after illegal bilge discharge, tank washing (MARPOL 73/78 violations), or bunker leaks. By the time a satellite passes overhead, the guilty vessel has steamed tens or hundreds of nautical miles away into international waters, often having switched off its Automatic Identification System (AIS) Class-A transponder ("dark ship" maneuvers).

**SAGAR RAKSHAK** solves this attribution gap. It provides a complete, automated, end-to-end intelligence and forensic attribution platform that:
1. Ingests dual-sensor satellite imagery (Sentinel-1 SAR + Sentinel-2/Resourcesat optical).
2. Classifies oil slicks and characterizes spill morphology and physical weathering kinetics.
3. Executes Lagrangian hydrodynamic drift hindcasting (OpenDrift-style numerical particle modeling forced by HYCOM ocean currents and ECMWF winds) to isolate the space-time release origin ($T_0$).
4. Reconstructs historical AIS vessel traffic and flags transponder blackout anomalies.
5. Produces an explainable, 5-factor ranked suspect leaderboard with expandable scorecards and exclusion actions.
6. Conducts court-defensible **What-If Sensitivity Testing**, perturbing metocean parameters (current speed, heading, wind leeway, release window) to compute rank retention %, correlation variance, spatial overlap %, and centroid drift error in kilometers.
7. Generates an exportable, formal **MARPOL Annex I Forensic Evidence Dossier** with SHA-256 cryptographic seal compliant with Section 65B of the Indian Evidence Act.
8. Hosts an always-accessible **Docked AI Forensics Copilot** assisting operators with real-time incident Q&A.

---

## 2. Distinction from Competitor Reference ("SPILLX")

SAGAR RAKSHAK establishes a decisively superior and distinct user experience:
- **Design Language & Palette:** Distinct deep-ocean teal (`#00d2b4` / `#0ea5e9`) with navigational amber (`#f59e0b`) and high-priority coral-red (`#f43f5e`) accents. Replaces SPILLX's flat navy-cyan monochrome.
- **Data Source Color Encoding:**
  - Satellite / SAR: **Teal**
  - Ocean Currents / Weather: **Green** (`#10b981`)
  - AIS / Vessel Traffic: **Amber**
  - Suspect Tankers / Alerts: **Coral-Red**
- **Layout Paradigm:** Map-first full-bleed canvas with floating contextual glass HUD panels (`backdrop-filter: blur(16px)`), eliminating SPILLX's rigid boxed-grid layout and permanently duplicated sidebars.
- **Interactive Drift Motion:** Live animated particle flow along current+wind vector fields synchronized with an interactive scrubber, replacing static dashed lines.
- **First-Class What-If Testing:** Interactive perturbation sliders with real-time recalculation of rank retention %, correlation variance %, spatial overlap %, and centroid error.

---

## 3. Pages & Functional Scope

### Page 1: Login / Ops Gateway (`/login`)
- Clean, mission-console feel for maritime enforcement (ICG / NTRO).
- Fields: Operator email/username + security passcode.
- Real Supabase Auth integration (`@supabase/supabase-js`) targeting active project `calculus-nominated` (`ixynpnpavmorppvltbxf`).
- Secondary "Sign in with National Maritime SSO (NIC / NTRO)" option.
- 1-Click evaluator demo profiles (`Indian Coast Guard`, `NTRO Space Analyst`).
- Form validation and dynamic error states.

### Page 2: Landing / Command Room (`/`)
- Full-bleed tactical hero with satellite sweep visualization.
- Headline: *"SAGAR RAKSHAK — Every Slick Traced, Every Vessel Identified"*.
- Persistent "Incident Reconstruction Telemetry" HUD with live system counters (Active corridors, Mean SAR damping ratio, AIS vessels tracked, Attribution latency).
- Incident ID / Vessel MMSI search bar (filters and previews active scenarios).
- Quick-launch cards for the three operational pilot zones:
  - **Gulf of Kutch Deepwater Basin** (Vadinar SPM / Coral Reef Sanctuary / SPM Crude Spills)
  - **Mumbai High Offshore Corridor** (Western Fairway / ONGC Basin / Heavy Crude Discharge)
  - **Chennai / Ennore Coastal Gateway** (Port Channel / Bay of Bengal Gateway / Coastal Biome)
- Direct CTA: "Enter Operations Console".

### Page 3: Operations Console (Core Application)
- **Top Workflow Stepper:** Detect & Verify $\rightarrow$ Reverse Drift $\rightarrow$ AIS Correlation $\rightarrow$ Legal Dossier.
- **Five Primary Views:**
  1. **Tactical Map:** Full-bleed hero map with animated drift particle flow, 5 toggleable layers (SAR Slick, Drift Cone, AIS Tracks, Dark Segments, Current Vectors), and 5 focus presets (Full Corridor, Slick Polygon, Spill Origin, Top Suspect, Dark Segment).
  2. **Interactive Evidence Graph:** 8-node causal chain graph (SAR obs $\rightarrow$ slick morphology $\rightarrow$ oil verification $\rightarrow$ drift backtrack $\rightarrow$ origin zone $\rightarrow$ AIS correlation $\rightarrow$ suspect vessel) with confidence-scaled glows, color by data source, and parameter inspection card.
  3. **Suspects Leaderboard:** Ranked leaderboard table with expandable scorecards showing 5 sub-scores (Spatial CPA, Temporal $\Delta t$, Trajectory Alignment, Drift Overlap, AIS Anomaly), candidate exclusion action, and tactical intercept vector drawing.
  4. **What-If Sensitivity Testing:** Sliders for current speed offset, heading deviation, wind leeway %, and release time shift with live recalculation of rank retention %, correlation variance %, spatial overlap %, centroid error in km, and plain-language court defensibility readout.
  5. **Legal Dossier:** Formal government letterhead investigation report, SHA-256 digital signature seal, printable/PDF export layout, and JSON evidence package export.
- **Docked AI Forensics Copilot:** First-class, always-accessible chat drawer answering incident queries with grounded telemetry and evidence citations.

---

## 4. Statutory & Legal Standards
- **MARPOL 73/78 Annex I, Regulation 15:** Control of discharge of oil from cargo spaces and bilges.
- **Merchant Shipping Act (1958) Section 356:** Prevention and containment of pollution of the sea by oil.
- **Indian Evidence Act (1872) Section 65B / Bharatiya Sakshya Adhiniyam:** Admissibility of electronic records with deterministic SHA-256 cryptographic digest.
