// SAGAR RAKSHAK Core Domain Types (SIH26143 - Team Calculus)

export type AgencyRole = 
  | 'COAST_GUARD'
  | 'NAVY'
  | 'MOEFCC'
  | 'DG_SHIPPING'
  | 'PORT_AUTHORITY'
  | 'INSURER';

export type PilotRegionId = 'mumbai-high' | 'gulf-of-kutch' | 'chennai-ennore';

export interface PilotRegion {
  id: PilotRegionId;
  name: string;
  state: string;
  description: string;
  center: [number, number]; // [lat, lon]
  zoom: number;
  trafficDensity: 'EXTREME' | 'HIGH' | 'MODERATE';
  sensitiveZones: {
    name: string;
    type: 'CORAL_REEF' | 'MANGROVE' | 'MARINE_PARK' | 'SPM_TERMINAL' | 'PORT_CHANNEL';
    coordinates: [number, number];
    radiusKm: number;
  }[];
}

export type SensorType = 'SAR' | 'OPTICAL';

export interface SatelliteScene {
  id: string;
  sceneName: string;
  sensor: 'Sentinel-1 C-SAR' | 'Sentinel-2 MSI' | 'Resourcesat-2 LISS-IV';
  sensorType: SensorType;
  acquisitionTime: string; // ISO 8601
  orbitPass: 'ASCENDING' | 'DESCENDING';
  pathRow: string;
  polarization: 'VV+VH' | 'VV' | 'N/A';
  incidenceAngle: number; // degrees
  resolutionMeters: number;
  cloudCoveragePercent: number;
  boundingBox: [[number, number], [number, number]]; // [[sw_lat, sw_lon], [ne_lat, ne_lon]]
  calibrated: boolean;
  speckleFiltered: boolean;
  terrainCorrected: boolean;
  processingState: 'IDLE' | 'PREPROCESSING' | 'READY_FOR_DETECTION' | 'PROCESSED';
}

export type LookAlikeType = 
  | 'MINERAL_OIL_SLICK'
  | 'ALGAL_BLOOM'
  | 'BIOGENIC_FILM'
  | 'WIND_SHADOW'
  | 'RAIN_CELL';

export interface SlickDetection {
  id: string;
  sceneId: string;
  incidentId: string;
  timestamp: string;
  polygon: [number, number][]; // [lat, lon] closed ring
  centroid: [number, number];
  confidenceScore: number; // 0-100%
  classification: LookAlikeType;
  isConfirmedSlick: boolean;
  sarDampingRatioDb: number; // e.g., 9.8 dB (oil > 8.5 dB)
  opticalContrastIndex: number; // -1 to 1 (SWIR/NIR ratio)
  modelArchitecture: string; // "U-Net + ResNet-50 SAR-Optical Fusion"
  detectionNotes: string;
}

export interface WeatheringDataPoint {
  hour: number;
  evaporationPercent: number;
  viscosityCst: number;
  emulsificationPercent: number;
  remainingMassPercent: number;
}

export interface SpillCharacterisation {
  id: string;
  incidentId: string;
  surfaceAreaKm2: number;
  perimeterKm: number;
  elongationRatio: number; // major/minor axis ratio
  majorAxisKm: number;
  minorAxisKm: number;
  orientationDegrees: number; // angle with true north
  estimatedVolumeM3: number;
  spillAgeHours: number; // e.g. 14.2 hours
  releaseWindowStart: string; // ISO
  releaseWindowEnd: string; // ISO
  weatheringPhysics: {
    oilType: string;
    apiGravity: number;
    initialViscosityCst: number;
    currentViscosityCst: number;
    evaporationPercent: number;
    emulsificationPercent: number;
    remainingMassPercent: number;
    weatheringCurve: WeatheringDataPoint[];
  };
}

export interface MetoceanConditions {
  windSpeedKnots: number;
  windDirectionDegrees: number; // blowing towards
  currentSpeedKnots: number;
  currentDirectionDegrees: number;
  seaTemperatureCelsius: number;
  waveHeightMeters: number;
  stokesDriftKnots: number;
}

export interface LagrangianTimeStep {
  timestamp: string;
  hoursOffset: number; // negative for hindcast, positive for forecast
  particles: [number, number][]; // [lat, lon]
  meanPosition: [number, number];
  uncertaintyRadiusKm: number;
}

export interface DriftHindcast {
  incidentId: string;
  runTimestamp: string;
  modelEngine: 'OpenDrift Lagrangian Particle Engine (HYCOM + ECMWF)';
  backwardHorizonHours: number; // e.g. 24h
  particlesSimulated: number;
  timeSteps: LagrangianTimeStep[];
  probableOrigin: {
    coordinates: [number, number]; // [lat, lon]
    searchRadiusKm: number;
    releaseTime: string; // estimated release timestamp
    confidencePercent: number;
    locationDescription: string;
  };
}

export interface DriftForecast {
  incidentId: string;
  runTimestamp: string;
  forecastHorizonHours: number; // e.g. 48h
  timeSteps: LagrangianTimeStep[];
  forecastSpreadPolygon: [number, number][]; // envelope at max horizon
  landfallRisk: {
    threatensCoast: boolean;
    estimatedLandfallTime?: string;
    vulnerableZone?: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    containmentPriority: string;
  };
}

