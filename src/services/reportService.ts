import { Incident, EvidenceReport, PilotRegion } from '../types'
import { PILOT_REGIONS } from '../data/regions'

export class ReportService {
  /**
   * Compile a full forensic evidence dossier for legal and regulatory enforcement
   */
  public static generateEvidenceDossier(incident: Incident): EvidenceReport {
    const region: PilotRegion = PILOT_REGIONS[incident.regionId] || {
      id: incident.regionId,
      name: 'Indian Territorial Waters / EEZ',
      state: 'Maritime Zone of India',
      description: 'Indian EEZ',
      center: incident.detection.centroid,
      zoom: 9,
      trafficDensity: 'HIGH',
      sensitiveZones: []
    }

    const primarySuspect = incident.suspects[0] || {
      rank: 1,
      vessel: incident.aisVessels[0] || {
        id: 'unknown',
        name: 'UNIDENTIFIED VESSEL',
        imo: 'N/A',
        mmsi: 'N/A',
        callSign: 'N/A',
        flag: 'UN',
        flagCountry: 'Unknown',
        vesselType: 'CRUDE_OIL_TANKER',
        lengthMeters: 0,
        beamMeters: 0,
        draughtMeters: 0,
        grossTonnage: 0,
        destination: 'Unknown',
        eta: 'Unknown',
        currentPosition: incident.detection.centroid,
        sogKnots: 0,
        cogDegrees: 0,
        headingDegrees: 0,
        navStatus: 'Unknown',
        trajectory: [],
        hasBlackout: false
      },
      overallScore: 0,
      confidenceLevel: 'LOW',
      evidenceFactors: [],
      legalAdmissibilityCaveat: 'No suspect identified',
      recommendedAction: 'Continue surveillance'
    }

    return {
      reportId: `DOSSIER-${incident.id}-${Date.now().toString().slice(-4)}`,
      incidentId: incident.id,
      generatedAt: new Date().toISOString(),
      generatedBy: 'SAGAR RAKSHAK Automated Forensic Attribution Engine (v1.0)',
      legalClassification: 'CONFIDENTIAL MARITIME EVIDENCE — SUBJECT TO INDIAN COAST GUARD / DG SHIPPING VERIFICATION (MARPOL 73/78)',
      region,
      satelliteData: {
        sensor: `${incident.scene.sensor} (${incident.scene.sensorType})`,
        sceneId: incident.scene.id,
        acquisitionTime: incident.scene.acquisitionTime,
        orbitPass: incident.scene.orbitPass,
        dampingRatioDb: incident.detection.sarDampingRatioDb
      },
      slickData: {
        coordinates: incident.detection.centroid,
        surfaceAreaKm2: incident.characterisation.surfaceAreaKm2,
        estimatedVolumeM3: incident.characterisation.estimatedVolumeM3,
        estimatedAgeHours: incident.characterisation.spillAgeHours,
        releaseWindow: `${incident.characterisation.releaseWindowStart} to ${incident.characterisation.releaseWindowEnd}`
      },
      hindcastData: {
        probableOrigin: incident.hindcast.probableOrigin.coordinates,
        searchRadiusKm: incident.hindcast.probableOrigin.searchRadiusKm,
        driftParticles: incident.hindcast.particlesSimulated
      },
      forecastData: {
        landfallRisk: incident.forecast.landfallRisk.riskLevel,
        threatenedEcosystem: incident.forecast.landfallRisk.vulnerableZone || 'Deepwater Fairway'
      },
      primarySuspect,
      fullSuspectList: incident.suspects,
      correlatedVesselsCount: incident.aisVessels.length,
      chainOfCustody: [
        {
          timestamp: incident.scene.acquisitionTime,
          action: 'Copernicus Sentinel Hub Raw Scene Ingestion & Cryptographic Checksum Verified',
          officer: 'Satellite Ingestion Daemon'
        },
        {
          timestamp: incident.detection.timestamp,
          action: 'U-Net Deep Learning Dark-Spot Segmentation & Optical Validation Completed',
          officer: 'AI Inference Engine'
        },
        {
          timestamp: incident.hindcast.runTimestamp,
          action: 'OpenDrift Lagrangian Particle Backward Hindcast Localized Origin Centroid',
          officer: 'Hydrodynamic Drift Simulator'
        },
        {
          timestamp: incident.createdAt,
          action: 'AIS Stream Cross-Correlated; Multi-Factor Forensic Attribution Matrix Calculated',
          officer: 'Forensic Attribution Engine'
        }
      ]
    }
  }

  /**
   * Export the report dossier as a clean downloadable JSON object
   */
  public static exportReportAsJSON(report: EvidenceReport): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `${report.reportId}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  /**
   * Trigger browser print dialog for the official MARPOL evidence report
   */
  public static printReport(): void {
    window.print()
  }
}
