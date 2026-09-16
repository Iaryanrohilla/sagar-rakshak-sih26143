import { describe, it, expect } from 'vitest'
import { DEMO_SCENARIOS } from '../data/scenarios'
import { PILOT_REGIONS } from '../data/regions'
import { ReportService } from '../services/reportService'
import { DriftService } from '../services/driftService'
import { AttributionService } from '../services/attributionService'

describe('SAGAR RAKSHAK Maritime Intelligence Platform Tests', () => {
  it('validates all 5 tactical demo scenarios with complete telemetry', () => {
    expect(DEMO_SCENARIOS.length).toBe(5)

    DEMO_SCENARIOS.forEach((scenario) => {
      expect(scenario.id).toBeDefined()
      expect(scenario.title).toBeDefined()
      expect(scenario.regionId).toBeDefined()
      expect(PILOT_REGIONS[scenario.regionId]).toBeDefined()

      const inc = scenario.incident
      expect(inc.scene.sensor).toBeDefined()
      expect(inc.detection.centroid.length).toBe(2)
      expect(inc.detection.polygon.length).toBeGreaterThan(2)
      expect(inc.characterisation.surfaceAreaKm2).toBeGreaterThan(0)
      expect(inc.characterisation.estimatedVolumeM3).toBeGreaterThanOrEqual(0)
      expect(inc.hindcast.probableOrigin.coordinates.length).toBe(2)
      expect(Array.isArray(inc.forecast.forecastSpreadPolygon)).toBe(true)
      expect(Array.isArray(inc.aisVessels)).toBe(true)
    })

    // Validate primary demo scenario (Mumbai High) has full precomputed results
    const primary = DEMO_SCENARIOS[0].incident
    expect(primary.forecast.forecastSpreadPolygon.length).toBeGreaterThan(2)
    expect(primary.suspects.length).toBeGreaterThanOrEqual(1)
    expect(primary.suspects[0].overallScore).toBeGreaterThanOrEqual(70)
  })

  it('verifies forensic MARPOL evidence dossier generation for primary suspects', () => {
    // Generate for primary scenario
    const dossier = ReportService.generateEvidenceDossier(DEMO_SCENARIOS[0].incident)
    expect(dossier.reportId).toMatch(/^(DOSSIER|SR-EVD)-/)
    expect(dossier.primarySuspect).toBeDefined()
    expect(dossier.primarySuspect.rank).toBe(1)
    expect(dossier.primarySuspect.overallScore).toBeGreaterThanOrEqual(70)
    expect(dossier.primarySuspect.vessel.name).toBeDefined()
    expect(dossier.legalClassification).toContain('MARPOL')
    expect(dossier.chainOfCustody.length).toBeGreaterThanOrEqual(1)
  })

  it('validates forward forecast 48h temporal extrapolation', async () => {
    const defaultScenario = DEMO_SCENARIOS[0]
    const forecast = await DriftService.runForwardForecast(
      defaultScenario.incident.detection,
      defaultScenario.incident.metocean
    )

    expect(forecast.forecastHorizonHours).toBe(48)
    expect(forecast.forecastSpreadPolygon.length).toBeGreaterThan(3)
    expect(forecast.landfallRisk).toBeDefined()
    expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(forecast.landfallRisk.riskLevel)
  })

  it('calculates 5-factor forensic attribution with transponder blackout penalty', () => {
    const kutchScenario = DEMO_SCENARIOS[1] // Gulf of Kutch has dark vessel blackout
    const suspects = AttributionService.calculateAttribution(kutchScenario.incident, kutchScenario.incident.aisVessels)
    
    expect(suspects.length).toBeGreaterThan(0)
    const topSuspect = suspects[0]
    expect(topSuspect.rank).toBe(1)
    expect(topSuspect.evidenceFactors.length).toBe(5)

    // Check blackout factor
    const blackoutFactor = topSuspect.evidenceFactors.find(f => f.name.includes('AIS Transmission Regularity') || f.name.includes('Blackout'))
    expect(blackoutFactor).toBeDefined()
  })

  it('verifies zero occurrences of forbidden team identifiers (ST1-ST6) across scenarios', () => {
    const jsonString = JSON.stringify(DEMO_SCENARIOS)
    const forbiddenIdentifiers = ['ST1', 'ST2', 'ST3', 'ST4', 'ST5', 'ST6']
    forbiddenIdentifiers.forEach((id) => {
      // Must not appear as standalone token or module label
      const regex = new RegExp(`\\b${id}\\b`, 'g')
      expect(jsonString).not.toMatch(regex)
    })
  })
})
