import { SlickDetection, SpillCharacterisation, MetoceanConditions, WeatheringDataPoint } from '../types'
import { DEMO_SCENARIOS } from '../data/scenarios'

export class CharacterisationService {
  /**
   * Characterise slick geometry and estimate physical weathering / spill age
   */
  public static characteriseSlick(
    detection: SlickDetection,
    metocean: MetoceanConditions
  ): SpillCharacterisation {
    // Check if predefined in demo scenarios
    const scenario = DEMO_SCENARIOS.find(s => s.incident.detection.id === detection.id)
    if (scenario) {
      return scenario.incident.characterisation
    }

    // Dynamic calculation from detection polygon
    const polygon = detection.polygon
    const n = polygon.length

    // Calculate approximate area using shoelace formula on spherical projection
    let areaKm2 = 0
    let perimeterKm = 0
    const latConversion = 111.0 // ~111 km per degree latitude
    const lonConversion = 111.0 * Math.cos((detection.centroid[0] * Math.PI) / 180)

    for (let i = 0; i < n - 1; i++) {
      const p1 = polygon[i]
      const p2 = polygon[i + 1]

      const x1 = p1[1] * lonConversion
      const y1 = p1[0] * latConversion
      const x2 = p2[1] * lonConversion
      const y2 = p2[0] * latConversion

      areaKm2 += (x1 * y2 - x2 * y1)
      perimeterKm += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    }
    areaKm2 = Math.abs(areaKm2) / 2
    if (areaKm2 < 1.0) areaKm2 = 12.5 // fallback minimum sensible size

    // Elongation ratio based on wind speed alignment
    const elongationRatio = Math.max(1.8, Math.min(5.2, 1.5 + (metocean.windSpeedKnots / 6)))
    const majorAxisKm = Math.sqrt(areaKm2 * elongationRatio)
    const minorAxisKm = areaKm2 / majorAxisKm

    // Mackay Evaporation & Ageing Model:
    // Evaporation fraction F_evap = (T_boil / 1158) * ln(1 + B * theta * t)
    // Approximate spill age from damping ratio and metocean wind speed
    const spillAgeHours = Math.round((10 + (detection.sarDampingRatioDb - 8.5) * 3.5) * 10) / 10
    const now = new Date(detection.timestamp).getTime()
    const releaseStart = new Date(now - (spillAgeHours + 1.5) * 3600 * 1000).toISOString()
    const releaseEnd = new Date(now - (spillAgeHours - 1.5) * 3600 * 1000).toISOString()

    // Generate Mackay weathering curve
    const weatheringCurve: WeatheringDataPoint[] = []
    const hours = [0, 3, 6, 9, 12, 18, 24]
    for (const h of hours) {
      const evap = Math.min(38.0, 10 * Math.log10(h + 1) * (metocean.seaTemperatureCelsius / 25))
      const visc = 45 * Math.exp(0.08 * h)
      const emuls = Math.min(65.0, 18 * Math.log10(h + 1))
      weatheringCurve.push({
        hour: h,
        evaporationPercent: Math.round(evap * 10) / 10,
        viscosityCst: Math.round(visc),
        emulsificationPercent: Math.round(emuls * 10) / 10,
        remainingMassPercent: Math.round((100 - evap) * 10) / 10
      })
    }

    return {
      id: `CHAR-${detection.id}`,
      incidentId: detection.incidentId,
      surfaceAreaKm2: Math.round(areaKm2 * 10) / 10,
      perimeterKm: Math.round(perimeterKm * 10) / 10,
      elongationRatio: Math.round(elongationRatio * 100) / 100,
      majorAxisKm: Math.round(majorAxisKm * 10) / 10,
      minorAxisKm: Math.round(minorAxisKm * 10) / 10,
      orientationDegrees: Math.round((metocean.windDirectionDegrees + 180) % 360),
      estimatedVolumeM3: Math.round(areaKm2 * 35),
      spillAgeHours,
      releaseWindowStart: releaseStart,
      releaseWindowEnd: releaseEnd,
      weatheringPhysics: {
        oilType: 'Medium-Heavy Crude (API 29.5)',
        apiGravity: 29.5,
        initialViscosityCst: 45.0,
        currentViscosityCst: Math.round(45 * Math.exp(0.08 * spillAgeHours)),
        evaporationPercent: Math.round(Math.min(35, 10 * Math.log10(spillAgeHours + 1)) * 10) / 10,
        emulsificationPercent: Math.round(Math.min(55, 15 * Math.log10(spillAgeHours + 1)) * 10) / 10,
        remainingMassPercent: 74.5,
        weatheringCurve
      }
    }
  }
}
