# Visual Design Doctrine & C4I Interface Language (Design.md) — SAGAR RAKSHAK
**Project Title:** SAGAR RAKSHAK (AI-Powered Maritime Oil-Spill Detection & Vessel Attribution Platform)  
**Problem Statement ID:** SIH PS 26143 / NTRO / Space Technology / Software  
**Version:** 2.0.0 (Design System Doctrine)  
**Status:** MANDATORY VISUAL SPECIFICATION  

---

## 1. Visual Identity Doctrine (Strict Differentiation vs SPILLX)

The SAGAR RAKSHAK visual identity is engineered specifically to look and behave like a mission-critical maritime command operations center (C4I), strictly avoiding the flat navy-cyan monochrome and boxed-grid layout of competitor prototypes (e.g. SPILLX).

### Core Differentiating Principles:
1. **Curated Multi-Source Palette:** Replaces flat monochrome with an intentional, data-source-specific palette:
   - **SAR / Satellite Imagery:** Deep-Ocean Bioluminescent Teal (`#00d2b4` / `#0ea5e9`)
   - **Ocean Currents & Metocean:** Marine Emerald Green (`#10b981`)
   - **AIS & Vessel Navigation:** Maritime Navigational Amber (`#f59e0b` / `#fbbf24`)
   - **Suspect Vessels & Enforcement Alerts:** High-Priority Coral-Red (`#f43f5e` / `#ff5252`)
2. **Visual Hierarchy & Hero Numbers:** Primary KPIs (confidence %, spill area in $km^2$, attribution scores) are rendered large and bold (`hero-number`, `hero-number-lg`) with small, quiet supporting captions.
3. **Map-First, Full-Bleed Layout:** The tactical map canvas occupies 100% of the workspace viewport. Side panels and inspectors dock as floating translucent glass HUDs (`backdrop-filter: blur(16px)`), eliminating duplicated permanent sidebars.
4. **Physically Grounded Motion:** The Lagrangian drift simulation features continuous particle flow animations along the combined current + wind vector field rather than static dashed lines.
5. **Government Authority Tone:** Crisp monospace fonts (`JetBrains Mono`), uppercase tactical headers, and official government letterheads for court dossiers.

---

## 2. Color Palette & Tactical Tokens

| Token | Hex Value | Semantic Function |
| :--- | :--- | :--- |
| `--bg-primary` | `#050a12` | Deepest ocean obsidian base canvas |
| `--bg-secondary` | `#09111e` | Secondary tactical header and toolbar backdrop |
| `--bg-surface` | `#0f1c30` | Active panel and card surface |
| `--bg-glass` | `rgba(9, 17, 30, 0.88)` | Translucent HUD overlay backdrop (`blur(16px)`) |
| `--accent-teal` | `#00d2b4` | Primary SAR satellite detection, slick boundaries |
| `--accent-green` | `#10b981` | Ocean current vectors, Metocean conditions |
| `--accent-amber` | `#f59e0b` | AIS commercial vessel tracks, What-If controls |
| `--accent-coral` | `#f43f5e` | Suspect tankers, blackout gaps, urgent intercept |
| `--border-subtle`| `rgba(14, 165, 233, 0.14)`| Passive panel boundary |
| `--border-strong`| `rgba(0, 210, 180, 0.45)` | Active selection or focus highlight |

---

## 3. Typography Doctrine

- **Primary Body Font:** `'Inter'`, modern, legible sans-serif for descriptions and narrative reports.
- **Tactical Monospace Font:** `'JetBrains Mono'`, `'Fira Code'`, `'SF Mono'` for coordinates, timestamps, heading angles, speeds, and SHA-256 hashes.
- **Rule of Dual Encoding:** Severity and confidence must always display both an explicit label/percentage AND a color (e.g. `CRITICAL (94.6%)`).

---

## 4. Simulation Badging Rule

Per engineering rules, synthetic or pre-computed data modules display an unambiguous badge:
```
[● SIMULATED DATA]
```
Ensures complete transparency with government evaluators and court admissibility standards.

---

## 5. CSS Grid Layout & Non-Overlapping Interface Doctrine

To maintain mission-critical C4I clarity, the interface rejects arbitrary `position: absolute` floating wrappers:
1. **Grid Container Isolation:** All major UI regions (Top Navigation Stack, Center Operational Workspace, Bottom Timeline Scrubber, Right Tactical Inspector) reside in dedicated grid cells.
2. **Deterministic z-index Standard:**
   - Base Map: `z-index: 0` (`--z-base`)
   - Particle Simulation: `z-index: 10` (`--z-overlay`)
   - Floating Toolbars / Controls: `z-index: 20` (`--z-toolbar`)
   - Dropdown Menus: `z-index: 25` (`--z-popover`)
   - Modals / Drawers: `z-index: 30` (`--z-modal`)
   - Full Screen Overlays: `z-index: 1000` (`--z-dialog`)
3. **Card Dimension Constraints:** Floating summary cards and inspector widgets enforce fixed `min-height` and `max-height` with `overflow-y: auto`, preventing map obstruction or scrubber bleed.

