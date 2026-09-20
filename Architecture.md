# System Architecture Document — SAGAR RAKSHAK
**Project Title:** SAGAR RAKSHAK (AI-Powered Maritime Oil-Spill Detection & Vessel Attribution Platform)  
**Problem Statement ID:** SIH PS 26143 / NTRO / Space Technology / Software  
**Version:** 1.0.0 (SIH 2026 Submission Architecture)  
**Status:** ACTIVE ARCHITECTURAL SPECIFICATION  

---

## 1. System Overview & End-to-End Pipeline Diagram

SAGAR RAKSHAK is structured as an asynchronous, modular geospatial intelligence pipeline. The diagram below illustrates the complete data flow from satellite pass down to court-admissible forensic reporting:

```
                            ┌──────────────────────────────────────────────┐
                            │               DATA INGESTION                 │
                            │  Sentinel-1 SAR C-band + Sentinel-2 Optical  │
                            │  [SIMULATED: GeoJSON / TIFF Sample Feeds]    │
                            └──────────────────────┬───────────────────────┘
                                                   │
                                                   ▼
                            ┌──────────────────────────────────────────────┐
                            │            DETECTION & SEGMENTATION          │
                            │  U-Net Dark Spot Segmentation Engine         │
                            │  Look-Alike Rejection (Algae, Wind, Seeps)   │
                            │  [SIMULATED: Pre-labelled Segmentation Mask] │
                            └──────────────────────┬───────────────────────┘
                                                   │
                                                   ▼
                            ┌──────────────────────────────────────────────┐
                            │         CHARACTERISATION & AGEING            │
                            │  Morphology: Area, Perimeter, Elongation     │
                            │  Weathering Physics: Mackay Kinetics & Fay   │
                            │  Output: Release Time T₀ ± Δt, Volume (m³)   │
                            └──────────────────────┬───────────────────────┘
                                                   │
                                                   ▼
                            ┌──────────────────────────────────────────────┐
                            │          LAGRANGIAN DRIFT MODELLING          │
                            │  Backward Hindcast: Origin Zone P_origin     │
                            │  Forward Forecast: 48h Landfall Threat Cone  │
                            │  Metocean: HYCOM Currents + ECMWF Windage    │
                            └──────────────┬───────────────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
┌──────────────────────────────────────────────┐ ┌──────────────────────────────────────────────┐
│            AIS CORRELATION ENGINE            │ │            ALERT LIFECYCLE ENGINE            │
│ Reconstruct Traffic in T₀ ± 3h, 5nm Origin   │ │ Multi-Agency Status: NEW ──> INVESTIGATING   │
│ Detect Transponder Blackouts & Loitering     │ │ Coast Guard / NTRO / DG Shipping Dispatch    │
│ [SIMULATED: Historical AIS Stream Parser]    │ │ Escalation & Containment Unit Assignment     │
└──────────────────────┬───────────────────────┘ └──────────────────────┬───────────────────────┘
                       │                                                │
                       ▼                                                │
┌──────────────────────────────────────────────┐                        │
│          BAYESIAN ATTRIBUTION ENGINE         │                        │
│ Multi-Factor Scoring (CPA, Δt, AIS Gap,      │                        │
│ Course Match, Vessel Draft & Speed Anomaly)  │                        │
│ Output: Ranked Suspect Leaderboard           │                        │
└──────────────────────┬───────────────────────┘                        │
                       │                                                │
                       └──────────────────────┬─────────────────────────┘
                                              │
                                              ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   FORENSIC EVIDENCE & REPORTING                               │
│ MARPOL Annex I Forensic Evidence Dossier (Printable HTML / PDF / Cryptographic SHA-256 Hash) │
└─────────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                              │
                                              ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    C4I CONTROL ROOM FRONTEND                                  │
│ Full-Bleed Dark Tactical Map (Mapbox/Leaflet) + Timeline Scrubber + Leaderboard + HUD Panels  │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack Selection & Justification

### Backend: Python FastAPI (Selected over Node.js/Express)
We selected **Python FastAPI** for the core backend microservice with the following architectural justification:
1. **Scientific & Geospatial Ecosystem:** The production implementation of SAGAR RAKSHAK relies on numerical computing and geospatial libraries (`NumPy`, `SciPy`, `Shapely`, `GeoPandas`, `PyTorch`, and `OpenDrift`). Implementing the backend in Python avoids cross-process serialization bottlenecks and IPC overhead.
2. **Asynchronous Concurrency:** Built on `Starlette` and `Uvicorn`, FastAPI provides asynchronous non-blocking I/O performance on par with Node.js while handling computationally intensive geospatial matrix operations via thread/process pools.
3. **Automated OpenAPI / Swagger Contract:** FastAPI natively generates interactive OpenAPI specifications (`/docs`) directly from Pydantic models. This allows instantaneous generation and synchronization of our Postman collections.
4. **Seamless Production Migration:** Replacing our prototype's analytic simulation functions with actual PyTorch neural net weights and OpenDrift trajectory models requires zero modifications to the REST API contract or data models.

*Hybrid Presentation Fallback:* To ensure 100% reliability during offline hackathon demonstrations, the React frontend also incorporates a zero-dependency in-memory TypeScript adapter that mirrors every FastAPI endpoint.

### Database: PostgreSQL + PostGIS via Supabase
- **Spatial Indexing:** R-Tree spatial indices (`GIST`) enable sub-millisecond execution of `ST_DWithin`, `ST_Intersects`, and `ST_Distance` across thousands of AIS trajectory points.
- **Supabase Cloud & Edge Services:** Provides managed PostgreSQL with PostGIS extensions pre-compiled, built-in instant REST/GraphQL reflection, row-level security (RLS) for multi-agency role separation, and object storage for SAR and optical TIFF scene images.

### Frontend: React 19 + TypeScript + Tailwind CSS
- **Tactical Map Workspace:** Full-bleed interactive geospatial canvas utilizing dark nautical cartography (Esri Dark Gray Canvas and CartoDB Dark Matter with vector overlays).
- **HUD Glassmorphism Design:** Tactical control room panels styled with CSS backdrop blur (`backdrop-filter: blur(12px)`), high information density, and phosphor typography (`JetBrains Mono`).
- **Telemetry Charts:** Recharts visualization for exponential Mackay weathering evaporation curves, emulsification kinetics, and attribution factor radar charts.

---

## 3. Pipeline Module Specifications

### Module 1: Satellite Ingestion Layer (`satelliteService`)
- **Inputs:** Satellite metadata (Sensor type, orbit pass, polarization VV/VH, acquisition timestamp, bounding box).
- **Processing:** Ingestion of Sentinel-1 C-band SAR Level-1 GRD imagery and Sentinel-2 MSI Level-2A surface reflectance. Radiometric calibration and Lee speckle filtering.
- **Prototype Implementation:** Serves realistic GeoTIFF and high-resolution simulated radar backscatter matrices for the 3 pilot zones.

### Module 2: Dark Spot Detection & Look-Alike Rejection (`slickDetectionService`)
- **Physics Principle:** Oil films dampen ocean surface capillary and short gravity waves, producing a specular reflection away from the SAR antenna, appearing as prominent dark spots.
- **Model Architecture:** Modified U-Net with ResNet-34 encoder for semantic segmentation. Secondary Random Forest / MLP classifier trained on 14 texture and context features (damping ratio, gradient border gradient, contrast, wind speed) to distinguish true mineral oil slicks from look-alikes (algal blooms, natural biogenic films, rain cells, low-wind calm areas).
- **Prototype Implementation:** Returns pre-labeled polygon geometries with pixel-level confidence scores and explicit look-alike rejection flags.

### Module 3: Slick Characterisation & Mackay Ageing (`characterisationService`)
- **Morphology Metrics:** Computes polygon area ($A$ in $km^2$), perimeter ($P$ in $km$), elongation ratio ($L/W$), and estimated volume ($V = A \times \bar{h}$ using Bonn Agreement thickness classifications).
- **Weathering Kinetics:** Implements Mackay's analytical weathering equations:
  $$F_{evap} = \frac{T_K}{K_E} \ln\left(1 + \frac{K_E \theta t}{T_K}\right)$$
  $$Y_W = C_{final} \left(1 - \exp\left(-\frac{K_B (1 + U_{wind})^2 t}{C_{final}}\right)\right)$$
- **Output:** Estimated elapsed time since release ($\Delta t$ hours) and estimated release window ($T_0 = T_{satellite} - \Delta t \pm \sigma$).

### Module 4: Lagrangian Drift Hindcasting & Forecasting (`driftService`)
- **Physics Principle:** Oil droplets on the sea surface move under the combined influence of ocean currents, surface wind leeway, and Stokes wave drift:
  $$\vec{V}_{particle} = \vec{U}_{current} + \alpha_{leeway} \vec{W}_{10m} + \vec{U}_{Stokes} + \vec{R}_{diffusion}$$
  where $\alpha_{leeway} \approx 0.030$ (3% rule), and $\vec{R}_{diffusion}$ is a stochastic Markov random-walk dispersion term.
- **Backward Hindcast:** Reverses the vector field backward in time by $\Delta t$ hours from detection centroid to establish the Probable Spill Origin Zone ($P_{origin}$ polygon with $2\sigma$ dispersion ellipse).
- **Forward Forecast:** Projects particles forward up to 48 hours to model trajectory spread, shoreline landfall collision points, and sensitive habitat intersection.

### Module 5: AIS Spatio-Temporal Correlation (`aisService`)
- **Query Bounding Box:** Spatio-temporal window defined by:
  $$\text{Region} = P_{origin} \oplus \text{Buffer}(5\,\text{nautical miles}), \quad t \in [T_0 - 3\,\text{hours}, T_0 + 3\,\text{hours}]$$
- **Vessel Filters:** Queries AIS Class-A and Class-B transponder messages. Flags transponder blackouts (gaps $> 1.5\,\text{hours}$ where vessel stopped transmitting while navigating near the origin zone) and loitering maneuvers (speed $< 3\,\text{knots}$ in open transit lanes).

### Module 6: Bayesian Multi-Factor Attribution Engine (`attributionService`)
- **Mathematical Formulation:** Each candidate vessel $v_i$ is evaluated across five normalized, weighted forensic criteria:
  $$S_{attrib}(v_i) = w_{CPA} \cdot f_{CPA} + w_{time} \cdot f_{time} + w_{gap} \cdot f_{gap} + w_{course} \cdot f_{course} + w_{draft} \cdot f_{draft}$$
  where $\sum w_k = 1.0$:
  - $f_{CPA}$ (Proximity): Gaussian decay function of Closest Point of Approach to origin: $\exp(-d_{CPA}^2 / 2\sigma_d^2)$.
  - $f_{time}$ (Temporal Match): Alignment between vessel pass timestamp and Mackay release timestamp $T_0$.
  - $f_{gap}$ (AIS Blackout Anomaly): Penalty for intentional transponder blackout in proximity to release zone.
  - $f_{course}$ (Course & Speed Consistency): Abrupt deviations in heading or speed matching bilge discharge speeds (6–10 kts).
  - $f_{draft}$ (Vessel Type & Draft Profile): Crude oil tankers, chemical tankers, and large container ships carrying heavy fuel oil (HFO) receive higher risk priors.

---

## 4. PostGIS Relational Database Schema

```sql
-- Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Pilot Regions & Sensitive Zones
CREATE TABLE pilot_regions (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(128) NOT NULL,
    description TEXT,
    boundary GEOMETRY(Polygon, 4326) NOT NULL,
    center GEOMETRY(Point, 4326) NOT NULL
);

