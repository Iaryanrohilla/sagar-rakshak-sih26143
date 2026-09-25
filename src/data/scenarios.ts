import { DemoScenario } from '../types'

export const DEMO_SCENARIOS: DemoScenario[] = [
  // ==========================================
  // SCENARIO 1: Mumbai High Oil Spill (Default)
  // ==========================================
  {
    id: 'mumbai-high-crude',
    title: 'Mumbai High Western Fairway Crude Discharge',
    regionId: 'mumbai-high',
    badge: 'PRIMARY JUDGE DEMO',
    description: 'High-confidence Sentinel-1 SAR dark-spot detection cross-validated with Sentinel-2 optical imagery. Lagrangian hindcast maps release to 14.5 hours ago, matching laden tanker MT Oceanus Pride with 92% attribution score.',
    incident: {
      id: 'INC-2026-MH-0104',
      title: 'Western Fairway Crude Slick — Sector BNV-4',
      regionId: 'mumbai-high',
      status: 'ACTIVE',
      severity: 'CRITICAL',
      createdAt: '2026-09-15T04:30:00Z',
      updatedAt: '2026-09-15T08:15:00Z',
      scene: {
        id: 'S1A_IW_GRDH_1SDV_20260915T032014_048912_05D84A_MH',
        sceneName: 'Sentinel-1A C-SAR Level-1 GRD (Mumbai High Sector 4)',
        sensor: 'Sentinel-1 C-SAR',
        sensorType: 'SAR',
        acquisitionTime: '2026-09-15T03:20:14Z',
        orbitPass: 'DESCENDING',
        pathRow: 'Pass 128 / Frame 492',
        polarization: 'VV+VH',
        incidenceAngle: 36.4,
        resolutionMeters: 10.0,
        cloudCoveragePercent: 68.4,
        boundingBox: [[19.20, 71.10], [19.65, 71.60]],
        calibrated: true,
        speckleFiltered: true,
        terrainCorrected: true,
        processingState: 'PROCESSED'
      },
      detection: {
        id: 'DET-MH-0104-A',
        sceneId: 'S1A_IW_GRDH_1SDV_20260915T032014_048912_05D84A_MH',
        incidentId: 'INC-2026-MH-0104',
        timestamp: '2026-09-15T03:45:00Z',
        polygon: [
          [19.442, 71.365],
          [19.458, 71.392],
          [19.465, 71.425],
          [19.452, 71.450],
          [19.435, 71.442],
          [19.420, 71.410],
          [19.415, 71.380],
          [19.428, 71.355],
          [19.442, 71.365]
        ],
        centroid: [19.438, 71.402],
        confidenceScore: 94.6,
        classification: 'MINERAL_OIL_SLICK',
        isConfirmedSlick: true,
        sarDampingRatioDb: 10.4,
        opticalContrastIndex: 0.72,
        modelArchitecture: 'Dual-Sensor U-Net + ResNet-50 SAR/EO Fusion',
        detectionNotes: 'Severe capillary wave damping observed in SAR VV polarization (10.4 dB attenuation vs background ocean). Confirmed by Sentinel-2 SWIR/NIR negative contrast ratio. Ruled out biogenic slick due to steep edge gradients and thickness.'
      },
      characterisation: {
        id: 'CHAR-MH-0104',
        incidentId: 'INC-2026-MH-0104',
        surfaceAreaKm2: 38.4,
        perimeterKm: 31.8,
        elongationRatio: 3.25,
        majorAxisKm: 8.6,
        minorAxisKm: 2.65,
        orientationDegrees: 62.0,
        estimatedVolumeM3: 1420.0,
        spillAgeHours: 14.5,
        releaseWindowStart: '2026-09-14T11:30:00Z',
        releaseWindowEnd: '2026-09-14T14:00:00Z',
        weatheringPhysics: {
          oilType: 'Arabian Heavy Crude (API 27.9)',
          apiGravity: 27.9,
          initialViscosityCst: 48.0,
          currentViscosityCst: 340.0,
          evaporationPercent: 28.5,
          emulsificationPercent: 42.0,
          remainingMassPercent: 71.5,
          weatheringCurve: [
            { hour: 0, evaporationPercent: 0.0, viscosityCst: 48.0, emulsificationPercent: 0.0, remainingMassPercent: 100.0 },
            { hour: 3, evaporationPercent: 11.2, viscosityCst: 76.0, emulsificationPercent: 8.0, remainingMassPercent: 88.8 },
            { hour: 6, evaporationPercent: 18.4, viscosityCst: 125.0, emulsificationPercent: 19.5, remainingMassPercent: 81.6 },
            { hour: 9, evaporationPercent: 23.1, viscosityCst: 210.0, emulsificationPercent: 29.0, remainingMassPercent: 76.9 },
            { hour: 12, evaporationPercent: 26.3, viscosityCst: 285.0, emulsificationPercent: 37.0, remainingMassPercent: 73.7 },
            { hour: 15, evaporationPercent: 28.8, viscosityCst: 355.0, emulsificationPercent: 43.5, remainingMassPercent: 71.2 },
            { hour: 24, evaporationPercent: 33.2, viscosityCst: 540.0, emulsificationPercent: 58.0, remainingMassPercent: 66.8 }
          ]
        }
      },
      metocean: {
        windSpeedKnots: 14.2,
        windDirectionDegrees: 245.0, // WSW
        currentSpeedKnots: 0.85,
        currentDirectionDegrees: 65.0, // ENE
        seaTemperatureCelsius: 28.4,
        waveHeightMeters: 1.4,
        stokesDriftKnots: 0.28
      },
      hindcast: {
        incidentId: 'INC-2026-MH-0104',
        runTimestamp: '2026-09-15T04:10:00Z',
        modelEngine: 'OpenDrift Lagrangian Particle Engine (HYCOM + ECMWF)',
        backwardHorizonHours: 18,
        particlesSimulated: 450,
        probableOrigin: {
          coordinates: [19.284, 71.215],
          searchRadiusKm: 3.2,
          releaseTime: '2026-09-14T12:45:00Z',
          confidencePercent: 91.5,
          locationDescription: 'Western Tanker Corridor (18.4 NM southwest of ONGC Platform BNV)'
        },
        timeSteps: [
          {
            timestamp: '2026-09-15T03:20:00Z',
            hoursOffset: 0,
            meanPosition: [19.438, 71.402],
            uncertaintyRadiusKm: 0.8,
            particles: [
              [19.438, 71.402], [19.445, 71.412], [19.430, 71.390], [19.450, 71.420], [19.425, 71.385]
            ]
          },
          {
            timestamp: '2026-09-14T23:20:00Z',
            hoursOffset: -4,
            meanPosition: [19.395, 71.350],
            uncertaintyRadiusKm: 1.4,
            particles: [
              [19.395, 71.350], [19.405, 71.362], [19.388, 71.338], [19.410, 71.370], [19.382, 71.330]
            ]
          },
          {
            timestamp: '2026-09-14T19:20:00Z',
            hoursOffset: -8,
            meanPosition: [19.352, 71.300],
            uncertaintyRadiusKm: 2.1,
            particles: [
              [19.352, 71.300], [19.365, 71.315], [19.340, 71.285], [19.370, 71.325], [19.335, 71.275]
            ]
          },
          {
            timestamp: '2026-09-14T15:20:00Z',
            hoursOffset: -12,
            meanPosition: [19.310, 71.250],
            uncertaintyRadiusKm: 2.7,
            particles: [
              [19.310, 71.250], [19.325, 71.268], [19.298, 71.235], [19.330, 71.280], [19.290, 71.220]
            ]
          },
          {
            timestamp: '2026-09-14T12:45:00Z',
            hoursOffset: -14.5,
            meanPosition: [19.284, 71.215],
            uncertaintyRadiusKm: 3.2,
            particles: [
              [19.284, 71.215], [19.300, 71.232], [19.270, 71.198], [19.308, 71.245], [19.262, 71.185]
            ]
          }
        ]
      },
      forecast: {
        incidentId: 'INC-2026-MH-0104',
        runTimestamp: '2026-09-15T04:25:00Z',
        forecastHorizonHours: 48,
        forecastSpreadPolygon: [
          [19.48, 71.48],
          [19.56, 71.60],
          [19.62, 71.78],
          [19.58, 71.85],
          [19.46, 71.72],
          [19.40, 71.55],
          [19.48, 71.48]
        ],
        landfallRisk: {
          threatensCoast: false,
          riskLevel: 'MEDIUM',
          vulnerableZone: 'ONGC South Offshore Extraction Cluster (14 NM Northeast)',
          containmentPriority: 'Deploy offshore booming vessels along ENE leading edge (65° azimuth) to prevent ingress into production zone.'
        },
        timeSteps: [
          {
            timestamp: '2026-09-15T09:20:00Z',
            hoursOffset: 6,
            meanPosition: [19.468, 71.445],
            uncertaintyRadiusKm: 1.5,
            particles: [[19.468, 71.445], [19.480, 71.460], [19.455, 71.430]]
          },
          {
            timestamp: '2026-09-15T15:20:00Z',
            hoursOffset: 12,
            meanPosition: [19.502, 71.495],
            uncertaintyRadiusKm: 2.4,
            particles: [[19.502, 71.495], [19.520, 71.515], [19.485, 71.475]]
          },
          {
            timestamp: '2026-09-16T03:20:00Z',
            hoursOffset: 24,
            meanPosition: [19.565, 71.590],
            uncertaintyRadiusKm: 4.1,
            particles: [[19.565, 71.590], [19.590, 71.625], [19.540, 71.555]]
          },
          {
            timestamp: '2026-09-17T03:20:00Z',
            hoursOffset: 48,
            meanPosition: [19.680, 71.760],
            uncertaintyRadiusKm: 7.5,
            particles: [[19.680, 71.760], [19.720, 71.810], [19.640, 71.710]]
          }
        ]
      },
      aisVessels: [
        {
          id: 'vessel-mh-01',
          name: 'MT OCEANUS PRIDE',
          imo: '9482176',
          mmsi: '636018244',
          callSign: 'A8QK9',
          flag: 'LR',
          flagCountry: 'Liberia',
          vesselType: 'CRUDE_OIL_TANKER',
          lengthMeters: 274,
          beamMeters: 48,
          draughtMeters: 16.4,
          grossTonnage: 84500,
          destination: 'SIKKA (VADINAR)',
          eta: '2026-09-16T02:00:00Z',
          currentPosition: [20.12, 71.82],
          sogKnots: 12.8,
          cogDegrees: 340.0,
          headingDegrees: 341.0,
          navStatus: 'Underway using Engine',
          hasBlackout: true,
          blackoutAnomaly: {
            startTime: '2026-09-14T11:45:00Z',
            endTime: '2026-09-14T14:15:00Z',
            durationHours: 2.5,
            lastReportedPos: [19.220, 71.160],
            nextReportedPos: [19.345, 71.265],
            distanceTraveledKm: 31.2,
            estimatedAverageSpeedKnots: 13.5,
            coincidesWithOriginZone: true
          },
          trajectory: [
            { timestamp: '2026-09-14T09:00:00Z', position: [19.05, 71.02], sogKnots: 13.4, cogDegrees: 58.0, distanceToOriginKm: 32.4 },
            { timestamp: '2026-09-14T11:40:00Z', position: [19.215, 71.155], sogKnots: 13.2, cogDegrees: 56.0, distanceToOriginKm: 9.8 },
            // Gap between 11:45 and 14:15 - estimated point at 12:45 directly crosses origin [19.284, 71.215]
            { timestamp: '2026-09-14T12:45:00Z', position: [19.280, 71.210], sogKnots: 13.0, cogDegrees: 57.0, distanceToOriginKm: 0.7 },
            { timestamp: '2026-09-14T14:20:00Z', position: [19.350, 71.270], sogKnots: 13.1, cogDegrees: 55.0, distanceToOriginKm: 9.4 },
            { timestamp: '2026-09-14T18:00:00Z', position: [19.55, 71.45], sogKnots: 13.0, cogDegrees: 350.0, distanceToOriginKm: 39.8 },
            { timestamp: '2026-09-15T03:20:00Z', position: [20.05, 71.78], sogKnots: 12.9, cogDegrees: 342.0, distanceToOriginKm: 104.2 }
          ]
        },
        {
          id: 'vessel-mh-02',
          name: 'MV NORDIC TRADER',
          imo: '9315482',
          mmsi: '257812000',
          callSign: 'LAX42',
          flag: 'NO',
          flagCountry: 'Norway',
          vesselType: 'BULK_CARRIER',
          lengthMeters: 225,
          beamMeters: 32,
          draughtMeters: 12.1,
          grossTonnage: 43200,
          destination: 'MUMBAI PORT',
          eta: '2026-09-15T10:00:00Z',
          currentPosition: [19.10, 72.40],
          sogKnots: 11.2,
          cogDegrees: 85.0,
          headingDegrees: 84.0,
          navStatus: 'Underway using Engine',
          hasBlackout: false,
          trajectory: [
            { timestamp: '2026-09-14T11:00:00Z', position: [19.12, 70.85], sogKnots: 11.4, cogDegrees: 88.0, distanceToOriginKm: 42.1 },
            { timestamp: '2026-09-14T12:45:00Z', position: [19.14, 71.15], sogKnots: 11.2, cogDegrees: 86.0, distanceToOriginKm: 17.5 },
            { timestamp: '2026-09-14T15:00:00Z', position: [19.15, 71.45], sogKnots: 11.1, cogDegrees: 84.0, distanceToOriginKm: 28.6 }
          ]
        },
        {
          id: 'vessel-mh-03',
          name: 'MT ARABIAN BREEZE',
          imo: '9651034',
          mmsi: '470219000',
          callSign: 'A6AB',
          flag: 'AE',
          flagCountry: 'UAE',
          vesselType: 'CHEMICAL_TANKER',
          lengthMeters: 182,
          beamMeters: 28,
          draughtMeters: 9.8,
          grossTonnage: 26800,
          destination: 'JNPT NAVI MUMBAI',
          eta: '2026-09-15T14:30:00Z',
          currentPosition: [18.85, 72.15],
          sogKnots: 10.5,
          cogDegrees: 110.0,
          headingDegrees: 112.0,
          navStatus: 'Underway using Engine',
          hasBlackout: false,
          trajectory: [
            { timestamp: '2026-09-14T12:00:00Z', position: [19.05, 71.40], sogKnots: 10.8, cogDegrees: 115.0, distanceToOriginKm: 32.8 },
            { timestamp: '2026-09-14T12:45:00Z', position: [19.00, 71.55], sogKnots: 10.6, cogDegrees: 112.0, distanceToOriginKm: 46.2 }
          ]
        }
      ],
      suspects: [
        {
          rank: 1,
          vessel: {
            id: 'vessel-mh-01',
            name: 'MT OCEANUS PRIDE',
            imo: '9482176',
            mmsi: '636018244',
            callSign: 'A8QK9',
            flag: 'LR',
            flagCountry: 'Liberia',
            vesselType: 'CRUDE_OIL_TANKER',
            lengthMeters: 274,
            beamMeters: 48,
            draughtMeters: 16.4,
            grossTonnage: 84500,
            destination: 'SIKKA (VADINAR)',
            eta: '2026-09-16T02:00:00Z',
            currentPosition: [20.12, 71.82],
            sogKnots: 12.8,
            cogDegrees: 340.0,
            headingDegrees: 341.0,
            navStatus: 'Underway using Engine',
            hasBlackout: true,
            blackoutAnomaly: {
              startTime: '2026-09-14T11:45:00Z',
              endTime: '2026-09-14T14:15:00Z',
              durationHours: 2.5,
              lastReportedPos: [19.220, 71.160],
              nextReportedPos: [19.345, 71.265],
              distanceTraveledKm: 31.2,
              estimatedAverageSpeedKnots: 13.5,
              coincidesWithOriginZone: true
            },
            trajectory: []
          },
          overallScore: 92.4,
          confidenceLevel: 'HIGH',
          evidenceFactors: [
            { category: 'PROXIMITY', name: 'Hindcast Origin Proximity', score: 28, maxScore: 30, description: 'Interpolated track passed within 0.7 km of the Lagrangian probable origin point at release time T0.' },
            { category: 'TRAJECTORY', name: 'Course-Slick Alignment', score: 18, maxScore: 20, description: 'Vessel heading (057°) aligns within 5° of the slick elongation major axis (062°).' },
            { category: 'SPEED', name: 'Discharge Speed Compatibility', score: 15, maxScore: 15, description: 'Transit speed 13.0 knots is highly consistent with continuous en-route operational tank washing discharge.' },
            { category: 'TIMING', name: 'Weathering Temporal Match', score: 15, maxScore: 15, description: 'Crossing timestamp (12:45 UTC) sits exactly inside the Mackay physical weathering window (11:30–14:00 UTC).' },
            { category: 'AIS_ANOMALY', name: 'AIS Transponder Blackout', score: 16.4, maxScore: 20, description: '2.5-hour AIS gap began 10 NM before origin and resumed after crossing origin zone, indicating intentional evasion.' }
          ],
          legalAdmissibilityCaveat: 'Potential Responsible Vessel — Evidence-backed suspect. Requires Indian Coast Guard / DG Shipping verification and PSC sampling under MARPOL Annex I.',
          recommendedAction: 'Direct ICG Dornier-228 aerial patrol and intercept via Fast Patrol Vessel (FPV) before port entry at Sikka.'
        },
        {
          rank: 2,
          vessel: {
            id: 'vessel-mh-02',
            name: 'MV NORDIC TRADER',
            imo: '9315482',
            mmsi: '257812000',
            callSign: 'LAX42',
            flag: 'NO',
            flagCountry: 'Norway',
            vesselType: 'BULK_CARRIER',
            lengthMeters: 225,
            beamMeters: 32,
            draughtMeters: 12.1,
            grossTonnage: 43200,
            destination: 'MUMBAI PORT',
            eta: '2026-09-15T10:00:00Z',
            currentPosition: [19.10, 72.40],
            sogKnots: 11.2,
            cogDegrees: 85.0,
            headingDegrees: 84.0,
            navStatus: 'Underway using Engine',
            hasBlackout: false,
            trajectory: []
          },
          overallScore: 38.2,
          confidenceLevel: 'LOW',
          evidenceFactors: [
            { category: 'PROXIMITY', name: 'Hindcast Origin Proximity', score: 12, maxScore: 30, description: 'Closest approach was 17.5 km from the estimated origin zone.' },
            { category: 'TRAJECTORY', name: 'Course-Slick Alignment', score: 8, maxScore: 20, description: 'Course (086°) deviates 24° from the slick elongation axis.' },
            { category: 'SPEED', name: 'Discharge Speed Compatibility', score: 10, maxScore: 15, description: 'Bulk carrier in laden transit, cargo type does not match mineral crude characteristics.' },
            { category: 'TIMING', name: 'Weathering Temporal Match', score: 8.2, maxScore: 15, description: 'Passed area near origin window, but offset outside radius.' },
            { category: 'AIS_ANOMALY', name: 'AIS Transponder Blackout', score: 0, maxScore: 20, description: 'Continuous AIS transmission with zero telemetry gaps.' }
          ],
          legalAdmissibilityCaveat: 'Low-probability peripheral vessel. No compliance violations detected.',
          recommendedAction: 'Routine monitor; no interception required.'
        }
      ],
      alerts: [
        {
          id: 'ALT-MH-01',
          incidentId: 'INC-2026-MH-0104',
          title: 'High-Confidence Mineral Oil Slick Detected in Mumbai High',
          severity: 'CRITICAL',
          type: 'HIGH_CONFIDENCE',
          status: 'INVESTIGATING',
          timestamp: '2026-09-15T03:50:00Z',
          assignedAgency: 'COAST_GUARD',
          description: 'Sentinel-1 C-SAR pass confirmed 38.4 km² crude slick with 10.4 dB damping. U-Net confidence 94.6%.',
          history: [
            { status: 'NEW', timestamp: '2026-09-15T03:50:00Z', updatedBy: 'Automated Detection Pipeline', note: 'Incident created from SAR detection' },
            { status: 'ACKNOWLEDGED', timestamp: '2026-09-15T04:02:00Z', updatedBy: 'Duty Officer (ICG RHQ-West)', note: 'SAR telemetry verified against Sentinel-2 EO reflectance.' },
            { status: 'INVESTIGATING', timestamp: '2026-09-15T04:35:00Z', updatedBy: 'Pollution Response Commander', note: 'Lagrangian hindcast completed; top suspect identified.' }
          ]
        },
        {
          id: 'ALT-MH-02',
          incidentId: 'INC-2026-MH-0104',
          title: 'Primary Suspect Vessel Identified with AIS Blackout: MT OCEANUS PRIDE',
          severity: 'HIGH',
          type: 'VESSEL_SUSPECT',
          status: 'ACKNOWLEDGED',
          timestamp: '2026-09-15T04:40:00Z',
          assignedAgency: 'DG_SHIPPING',
          description: 'Explainable attribution score 92.4%. Tanker disabled transponder for 2.5 hours while crossing spill origin.',
          history: [
            { status: 'NEW', timestamp: '2026-09-15T04:40:00Z', updatedBy: 'Forensic Attribution Engine', note: 'Candidate ranked #1 across 14 vessels' },
            { status: 'ACKNOWLEDGED', timestamp: '2026-09-15T05:00:00Z', updatedBy: 'DG Shipping PSC Officer', note: 'Notice drafted for Sikka/Vadinar Port State Control inspection team.' }
          ]
        }
      ],
      timeline: [
        { id: 'TL-1', timestamp: '2026-09-15T03:20:14Z', stage: 'SATELLITE_ACQUISITION', title: 'Sentinel-1A SAR Acquisition', source: 'ESA Copernicus Sentinel Hub', confidence: 100, description: 'C-SAR Level-1 GRD acquired over Mumbai High (Path 128 / Frame 492).' },
        { id: 'TL-2', timestamp: '2026-09-15T03:32:00Z', stage: 'PREPROCESSING', title: 'Radiometric Calibration & Speckle Filtering', source: 'SNAP Toolbox / GDAL Pipeline', confidence: 100, description: 'Sigma0 calibration completed; refined Lee speckle filtering applied.' },
        { id: 'TL-3', timestamp: '2026-09-15T03:45:00Z', stage: 'SLICK_DETECTION', title: 'Mineral Oil Slick Confirmed', source: 'U-Net Deep Learning Detector', confidence: 94.6, description: 'Segmented 38.4 km² dark spot with 10.4 dB damping ratio. Look-alikes rejected.' },
        { id: 'TL-4', timestamp: '2026-09-15T03:55:00Z', stage: 'CHARACTERISATION', title: 'Geometric & Weathering Analysis', source: 'Physical Spreading Engine (Fay/Mackay)', confidence: 92.0, description: 'Elongation ratio 3.25 along 062° azimuth. Volume estimated at 1,420 m³.' },
        { id: 'TL-5', timestamp: '2026-09-15T04:05:00Z', stage: 'AGE_ESTIMATION', title: 'Spill Age Estimated at 14.5 Hours', source: 'Mackay Evaporation/Emulsification Model', confidence: 91.0, description: 'Release time window established between 11:30 and 14:00 UTC (14 September).' },
        { id: 'TL-6', timestamp: '2026-09-15T04:15:00Z', stage: 'HINDCAST_SIMULATION', title: 'OpenDrift Backward Hindcast Completed', source: 'OpenDrift Lagrangian Particle Engine', confidence: 91.5, description: 'Probable origin localized at 19.284°N, 71.215°E (search radius 3.2 km).' },
        { id: 'TL-7', timestamp: '2026-09-15T04:28:00Z', stage: 'AIS_CORRELATION', title: 'AIS Traffic Correlated & Blackout Detected', source: 'AIS Stream Processor (PostGIS)', confidence: 96.0, description: 'Correlated 14 vessels in release window. Identified 2.5h AIS gap on MT Oceanus Pride.' },
        { id: 'TL-8', timestamp: '2026-09-15T04:38:00Z', stage: 'VESSEL_ATTRIBUTION', title: 'MT Oceanus Pride Ranked Suspect #1', source: 'Explainable Attribution Engine', confidence: 92.4, description: 'Attribution score 92.4/100 across 5 forensic categories. Evidence dossier compiled.' },
        { id: 'TL-9', timestamp: '2026-09-15T04:45:00Z', stage: 'AUTHORITY_ALERT', title: 'Coast Guard & DG Shipping Alerts Dispatched', source: 'Agency Alert Engine', confidence: 100, description: 'Priority flash alerts dispatched to ICG RHQ-West and DG Shipping Mumbai.' }
      ]
    }
  },

  // ========================================================
  // SCENARIO 2: Gulf of Kutch — Sensitive Reef Landfall Risk
  // ========================================================
  {
    id: 'kutch-spm-sensitive',
    title: 'Gulf of Kutch SPM Spill & Marine National Park Threat',
    regionId: 'gulf-of-kutch',
    badge: 'ECOLOGICAL CRISIS',
    description: 'Crude spill near Vadinar Single Point Mooring terminal with fast east-southeast tidal drift directly threatening Marine National Park coral reefs. Requires immediate containment boom deployment.',
    incident: {
      id: 'INC-2026-GK-0209',
      title: 'Vadinar SPM Channel Spill — Coral Reef Alert',
      regionId: 'gulf-of-kutch',
      status: 'ACTIVE',
      severity: 'CRITICAL',
      createdAt: '2026-09-15T06:15:00Z',
      updatedAt: '2026-09-15T08:45:00Z',
      scene: {
        id: 'S1B_IW_GRDH_1SDV_20260915T054012_051290_05F321_GK',
        sceneName: 'Sentinel-1B C-SAR Level-1 GRD (Gulf of Kutch Approaches)',
        sensor: 'Sentinel-1 C-SAR',
        sensorType: 'SAR',
        acquisitionTime: '2026-09-15T05:40:12Z',
        orbitPass: 'ASCENDING',
        pathRow: 'Pass 042 / Frame 180',
        polarization: 'VV+VH',
        incidenceAngle: 41.2,
        resolutionMeters: 10.0,
        cloudCoveragePercent: 42.0,
        boundingBox: [[22.25, 69.20], [22.75, 69.95]],
        calibrated: true,
        speckleFiltered: true,
        terrainCorrected: true,
        processingState: 'PROCESSED'
      },
      detection: {
        id: 'DET-GK-0209-A',
        sceneId: 'S1B_IW_GRDH_1SDV_20260915T054012_051290_05F321_GK',
        incidentId: 'INC-2026-GK-0209',
        timestamp: '2026-09-15T06:05:00Z',
        polygon: [
          [22.465, 69.610],
          [22.482, 69.645],
          [22.478, 69.680],
          [22.455, 69.695],
          [22.440, 69.660],
          [22.445, 69.625],
          [22.465, 69.610]
        ],
        centroid: [22.461, 69.652],
        confidenceScore: 96.2,
        classification: 'MINERAL_OIL_SLICK',
        isConfirmedSlick: true,
        sarDampingRatioDb: 11.8,
        opticalContrastIndex: 0.81,
        modelArchitecture: 'Dual-Sensor U-Net + ResNet-50 SAR/EO Fusion',
        detectionNotes: 'High-intensity damping signature (11.8 dB) in narrow navigation channel. Confirmed by Sentinel-2 cloud-free optical spectrum indicating thick emulsified crude.'
      },
      characterisation: {
        id: 'CHAR-GK-0209',
        incidentId: 'INC-2026-GK-0209',
        surfaceAreaKm2: 22.6,
        perimeterKm: 24.2,
        elongationRatio: 2.8,
        majorAxisKm: 6.4,
        minorAxisKm: 2.3,
        orientationDegrees: 105.0,
        estimatedVolumeM3: 980.0,
        spillAgeHours: 8.5,
        releaseWindowStart: '2026-09-14T20:30:00Z',
        releaseWindowEnd: '2026-09-14T22:30:00Z',
        weatheringPhysics: {
          oilType: 'Basrah Light Crude (API 30.5)',
          apiGravity: 30.5,
          initialViscosityCst: 32.0,
          currentViscosityCst: 195.0,
          evaporationPercent: 24.2,
          emulsificationPercent: 33.0,
          remainingMassPercent: 75.8,
          weatheringCurve: [
            { hour: 0, evaporationPercent: 0.0, viscosityCst: 32.0, emulsificationPercent: 0.0, remainingMassPercent: 100.0 },
            { hour: 3, evaporationPercent: 12.5, viscosityCst: 55.0, emulsificationPercent: 11.0, remainingMassPercent: 87.5 },
            { hour: 6, evaporationPercent: 19.8, viscosityCst: 110.0, emulsificationPercent: 24.0, remainingMassPercent: 80.2 },
            { hour: 8.5, evaporationPercent: 24.2, viscosityCst: 195.0, emulsificationPercent: 33.0, remainingMassPercent: 75.8 },
            { hour: 12, evaporationPercent: 28.5, viscosityCst: 290.0, emulsificationPercent: 44.0, remainingMassPercent: 71.5 }
          ]
        }
      },
      metocean: {
        windSpeedKnots: 11.5,
        windDirectionDegrees: 290.0, // WNW
        currentSpeedKnots: 1.85, // Strong tidal current in gulf
        currentDirectionDegrees: 110.0, // ESE
        seaTemperatureCelsius: 29.1,
        waveHeightMeters: 0.9,
        stokesDriftKnots: 0.22
      },
      hindcast: {
        incidentId: 'INC-2026-GK-0209',
        runTimestamp: '2026-09-15T06:30:00Z',
        modelEngine: 'OpenDrift Lagrangian Particle Engine (HYCOM + ECMWF)',
        backwardHorizonHours: 12,
        particlesSimulated: 500,
        probableOrigin: {
          coordinates: [22.425, 69.510],
          searchRadiusKm: 2.1,
          releaseTime: '2026-09-14T21:15:00Z',
          confidencePercent: 93.8,
          locationDescription: 'Vadinar SPM Approach Anchorage #2'
        },
        timeSteps: [
          {
            timestamp: '2026-09-15T05:40:00Z',
            hoursOffset: 0,
            meanPosition: [22.461, 69.652],
            uncertaintyRadiusKm: 0.6,
            particles: [[22.461, 69.652], [22.470, 69.665], [22.450, 69.640]]
          },
          {
            timestamp: '2026-09-15T01:40:00Z',
            hoursOffset: -4,
            meanPosition: [22.448, 69.595],
            uncertaintyRadiusKm: 1.2,
            particles: [[22.448, 69.595], [22.458, 69.610], [22.438, 69.580]]
          },
          {
            timestamp: '2026-09-14T21:15:00Z',
            hoursOffset: -8.5,
            meanPosition: [22.425, 69.510],
            uncertaintyRadiusKm: 2.1,
            particles: [[22.425, 69.510], [22.435, 69.525], [22.415, 69.495]]
          }
        ]
      },
      forecast: {
        incidentId: 'INC-2026-GK-0209',
        runTimestamp: '2026-09-15T06:45:00Z',
        forecastHorizonHours: 24,
        forecastSpreadPolygon: [
          [22.470, 69.680],
          [22.485, 69.730],
          [22.490, 69.775],
          [22.465, 69.780],
          [22.445, 69.725],
          [22.470, 69.680]
        ],
        landfallRisk: {
          threatensCoast: true,
          estimatedLandfallTime: '2026-09-15T14:30:00Z (In ~6 Hours)',
          vulnerableZone: 'Pirotan Island Coral Reef Sanctuary (Marine National Park)',
          riskLevel: 'CRITICAL',
          containmentPriority: 'URGENT: Deploy Tier-1 oil containment booms (1,200m) at Pirotan reef buffer zone before afternoon high tide flood.'
        },
        timeSteps: [
          {
            timestamp: '2026-09-15T09:40:00Z',
            hoursOffset: 4,
            meanPosition: [22.472, 69.705],
            uncertaintyRadiusKm: 1.1,
            particles: [[22.472, 69.705], [22.480, 69.720], [22.465, 69.690]]
          },
          {
            timestamp: '2026-09-15T13:40:00Z',
            hoursOffset: 8,
            meanPosition: [22.482, 69.755],
            uncertaintyRadiusKm: 1.8,
            particles: [[22.482, 69.755], [22.495, 69.770], [22.470, 69.740]]
          }
        ]
      },
      aisVessels: [
        {
          id: 'vessel-gk-01',
          name: 'MT GULF STAR V',
          imo: '9518820',
          mmsi: '470992000',
          callSign: 'A6GS5',
          flag: 'AE',
          flagCountry: 'UAE',
          vesselType: 'CRUDE_OIL_TANKER',
          lengthMeters: 333,
          beamMeters: 60,
          draughtMeters: 20.8,
          grossTonnage: 161000,
          destination: 'VADINAR SPM 1',
          eta: '2026-09-14T20:00:00Z',
          currentPosition: [22.418, 69.715],
          sogKnots: 0.2,
          cogDegrees: 120.0,
          headingDegrees: 118.0,
          navStatus: 'Moored to SPM Buoy',
          hasBlackout: false,
          trajectory: [
            { timestamp: '2026-09-14T19:00:00Z', position: [22.410, 69.450], sogKnots: 5.4, cogDegrees: 88.0, distanceToOriginKm: 6.4 },
            { timestamp: '2026-09-14T21:15:00Z', position: [22.424, 69.512], sogKnots: 2.1, cogDegrees: 85.0, distanceToOriginKm: 0.2 },
            { timestamp: '2026-09-14T23:30:00Z', position: [22.418, 69.715], sogKnots: 0.2, cogDegrees: 120.0, distanceToOriginKm: 21.2 }
          ]
        },
        {
          id: 'vessel-gk-02',
          name: 'TUG SAGAR VIKRAM',
          imo: '9782100',
          mmsi: '419001234',
          callSign: 'VTBA',
          flag: 'IN',
          flagCountry: 'India',
          vesselType: 'OFFSHORE_TUG',
          lengthMeters: 38,
          beamMeters: 11,
          draughtMeters: 4.2,
          grossTonnage: 480,
          destination: 'VADINAR PORT',
          eta: '2026-09-15T08:00:00Z',
          currentPosition: [22.44, 69.65],
          sogKnots: 8.5,
          cogDegrees: 270.0,
          headingDegrees: 270.0,
          navStatus: 'Underway using Engine',
          hasBlackout: false,
          trajectory: []
        }
      ],
      suspects: [
        {
          rank: 1,
          vessel: {
            id: 'vessel-gk-01',
            name: 'MT GULF STAR V',
            imo: '9518820',
            mmsi: '470992000',
            callSign: 'A6GS5',
            flag: 'AE',
            flagCountry: 'UAE',
            vesselType: 'CRUDE_OIL_TANKER',
            lengthMeters: 333,
            beamMeters: 60,
            draughtMeters: 20.8,
            grossTonnage: 161000,
            destination: 'VADINAR SPM 1',
            eta: '2026-09-14T20:00:00Z',
            currentPosition: [22.418, 69.715],
            sogKnots: 0.2,
            cogDegrees: 120.0,
            headingDegrees: 118.0,
            navStatus: 'Moored to SPM Buoy',
            hasBlackout: false,
            trajectory: []
          },
          overallScore: 88.5,
          confidenceLevel: 'HIGH',
          evidenceFactors: [
            { category: 'PROXIMITY', name: 'Hindcast Origin Proximity', score: 30, maxScore: 30, description: 'VLCC was directly positioned at 22.424°N, 69.512°E during hose connection (0.2 km from hindcast origin).' },
            { category: 'TIMING', name: 'Weathering Temporal Match', score: 15, maxScore: 15, description: 'Time of de-ballasting/SPM manifold connection (21:15 UTC) correlates with 8.5h estimated spill age.' },
            { category: 'SPEED', name: 'Discharge Speed Compatibility', score: 14, maxScore: 15, description: 'Low maneuvering speed (2.1 kts) aligns with SPM mooring approach and hose manifold transfer.' },
            { category: 'TRAJECTORY', name: 'Course-Slick Alignment', score: 15.5, maxScore: 20, description: 'Approach alignment conforms to tidal flood trajectory (105° azimuth).' },
            { category: 'AIS_ANOMALY', name: 'AIS Transponder Blackout', score: 14, maxScore: 20, description: 'Telemetry indicates manifold pressure anomaly logged during SPM mooring sequence.' }
          ],
          legalAdmissibilityCaveat: 'Potential Responsible Vessel — Mooring & de-ballasting operations suspect. Requires Port Health & MoEFCC joint inspection.',
          recommendedAction: 'Order immediate halt to discharge pumping; deploy boom barriers around SPM #1.'
        }
      ],
      alerts: [
        {
          id: 'ALT-GK-01',
          incidentId: 'INC-2026-GK-0209',
          title: 'CRITICAL: Oil Spill Approaching Pirotan Coral Reef (Marine National Park)',
          severity: 'CRITICAL',
          type: 'SENSITIVE_ZONE_THREAT',
          status: 'ESCALATED',
          timestamp: '2026-09-15T06:50:00Z',
          assignedAgency: 'MOEFCC',
          description: 'Forward drift model projects slick impact on Pirotan Coral Reef sanctuary in ~6 hours under 1.85 kt tidal current.',
          history: [
            { status: 'NEW', timestamp: '2026-09-15T06:50:00Z', updatedBy: 'Drift Forecast Engine', note: 'Threat vector calculated' },
            { status: 'ACKNOWLEDGED', timestamp: '2026-09-15T07:05:00Z', updatedBy: 'Gujarat Forest Dept & ICG Vadinar', note: 'Pollution Response Vessel ICGS Samudra Pavak alerted' },
            { status: 'ESCALATED', timestamp: '2026-09-15T07:30:00Z', updatedBy: 'MoEFCC National Coastal Directorate', note: 'Disaster response protocol activated.' }
          ]
        }
      ],
      timeline: [
        { id: 'TL-GK-1', timestamp: '2026-09-15T05:40:12Z', stage: 'SATELLITE_ACQUISITION', title: 'Sentinel-1B Ingestion', source: 'Sentinel Hub API', confidence: 100, description: 'Acquired C-SAR scene over Gulf of Kutch.' },
        { id: 'TL-GK-2', timestamp: '2026-09-15T06:05:00Z', stage: 'SLICK_DETECTION', title: 'Oil Slick Detected in SPM Channel', source: 'U-Net Model', confidence: 96.2, description: 'Detected 22.6 km² crude slick with 11.8 dB attenuation.' },
        { id: 'TL-GK-3', timestamp: '2026-09-15T06:20:00Z', stage: 'CHARACTERISATION', title: 'Characterisation & Mackay Ageing', source: 'Mackay Weathering Engine', confidence: 93.0, description: 'Spill age estimated at 8.5 hours. Volume ~980 m³.' },
        { id: 'TL-GK-4', timestamp: '2026-09-15T06:30:00Z', stage: 'HINDCAST_SIMULATION', title: 'Origin Localized to SPM Anchorage #2', source: 'OpenDrift Hindcast', confidence: 93.8, description: 'Origin matches Vadinar mooring sequence at 21:15 UTC.' },
        { id: 'TL-GK-5', timestamp: '2026-09-15T06:45:00Z', stage: 'FORECAST_SIMULATION', title: 'CRITICAL Landfall Warning: Pirotan Island', source: 'OpenDrift Forward Engine', confidence: 95.0, description: 'Calculated high-tide flood impact on Marine National Park reefs.' },
        { id: 'TL-GK-6', timestamp: '2026-09-15T07:15:00Z', stage: 'AUTHORITY_ALERT', title: 'Emergency MoEFCC & ICG Escalation', source: 'Agency Alert Engine', confidence: 100, description: 'Dispatched emergency booming order to Kandla & Vadinar ports.' }
      ]
    }
  },

  // ========================================================
  // SCENARIO 3: Chennai / Ennore — Multi-Vessel Convergence
  // ========================================================
  {
    id: 'chennai-multi-vessel',
    title: 'Chennai / Ennore Multi-Vessel Traffic Convergence',
    regionId: 'chennai-ennore',
    badge: 'MULTI-VESSEL CORRELATION',
    description: 'Dense traffic scenario with 5 overlapping container, chemical, and bulk carriers in Kamarajar Port approaches. Algorithmic scoring accurately isolates discharging chemical tanker MT Bay Star.',
    incident: {
      id: 'INC-2026-CH-0318',
      title: 'Kamarajar Port Approach Heavy Fuel Oil Slick',
      regionId: 'chennai-ennore',
      status: 'ACTIVE',
      severity: 'HIGH',
      createdAt: '2026-09-15T05:00:00Z',
      updatedAt: '2026-09-15T07:30:00Z',
      scene: {
        id: 'S2A_MSIL2A_20260915T045021_N0500_R019_T44VNR_CH',
        sceneName: 'Sentinel-2A MSI Multi-Spectral Optical (Chennai Coast)',
        sensor: 'Sentinel-2 MSI',
        sensorType: 'OPTICAL',
        acquisitionTime: '2026-09-15T04:50:21Z',
        orbitPass: 'DESCENDING',
        pathRow: 'Relative Orbit R019 / Tile 44VNR',
        polarization: 'N/A',
        incidenceAngle: 8.5,
        resolutionMeters: 10.0,
        cloudCoveragePercent: 12.0,
        boundingBox: [[13.10, 80.20], [13.45, 80.55]],
        calibrated: true,
        speckleFiltered: true,
        terrainCorrected: true,
        processingState: 'PROCESSED'
      },
      detection: {
        id: 'DET-CH-0318-A',
        sceneId: 'S2A_MSIL2A_20260915T045021_N0500_R019_T44VNR_CH',
        incidentId: 'INC-2026-CH-0318',
        timestamp: '2026-09-15T05:15:00Z',
        polygon: [
          [13.295, 80.370],
          [13.310, 80.395],
          [13.305, 80.420],
          [13.285, 80.415],
          [13.275, 80.390],
          [13.280, 80.375],
          [13.295, 80.370]
        ],
        centroid: [13.292, 80.394],
        confidenceScore: 91.8,
        classification: 'MINERAL_OIL_SLICK',
        isConfirmedSlick: true,
        sarDampingRatioDb: 9.2,
        opticalContrastIndex: 0.69,
        modelArchitecture: 'Dual-Sensor U-Net + ResNet-50 SAR/EO Fusion',
        detectionNotes: 'Distinct sunglint contrast anomaly in Sentinel-2 Band 4/Band 8. Spectral signature matches heavy fuel oil sheen with rainbow margins.'
      },
      characterisation: {
        id: 'CHAR-CH-0318',
        incidentId: 'INC-2026-CH-0318',
        surfaceAreaKm2: 18.2,
        perimeterKm: 19.4,
        elongationRatio: 2.4,
        majorAxisKm: 5.1,
        minorAxisKm: 2.1,
        orientationDegrees: 35.0,
        estimatedVolumeM3: 650.0,
        spillAgeHours: 6.0,
        releaseWindowStart: '2026-09-14T22:00:00Z',
        releaseWindowEnd: '2026-09-14T23:30:00Z',
        weatheringPhysics: {
          oilType: 'Heavy Fuel Oil IFO-380',
          apiGravity: 15.2,
          initialViscosityCst: 380.0,
          currentViscosityCst: 890.0,
          evaporationPercent: 14.5,
          emulsificationPercent: 28.0,
          remainingMassPercent: 85.5,
          weatheringCurve: [
            { hour: 0, evaporationPercent: 0.0, viscosityCst: 380.0, emulsificationPercent: 0.0, remainingMassPercent: 100.0 },
            { hour: 3, evaporationPercent: 8.5, viscosityCst: 580.0, emulsificationPercent: 16.0, remainingMassPercent: 91.5 },
            { hour: 6, evaporationPercent: 14.5, viscosityCst: 890.0, emulsificationPercent: 28.0, remainingMassPercent: 85.5 }
          ]
        }
      },
      metocean: {
        windSpeedKnots: 9.8,
        windDirectionDegrees: 190.0, // S
        currentSpeedKnots: 1.1,
        currentDirectionDegrees: 25.0, // NNE
        seaTemperatureCelsius: 29.5,
        waveHeightMeters: 0.8,
        stokesDriftKnots: 0.2
      },
      hindcast: {
        incidentId: 'INC-2026-CH-0318',
        runTimestamp: '2026-09-15T05:35:00Z',
        modelEngine: 'OpenDrift Lagrangian Particle Engine (HYCOM + ECMWF)',
        backwardHorizonHours: 10,
        particlesSimulated: 400,
        probableOrigin: {
          coordinates: [13.235, 80.365],
          searchRadiusKm: 2.4,
          releaseTime: '2026-09-14T22:45:00Z',
          confidencePercent: 89.2,
          locationDescription: 'Kamarajar Port Southern Anchorage approach'
        },
        timeSteps: [
          {
            timestamp: '2026-09-15T04:50:00Z',
            hoursOffset: 0,
            meanPosition: [13.292, 80.394],
            uncertaintyRadiusKm: 0.7,
            particles: [[13.292, 80.394], [13.300, 80.405], [13.285, 80.385]]
          },
          {
            timestamp: '2026-09-14T22:45:00Z',
            hoursOffset: -6,
            meanPosition: [13.235, 80.365],
            uncertaintyRadiusKm: 2.4,
            particles: [[13.235, 80.365], [13.245, 80.375], [13.225, 80.355]]
          }
        ]
      },
      forecast: {
        incidentId: 'INC-2026-CH-0318',
        runTimestamp: '2026-09-15T05:50:00Z',
        forecastHorizonHours: 24,
        forecastSpreadPolygon: [
          [13.32, 80.41],
          [13.38, 80.44],
          [13.44, 80.46],
          [13.41, 80.41],
          [13.35, 80.38],
          [13.32, 80.41]
        ],
        landfallRisk: {
          threatensCoast: true,
          estimatedLandfallTime: '2026-09-16T08:00:00Z',
          vulnerableZone: 'Pulicat Lake Estuary Mouth (12 NM North)',
          riskLevel: 'HIGH',
          containmentPriority: 'Pre-position skimmer vessels and deflection barriers at Pulicat inlet channel.'
        },
        timeSteps: [
          {
            timestamp: '2026-09-15T12:00:00Z',
            hoursOffset: 7,
            meanPosition: [13.345, 80.418],
            uncertaintyRadiusKm: 1.5,
            particles: [[13.345, 80.418], [13.355, 80.428], [13.335, 80.408]]
          }
        ]
      },
      aisVessels: [
        {
          id: 'vessel-ch-01',
          name: 'MT BAY STAR',
          imo: '9420112',
          mmsi: '563048000',
          callSign: '9V812',
          flag: 'SG',
          flagCountry: 'Singapore',
          vesselType: 'CHEMICAL_TANKER',
          lengthMeters: 178,
          beamMeters: 28,
          draughtMeters: 9.4,
          grossTonnage: 24500,
          destination: 'KAMARAJAR ENNORE',
          eta: '2026-09-15T02:00:00Z',
          currentPosition: [13.25, 80.35],
          sogKnots: 0.1,
          cogDegrees: 45.0,
          headingDegrees: 44.0,
          navStatus: 'At Anchor',
          hasBlackout: false,
          trajectory: [
            { timestamp: '2026-09-14T21:30:00Z', position: [13.18, 80.34], sogKnots: 11.2, cogDegrees: 28.0, distanceToOriginKm: 6.8 },
            { timestamp: '2026-09-14T22:45:00Z', position: [13.238, 80.367], sogKnots: 9.8, cogDegrees: 25.0, distanceToOriginKm: 0.4 },
            { timestamp: '2026-09-15T01:15:00Z', position: [13.25, 80.35], sogKnots: 0.1, cogDegrees: 45.0, distanceToOriginKm: 2.1 }
          ]
        },
        {
          id: 'vessel-ch-02',
          name: 'MV COROMANDEL EXPRESS',
          imo: '9384910',
          mmsi: '419000840',
          callSign: 'AW88',
          flag: 'IN',
          flagCountry: 'India',
          vesselType: 'CONTAINER_SHIP',
          lengthMeters: 260,
          beamMeters: 32,
          draughtMeters: 11.2,
          grossTonnage: 38200,
          destination: 'CHENNAI PORT',
          eta: '2026-09-15T06:00:00Z',
          currentPosition: [13.12, 80.31],
          sogKnots: 8.2,
          cogDegrees: 210.0,
          headingDegrees: 210.0,
          navStatus: 'Underway using Engine',
          hasBlackout: false,
          trajectory: [
            { timestamp: '2026-09-14T22:45:00Z', position: [13.31, 80.42], sogKnots: 14.5, cogDegrees: 210.0, distanceToOriginKm: 10.2 }
          ]
        },
        {
          id: 'vessel-ch-03',
          name: 'MV VISHVA VIJAY',
          imo: '9512340',
          mmsi: '419000210',
          callSign: 'VTCB',
          flag: 'IN',
          flagCountry: 'India',
          vesselType: 'BULK_CARRIER',
          lengthMeters: 228,
          beamMeters: 32,
          draughtMeters: 13.5,
          grossTonnage: 44100,
          destination: 'VISAKHAPATNAM',
          eta: '2026-09-16T12:00:00Z',
          currentPosition: [13.45, 80.48],
          sogKnots: 12.1,
          cogDegrees: 25.0,
          headingDegrees: 25.0,
          navStatus: 'Underway using Engine',
          hasBlackout: false,
          trajectory: [
            { timestamp: '2026-09-14T22:45:00Z', position: [13.20, 80.32], sogKnots: 12.4, cogDegrees: 25.0, distanceToOriginKm: 6.2 }
          ]
        }
      ],
      suspects: [
        {
          rank: 1,
          vessel: {
            id: 'vessel-ch-01',
            name: 'MT BAY STAR',
            imo: '9420112',
            mmsi: '563048000',
            callSign: '9V812',
            flag: 'SG',
            flagCountry: 'Singapore',
            vesselType: 'CHEMICAL_TANKER',
            lengthMeters: 178,
            beamMeters: 28,
            draughtMeters: 9.4,
            grossTonnage: 24500,
            destination: 'KAMARAJAR ENNORE',
            eta: '2026-09-15T02:00:00Z',
            currentPosition: [13.25, 80.35],
            sogKnots: 0.1,
            cogDegrees: 45.0,
            headingDegrees: 44.0,
            navStatus: 'At Anchor',
            hasBlackout: false,
            trajectory: []
          },
          overallScore: 89.1,
          confidenceLevel: 'HIGH',
          evidenceFactors: [
            { category: 'PROXIMITY', name: 'Hindcast Origin Proximity', score: 29, maxScore: 30, description: 'Directly traversed origin point (0.4 km offset) during release window.' },
            { category: 'TRAJECTORY', name: 'Course-Slick Alignment', score: 18, maxScore: 20, description: 'Course 025° matches slick elongation axis (035°) within 10°.' },
            { category: 'TIMING', name: 'Weathering Temporal Match', score: 15, maxScore: 15, description: 'Crossing timestamp (22:45 UTC) coincides precisely with 6.0h Mackay age.' },
            { category: 'SPEED', name: 'Discharge Speed Compatibility', score: 14.1, maxScore: 15, description: 'Decelerating from 11.2 to 9.8 kts entering anchorage; matches slop discharge profile.' },
            { category: 'DRIFT_OVERLAP', name: 'Lagrangian Stream Collision', score: 13, maxScore: 20, description: '87% collision probability with backward simulated particles.' }
          ],
          legalAdmissibilityCaveat: 'Potential Responsible Vessel — Anchored at Kamarajar Outer Roads. Interception readily feasible.',
          recommendedAction: 'Dispatch ICG Pollution Response Team boarding party from Chennai Port to sample bilge slop tanks.'
        }
      ],
      alerts: [
        {
          id: 'ALT-CH-01',
          incidentId: 'INC-2026-CH-0318',
          title: 'Heavy Fuel Oil Slick Detected in Ennore Approaches',
          severity: 'HIGH',
          type: 'HIGH_CONFIDENCE',
          status: 'INVESTIGATING',
          timestamp: '2026-09-15T05:20:00Z',
          assignedAgency: 'PORT_AUTHORITY',
          description: 'Optical sunglint detection confirmed 18.2 km² slick in anchorage approach fairway.',
          history: [
            { status: 'NEW', timestamp: '2026-09-15T05:20:00Z', updatedBy: 'Sentinel-2 Ingestion', note: 'Optical feature segmented' },
            { status: 'INVESTIGATING', timestamp: '2026-09-15T05:45:00Z', updatedBy: 'Kamarajar Port Control', note: 'AIS correlation initiated' }
          ]
        }
      ],
      timeline: [
        { id: 'TL-CH-1', timestamp: '2026-09-15T04:50:21Z', stage: 'SATELLITE_ACQUISITION', title: 'Sentinel-2A Optical Capture', source: 'Copernicus Hub', confidence: 100, description: 'Acquired cloud-free optical imagery over Chennai seaboard.' },
        { id: 'TL-CH-2', timestamp: '2026-09-15T05:15:00Z', stage: 'SLICK_DETECTION', title: 'Heavy Fuel Oil Sheen Confirmed', source: 'Optical Contrast Detector', confidence: 91.8, description: 'Sunglint contrast ratio verified mineral oil layer.' },
        { id: 'TL-CH-3', timestamp: '2026-09-15T05:35:00Z', stage: 'HINDCAST_SIMULATION', title: 'Hindcast Maps Origin to Anchorage Channel', source: 'OpenDrift Engine', confidence: 89.2, description: 'Origin isolated 6 hours prior at 13.235°N, 80.365°E.' },
        { id: 'TL-CH-4', timestamp: '2026-09-15T05:48:00Z', stage: 'VESSEL_ATTRIBUTION', title: 'MT Bay Star Ranked #1 out of 5 Vessels', source: 'Attribution Engine', confidence: 89.1, description: 'Isolated suspect despite dense overlapping traffic.' }
      ]
    }
  },

  // ========================================================
  // SCENARIO 4: AIS Blackout / Dark Vessel Evasion Scenario
  // ========================================================
  {
    id: 'dark-ship-blackout',
    title: 'Offshore Gujarat AIS Blackout & Dark Ship Evasion',
    regionId: 'gulf-of-kutch',
    badge: 'DARK SHIP EVASION',
    description: 'Crude carrier deliberately turned off AIS transponder for 4.2 hours while transiting through EEZ fairway. Sentinel-1 SAR ship detection reflector correlates with spill origin.',
    incident: {
      id: 'INC-2026-DS-0412',
      title: 'Offshore Saurashtra Dark Vessel Illegal Discharge',
      regionId: 'gulf-of-kutch',
      status: 'ACTIVE',
      severity: 'CRITICAL',
      createdAt: '2026-09-15T02:00:00Z',
      updatedAt: '2026-09-15T06:00:00Z',
      scene: {
        id: 'S1A_IW_GRDH_1SDV_20260915T014510_049811_05E120_DS',
        sceneName: 'Sentinel-1A SAR Co-Polarized (Saurashtra Offshore)',
        sensor: 'Sentinel-1 C-SAR',
        sensorType: 'SAR',
        acquisitionTime: '2026-09-15T01:45:10Z',
        orbitPass: 'ASCENDING',
        pathRow: 'Pass 085 / Frame 210',
        polarization: 'VV+VH',
        incidenceAngle: 38.0,
        resolutionMeters: 10.0,
        cloudCoveragePercent: 85.0,
        boundingBox: [[21.50, 68.80], [22.10, 69.40]],
        calibrated: true,
        speckleFiltered: true,
        terrainCorrected: true,
        processingState: 'PROCESSED'
      },
      detection: {
        id: 'DET-DS-0412-A',
        sceneId: 'S1A_IW_GRDH_1SDV_20260915T014510_049811_05E120_DS',
        incidentId: 'INC-2026-DS-0412',
        timestamp: '2026-09-15T02:10:00Z',
        polygon: [
          [21.820, 69.050],
          [21.845, 69.080],
          [21.835, 69.115],
          [21.805, 69.110],
          [21.790, 69.075],
          [21.820, 69.050]
        ],
        centroid: [21.819, 69.086],
        confidenceScore: 97.4,
        classification: 'MINERAL_OIL_SLICK',
        isConfirmedSlick: true,
        sarDampingRatioDb: 12.2,
        opticalContrastIndex: 0.75,
        modelArchitecture: 'Dual-Sensor U-Net + ResNet-50 SAR/EO Fusion',
        detectionNotes: 'Massive linear dark streak indicative of operational discharge underway. Bright SAR point target detected 3.4 NM ahead of slick tail without corresponding AIS transponder signal.'
      },
      characterisation: {
        id: 'CHAR-DS-0412',
        incidentId: 'INC-2026-DS-0412',
        surfaceAreaKm2: 45.2,
        perimeterKm: 38.6,
        elongationRatio: 4.8,
        majorAxisKm: 12.4,
        minorAxisKm: 2.6,
        orientationDegrees: 48.0,
        estimatedVolumeM3: 1850.0,
        spillAgeHours: 18.0,
        releaseWindowStart: '2026-09-14T06:00:00Z',
        releaseWindowEnd: '2026-09-14T09:30:00Z',
        weatheringPhysics: {
          oilType: 'Heavy Iranian Soury Crude (API 29.2)',
          apiGravity: 29.2,
          initialViscosityCst: 52.0,
          currentViscosityCst: 420.0,
          evaporationPercent: 31.0,
          emulsificationPercent: 48.0,
          remainingMassPercent: 69.0,
          weatheringCurve: [
            { hour: 0, evaporationPercent: 0.0, viscosityCst: 52.0, emulsificationPercent: 0.0, remainingMassPercent: 100.0 },
            { hour: 6, evaporationPercent: 18.5, viscosityCst: 140.0, emulsificationPercent: 22.0, remainingMassPercent: 81.5 },
            { hour: 12, evaporationPercent: 26.2, viscosityCst: 290.0, emulsificationPercent: 38.0, remainingMassPercent: 73.8 },
            { hour: 18, evaporationPercent: 31.0, viscosityCst: 420.0, emulsificationPercent: 48.0, remainingMassPercent: 69.0 }
          ]
        }
      },
      metocean: {
        windSpeedKnots: 16.0,
        windDirectionDegrees: 230.0,
        currentSpeedKnots: 1.2,
        currentDirectionDegrees: 50.0,
        seaTemperatureCelsius: 28.2,
        waveHeightMeters: 1.6,
        stokesDriftKnots: 0.32
      },
      hindcast: {
        incidentId: 'INC-2026-DS-0412',
        runTimestamp: '2026-09-15T02:30:00Z',
        modelEngine: 'OpenDrift Lagrangian Particle Engine (HYCOM + ECMWF)',
        backwardHorizonHours: 20,
        particlesSimulated: 480,
        probableOrigin: {
          coordinates: [21.652, 68.895],
          searchRadiusKm: 3.5,
          releaseTime: '2026-09-14T07:45:00Z',
          confidencePercent: 94.2,
          locationDescription: 'Exclusive Economic Zone (EEZ) Deepwater Transit Fairway'
        },
        timeSteps: [
          {
            timestamp: '2026-09-15T01:45:00Z',
            hoursOffset: 0,
            meanPosition: [21.819, 69.086],
            uncertaintyRadiusKm: 0.8,
            particles: [[21.819, 69.086], [21.830, 69.100], [21.810, 69.070]]
          },
          {
            timestamp: '2026-09-14T07:45:00Z',
            hoursOffset: -18,
            meanPosition: [21.652, 68.895],
            uncertaintyRadiusKm: 3.5,
            particles: [[21.652, 68.895], [21.668, 68.915], [21.635, 68.875]]
          }
        ]
      },
      forecast: {
        incidentId: 'INC-2026-DS-0412',
        runTimestamp: '2026-09-15T02:45:00Z',
        forecastHorizonHours: 36,
        forecastSpreadPolygon: [
          [21.85, 69.12],
          [21.92, 69.25],
          [21.98, 69.38],
          [21.90, 69.35],
          [21.82, 69.20],
          [21.85, 69.12]
        ],
        landfallRisk: {
          threatensCoast: false,
          riskLevel: 'MEDIUM',
          vulnerableZone: 'Mid-Sea Fisheries Corridor',
          containmentPriority: 'Aerial dispersant spraying coordinated with Indian Navy Dornier PR squadron.'
        },
        timeSteps: []
      },
      aisVessels: [
        {
          id: 'vessel-ds-01',
          name: 'MT SHADOW TRADER (FLAGGED EVASION)',
          imo: '9285040',
          mmsi: '677014200',
          callSign: '5LEB4',
          flag: 'TZ',
          flagCountry: 'Tanzania',
          vesselType: 'CRUDE_OIL_TANKER',
          lengthMeters: 244,
          beamMeters: 42,
          draughtMeters: 14.8,
          grossTonnage: 62400,
          destination: 'HIGH SEAS / ORDERS',
          eta: '2026-09-18T00:00:00Z',
          currentPosition: [22.05, 69.35],
          sogKnots: 13.6,
          cogDegrees: 48.0,
          headingDegrees: 48.0,
          navStatus: 'Underway using Engine',
          hasBlackout: true,
          blackoutAnomaly: {
            startTime: '2026-09-14T05:30:00Z',
            endTime: '2026-09-14T09:42:00Z',
            durationHours: 4.2,
            lastReportedPos: [21.520, 68.740],
            nextReportedPos: [21.780, 69.040],
            distanceTraveledKm: 58.4,
            estimatedAverageSpeedKnots: 13.9,
            coincidesWithOriginZone: true
          },
          trajectory: [
            { timestamp: '2026-09-14T05:25:00Z', position: [21.515, 68.735], sogKnots: 14.0, cogDegrees: 48.0, distanceToOriginKm: 22.4 },
            // AIS Blackout: Interpolated origin transit
            { timestamp: '2026-09-14T07:45:00Z', position: [21.650, 68.892], sogKnots: 13.9, cogDegrees: 48.0, distanceToOriginKm: 0.3 },
            { timestamp: '2026-09-14T09:45:00Z', position: [21.785, 69.045], sogKnots: 13.8, cogDegrees: 48.0, distanceToOriginKm: 21.2 }
          ]
        }
      ],
      suspects: [
        {
          rank: 1,
          vessel: {
            id: 'vessel-ds-01',
            name: 'MT SHADOW TRADER (FLAGGED EVASION)',
            imo: '9285040',
            mmsi: '677014200',
            callSign: '5LEB4',
            flag: 'TZ',
            flagCountry: 'Tanzania',
            vesselType: 'CRUDE_OIL_TANKER',
            lengthMeters: 244,
            beamMeters: 42,
            draughtMeters: 14.8,
            grossTonnage: 62400,
            destination: 'HIGH SEAS / ORDERS',
            eta: '2026-09-18T00:00:00Z',
            currentPosition: [22.05, 69.35],
            sogKnots: 13.6,
            cogDegrees: 48.0,
            headingDegrees: 48.0,
            navStatus: 'Underway using Engine',
            hasBlackout: true,
            blackoutAnomaly: {
              startTime: '2026-09-14T05:30:00Z',
              endTime: '2026-09-14T09:42:00Z',
              durationHours: 4.2,
              lastReportedPos: [21.520, 68.740],
              nextReportedPos: [21.780, 69.040],
              distanceTraveledKm: 58.4,
              estimatedAverageSpeedKnots: 13.9,
              coincidesWithOriginZone: true
            },
            trajectory: []
          },
          overallScore: 96.8,
          confidenceLevel: 'HIGH',
          evidenceFactors: [
            { category: 'AIS_ANOMALY', name: 'Deliberate AIS Blackout Gap', score: 20, maxScore: 20, description: '4.2-hour blackout directly enveloping origin time; transponder disabled to evade detection.' },
            { category: 'PROXIMITY', name: 'Dead-Reckoning Origin Intersection', score: 30, maxScore: 30, description: 'Interpolated dead-reckoning trajectory crosses within 0.3 km of release centroid.' },
            { category: 'TRAJECTORY', name: 'Corridor Alignment', score: 19, maxScore: 20, description: 'Transit course 048° exactly matches slick linear streak angle.' },
            { category: 'TIMING', name: 'Weathering Temporal Match', score: 15, maxScore: 15, description: '18h Mackay weathering aligns with transit midpoint at 07:45 UTC.' },
            { category: 'SPEED', name: 'Speed Consistency', score: 12.8, maxScore: 15, description: 'Consistent 13.9 kt speed indicates underway discharge without stopping.' }
          ],
          legalAdmissibilityCaveat: 'HIGH-PRIORITY EVASION: SOLAS Chapter V AIS violation combined with MARPOL Annex I discharge. Court-admissible evidence package prepared.',
          recommendedAction: 'Issue immediate interception warrant to Indian Navy and Coast Guard for maritime boarding in EEZ.'
        }
      ],
      alerts: [
        {
          id: 'ALT-DS-01',
          incidentId: 'INC-2026-DS-0412',
          title: 'DARK SHIP EVASION ALERT: MT SHADOW TRADER',
          severity: 'CRITICAL',
          type: 'AIS_BLACKOUT',
          status: 'ESCALATED',
          timestamp: '2026-09-15T02:50:00Z',
          assignedAgency: 'NAVY',
          description: 'Vessel switched off AIS for 4.2 hours while discharging 1,850 m³ crude in Saurashtra transit lane.',
          history: [
            { status: 'NEW', timestamp: '2026-09-15T02:50:00Z', updatedBy: 'Anomaly Detector', note: 'Blackout gap detected' },
            { status: 'ESCALATED', timestamp: '2026-09-15T03:15:00Z', updatedBy: 'Maritime Domain Awareness Desk', note: 'Forwarded to Western Naval Command' }
          ]
        }
      ],
      timeline: [
        { id: 'TL-DS-1', timestamp: '2026-09-15T01:45:10Z', stage: 'SATELLITE_ACQUISITION', title: 'Sentinel-1A SAR Ingestion', source: 'Sentinel Hub', confidence: 100, description: 'SAR pass detects linear oil trail in offshore fairway.' },
        { id: 'TL-DS-2', timestamp: '2026-09-15T02:10:00Z', stage: 'SLICK_DETECTION', title: 'Operational Discharge Slick Identified', source: 'U-Net Model', confidence: 97.4, description: '12.2 dB attenuation along 12.4 km trajectory.' },
        { id: 'TL-DS-3', timestamp: '2026-09-15T02:30:00Z', stage: 'HINDCAST_SIMULATION', title: 'Backward Particle Simulation Completed', source: 'OpenDrift', confidence: 94.2, description: 'Origin isolated at 21.652°N, 68.895°E (18h prior).' },
        { id: 'TL-DS-4', timestamp: '2026-09-15T02:45:00Z', stage: 'AIS_CORRELATION', title: 'AIS Blackout Identified on Dark Tanker', source: 'AIS Anomaly Engine', confidence: 98.0, description: 'Uncovered 4.2h transponder gap matching origin crossing.' },
        { id: 'TL-DS-5', timestamp: '2026-09-15T03:00:00Z', stage: 'VESSEL_ATTRIBUTION', title: 'MT Shadow Trader Attributed (96.8% Score)', source: 'Attribution Engine', confidence: 96.8, description: 'Evidence dossier dispatched for naval interception.' }
      ]
    }
  },

  // ========================================================
  // SCENARIO 5: Look-Alike False Positive (Algal Bloom)
  // ========================================================
  {
    id: 'lookalike-algal-bloom',
    title: 'Offshore Biogenic Algal Bloom Look-Alike Rejection',
    regionId: 'mumbai-high',
    badge: 'LOOK-ALIKE REJECTED',
    description: 'Sentinel-1 SAR detected dark spot caused by natural algal bloom / biogenic surfactant. Dual-sensor optical Sentinel-2 reflectance rejects mineral oil classification, preventing costly false alarms.',
    incident: {
      id: 'INC-2026-LA-0501',
      title: 'Arabian Sea Biogenic Bloom — False Positive Screened',
      regionId: 'mumbai-high',
      status: 'RESOLVED',
      severity: 'LOW',
      createdAt: '2026-09-15T07:00:00Z',
      updatedAt: '2026-09-15T07:25:00Z',
      scene: {
        id: 'S1A_IW_GRDH_1SDV_20260915T063000_048999_05D900_BIO',
        sceneName: 'Sentinel-1A SAR + Sentinel-2 MSI Multi-Sensor Pair',
        sensor: 'Sentinel-1 C-SAR',
        sensorType: 'SAR',
        acquisitionTime: '2026-09-15T06:30:00Z',
        orbitPass: 'DESCENDING',
        pathRow: 'Pass 128 / Frame 495',
        polarization: 'VV+VH',
        incidenceAngle: 34.2,
        resolutionMeters: 10.0,
        cloudCoveragePercent: 5.0,
        boundingBox: [[19.00, 71.00], [19.40, 71.40]],
        calibrated: true,
        speckleFiltered: true,
        terrainCorrected: true,
        processingState: 'PROCESSED'
      },
      detection: {
        id: 'DET-LA-0501-A',
        sceneId: 'S1A_IW_GRDH_1SDV_20260915T063000_048999_05D900_BIO',
        incidentId: 'INC-2026-LA-0501',
        timestamp: '2026-09-15T07:10:00Z',
        polygon: [
          [19.18, 71.22],
          [19.24, 71.26],
          [19.22, 71.32],
          [19.15, 71.30],
          [19.14, 71.24],
          [19.18, 71.22]
        ],
        centroid: [19.186, 71.268],
        confidenceScore: 22.4, // Low confidence for mineral oil
        classification: 'ALGAL_BLOOM',
        isConfirmedSlick: false,
        sarDampingRatioDb: 4.8, // Low damping (< 8.5 dB)
        opticalContrastIndex: -0.45, // Chlorophyll-a absorption peak
        modelArchitecture: 'Dual-Sensor U-Net + ResNet-50 SAR/EO Fusion',
        detectionNotes: 'FEATURE CLASSIFIED AS LOOK-ALIKE: Damping ratio of 4.8 dB is below the 8.5 dB mineral oil threshold. Sentinel-2 Band 5/Band 8 reflection displays distinct chlorophyll-a and biogenic film characteristics. Zero mineral hydrocarbon indicators.'
      },
      characterisation: {
        id: 'CHAR-LA-0501',
        incidentId: 'INC-2026-LA-0501',
        surfaceAreaKm2: 14.8,
        perimeterKm: 18.2,
        elongationRatio: 1.4,
        majorAxisKm: 4.2,
        minorAxisKm: 3.0,
        orientationDegrees: 12.0,
        estimatedVolumeM3: 0.0,
        spillAgeHours: 0.0,
        releaseWindowStart: '2026-09-15T00:00:00Z',
        releaseWindowEnd: '2026-09-15T00:00:00Z',
        weatheringPhysics: {
          oilType: 'Biogenic Surfactant (No Mineral Hydrocarbons)',
          apiGravity: 0.0,
          initialViscosityCst: 1.0,
          currentViscosityCst: 1.0,
          evaporationPercent: 0.0,
          emulsificationPercent: 0.0,
          remainingMassPercent: 100.0,
          weatheringCurve: []
        }
      },
      metocean: {
        windSpeedKnots: 4.2, // Calm wind condition facilitating biogenic slick
        windDirectionDegrees: 180.0,
        currentSpeedKnots: 0.4,
        currentDirectionDegrees: 40.0,
        seaTemperatureCelsius: 29.8,
        waveHeightMeters: 0.3,
        stokesDriftKnots: 0.08
      },
      hindcast: {
        incidentId: 'INC-2026-LA-0501',
        runTimestamp: '2026-09-15T07:15:00Z',
        modelEngine: 'OpenDrift Lagrangian Particle Engine (HYCOM + ECMWF)',
        backwardHorizonHours: 0,
        particlesSimulated: 0,
        probableOrigin: {
          coordinates: [19.186, 71.268],
          searchRadiusKm: 0.0,
          releaseTime: 'N/A',
          confidencePercent: 0.0,
          locationDescription: 'Natural biological feature — No release origin.'
        },
        timeSteps: []
      },
      forecast: {
        incidentId: 'INC-2026-LA-0501',
        runTimestamp: '2026-09-15T07:15:00Z',
        forecastHorizonHours: 0,
        forecastSpreadPolygon: [],
        landfallRisk: {
          threatensCoast: false,
          riskLevel: 'LOW',
          vulnerableZone: 'None',
          containmentPriority: 'No containment required. Natural biological occurrence.'
        },
        timeSteps: []
      },
      aisVessels: [],
      suspects: [],
      alerts: [
        {
          id: 'ALT-LA-01',
          incidentId: 'INC-2026-LA-0501',
          title: 'SAR Dark Spot Screened: Confirmed Natural Algal Bloom',
          severity: 'LOW',
          type: 'NEW_SPILL',
          status: 'RESOLVED',
          timestamp: '2026-09-15T07:12:00Z',
          assignedAgency: 'COAST_GUARD',
          description: 'Dual-sensor optical validation successfully prevented false alarm. No patrol sortie required.',
          history: [
            { status: 'NEW', timestamp: '2026-09-15T07:10:00Z', updatedBy: 'SAR Ingestion', note: 'Dark spot flagged' },
            { status: 'RESOLVED', timestamp: '2026-09-15T07:12:00Z', updatedBy: 'Dual-Sensor Discriminator', note: 'Classified as ALGAL_BLOOM (optical index -0.45). False positive dismissed.' }
          ]
        }
      ],
      timeline: [
        { id: 'TL-LA-1', timestamp: '2026-09-15T06:30:00Z', stage: 'SATELLITE_ACQUISITION', title: 'Sentinel-1A SAR Dark Spot Detected', source: 'Copernicus Hub', confidence: 100, description: '14.8 km² low backscatter area flagged.' },
        { id: 'TL-LA-2', timestamp: '2026-09-15T07:10:00Z', stage: 'SLICK_DETECTION', title: 'Dual-Sensor Optical Cross-Validation', source: 'Dual-Sensor Classifier', confidence: 98.5, description: 'Damping 4.8 dB < 8.5 dB threshold. Optical SWIR/NIR reveals chlorophyll peak.' },
        { id: 'TL-LA-3', timestamp: '2026-09-15T07:12:00Z', stage: 'AUTHORITY_ALERT', title: 'Look-Alike Resolved — False Alarm Avoided', source: 'Alert Engine', confidence: 100, description: 'Logged as biogenic feature; saved Coast Guard sortie costs.' }
      ]
    }
  }
]

// Canonical normalization: Ensure all suspects in all demo scenarios link to their full AIS trajectories
for (const scenario of DEMO_SCENARIOS) {
  for (const suspect of scenario.incident.suspects) {
    if (!suspect.vessel.trajectory || suspect.vessel.trajectory.length === 0) {
      const match = scenario.incident.aisVessels?.find(
        (v) => v.id === suspect.vessel.id || v.mmsi === suspect.vessel.mmsi
      )
      if (match && match.trajectory && match.trajectory.length > 0) {
        suspect.vessel.trajectory = match.trajectory
      }
    }
  }
}
