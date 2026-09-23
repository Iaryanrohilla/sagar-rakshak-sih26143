import { describe, it, expect } from 'vitest'
import { calculateWhatIfSensitivity, DEFAULT_PERTURBATION } from '../services/whatIfService'
import { DEMO_SCENARIOS } from '../data/scenarios'

describe('What-If Sensitivity Simulation Engine Tests', () => {
  const scenario = DEMO_SCENARIOS[0]
  const incident = scenario.incident

  it('calculates baseline sensitivity with zero perturbation cleanly', () => {
    const result = calculateWhatIfSensitivity(incident, DEFAULT_PERTURBATION)

    expect(result).toBeDefined()
    expect(result.centroidErrorKm).toBeCloseTo(0.0, 1)
    expect(result.spatialOverlapPercent).toBeGreaterThan(95.0)
    expect(result.rankRetentionPercent).toBeGreaterThan(80.0)
    expect(result.defensibilityRating).toBe('HIGH (COURT-DEFENSIBLE)')
    expect(result.forensicSensitivityReadout).toContain('Rank Retention')
    expect(result.recomputedSuspects.length).toBe(incident.suspects.length)
  })

  it('shifts origin and reduces spatial overlap under high current perturbation', () => {
    const highPerturbation = {
      currentSpeedDeltaKnots: 0.45,
      currentDirectionDeltaDeg: 25.0,
      windLeewayPercent: 4.5,
      releaseTimeDeltaHours: 2.0
    }

    const result = calculateWhatIfSensitivity(incident, highPerturbation)

    expect(result.centroidErrorKm).toBeGreaterThan(1.0)
    expect(result.spatialOverlapPercent).toBeLessThan(95.0)
    expect(result.perturbedOriginCoords[0]).not.toEqual(incident.detection.centroid[0])
    expect(result.forensicSensitivityReadout).toBeDefined()
  })

  it('maintains primary suspect rank retention above threshold under moderate shifts', () => {
    const moderatePerturbation = {
      currentSpeedDeltaKnots: 0.1,
      currentDirectionDeltaDeg: 5.0,
      windLeewayPercent: 3.2,
      releaseTimeDeltaHours: 0.5
    }

    const result = calculateWhatIfSensitivity(incident, moderatePerturbation)

    expect(result.rankRetentionPercent).toBeGreaterThanOrEqual(75.0)
    expect(result.recomputedSuspects[0].suspect.vessel.name).toBe(incident.suspects[0].vessel.name)
  })
})
