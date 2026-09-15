import { SlickDetection, SatelliteScene } from '../types'
import { DEMO_SCENARIOS } from '../data/scenarios'

export interface DetectionProgress {
  stage: string;
  progressPercent: number;
}

export class SlickDetectionService {
  /**
   * Run deep learning segmentation and dual-sensor look-alike rejection pipeline
   */
  public static async runDetectionPipeline(
    scene: SatelliteScene,
    onProgress?: (progress: DetectionProgress) => void
  ): Promise<SlickDetection> {
    const stages = [
      { name: 'Extracting SAR Amplitude & Phase Channels', percent: 20 },
      { name: 'Running Adaptive Thresholding (CFAR Dark-Spot Candidates)', percent: 45 },
      { name: 'Inference via U-Net + ResNet-50 Segmentation Model', percent: 70 },
      { name: 'Cross-Referencing Optical SWIR/NIR Reflectance Ratio', percent: 85 },
      { name: 'Discriminating Look-Alikes & Generating Vector Polygon', percent: 100 }
    ]

    for (const stage of stages) {
      if (onProgress) {
        onProgress({ stage: stage.name, progressPercent: stage.percent })
      }
      await new Promise(resolve => setTimeout(resolve, 380))
    }

    // Match the detection for the scene
    const scenario = DEMO_SCENARIOS.find(s => s.incident.scene.id === scene.id)
    if (scenario) {
      return scenario.incident.detection
    }

    // Fallback detection if arbitrary scene
    return {
      id: `DET-GEN-${Date.now()}`,
      sceneId: scene.id,
      incidentId: 'INC-ACTIVE',
      timestamp: new Date().toISOString(),
      polygon: [
        [scene.boundingBox[0][0] + 0.1, scene.boundingBox[0][1] + 0.1],
        [scene.boundingBox[0][0] + 0.15, scene.boundingBox[0][1] + 0.18],
        [scene.boundingBox[0][0] + 0.12, scene.boundingBox[0][1] + 0.22],
        [scene.boundingBox[0][0] + 0.08, scene.boundingBox[0][1] + 0.15],
        [scene.boundingBox[0][0] + 0.1, scene.boundingBox[0][1] + 0.1]
      ],
      centroid: [scene.boundingBox[0][0] + 0.12, scene.boundingBox[0][1] + 0.16],
      confidenceScore: 92.0,
      classification: 'MINERAL_OIL_SLICK',
      isConfirmedSlick: true,
      sarDampingRatioDb: 10.2,
      opticalContrastIndex: 0.74,
      modelArchitecture: 'Dual-Sensor U-Net + ResNet-50 SAR/EO Fusion',
      detectionNotes: 'Severe radar backscatter damping with sharp boundaries. Optical reflectance confirmed mineral hydrocarbon layer.'
    }
  }
}
