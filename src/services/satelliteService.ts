import { SatelliteScene, PilotRegionId } from '../types'
import { DEMO_SCENARIOS } from '../data/scenarios'

export interface PreprocessingProgress {
  stepName: string;
  stepIndex: number;
  totalSteps: number;
  percent: number;
}

export class SatelliteService {
  /**
   * Get available satellite scenes for a selected pilot region
   */
  public static getScenesForRegion(regionId: PilotRegionId): SatelliteScene[] {
    const scenes: SatelliteScene[] = []
    for (const scenario of DEMO_SCENARIOS) {
      if (scenario.regionId === regionId) {
        scenes.push(scenario.incident.scene)
      }
    }
    // Also include other complementary scenes if needed
    return scenes
  }

  /**
   * Simulate realistic step-by-step satellite image preprocessing
   * (Radiometric calibration, thermal noise removal, speckle filtering, terrain correction)
   */
  public static async preprocessScene(
    scene: SatelliteScene,
    onProgress?: (progress: PreprocessingProgress) => void
  ): Promise<SatelliteScene> {
    const steps = [
      'Applying Orbit Ephemeris Correction (Precise Orbit Files)',
      'Removing Thermal Noise Vectors & Border Radiometric Masking',
      'Radiometric Calibration (Computing Sigma0 Backscatter dB)',
      'Refined Lee Speckle Filtering (7x7 Window)',
      'Range-Doppler Terrain Correction (SRTM 1-ArcSecond)'
    ]

    for (let i = 0; i < steps.length; i++) {
      if (onProgress) {
        onProgress({
          stepName: steps[i],
          stepIndex: i + 1,
          totalSteps: steps.length,
          percent: Math.round(((i + 1) / steps.length) * 100)
        })
      }
      // Small realistic processing pause
      await new Promise(resolve => setTimeout(resolve, 350))
    }

    return {
      ...scene,
      calibrated: true,
      speckleFiltered: true,
      terrainCorrected: true,
      processingState: 'READY_FOR_DETECTION'
    }
  }
}
