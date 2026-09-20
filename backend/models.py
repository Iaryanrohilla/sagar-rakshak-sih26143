"""
Pydantic Domain Models & PostGIS Schemas for SAGAR RAKSHAK Backend
"""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class Coordinates(BaseModel):
    lat: float
    lng: float

class PilotRegion(BaseModel):
    id: str
    name: str
    state: str
    description: str
    center: List[float] # [lat, lng]
    zoom: int
    trafficDensity: str
    sensitiveZones: List[Dict[str, Any]]

class MetoceanConditions(BaseModel):
    windSpeedKnots: float
    windDirectionDeg: float
    currentSpeedKnots: float
    currentDirectionDeg: float
    seaSurfaceTempC: float
    waveHeightMeters: float
    tideState: str

class SatelliteSceneMetadata(BaseModel):
    sceneId: str
    satellite: str
    sensorType: str
    acquisitionTime: str
    orbitDirection: str
    polarization: str
    footprint: List[List[float]]
    resolutionMeters: float
    isSimulated: bool = True

class SlickGeometry(BaseModel):
    areaSqKm: float
    perimeterKm: float
    elongationRatio: float
    majorAxisKm: float
    minorAxisKm: float
    estimatedVolumeM3: float
    thicknessMm: float

class WeatheringKinetics(BaseModel):
    estimatedAgeHours: float
    releaseTimestamp: str
    evaporatedPercentage: float
    emulsifiedPercentage: float
    waterInOilContent: float
    viscosityCSt: float
    dispersantSuitabilityWindowHours: float

class DriftParticle(BaseModel):
    lat: float
    lng: float
    uncertaintyKm: float

class DriftStep(BaseModel):
    stepIndex: int
    hourOffset: float
    timestamp: str
    centroid: List[float]
    particleCount: int
    spreadRadiusKm: float

class DriftSimulation(BaseModel):
    simulationType: str # "HINDCAST" | "FORECAST"
    steps: List[DriftStep]
    originZone: Optional[Dict[str, Any]] = None
    landfallThreats: Optional[List[Dict[str, Any]]] = None

class AISVessel(BaseModel):
    mmsi: str
    name: str
    imo: Optional[str] = None
    vesselType: str
    flagCountry: str
    callsign: str
    draughtMeters: float
    deadweightTonnage: int
    trackPoints: List[Dict[str, Any]]

class SuspectAttribution(BaseModel):
    rank: int
    vessel: AISVessel
    attributionScore: float
    severityLevel: str # "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
    cpaNauticalMiles: float
    timeDeltaHours: float
    blackoutDurationHours: float
    headingDeviationDeg: float
    speedAnomalyKnots: float
    drivingFactors: List[str]
    factorWeights: Dict[str, float]
    factorScores: Dict[str, float]
    interceptVector: Optional[List[List[float]]] = None

class IncidentAlert(BaseModel):
    id: str
    incidentId: str
    title: str
    agency: str
    severity: str
    status: str
    timestamp: str
    dispatchedUnits: List[str]
    actionRequired: str

class IncidentDetail(BaseModel):
    id: str
    regionId: str
    title: str
    detectionTime: str
    status: str
    severity: str
    centroid: List[float]
    slickPolygon: List[List[float]]
    metocean: MetoceanConditions
    satellite: SatelliteSceneMetadata
    geometry: SlickGeometry
    weathering: WeatheringKinetics
    hindcast: DriftSimulation
    forecast: DriftSimulation
    suspects: List[SuspectAttribution]
    alerts: List[IncidentAlert]
    isSimulated: bool = True

class MarpolDossier(BaseModel):
    dossierId: str
    caseFileNumber: str
    incidentId: str
    generatedAt: str
    sha256Digest: str
    securityClassification: str
    signOffAuthority: str
    incidentSummary: Dict[str, Any]
    weatheringSummary: Dict[str, Any]
    driftSummary: Dict[str, Any]
    accusedVessel: SuspectAttribution
    statutoryViolations: List[Dict[str, str]]
    recommendedSanctions: List[str]
    isSimulated: bool = True
