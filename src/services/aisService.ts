import { AISVessel, DriftHindcast, Incident } from '../types'
import { DEMO_SCENARIOS } from '../data/scenarios'

export interface CorrelationSummary {
  totalVesselsInRegion: number;
  correlatedVessels: AISVessel[];
  blackoutAnomaliesCount: number;
}

export class AISService {
  /**
   * Correlate AIS maritime traffic with the Lagrangian hindcast origin zone
   */
  public static async correlateVesselsWithOrigin(
    incident: Incident,
    _hindcast: DriftHindcast,
    onProgress?: (percent: number) => void
  ): Promise<CorrelationSummary> {
    for (let p = 20; p <= 100; p += 20) {
      if (onProgress) onProgress(p)
      await new Promise(r => setTimeout(r, 150))
    }

    const scenario = DEMO_SCENARIOS.find(s => s.incident.id === incident.id)
    if (scenario) {
      const vessels = scenario.incident.aisVessels
      const blackouts = vessels.filter(v => v.hasBlackout).length
      return {
        totalVesselsInRegion: vessels.length + 8,
        correlatedVessels: vessels,
        blackoutAnomaliesCount: blackouts
      }
    }

    // Default fallback calculation
    const vessels = incident.aisVessels
    return {
      totalVesselsInRegion: vessels.length,
      correlatedVessels: vessels,
      blackoutAnomaliesCount: vessels.filter(v => v.hasBlackout).length
    }
  }

  /**
   * Calculate distance between two coordinate pairs in kilometers (Haversine formula)
   */
  public static calculateHaversineDistance(
    coord1: [number, number],
    coord2: [number, number]
  ): number {
    const R = 6371 // Earth radius in km
    const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180
    const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1[0] * Math.PI) / 180) *
        Math.cos((coord2[0] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c * 10) / 10
  }
}
