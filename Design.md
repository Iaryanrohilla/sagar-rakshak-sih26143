# Visual System & UI Specification (Design.md) — SAGAR RAKSHAK
**Project Title:** SAGAR RAKSHAK (AI-Powered Maritime Oil-Spill Detection & Vessel Attribution Platform)  
**Problem Statement ID:** SIH PS 26143 / NTRO / Space Technology / Software  
**Design Doctrine:** C4I Maritime Operations Control Room (Tactical, Dense, Map-Centric, Telemetric)  
**Version:** 1.0.0  
**Status:** ACTIVE UI SPECIFICATION  

---

## 1. Visual Philosophy & Design Doctrine

SAGAR RAKSHAK is intentionally designed as a **mission-critical maritime domain awareness (MDA) control room**, closer in spirit to naval combat management systems, NORAD situation displays, and air traffic control suites than a typical commercial SaaS dashboard.

### Core Visual Tenets:
1. **Full-Bleed Map Canvas as Primary Stage:** The geospatial map is not a small embedded widget; it occupies 100% of the viewport. Tactical panels, HUD telemetry ribbons, and drilldown cards dock or float over the map with glassmorphism transparency, preserving situational context at all times.
2. **High Information Density with Absolute Legibility:** Operators require instant access to coordinates, headings, timestamps, and confidence percentages without navigating deep menus. We utilize monospace tabular typography (`JetBrains Mono`, `Fira Code`) for metrics and coordinates.
3. **Mandatory Dual-Encoding Principle:** **Color alone is never used to convey status, severity, or confidence.** Every colored indicator is strictly paired with an explicit numerical metric and uppercase label:
   - 🔴 `CRITICAL (94%)` — Never just a red circle.
   - 🟠 `HIGH RISK (81%)` — Never just an orange border.
   - 🟡 `MEDIUM (58%)` — Never just a yellow dot.
   - 🟢 `VERIFIED / LOW (18%)` — Never just a green pill.
4. **Transparent Simulation Disclosure:** Every mock feed, synthetic satellite pass, and simulated AIS stream features a prominent, unmissable `[SIMULATED]` badge with amber/cyan border glow to guarantee absolute honesty during presentations.

---

## 2. Design Tokens & Palette Specifications

```css
:root {
  /* Surface & Background Hierarchy */
  --bg-space: #04070E;          /* Deepest background underlay */
  --bg-primary: #080C16;        /* Tactical dark obsidian base */
  --bg-surface: rgba(13, 21, 39, 0.88); /* Translucent HUD panel surface */
  --bg-surface-elevated: rgba(22, 34, 56, 0.94); /* Hover & active cards */
  --bg-glass-overlay: rgba(8, 12, 22, 0.75); /* Full modal backdrops */

  /* Border & Grid Tokens */
  --border-subtle: rgba(30, 49, 75, 0.70);
  --border-active: rgba(0, 240, 255, 0.45);
  --border-critical: rgba(255, 51, 102, 0.55);

  /* Primary Tactical Accents */
  --accent-cyan: #00F0FF;       /* Active radar sweep, SAR detections, primary focus */
  --accent-cyan-glow: rgba(0, 240, 255, 0.25);
  --accent-purple: #A855F7;     /* Optical Sentinel-2 / Resourcesat layers */
  --accent-emerald: #00FFA3;    /* Positive verification, compliant vessels, clean seas */

  /* Severity & Alert Spectrum (Strict Dual Encoding) */
  --severity-critical: #FF3366; /* Confirmed heavy crude slick / prime suspect */
  --severity-high: #FF8800;     /* Probable slick / secondary suspect */
  --severity-medium: #FFCC00;   /* Look-alike candidate / minor anomaly */
  --severity-low: #00D8A4;      /* Natural biogenic film / cleared vessel */

  /* Text & Telemetry Typography */
  --text-primary: #F0F6FC;      /* Primary labels and white values */
  --text-secondary: #8B9BB4;    /* Secondary metadata, units, and timestamps */
  --text-muted: #485A75;        /* Disabled or inactive elements */
  --text-cyan: #00F0FF;         /* Dynamic telemetry numbers */

  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', SFMono-Regular, monospace;
}
```

---

## 3. Layout Architecture & Workspace Zones

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ZONE 1: TACTICAL TOP BAR (System Time UTC, Scenario Selector, Role Switcher, Demo Tour)│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ZONE 2: INCIDENT & KPI TELEMETRY RIBBON (Coordinates, Area, Mackay Age, Top Suspect)   │
├──────────────────────────┬─────────────────────────────────────────────────────────────┤
│ ZONE 3: DOCKED LEFT HUD  │ ZONE 4: FULL-BLEED INTERACTIVE MAP CANVAS                   │
│                          │                                                             │
│ • Satellite Scene Layer  │ • Esri Tactical Dark Cartography with Nautical Graticule    │
│ • Slick Geometry Matrix  │ • Animated SAR Radar / Optical Sensor Footprint Overlays    │
│ • Mackay Weathering Curve│ • Real-time Slick Vector Polygon + Mackay Spreading Axes    │
│ • Lagrangian Drift Vector│ • Backward Hindcast Particles (P_origin ellipse)            │
│ • 48h Forward Landfall   │ • Forward Forecast Drift Cone with Landfall Threat Markers │
│   Threat Checklist       │ • AIS Vessel Trails, Course Vectors & Blackout Segments     │
│                          │ • Intercept Vector connecting Prime Suspect to Slick Origin │
├──────────────────────────┴─────────────────────────────────────────────────────────────┤
│ ZONE 5: BOTTOM TIMELINE SCRUBBER (Hindcast Rewind ── Play/Pause ── Forward Forecast)   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ZONE 6: DOCKED RIGHT LEADERBOARD (Ranked Suspect Vessels with 5-Factor Score Pills)    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Inventory & Interactive Specifications

