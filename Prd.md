# Product Requirements Document (PRD) — SAGAR RAKSHAK
**Project Title:** SAGAR RAKSHAK — "Every Slick Traced, Every Vessel Identified"  
**Problem Statement ID:** SIH PS 26143 / Ministry: National Technical Research Organisation (NTRO) / Space Technology / Software  
**Version:** 1.0.0 (SIH 2026 Submission Prototype)  
**Status:** ACTIVE SPECIFICATION  

---

## 1. Executive Summary & Problem Statement

Marine oil spills represent one of the most destructive environmental catastrophes, causing irreversible damage to coastal ecosystems, coral reefs, fisheries, and port infrastructure. While modern spaceborne Earth Observation (EO) satellites—specifically Synthetic Aperture Radar (SAR) and optical multispectral imagery—routinely detect oil slicks on the ocean surface, **the responsible polluting vessel is almost never held accountable**. 

Toxified slicks are typically discovered hours or days after illegal bilge dumping or tank washing (MARPOL violations) or unintentional bunker leaks. By the time a satellite passes overhead, the guilty ship has steamed tens or hundreds of nautical miles away into international waters, often deliberately switching off its Automatic Identification System (AIS) transponder ("dark ship" maneuvers).

**SAGAR RAKSHAK** solves this attribution gap. It provides a complete, automated, end-to-end intelligence pipeline that ingests satellite imagery, segments and classifies oil slicks, computes weathering kinetics and physical age, executes backward Lagrangian drift hindcasting to isolate the exact space-time origin, cross-correlates maritime AIS traffic, and generates an explainable, court-admissible ranked suspect leaderboard with full MARPOL Annex I forensic dossiers.

---

## 2. Primary Users & Agency Personas

SAGAR RAKSHAK is engineered as a unified, role-aware C4I (Command, Control, Communications, Computers, and Intelligence) operations dashboard serving five distinct national stakeholders:

| Agency | Primary Operational Objective | Core Workflow in SAGAR RAKSHAK |
| :--- | :--- | :--- |
| **Indian Coast Guard (ICG)** | Rapid incident response, spill containment barrier positioning, pollution response team (PRT) dispatch, patrol intercept. | Accesses tactical map, 48-hour forward landfall forecast cone, sensitive shoreline warning alerts, and real-time vessel intercept vectors. |
| **NTRO Surveillance Analysts** | Satellite reconnaissance, dark vessel interdiction, sensor fusion, EEZ security perimeter monitoring. | Evaluates dual-sensor SAR/Optical fusion, detects AIS transponder blackout zones, reviews algorithmic look-alike rejection confidence. |
| **Directorate General of Shipping (DG Shipping)** | Port State Control (PSC) inspection, flag state notifications, legal detention, MARPOL 73/78 Annex I violation enforcement. | Downloads cryptographically hashed MARPOL Forensic Evidence Dossiers for detention warrants and International Maritime Organization (IMO) citations. |
| **Port Authorities (Kandla, Mumbai, Ennore)** | Harbor channel clearance, local craft navigation advisories, containment boom deployment around berths and SPM terminals. | Monitors local pilotage fairways, Single Point Mooring (SPM) berths, and estuarine approach channels for immediate booming operations. |
| **MoEFCC & State Pollution Control Boards** | Marine ecology protection, coral reef and mangrove preservation, environmental damage liability assessment. | Tracks slick impact against Marine National Parks, Pulicat Lake sanctuaries, and mangrove biomes; tracks volume and weathering mousse. |

---

## 3. High-Traffic Pilot Demonstration Zones

The prototype incorporates high-fidelity deterministic scenarios across three critical Indian maritime corridors:

1. **Gulf of Kutch Deepwater Basin (Gujarat / Arabian Sea)**
   - *Strategic Context:* Gateway handling ~70% of India's imported crude oil (Deendayal/Kandla Port, Vadinar Single Point Mooring [SPM] terminals).
   - *Ecological Vulnerability:* Marine National Park & Sanctuary (sensitive coral reefs, mangroves, endangered dugong habitats).
   - *Incident Profile:* Crude carrier tank-washing slick threatening Vadinar SPM and Pirotan Island reefs.

2. **Mumbai High Offshore Corridor (Maharashtra / Arabian Sea)**
   - *Strategic Context:* India's largest offshore hydrocarbon field (ONGC platforms BNV/NQ complex) combined with western ultra-large crude carrier (ULCC) transit lanes.
   - *Ecological Vulnerability:* Alibaug coastal fishery reserves, Elephanta island heritage biome, and Mumbai harbor approaches.
   - *Incident Profile:* High-volume bunker discharge in western fairway drifting toward offshore platform safety perimeter.

3. **Chennai / Ennore Coastal Gateway (Tamil Nadu / Bay of Bengal)**
   - *Strategic Context:* Busiest eastern commercial gateway (Kamarajar Port & Chennai Port) with severe historical sensitivity (2017 Dawn Kanchipuram collision).
   - *Ecological Vulnerability:* Pulicat Lake brackish water lagoon (flamingo sanctuary), Ennore creek mangroves, and Marina Beach coastal biome.
   - *Incident Profile:* Heavy fuel oil slick drifting northward toward Pulicat estuarine inlet.

---

## 4. End-to-End Intelligence Pipeline & User Stories

```
[Satellite Pass] ──> [Slick Detection] ──> [Characterisation & Age] ──> [Lagrangian Drift] ──> [AIS Correlation] ──> [Ranked Suspects] ──> [Alert & Dossier]
```

