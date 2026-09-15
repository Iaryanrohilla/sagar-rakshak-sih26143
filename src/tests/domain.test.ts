import { describe, it, expect } from 'vitest'
import { CharacterisationService } from '../services/characterisationService'
import { DriftService } from '../services/driftService'
import { AISService } from '../services/aisService'
import { AttributionService } from '../services/attributionService'
import { AlertService } from '../services/alertService'
import { DEMO_SCENARIOS } from '../data/scenarios'
import { SlickDetection, MetoceanConditions, AISVessel, Incident } from '../types'

describe('SAGAR RAKSHAK Core Domain Engine Tests', () => {
  const defaultScenario = DEMO_SCENARIOS[0]
  const incident = defaultScenario.incident

  it('calculates slick characterisation and physical Mackay weathering', () => {
    const char = CharacterisationService.characteriseSlick(
      incident.detection,
      incident.metocean
    )

    expect(char.surfaceAreaKm2).toBeGreaterThan(0)
    expect(char.elongationRatio).toBeGreaterThan(1.0)
    expect(char.spillAgeHours).toBeGreaterThan(0)
    expect(char.weatheringPhysics.evaporationPercent).toBeGreaterThan(0)
    expect(char.weatheringPhysics.weatheringCurve.length).toBeGreaterThan(0)
  })

  it('runs Lagrangian drift backward hindcast and localizes origin', async () => {
    const hindcast = await DriftService.runBackwardHindcast(
      incident.detection,
      incident.characterisation,
      incident.metocean
    )

    expect(hindcast.probableOrigin.coordinates[0]).toBeCloseTo(19.284, 1)
    expect(hindcast.probableOrigin.coordinates[1]).toBeCloseTo(71.215, 1)
    expect(hindcast.probableOrigin.searchRadiusKm).toBeGreaterThan(0)
    expect(hindcast.probableOrigin.confidencePercent).toBeGreaterThan(80)
  })

  it('calculates accurate Haversine spatial distances', () => {
    // Mumbai [18.922, 72.834] to JNPT [18.948, 72.952] ~12.7 km
    const dist = AISService.calculateHaversineDistance(
      [18.922, 72.834],
      [18.948, 72.952]
    )
    expect(dist).toBeGreaterThan(10)
    expect(dist).toBeLessThan(15)
  })

  it('ranks vessels with explainable multi-factor attribution scoring', () => {
    const rankings = AttributionService.calculateAttribution(incident, incident.aisVessels)

    expect(rankings.length).toBeGreaterThan(0)
    expect(rankings[0].rank).toBe(1)
    expect(rankings[0].overallScore).toBeGreaterThan(85)
    expect(rankings[0].confidenceLevel).toBe('HIGH')
    expect(rankings[0].evidenceFactors.length).toBe(5)
    expect(rankings[0].legalAdmissibilityCaveat).toContain('Potential Responsible Vessel')
  })

  it('transitions alert lifecycle states and records audit history', () => {
    const alert = AlertService.createAlert(
      incident.id,
      'Test Alert',
      'HIGH',
      'NEW_SPILL',
      'COAST_GUARD',
      'Test description'
    )

    expect(alert.status).toBe('NEW')
    expect(alert.history.length).toBe(1)

    const acknowledged = AlertService.updateAlertStatus(
      alert,
      'ACKNOWLEDGED',
      'Duty Officer Sharma (ICG)',
      'Verified satellite signature'
    )

    expect(acknowledged.status).toBe('ACKNOWLEDGED')
    expect(acknowledged.history.length).toBe(2)
    expect(acknowledged.history[1].updatedBy).toBe('Duty Officer Sharma (ICG)')
  })

  it('verifies look-alike rejection in scenario 5', () => {
    const lookAlikeScenario = DEMO_SCENARIOS.find(s => s.id === 'lookalike-algal-bloom')
    expect(lookAlikeScenario).toBeDefined()
    if (lookAlikeScenario) {
      expect(lookAlikeScenario.incident.detection.isConfirmedSlick).toBe(false)
      expect(lookAlikeScenario.incident.detection.classification).toBe('ALGAL_BLOOM')
      expect(lookAlikeScenario.incident.detection.sarDampingRatioDb).toBeLessThan(8.5)
    }
  })
})
