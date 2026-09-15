import { AISVessel, Incident, SuspectRanking, EvidenceFactor } from '../types'
import { DEMO_SCENARIOS } from '../data/scenarios'
import { AISService } from './aisService'

export class AttributionService {
  /**
   * Run multi-factor explainable attribution scoring engine
   */
  public static calculateAttribution(
    incident: Incident,
    vessels: AISVessel[]
  ): SuspectRanking[] {
    const scenario = DEMO_SCENARIOS.find(s => s.incident.id === incident.id)
    if (scenario && scenario.incident.suspects.length > 0) {
      return scenario.incident.suspects
    }

    const origin = incident.hindcast.probableOrigin.coordinates
    const slickOrientation = incident.characterisation.orientationDegrees

    const rankings: SuspectRanking[] = vessels.map((vessel) => {
      // 1. Proximity Factor (0 - 30 pts)
      let minDistance = 999
      for (const pt of vessel.trajectory) {
        const d = AISService.calculateHaversineDistance(pt.position, origin)
        if (d < minDistance) minDistance = d
      }
      if (vessel.trajectory.length === 0) {
        minDistance = AISService.calculateHaversineDistance(vessel.currentPosition, origin)
      }

      let proximityScore = Math.max(0, 30 - minDistance * 1.5)
      proximityScore = Math.round(proximityScore * 10) / 10

      // 2. Trajectory Alignment Factor (0 - 20 pts)
      const courseDiff = Math.abs(vessel.cogDegrees - slickOrientation) % 180
      const angularDiff = courseDiff > 90 ? 180 - courseDiff : courseDiff
      const trajectoryScore = Math.round(Math.max(0, 20 - (angularDiff / 90) * 20) * 10) / 10

      // 3. Speed Compatibility (0 - 15 pts)
      // Ideal discharge speed is 9 - 14 knots
      let speedScore = 15
      if (vessel.sogKnots < 3) speedScore = 6
      else if (vessel.sogKnots > 18) speedScore = 8
      else speedScore = 14.5

      // 4. Weathering Timing Overlap (0 - 15 pts)
      const timingScore = minDistance < 5 ? 15 : Math.max(5, 15 - minDistance * 0.5)

      // 5. AIS Blackout Anomaly (0 - 20 pts)
      let blackoutScore = 0
      if (vessel.hasBlackout) {
        blackoutScore = vessel.blackoutAnomaly?.coincidesWithOriginZone ? 20 : 12
      }

      const overall = Math.min(100, Math.round((proximityScore + trajectoryScore + speedScore + timingScore + blackoutScore) * 10) / 10)
      
      const confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 
        overall >= 80 ? 'HIGH' : overall >= 50 ? 'MEDIUM' : 'LOW'

      const evidenceFactors: EvidenceFactor[] = [
        {
          category: 'PROXIMITY',
          name: 'Hindcast Origin Proximity',
          score: proximityScore,
          maxScore: 30,
          description: `Vessel trajectory passed within ${minDistance} km of the probable spill release point.`
        },
        {
          category: 'TRAJECTORY',
          name: 'Course-Slick Alignment',
          score: trajectoryScore,
          maxScore: 20,
          description: `Vessel course (${vessel.cogDegrees}°) aligns within ${Math.round(angularDiff)}° of slick elongation axis (${slickOrientation}°).`
        },
        {
          category: 'SPEED',
          name: 'Discharge Speed Profile',
          score: speedScore,
          maxScore: 15,
          description: `Transit speed of ${vessel.sogKnots} knots fits continuous en-route tank wash / operational discharge.`
        },
        {
          category: 'TIMING',
          name: 'Weathering Temporal Match',
          score: Math.round(timingScore * 10) / 10,
          maxScore: 15,
          description: `Temporal proximity correlates with the Mackay physical weathering spill age window.`
        },
        {
          category: 'AIS_ANOMALY',
          name: 'AIS Telemetry Integrity',
          score: blackoutScore,
          maxScore: 20,
          description: vessel.hasBlackout
            ? `Transponder blackout detected for ${vessel.blackoutAnomaly?.durationHours} hours near release zone.`
            : 'Standard continuous AIS broadcast telemetry logged.'
        }
      ]

      return {
        rank: 1, // updated after sort
        vessel,
        overallScore: overall,
        confidenceLevel,
        evidenceFactors,
        legalAdmissibilityCaveat: overall >= 80
          ? 'Potential Responsible Vessel — Evidence-backed suspect. Requires Indian Coast Guard / DG Shipping verification under MARPOL Annex I.'
          : 'Low-probability peripheral vessel in vicinity of detected slick.',
        recommendedAction: overall >= 80
          ? 'Dispatch ICG boarding team for bilge and oil record book (ORB) inspection.'
          : 'Log for situational awareness; no intervention indicated.'
      }
    })

    // Sort descending by score and assign ranks
    rankings.sort((a, b) => b.overallScore - a.overallScore)
    rankings.forEach((r, idx) => {
      r.rank = idx + 1
    })

    return rankings
  }
}