-- 2. Satellite Scenes (SAR & Optical)
CREATE TABLE satellite_scenes (
    id VARCHAR(64) PRIMARY KEY,
    region_id VARCHAR(64) REFERENCES pilot_regions(id),
    sensor_type VARCHAR(32) NOT NULL, -- 'SENTINEL_1_SAR' | 'SENTINEL_2_OPTICAL'
    acquisition_time TIMESTAMPTZ NOT NULL,
    orbit_direction VARCHAR(16),       -- 'ASCENDING' | 'DESCENDING'
    polarization VARCHAR(16),          -- 'VV' | 'VH' | 'RGB'
    coverage_footprint GEOMETRY(Polygon, 4326) NOT NULL,
    raster_url TEXT NOT NULL,
    is_simulated BOOLEAN DEFAULT TRUE
);

-- 3. Spill Incidents
CREATE TABLE incidents (
    id VARCHAR(64) PRIMARY KEY,
    region_id VARCHAR(64) REFERENCES pilot_regions(id),
    scene_id VARCHAR(64) REFERENCES satellite_scenes(id),
    detection_timestamp TIMESTAMPTZ NOT NULL,
    estimated_release_timestamp TIMESTAMPTZ NOT NULL,
    estimated_age_hours NUMERIC(6, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'NEW',  -- 'NEW' | 'INVESTIGATING' | 'ESCALATED' | 'RESOLVED'
    severity VARCHAR(16) NOT NULL,     -- 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    slick_polygon GEOMETRY(Polygon, 4326) NOT NULL,
    origin_zone GEOMETRY(Polygon, 4326) NOT NULL,
    slick_area_sqkm NUMERIC(8, 3) NOT NULL,
    slick_perimeter_km NUMERIC(8, 3) NOT NULL,
    estimated_volume_m3 NUMERIC(10, 2) NOT NULL,
    evaporation_pct NUMERIC(5, 2) NOT NULL,
    mousse_factor NUMERIC(4, 2) NOT NULL
);

-- 4. Drift Simulation Particles
CREATE TABLE drift_particles (
    id BIGSERIAL PRIMARY KEY,
    incident_id VARCHAR(64) REFERENCES incidents(id) ON DELETE CASCADE,
    simulation_type VARCHAR(16) NOT NULL, -- 'HINDCAST' | 'FORECAST'
    timestep_hour NUMERIC(5, 1) NOT NULL,
    particle_position GEOMETRY(Point, 4326) NOT NULL,
    uncertainty_radius_km NUMERIC(6, 2) NOT NULL
);
CREATE INDEX idx_drift_particles_geom ON drift_particles USING GIST(particle_position);

-- 5. Vessels
CREATE TABLE vessels (
    mmsi VARCHAR(16) PRIMARY KEY,
    imo VARCHAR(16),
    name VARCHAR(255) NOT NULL,
    vessel_type VARCHAR(64) NOT NULL,  -- 'CRUDE_OIL_TANKER' | 'CONTAINER_SHIP' | 'BULK_CARRIER'
    flag_country VARCHAR(64) NOT NULL,
    length_m NUMERIC(6, 1),
    beam_m NUMERIC(6, 1),
    draught_m NUMERIC(4, 1),
    deadweight_tonnage INTEGER
);

-- 6. AIS Historical Positions
CREATE TABLE ais_positions (
    id BIGSERIAL PRIMARY KEY,
    mmsi VARCHAR(16) REFERENCES vessels(mmsi),
    timestamp TIMESTAMPTZ NOT NULL,
    position GEOMETRY(Point, 4326) NOT NULL,
    speed_knots NUMERIC(5, 2) NOT NULL,
    course_over_ground NUMERIC(5, 1) NOT NULL,
    heading NUMERIC(5, 1),
    nav_status VARCHAR(32),
    is_transponder_gap BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_ais_positions_geom ON ais_positions USING GIST(position);
CREATE INDEX idx_ais_positions_time ON ais_positions(mmsi, timestamp);

-- 7. Suspect Evaluations & Attribution Scores
CREATE TABLE suspect_evaluations (
    id BIGSERIAL PRIMARY KEY,
    incident_id VARCHAR(64) REFERENCES incidents(id) ON DELETE CASCADE,
    mmsi VARCHAR(16) REFERENCES vessels(mmsi),
    rank_order INTEGER NOT NULL,
    attribution_score NUMERIC(5, 2) NOT NULL, -- 0.00 to 100.00
    proximity_cpa_nm NUMERIC(6, 2) NOT NULL,
    time_delta_hours NUMERIC(6, 2) NOT NULL,
    blackout_duration_hours NUMERIC(5, 1) NOT NULL,
    course_deviation_deg NUMERIC(5, 1) NOT NULL,
    speed_anomaly_knots NUMERIC(5, 2) NOT NULL,
    factors_summary JSONB NOT NULL,
    intercept_vector GEOMETRY(LineString, 4326)
);

-- 8. Multi-Agency Alerts & Audit Trail
CREATE TABLE incident_alerts (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64) REFERENCES incidents(id) ON DELETE CASCADE,
    agency VARCHAR(32) NOT NULL,        -- 'COAST_GUARD' | 'NTRO' | 'DG_SHIPPING' | 'PORT_AUTH'
    severity VARCHAR(16) NOT NULL,
    status VARCHAR(32) NOT NULL,
    dispatched_units JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Prototype to Production Component Swap Mapping

To adhere strictly to engineering principles, every mock component in the prototype is architected with a 1-to-1 swappable interface:

| Pipeline Component | Prototype Implementation | Production Replacement Module | Integration Protocol / Swap Mechanism |
| :--- | :--- | :--- | :--- |
| **Satellite Imagery Ingestion** | Pre-bundled GeoTIFFs & synthetic SAR/optical arrays served via `/api/v1/scenes` | ESA Copernicus Open Access Hub & Sentinel Hub Commercial API / ISRO Bhoovan | Automated OData / STAC API ingestion worker subscribing to orbital pass alerts. |
| **Dark Spot Segmentation** | Deterministic GeoJSON slick masks with pre-computed confidence scores | PyTorch DeepLabV3+ / U-Net with ResNet-50 backbone running on NVIDIA Triton | REST/gRPC inference endpoint accepting calibrated Sentinel-1 GRD TIFF slices. |
| **Look-Alike Classification** | Rule-based classifier rejecting simulated algal blooms and biogenic films | Gradient Boosted Decision Tree (LightGBM) trained on clean sea SAR datasets | Feature extraction pipeline evaluating damping ratio, border contrast, and wind vectors. |
| **Metocean Wind & Wave** | Deterministic wind/current vectors based on historical IMD/INCOIS seasonal averages | INCOIS Ocean State Forecast (OSF), ECMWF ERA5, and HYCOM Global Analysis | Automated NetCDF/GRIB2 download pipeline with bilinear spatial interpolation. |
| **Lagrangian Drift Hindcast** | 2D kinematic advection particle model with Euler-Maruyama stochastic diffusion | Full OpenDrift Trajectory Engine with Stokes Drift and 3D droplet entrainment | Dockerized Python microservice executing `opendrift.models.openoil` simulation runs. |
| **AIS Maritime Feed** | Deterministic historical vessel streams with synthesized transponder gaps | Live Satellite AIS Stream (Spire Maritime / MarineTraffic / DGLL Coastal AIS Chain) | WebSocket / Kafka streaming consumer piping real-time NMEA-0183 AIVDM packets to PostGIS. |
| **Attribution Engine** | Multi-factor weighted Bayesian scoring function in Python FastAPI | Multi-Agent Forensic Reasoning Engine with probabilistic Markov decision chains | Direct swap in `attributionService.py` retaining identical JSON output contract. |
| **Forensic Dossier** | Printable HTML template with SHA-256 client hash | PDFKit / Weasyprint microservice with government PKI digital signature & QR code | `/api/v1/reports/marpol-dossier` endpoint producing cryptographically sealed PDF. |

---

## 6. REST API Contract Overview

The backend exposes the following endpoints (documented in the accompanying Postman collection):

- `GET /api/v1/health` — System status, database connectivity, simulation engine health.
- `GET /api/v1/regions` — List of pilot regions (Gulf of Kutch, Mumbai High, Chennai/Ennore).
- `GET /api/v1/incidents` — Active oil spill incidents across pilot regions.
- `GET /api/v1/incidents/{id}` — Full incident telemetry, geometry, and weathering age.
- `GET /api/v1/incidents/{id}/detections` — SAR and Optical satellite detection layers.
- `POST /api/v1/incidents/{id}/drift/hindcast` — Computes Lagrangian reverse origin tracing.
- `POST /api/v1/incidents/{id}/drift/forecast` — Computes 48-hour forward drift spread cone.
- `GET /api/v1/incidents/{id}/vessels` — AIS traffic passing within the origin spacetime window.
- `GET /api/v1/incidents/{id}/suspects` — Ranked suspect leaderboard with 5-factor breakdown.
- `POST /api/v1/incidents/{id}/alerts/dispatch` — Multi-agency alert state transitions.
- `GET /api/v1/incidents/{id}/dossier` — MARPOL Annex I forensic dossier export.
