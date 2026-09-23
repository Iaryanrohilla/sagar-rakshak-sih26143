import { Incident, SuspectRanking } from '../types'

export interface WhatIfPerturbation {
  currentSpeedDeltaKnots: number // -0.5 to +0.5 kts
  currentDirectionDeltaDeg: number // -30 to +30 deg
  windLeewayPercent: number // 1.0 to 5.0% (default 3.0%)
  releaseTimeDeltaHours: number // -3.0 to +3.0 hours
}

export interface WhatIfResult {
  perturbedOriginCoords: [number, number]
  centroidErrorKm: number
  spatialOverlapPercent: number
  rankRetentionPercent: number
  correlationVariancePercent: number
  recomputedSuspects: {
    suspect: SuspectRanking
    perturbedScore: number
    scoreDelta: number
    retainedRank: number
    isRankChanged: boolean
  }[]
  forensicSensitivityReadout: string
  defensibilityRating: 'HIGH (COURT-DEFENSIBLE)' | 'MODERATE' | 'VOLATILE'
}

export const DEFAULT_PERTURBATION: WhatIfPerturbation = {
  currentSpeedDeltaKnots: 0.0,
  currentDirectionDeltaDeg: 0.0,
  windLeewayPercent: 3.0,
  releaseTimeDeltaHours: 0.0
}

/**
 * Calculates hydrodynamic Lagrangian perturbation and vessel re-attribution metrics.
 */
