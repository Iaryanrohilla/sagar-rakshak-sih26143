# Product Requirements Document (PRD) — SAGAR RAKSHAK

## 1. Project Overview
- **Project Title:** SAGAR RAKSHAK (AI-Powered Satellite Oil-Spill Detection & Vessel Attribution Platform)
- **Problem Statement ID:** SIH26143 / Theme: Space Technology
- **Team Name:** Team Calculus (6 Members)
- **Tagline:** "Every Slick Traced. Every Vessel Identified."
- **Core Value Proposition:** Turn every satellite pass into an accountability trail through dual-sensor satellite detection, physics-based Lagrangian drift hindcasting, and explainable AIS vessel attribution.

## 2. Target Users & Agencies
1. **Indian Coast Guard (ICG):** Rapid incident response, containment barrier positioning, pollution response teams (PRT), patrol vessel interception.
2. **Indian Navy:** Maritime Domain Awareness (MDA), sensor fusion, EEZ security perimeter monitoring.
3. **Ministry of Environment, Forest & Climate Change (MoEFCC):** Vulnerability mapping, coral reef and mangrove protection, ecological remediation damage assessment.
4. **Directorate General of Shipping (DG Shipping):** Flag state and Port State Control (PSC) detention, MARPOL 73/78 Annex I violation enforcement.
5. **Port Authorities (Deendayal/Kandla, Mumbai, Kamarajar/Ennore):** Harbor channel clearance, local craft warnings, containment boom deployment.
6. **Marine Insurers & P&I Clubs:** Forensic evidence dossier, liability apportionment, clean-up cost recovery.

## 3. High-Traffic Pilot Regions
1. **Gulf of Kutch:** High-density crude tanker corridor, Vadinar Single Point Mooring (SPM), Marine National Park coral and mangrove ecological sensitivity.
2. **Mumbai High:** Offshore oil fields (ONGC rigs), western tanker fairways, heavy transit lane.
3. **Chennai / Ennore Coast:** Kamarajar port approaches, Coromandel seaboard, historical spill sensitivity zone.

## 4. End-to-End Pipeline
1. **Detect (Dual-Sensor Ingestion & Segmentation):** Ingest Sentinel-1 C-band SAR + Sentinel-2 optical imagery. Neural network dark-spot segmentation + look-alike rejection (algae bloom, biogenic film, wind shadow).
2. **Characterise (Slick Morphology):** Compute slick geometry (area $km^2$, perimeter $km$, elongation ratio, major/minor spread axes).
3. **Age (Physical Weathering Kinetics):** Mackay weathering physics & Fay spreading model to compute evaporation %, emulsification mousse, and estimated release age ($T_0 \pm \Delta t$).
4. **Backward Hindcast (Origin Localisation):** Lagrangian reverse particle tracking against HYCOM currents and ECMWF winds (3% windage factor) to compute the Probable Spill Origin Zone.
5. **Forward Forecast (Landfall Risk):** Forward Lagrangian simulation projecting 24h/48h trajectory, uncertainty spread cone, and sensitive coastal landfall warnings.
6. **AIS Correlate (Maritime Traffic & Blackout Analysis):** Spatio-temporal trajectory correlation of maritime traffic within the release window; transponder blackout / dark ship anomaly scoring.
7. **Rank Vessel Suspects (Explainable Attribution):** Transparent multi-factor scoring (Proximity, Trajectory alignment, Speed, Timing, Drift overlap, AIS blackout) outputting ranked suspect vessels with attribution confidence.
8. **Visualise (C4I Control Room):** Real-time C4I maritime control room dashboard with dark tactical tiles, radar sweeps, SVG vector overlays, and timeline scrubber.
9. **Alert Authority (Multi-Agency Workflow):** Multi-agency alert dispatch lifecycle: `NEW` -> `ACKNOWLEDGED` -> `INVESTIGATING` -> `ESCALATED` -> `RESOLVED`.
10. **Generate Evidence Report (MARPOL Forensic Dossier):** Court-admissible MARPOL Annex I forensic dossier with printable formatting and JSON export.

## 5. Non-Negotiable Engineering Principles
- 100% functional, state-driven prototype (no static UI mockups or dead buttons).
- Fully deterministic scenario datasets (5 scenarios) with seamless runtime switching.
- Clean separation: UI -> State -> Domain Services -> Adapters.
- Single-Click Judge Demo ("RUN FULL DEMO") providing an automated 2-4 minute showcase.
