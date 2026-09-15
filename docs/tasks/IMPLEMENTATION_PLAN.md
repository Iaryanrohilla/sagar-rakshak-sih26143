# Technical Implementation Plan & Architecture — SAGAR RAKSHAK

## System Architecture

```
                                      [ Satellite Feeds ]
                                 (Sentinel-1 SAR / Sentinel-2 EO)
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │ satelliteService      │
                                    │ (Ingestion & Preproc) │
                                    └───────────┬───────────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │ slickDetectionService │
                                    │ (U-Net / Look-alike)  │
                                    └───────────┬───────────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │characterisationService│
                                    │ (Geometry & Ageing)   │
                                    └───────────┬───────────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │     driftService      │
                                    │ (Hindcast & Forecast) │
                                    └───────────┬───────────┘
                                                │
                         ┌──────────────────────┴──────────────────────┐
                         ▼                                             ▼
             ┌───────────────────────┐                     ┌───────────────────────┐
             │      aisService       │                     │      alertService     │
             │ (Traffic Stream & Gap)│                     │   (Lifecycle State)   │
             └───────────┬───────────┘                     └───────────┬───────────┘
                         │                                             │
                         ▼                                             │
             ┌───────────────────────┐                                 │
             │  attributionService   │                                 │
             │ (Explainable Ranking) │                                 │
             └───────────┬───────────┘                                 │
                         │                                             │
                         ▼                                             ▼
                 ┌─────────────────────────────────────────────────────────────┐
                 │                       reportService                         │
                 │                     (Evidence Dossier)                      │
                 └──────────────────────────────┬──────────────────────────────┘
                                                │
                                                ▼
                 ┌─────────────────────────────────────────────────────────────┐
                 │                     UI Control Room                         │
                 │        Map Canvas + KPIs + Timeline + Roles + Demo          │
                 └─────────────────────────────────────────────────────────────┘
```

## Service Contracts & Interfaces

1. `satelliteService`:
   - `getAvailableScenes(regionId: string): Promise<SatelliteScene[]>`
   - `preprocessScene(sceneId: string, onProgress?: (step: string, percent: number) => void): Promise<PreprocessedScene>`

2. `slickDetectionService`:
   - `detectSlicks(sceneId: string): Promise<SlickDetectionResult>`
   - Distinguishes Mineral Oil Slick vs Look-alike (Algal bloom, Biogenic film, Wind shadow)

3. `characterisationService`:
   - `characteriseSlick(polygon: GeoJSONPolygon): SlickCharacterisation`
   - `estimateAgeMackay(characterisation: SlickCharacterisation, metocean: MetoceanConditions): SpillAgeEstimate`

4. `driftService`:
   - `runBackwardHindcast(centroid: Coordinates, releaseWindowHours: number, metocean: MetoceanConditions): DriftHindcast`
   - `runForwardForecast(currentPolygon: GeoJSONPolygon, forecastHours: number, metocean: MetoceanConditions): DriftForecast`

5. `aisService`:
   - `correlateVessels(originZone: OriginZone, timeWindow: TimeWindow): AISCorrelationResult`
   - Detects transponder blackout gaps and dark ship indicators

6. `attributionService`:
   - `calculateAttribution(incident: Incident, vessels: AISVessel[], originZone: OriginZone): RankedSuspectResult`
   - Provides explainable score breakdown: Proximity, Trajectory, Speed, Timing, Drift overlap, AIS blackout

7. `alertService`:
   - `createAlert(incidentId: string, severity: AlertSeverity, type: AlertType): Alert`
   - `transitionState(alertId: string, newState: AlertStatus, note?: string): Alert`

8. `reportService`:
   - `generateEvidenceReport(incident: Incident): EvidenceReport`
   - Exports printable HTML and formatted JSON