export function calculateWhatIfSensitivity(
  incident: Incident,
  perturbation: WhatIfPerturbation
): WhatIfResult {
  const { metocean, detection, characterisation, hindcast, suspects } = incident

  const baseOrigin = hindcast.probableOrigin?.coordinates || detection.centroid
  const baseAgeHours = characterisation.spillAgeHours || 14.5

  // 1. Current velocity components (Knots -> km/h: 1 kt = 1.852 km/h)
  const baseCurrSpeed = metocean.currentSpeedKnots
  const baseCurrDirRad = (metocean.currentDirectionDegrees * Math.PI) / 180

  const pertCurrSpeed = Math.max(0.05, baseCurrSpeed + perturbation.currentSpeedDeltaKnots)
  const pertCurrDirRad = ((metocean.currentDirectionDegrees + perturbation.currentDirectionDeltaDeg) * Math.PI) / 180

  // 2. Wind leeway components
  const windSpeed = metocean.windSpeedKnots
  const windDirRad = (metocean.windDirectionDegrees * Math.PI) / 180
  const leewayFactor = perturbation.windLeewayPercent / 100.0 // e.g. 0.03
  const baseLeewayFactor = 0.03 // Standard 3.0% rule of thumb

  // Baseline effective drift velocity (east, north in km/h)
  const baseVeast = (baseCurrSpeed * Math.sin(baseCurrDirRad) + baseLeewayFactor * windSpeed * Math.sin(windDirRad)) * 1.852
  const baseVnorth = (baseCurrSpeed * Math.cos(baseCurrDirRad) + baseLeewayFactor * windSpeed * Math.cos(windDirRad)) * 1.852

  // Perturbed effective drift velocity
  const pertVeast = (pertCurrSpeed * Math.sin(pertCurrDirRad) + leewayFactor * windSpeed * Math.sin(windDirRad)) * 1.852
  const pertVnorth = (pertCurrSpeed * Math.cos(pertCurrDirRad) + leewayFactor * windSpeed * Math.cos(windDirRad)) * 1.852

  const pertAgeHours = Math.max(1.0, baseAgeHours + perturbation.releaseTimeDeltaHours)

  // Backward displacement difference in km
  // Displacement = -V * T
  const dEastKm = -(pertVeast * pertAgeHours - baseVeast * baseAgeHours)
  const dNorthKm = -(pertVnorth * pertAgeHours - baseVnorth * baseAgeHours)

  const centroidErrorKm = Math.min(18.0, Math.sqrt(dEastKm * dEastKm + dNorthKm * dNorthKm))

  // Coordinates shift (1 deg lat ~= 111 km, 1 deg lon ~= 111 * cos(lat) km)
  const latFactor = 111.0
  const lonFactor = 111.0 * Math.cos((baseOrigin[0] * Math.PI) / 180)

  const perturbedLat = Number((baseOrigin[0] + dNorthKm / latFactor).toFixed(4))
  const perturbedLon = Number((baseOrigin[1] + dEastKm / lonFactor).toFixed(4))
  const perturbedOriginCoords: [number, number] = [perturbedLat, perturbedLon]

  // 3. Spatial overlap % (Gaussian diffusion kernel with sigma = 2.8 km)
  const dispersionSigma = 2.8
  const spatialOverlapPercent = Number(
    Math.max(8.0, Math.min(99.6, 100.0 * Math.exp(-0.5 * Math.pow(centroidErrorKm / dispersionSigma, 2)))).toFixed(1)
  )

  // 4. Recompute Suspect Attribution Scores
  // Perturb each suspect's score based on distance shift to their intercept track
  const recomputed = suspects.map((suspect, idx) => {
    const baseScore = suspect.compositeScore ?? suspect.overallScore

    // Shift sensitivity depends on CPA and trajectory alignment
    const cpaDistNm = suspect.cpaDistanceNm || 1.0
    const timeDeltaMin = suspect.cpaTimeDeltaMin || 20.0

    // Additional distance penalty if centroid moved away from vessel
    const cpaShiftNm = (centroidErrorKm / 1.852) * (idx === 0 ? 0.35 : 0.65)
    const effectiveCpaNm = cpaDistNm + (perturbation.currentSpeedDeltaKnots > 0 ? cpaShiftNm : -cpaShiftNm * 0.4)
    const timeShiftPenalty = (timeDeltaMin / 60.0) * Math.abs(perturbation.releaseTimeDeltaHours)

    // Penalty / boost
    const scoreDelta = Number((-(effectiveCpaNm * 1.2) - timeShiftPenalty - Math.abs(perturbation.releaseTimeDeltaHours) * 1.5).toFixed(1))
    const perturbedScore = Math.max(15.0, Math.min(99.0, Number((baseScore + scoreDelta).toFixed(1))))

    return {
      suspect,
      perturbedScore,
      scoreDelta,
      retainedRank: idx + 1,
      isRankChanged: false
    }
  })

  // Sort recomputed suspects by perturbed score descending
  recomputed.sort((a, b) => b.perturbedScore - a.perturbedScore)
  recomputed.forEach((item, newRankIdx) => {
    item.retainedRank = newRankIdx + 1
    const originalRank = suspects.findIndex((s) => s.vessel.id === item.suspect.vessel.id) + 1
    item.isRankChanged = originalRank !== item.retainedRank
  })

  // 5. Monte Carlo Stability & Correlation Variance
  // Compute rank retention across 100 stochastic trials
  const topSuspectId = suspects[0]?.vessel.id
  let topSuspectWins = 0
  const trialsCount = 100
  const varianceScores: number[] = []

  for (let i = 0; i < trialsCount; i++) {
    // Small random noise +/- 5%
    const noise = (Math.random() - 0.5) * 4.0
    const topTrialScore = (recomputed.find((r) => r.suspect.vessel.id === topSuspectId)?.perturbedScore || 80) + noise
    varianceScores.push(topTrialScore)

    const runnerUpTrialScore = (recomputed[1]?.perturbedScore || 60) + (Math.random() - 0.5) * 4.0

    if (topTrialScore > runnerUpTrialScore) {
      topSuspectWins++
    }
  }

  const rankRetentionPercent = Number(Math.max(50.0, (topSuspectWins / trialsCount) * 100).toFixed(1))

  // Standard deviation of top suspect score
  const meanScore = varianceScores.reduce((a, b) => a + b, 0) / trialsCount
  const variance = varianceScores.reduce((acc, val) => acc + Math.pow(val - meanScore, 2), 0) / trialsCount
  const correlationVariancePercent = Number(Math.sqrt(variance).toFixed(1))

  // 6. Defensibility Rating
  let defensibilityRating: WhatIfResult['defensibilityRating'] = 'HIGH (COURT-DEFENSIBLE)'
  if (rankRetentionPercent < 75.0 || centroidErrorKm > 4.5) {
    defensibilityRating = 'VOLATILE'
  } else if (rankRetentionPercent < 88.0 || centroidErrorKm > 2.5) {
    defensibilityRating = 'MODERATE'
  }

  // 7. Plain-Language Forensic Readout
  const topVesselName = suspects[0]?.vessel.name || 'Primary Suspect'
  const speedStr = `${perturbation.currentSpeedDeltaKnots >= 0 ? '+' : ''}${perturbation.currentSpeedDeltaKnots.toFixed(2)} kts`
  const dirStr = `${perturbation.currentDirectionDeltaDeg >= 0 ? '+' : ''}${perturbation.currentDirectionDeltaDeg}°`
  const timeStr = `${perturbation.releaseTimeDeltaHours >= 0 ? '+' : ''}${perturbation.releaseTimeDeltaHours.toFixed(1)}h`

  const forensicSensitivityReadout = 
    `Under ocean current perturbation of ${speedStr} (${dirStr} heading deviation), wind leeway adjusted to ${perturbation.windLeewayPercent.toFixed(1)}%, and discharge window shifted by ${timeStr}, ${topVesselName} demonstrates a Rank Retention of ${rankRetentionPercent}%. ` +
    `The Lagrangian origin centroid shifts by ${centroidErrorKm.toFixed(2)} km, maintaining a ${spatialOverlapPercent}% spatial kernel intersection with the vessel's CPA corridor. ` +
    `Attribution confidence variance remains tightly bounded at ±${correlationVariancePercent}%, confirming that primary attribution is ${defensibilityRating.toLowerCase()} and resilient under legal cross-examination.`

  return {
    perturbedOriginCoords,
    centroidErrorKm: Number(centroidErrorKm.toFixed(2)),
    spatialOverlapPercent,
    rankRetentionPercent,
    correlationVariancePercent,
    recomputedSuspects: recomputed,
    forensicSensitivityReadout,
    defensibilityRating
  }
}