### Epic 1: Dual-Sensor Slick Ingestion & Detection
- **US-1.1:** As an analyst, I can view SAR (Sentinel-1 C-band VV/VH) and Optical (Sentinel-2 MSI / Resourcesat) satellite passes for any of the 3 pilot zones.
- **US-1.2:** As an analyst, I can toggle between SAR radar backscatter, Optical false-color RGB, and AI Fusion overlays.
- **US-1.3:** As an analyst, I can view neural-network dark-spot segmentation that explicitly rejects look-alikes (algal blooms, biogenic surface slicks, low-wind shadows) with confidence metrics.

### Epic 2: Slick Characterisation & Mackay Weathering Ageing
- **US-2.1:** As a responder, I can inspect slick geometric properties: total surface area ($km^2$), perimeter ($km$), elongation ratio, and estimated spill volume ($m^3$).
- **US-2.2:** As a responder, I can view physical weathering kinetics calculated via the Mackay weathering & Fay spreading models, showing percentage evaporated, water-in-oil emulsification (mousse factor), and estimated spill release timestamp ($T_0 \pm \Delta t$).

### Epic 3: Lagrangian Drift Hindcast & Forward Forecast
- **US-3.1:** As an operator, I can run a backward Lagrangian drift hindcast driven by HYCOM ocean currents and ECMWF 10m wind fields (with 3% windage factor and Stokes drift) to compute the Probable Spill Origin Zone ($P_{origin}$).
- **US-3.2:** As an operator, I can control an interactive Timeline Scrubber to animate the spill's trajectory backward to release time or forward up to 48 hours.
- **US-3.3:** As an ICG commander, I can project forward 24h/48h drift cones with dynamic uncertainty envelopes and landfall threat warnings for sensitive coastal biomes.

### Epic 4: AIS Correlation & Dark-Ship Anomaly Detection
- **US-4.1:** As an analyst, I can reconstruct all commercial and tanker vessel traffic passing through the origin space-time window ($T_0 \pm 3h, \pm 5nm$).
- **US-4.2:** As an analyst, I can identify transponder blackout anomalies where vessels intentionally switched off AIS Class-A transponders prior to or during the release window.

### Epic 5: Explainable Suspect Attribution Leaderboard
- **US-5.1:** As an investigator, I can view a ranked leaderboard of suspect vessels sorted by attribution score (0–100%).
- **US-5.2:** As an investigator, I can inspect the exact mathematical factor breakdown driving each vessel's score:
  - Closest Point of Approach (CPA) distance in nautical miles.
  - Temporal release delta ($\Delta t$) against Mackay weathering age.
  - AIS transponder blackout duration and proximity to origin.
  - Historical course alignment and sudden speed/maneuver deviations.
  - Cargo/draft profile consistent with bunker or crude discharge.
- **US-5.3:** As an investigator, clicking "Show Evidence on Map" links the suspect's voyage track, intercept vector, and blackout gap directly onto the tactical canvas.

### Epic 6: Multi-Agency Workflow & MARPOL Annex I Forensic Dossier
- **US-6.1:** As an authorized user, I can transition incident alert states (`NEW` $\rightarrow$ `ACKNOWLEDGED` $\rightarrow$ `INVESTIGATING` $\rightarrow$ `ESCALATED` $\rightarrow$ `RESOLVED`) and assign dispatch units.
- **US-6.2:** As an enforcement officer, I can generate and export a printable, court-admissible MARPOL Annex I Forensic Evidence Dossier complete with cryptographic SHA-256 integrity hash, vessel identity, satellite metadata, and drift vector proofs.

---

## 5. Scope Boundaries

### In-Scope for Prototype (SIH 2026 Submission)
- Full-bleed dark maritime C4I tactical operations control room dashboard.
- 100% functional, interactive, state-driven user experience (zero mock dead buttons).
- Interactive timeline scrubber with play/pause rewind and forward forecast projection.
- 5 comprehensive deterministic scenario datasets across the 3 pilot zones.
- Dual-mode architecture: runs seamlessly client-side for offline hackathon presentations and connects to the FastAPI REST backend.
- Explainable suspect attribution modal ("Why This Vessel?") and methodology modal ("Explain the AI").
- Court-admissible printable MARPOL Annex I forensic dossier.
- Automated 1-click "RUN FULL DEMO" tour for hackathon evaluators.
- Clear `[SIMULATED]` badging on all synthetic satellite imagery, meteo-oceanic fields, and AIS feeds.

### Explicitly Out-of-Scope (Deferred to Production Enterprise Deployment)
- Live paid commercial satellite ingestion subscriptions (e.g. real-time Sentinel Hub / Planet Labs / ICEYE commercial APIs).
- Training multi-gigabyte deep learning CNN weights from scratch during the hackathon.
- Live classified naval radar feeds or encrypted Indian Navy sensor links.
- Production multi-tenant enterprise Single Sign-On (SSO) / CAC card authentication.

---

## 6. Demo Success Criteria

1. **Zero-Error Execution:** Zero runtime console errors, zero broken asset links, 100% build pass on `npm run build` and Vitest suites.
2. **Visual Impact:** High-density, professional C4I dark tactical theme with neon radar accents and instant map interactivity.
3. **Forensic Credibility:** Evaluators can inspect physics-based equations (Mackay, Fay, Lagrangian advection, Bayes scoring) and verify that attribution isn't an arbitrary black-box percentage.
4. **Transparent Simulation:** Every mock feed displays an explicit `[SIMULATED]` tag, demonstrating production architecture awareness.
5. **Turnkey Judge Showcase:** Evaluators can click "RUN FULL DEMO" to experience an automated, choreographed 2.5-minute presentation demonstrating detection, hindcasting, AIS correlation, suspect identification, and report export.