### Component 1: Full-Bleed Map Canvas (`TacticalMapCanvas`)
- **Base Tile Layer:** High-contrast dark nautical cartography (Esri World Dark Gray Canvas with vector coastlines and maritime depth soundings).
- **Sensor Overlays:**
  - *SAR Mode:* Inverted high-contrast radar backscatter with slick damping visualization.
  - *Optical Mode:* Sentinel-2 false-color infrared/SWIR layer accentuating coastal vegetation and chlorophyll.
  - *AI Fusion Mode:* Combined SAR radar mask with optical confidence gradient overlay.
- **Dynamic Vector Geometry:** Slick polygons with pulsating glow borders, Lagrangian particle clusters with directional heading arrows, and vessel course lines with transponder blackout dashes.

### Component 2: Integrated Timeline Scrubber (`TimelineScrubber`)
- **Scrubber Modes:**
  1. *Detection Timestamp ($T_{detect}$):* Current snapshot as captured by satellite.
  2. *Backward Hindcast Rewind ($T_0 \dots T_{detect}$):* Animated particle drift moving backward hour-by-hour to the probable release location.
  3. *Forward Forecast ($T_{detect} \dots T+48h$):* Dynamic slider expanding the dispersion envelope toward coastal landfall zones.
- **Controls:** Play/Pause toggle, 1x/2x/5x speed multiplier, step-forward, step-backward, time-elapsed telemetry badge.

### Component 3: Ranked Suspect Leaderboard (`AttributionPanel`)
- **Leaderboard Header:** Total vessels in window, average CPA, highest attribution probability.
- **Suspect Rank Card:**
  - *Position Badge:* Prominent rank `#01`, `#02`, `#03` with gold/silver/bronze tactical borders.
  - *Vessel Identity:* Name, MMSI, Flag emoji, Vessel Class (e.g. `VLCC Crude Oil Tanker`).
  - *Attribution Score Bar:* Visual score progress bar with dual encoding: e.g. `89.4% [CRITICAL ATTRIBUTION]`.
  - *Top Driving Factors (Pill Badges):*
    - 📍 `CPA: 0.8 nm` (Within release radius)
    - ⏱️ `Δt: -0.4h` (Exact Mackay age alignment)
    - 📡 `AIS GAP: 4.2h` (Transponder dark maneuver)
    - 🧭 `HEADING DEV: 42°` (Sudden course alteration)
  - *Action Buttons:* "Why This Vessel?" (forensic explainability modal) and "Show on Map" (pans and highlights intercept vector).

### Component 4: Forensic Explainability Modals
- **"Why This Vessel?" Modal (`WhyVesselModal`):** Detailed breakdown of the Bayesian scoring formula, showing exact mathematical weights, sensor measurements, and MARPOL Annex I violation checklist.
- **"Explain the AI" Modal (`ExplainAIModal`):** Complete deep-dive into U-Net architecture, Mackay weathering kinetics, Lagrangian particle mechanics, and Bayes attribution formulas for hackathon judges.

### Component 5: Multi-Agency Action Tray & Alert Feed (`AlertsPanel`)
- Interactive state progression stepper: `NEW` $\rightarrow$ `ACKNOWLEDGED` $\rightarrow$ `INVESTIGATING` $\rightarrow$ `ESCALATED` $\rightarrow$ `RESOLVED`.
- Agency dispatch buttons: Dispatch Coast Guard PRT, Notify Port Captaincy, Issue DG Shipping PSC Detention Warrant.
- MARPOL Annex I Forensic Evidence Dossier generator: Opens print-ready forensic report with cryptographic hash.

---

## 5. UI States & Simulation Badging

1. **Loading State:**
   - Tactical radar sweep animation centered over the incident coordinates with telemetric status text: `"ACQUIRING SENTINEL-1 SAR PASS... CALIBRATING LEE SPECKLE FILTER... HINDCASTING HYCOM VECTORS..."`
2. **Simulation Notice State:**
   - Prominent badge on top header and on all simulated panels:
     ```
     [● SIMULATED DATA — SYNTHETIC SAR / AIS STREAM]
     ```
   - Hovering triggers an informational tooltip explaining that live production mode connects directly to ESA Copernicus STAC API and Spire Maritime AIS WebSockets.
3. **Empty / No-Selection State:**
   - Tactical crosshair graphic with text: `"SELECT PILOT REGION OR SATELLITE PASS TO INITIATE SENSOR FUSION"`.
4. **Active Alert State:**
   - Subtle perimeter pulse on the map canvas when an incident transitions to `CRITICAL` or detects a transponder blackout vessel.

---

## 6. Stitch Screen Mockup Plan

Before writing pixel-level code, we utilize **StitchMCP** to generate and validate four foundational screen designs:
1. `sagar_rakshak_c4i_home` — Primary full-bleed tactical control room dashboard with HUD overlays.
2. `sagar_rakshak_spill_drift` — Detailed slick morphology inspector with animated backward hindcast and forward 48h forecast.
3. `sagar_rakshak_suspect_ranking` — Suspect leaderboard displaying factor pills, CPA telemetry, and intercept vectors.
4. `sagar_rakshak_marpol_dossier` — Formal maritime court-admissible forensic evidence dossier.
