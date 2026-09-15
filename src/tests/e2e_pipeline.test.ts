import { describe, it, expect } from 'vitest'
import { DEMO_SCENARIOS } from '../data/scenarios'
import { SatelliteService } from '../services/satelliteService'
import { SlickDetectionService } from '../services/slickDetectionService'
import { CharacterisationService } from '../services/characterisationService'
import { DriftService } from '../services/driftService'
import { AISService } from '../services/aisService'
import { AttributionService } from '../services/attributionService'
import { ReportService } from '../services/reportService'

describe('SAGAR RAKSHAK End-to-End Pipeline & Scenario Tests', () => {
  it('loads all 5 deterministic demo scenarios with complete data integrity', () => {
    expect(DEMO_SCENARIOS.length).toBe(5)

    const expectedScenarios = [
      'mumbai-high-crude',
      'kutch-spm-sensitive',
      'chennai-multi-vessel',
      'dark-ship-blackout',
      'lookalike-algal-bloom'
    ]

    for (const expectedId of expectedScenarios) {
      const sc = DEMO_SCENARIOS.find((s) => s.id === expectedId)
      expect(sc).toBeDefined()
      if (sc) {
        expect(sc.incident.id).toBeTruthy()
        expect(sc.incident.scene.id).toBeTruthy()
        expect(sc.incident.detection.centroid.length).toBe(2)
        expect(sc.incident.characterisation.surfaceAreaKm2).toBeGreaterThan(0)
      }
    }
  })

  it('executes full 7-step pipeline on Mumbai High scenario without error', async () => {
    const sc = DEMO_SCENARIOS[0]
    const incident = sc.incident

    // Step 1: Ingestion Preprocessing
    const preprocessed = await SatelliteService.preprocessScene(incident.scene)
    expect(preprocessed.calibrated).toBe(true)
    expect(preprocessed.speckleFiltered).toBe(true)

    // Step 2: Slick Detection
    const detection = await SlickDetectionService.runDetectionPipeline(preprocessed)
    expect(detection.isConfirmedSlick).toBe(true)
    expect(detection.confidenceScore).toBeGreaterThan(90)
    expect(detection.sarDampingRatioDb).toBeGreaterThan(8.5)

    // Step 3: Characterisation & Mackay Ageing
    const characterisation = CharacterisationService.characteriseSlick(detection, incident.metocean)
    expect(characterisation.spillAgeHours).toBeGreaterThan(10)
    expect(characterisation.weatheringPhysics.evaporationPercent).toBeGreaterThan(20)

    // Step 4: Backward Hindcast
    const hindcast = await DriftService.runBackwardHindcast(detection, characterisation, incident.metocean)
    expect(hindcast.probableOrigin.confidencePercent).toBeGreaterThan(85)
    expect(hindcast.probableOrigin.coordinates[0]).toBeCloseTo(19.284, 1)

    // Step 5: Forward Forecast
    const forecast = await DriftService.runForwardForecast(detection, incident.metocean)
    expect(forecast.forecastHorizonHours).toBe(48)

    // Step 6: AIS Correlation
    const corr = await AISService.correlateVesselsWithOrigin(incident, hindcast)
    expect(corr.correlatedVessels.length).toBeGreaterThan(0)
    expect(corr.blackoutAnomaliesCount).toBe(1)

    // Step 7: Attribution Ranking
    const suspects = AttributionService.calculateAttribution(incident, corr.correlatedVessels)
    expect(suspects[0].rank).toBe(1)
    expect(suspects[0].vessel.name).toBe('MT OCEANUS PRIDE')
    expect(suspects[0].overallScore).toBeGreaterThan(90)
    expect(suspects[0].evidenceFactors.length).toBe(5)

    // Step 8: Formal Evidence Report Dossier
    const report = ReportService.generateEvidenceDossier({
      ...incident,
      scene: preprocessed,
      detection,
      characterisation,
      hindcast,
      forecast,
      aisVessels: corr.correlatedVessels,
      suspects
    })

    expect(report.reportId).toBeTruthy()
    expect(report.primarySuspect.vessel.name).toBe('MT OCEANUS PRIDE')
    expect(report.chainOfCustody.length).toBeGreaterThanOrEqual(4)
  }, 15000)

  it('correctly handles AIS blackout anomaly in dark ship scenario', () => {
    const darkScenario = DEMO_SCENARIOS.find((s) => s.id === 'dark-ship-blackout')
    expect(darkScenario).toBeDefined()
    if (darkScenario) {
      const suspect = darkScenario.incident.suspects[0]
      expect(suspect.vessel.hasBlackout).toBe(true)
      expect(suspect.vessel.blackoutAnomaly?.durationHours).toBeGreaterThan(3)
      expect(suspect.overallScore).toBeGreaterThan(95)
      expect(suspect.evidenceFactors.some((f) => f.category === 'AIS_ANOMALY')).toBe(true)
    }
  })

  it('correctly triggers landfall alert in Gulf of Kutch coral reef scenario', () => {
    const kutchScenario = DEMO_SCENARIOS.find((s) => s.id === 'kutch-spm-sensitive')
    expect(kutchScenario).toBeDefined()
    if (kutchScenario) {
      expect(kutchScenario.incident.forecast.landfallRisk.threatensCoast).toBe(true)
      expect(kutchScenario.incident.forecast.landfallRisk.riskLevel).toBe('CRITICAL')
      expect(kutchScenario.incident.forecast.landfallRisk.vulnerableZone).toContain('Coral Reef')
    }
  })
})
