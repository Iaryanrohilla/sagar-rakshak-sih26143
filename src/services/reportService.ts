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
      ],
      sha256Digest: ReportService.computeEvidenceHash(incident, primarySuspect)
    }
  }

  /**
   * Generates a deterministic SHA-256 cryptographic digest for MARPOL legal chain-of-custody
   */
  public static computeEvidenceHash(incident: Incident, primarySuspect: any): string {
    const payload = `${incident.id}|${incident.scene.id}|${incident.detection.timestamp}|${primarySuspect?.vessel?.imo || 'NONE'}|${primarySuspect?.overallScore || 0}|${incident.hindcast.probableOrigin.coordinates.join(',')}`
    return ReportService.sha256(payload)
  }

  private static sha256(ascii: string): string {
    function rightRotate(value: number, amount: number) {
      return (value >>> amount) | (value << (32 - amount));
    }
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let i: number, j: number;
    let result = '';

    const words: number[] = [];
    const asciiBitLength = ascii.length * 8;
    
    const hash: number[] = [];
    const k: number[] = [];
    let primeCounter = 0;

    const isComposite: Record<number, number> = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 300; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    ascii += '\x80';
    while ((ascii.length % 64) - 56) ascii += '\x00';
    for (i = 0; i < ascii.length; i++) {
      j = ascii.charCodeAt(i);
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;

    for (j = 0; j < words.length; ) {
      const w = words.slice(j, (j += 16));
      const oldHash = [...hash];

      for (i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
        const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
        const s_0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
        const s_1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
        const t1 = (hash[7] + s_1 + ch + k[i] + (w[i] = i < 16 ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0)) | 0;
        const t2 = (s_0 + maj) | 0;

        hash.pop();
        hash.unshift((t1 + t2) | 0);
        hash[4] = (hash[4] + t1) | 0;
      }

      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    for (i = 0; i < 8; i++) {
      for (j = 3; j >= 0; j--) {
        const b = (hash[i] >> (8 * j)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }
    return result;
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