export type VesselType = 
  | 'CRUDE_OIL_TANKER'
  | 'CHEMICAL_TANKER'
  | 'BULK_CARRIER'
  | 'CONTAINER_SHIP'
  | 'GENERAL_CARGO'
  | 'OFFSHORE_TUG';

export interface AISTrajectoryPoint {
  timestamp: string;
  position: [number, number];
  sogKnots: number;
  cogDegrees: number;
  distanceToOriginKm: number;
}

export interface AISBlackoutAnomaly {
  startTime: string;
  endTime: string;
  durationHours: number;
  lastReportedPos: [number, number];
  nextReportedPos: [number, number];
  distanceTraveledKm: number;
  estimatedAverageSpeedKnots: number;
  coincidesWithOriginZone: boolean;
}

export interface AISVessel {
  id: string;
  name: string;
  imo: string;
  mmsi: string;
  callSign: string;
  flag: string; // ISO 2-letter
  flagCountry: string;
  vesselType: VesselType;
  lengthMeters: number;
  beamMeters: number;
  draughtMeters: number;
  grossTonnage: number;
  deadweightTons?: number;
  destination: string;
  eta: string;
  currentPosition: [number, number];
  sogKnots: number;
  cogDegrees: number;
  headingDegrees: number;
  navStatus: string;
  trajectory: AISTrajectoryPoint[];
  hasBlackout: boolean;
  blackoutAnomaly?: AISBlackoutAnomaly;
  blackoutDurationMin?: number;
}

export interface EvidenceFactor {
  category: 'PROXIMITY' | 'TRAJECTORY' | 'SPEED' | 'TIMING' | 'DRIFT_OVERLAP' | 'AIS_ANOMALY';
  name: string;
  score: number; // points awarded
  maxScore: number;
  description: string;
}

export interface SuspectRanking {
  rank: number;
  vessel: AISVessel;
  overallScore: number; // 0-100
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  evidenceFactors: EvidenceFactor[];
  legalAdmissibilityCaveat: string;
  recommendedAction: string;
  cpaDistanceNm?: number;
  cpaTimeDeltaMin?: number;
}

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertType = 
  | 'NEW_SPILL'
  | 'HIGH_CONFIDENCE'
  | 'SENSITIVE_ZONE_THREAT'
  | 'VESSEL_SUSPECT'
  | 'AIS_BLACKOUT';
export type AlertStatus = 'NEW' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'ESCALATED' | 'RESOLVED';

export interface Alert {
  id: string;
  incidentId: string;
  title: string;
  severity: AlertSeverity;
  type: AlertType;
  status: AlertStatus;
  timestamp: string;
  assignedAgency: AgencyRole;
  description: string;
  actionTaken?: string;
  history: {
    status: AlertStatus;
    timestamp: string;
    updatedBy: string;
    note: string;
  }[];
}

export interface EvidenceTimelineEvent {
  id: string;
  timestamp: string;
  stage: 
    | 'SATELLITE_ACQUISITION'
    | 'PREPROCESSING'
    | 'SLICK_DETECTION'
    | 'CHARACTERISATION'
    | 'AGE_ESTIMATION'
    | 'HINDCAST_SIMULATION'
    | 'FORECAST_SIMULATION'
    | 'AIS_CORRELATION'
    | 'VESSEL_ATTRIBUTION'
    | 'AUTHORITY_ALERT'
    | 'EVIDENCE_DOSSIER';
  title: string;
  source: string;
  confidence: number;
  description: string;
}

export interface EvidenceReport {
  reportId: string;
  incidentId: string;
  generatedAt: string;
  generatedBy: string;
  legalClassification: string;
  region: PilotRegion;
  satelliteData: {
    sensor: string;
    sceneId: string;
    acquisitionTime: string;
    orbitPass: string;
    dampingRatioDb: number;
  };
  slickData: {
    coordinates: [number, number];
    surfaceAreaKm2: number;
    estimatedVolumeM3: number;
    estimatedAgeHours: number;
    releaseWindow: string;
  };
  hindcastData: {
    probableOrigin: [number, number];
    searchRadiusKm: number;
    driftParticles: number;
  };
  forecastData: {
    landfallRisk: string;
    threatenedEcosystem: string;
  };
  primarySuspect: SuspectRanking;
  fullSuspectList: SuspectRanking[];
  correlatedVesselsCount: number;
  chainOfCustody: {
    timestamp: string;
    action: string;
    officer: string;
  }[];
  sha256Digest?: string;
}

export interface Incident {
  id: string;
  title: string;
  regionId: PilotRegionId;
  status: 'ACTIVE' | 'CONTAINED' | 'UNDER_INVESTIGATION' | 'RESOLVED';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
  updatedAt: string;
  scene: SatelliteScene;
  detection: SlickDetection;
  characterisation: SpillCharacterisation;
  metocean: MetoceanConditions;
  hindcast: DriftHindcast;
  forecast: DriftForecast;
  aisVessels: AISVessel[];
  suspects: SuspectRanking[];
  alerts: Alert[];
  timeline: EvidenceTimelineEvent[];
}

export interface DemoScenario {
  id: string;
  title: string;
  regionId: PilotRegionId;
  badge: string;
  description: string;
  incident: Incident;
}
