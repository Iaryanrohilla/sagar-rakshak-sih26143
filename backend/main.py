"""
SAGAR RAKSHAK // FastAPI Maritime Intelligence Microservice
PS 26143 / NTRO / Space Technology / SIH 2026
"""
import hashlib
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from backend.models import (
        PilotRegion,
        IncidentDetail,
        DriftSimulation,
        SuspectAttribution,
        IncidentAlert,
        MarpolDossier
    )
    from backend.scenarios_data import PILOT_REGIONS, INCIDENTS
except ImportError:
    from models import (
        PilotRegion,
        IncidentDetail,
        DriftSimulation,
        SuspectAttribution,
        IncidentAlert,
        MarpolDossier
    )
    from scenarios_data import PILOT_REGIONS, INCIDENTS

app = FastAPI(
    title="SAGAR RAKSHAK API",
    description="Maritime Oil-Spill Satellite Intelligence, Lagrangian Drift & Vessel Attribution REST API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health", tags=["System"])
def get_health() -> Dict[str, Any]:
    """Health check endpoint indicating service operational readiness."""
    return {
        "status": "ONLINE",
        "service": "SAGAR RAKSHAK C4I Intelligence Engine",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0",
        "simulationMode": "SIMULATED",
        "activePilotRegions": list(PILOT_REGIONS.keys())
    }

@app.get("/api/v1/regions", response_model=List[PilotRegion], tags=["Geospatial"])
def list_pilot_regions() -> List[Dict[str, Any]]:
    """List all configured high-traffic pilot demonstration regions."""
    return list(PILOT_REGIONS.values())

@app.get("/api/v1/regions/{region_id}", response_model=PilotRegion, tags=["Geospatial"])
def get_pilot_region(region_id: str) -> Dict[str, Any]:
    """Retrieve metadata and sensitive coastal biomes for a specific pilot region."""
    if region_id not in PILOT_REGIONS:
        raise HTTPException(status_code=404, detail=f"Pilot region '{region_id}' not found.")
    return PILOT_REGIONS[region_id]

@app.get("/api/v1/incidents", response_model=List[IncidentDetail], tags=["Incidents"])
def list_incidents(region_id: Optional[str] = Query(None, description="Filter incidents by pilot region")) -> List[Dict[str, Any]]:
    """List all active satellite oil spill incidents."""
    incidents = list(INCIDENTS.values())
    if region_id:
        incidents = [inc for inc in incidents if inc["regionId"] == region_id]
    return incidents

@app.get("/api/v1/incidents/{incident_id}", response_model=IncidentDetail, tags=["Incidents"])
def get_incident(incident_id: str) -> Dict[str, Any]:
    """Retrieve full incident telemetry, morphology, and weathering profile."""
    if incident_id not in INCIDENTS:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found.")
    return INCIDENTS[incident_id]

@app.get("/api/v1/incidents/{incident_id}/detections", tags=["Detections"])
def get_incident_detections(incident_id: str) -> Dict[str, Any]:
    """Retrieve dual-sensor SAR and Optical satellite detection layers for an incident."""
    if incident_id not in INCIDENTS:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found.")
    inc = INCIDENTS[incident_id]
    return {
        "incidentId": incident_id,
        "satellite": inc["satellite"],
        "slickPolygon": inc["slickPolygon"],
        "geometry": inc["geometry"],
        "lookAlikeRejection": {
            "algalBloom": {"status": "REJECTED", "confidence": 0.98},
            "biogenicSlick": {"status": "REJECTED", "confidence": 0.91},
            "lowWindShadow": {"status": "REJECTED", "confidence": 0.99}
        },
        "isSimulated": True
    }

@app.post("/api/v1/incidents/{incident_id}/drift/hindcast", response_model=DriftSimulation, tags=["Drift Engine"])
def run_drift_hindcast(incident_id: str, hours: float = Body(18.4, embed=True)) -> Dict[str, Any]:
    """Execute backward Lagrangian drift hindcast to compute the Probable Spill Origin Zone."""
    if incident_id not in INCIDENTS:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found.")
    return INCIDENTS[incident_id]["hindcast"]

@app.post("/api/v1/incidents/{incident_id}/drift/forecast", response_model=DriftSimulation, tags=["Drift Engine"])
def run_drift_forecast(incident_id: str, hours: float = Body(48.0, embed=True)) -> Dict[str, Any]:
    """Execute forward Lagrangian drift simulation projecting 24h/48h landfall trajectory."""
    if incident_id not in INCIDENTS:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found.")
    return INCIDENTS[incident_id]["forecast"]

@app.get("/api/v1/incidents/{incident_id}/vessels", tags=["AIS Maritime"])
def get_incident_vessels(incident_id: str) -> List[Dict[str, Any]]:
    """Retrieve all commercial and tanker vessels correlated in the origin space-time window."""
    if incident_id not in INCIDENTS:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found.")
    return [s["vessel"] for s in INCIDENTS[incident_id]["suspects"]]

@app.get("/api/v1/incidents/{incident_id}/suspects", response_model=List[SuspectAttribution], tags=["Attribution"])
def get_ranked_suspects(incident_id: str) -> List[Dict[str, Any]]:
    """Retrieve ranked suspect vessel leaderboard with 5-factor Bayesian attribution scores."""
    if incident_id not in INCIDENTS:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found.")
    return INCIDENTS[incident_id]["suspects"]

class DispatchAlertPayload(BaseModel):
    agency: str # "COAST_GUARD" | "NTRO" | "DG_SHIPPING" | "PORT_AUTH"
    actionType: str # "DISPATCH_PRT" | "ISSUE_DETENTION_ORDER" | "DEPLOY_BOOM"
    targetUnits: List[str]

@app.post("/api/v1/incidents/{incident_id}/alerts/dispatch", tags=["Alerts"])
def dispatch_alert(incident_id: str, payload: DispatchAlertPayload) -> Dict[str, Any]:
    """Transition incident alert state and dispatch operational containment/interdiction assets."""
    if incident_id not in INCIDENTS:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found.")
    
    new_alert = {
        "id": f"ALT-{datetime.now(timezone.utc).strftime('%H%M%S')}",
        "incidentId": incident_id,
        "title": f"Operational Action Dispatched: {payload.actionType}",
        "agency": payload.agency,
        "severity": "CRITICAL",
        "status": "DISPATCHED",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "dispatchedUnits": payload.targetUnits,
        "actionRequired": f"Asset tasking initiated for {len(payload.targetUnits)} unit(s)."
    }
    INCIDENTS[incident_id]["alerts"].append(new_alert)
    return {
        "success": True,
        "alert": new_alert,
        "message": f"Successfully dispatched action {payload.actionType} to agency {payload.agency}."
    }

@app.get("/api/v1/incidents/{incident_id}/dossier", response_model=MarpolDossier, tags=["Forensic Reporting"])
def get_marpol_dossier(incident_id: str) -> Dict[str, Any]:
    """Generate and return a court-admissible MARPOL Annex I Forensic Evidence Dossier with SHA-256 hash."""
    if incident_id not in INCIDENTS:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found.")
    
    inc = INCIDENTS[incident_id]
    prime_suspect = inc["suspects"][0] if inc["suspects"] else None
    if not prime_suspect:
        raise HTTPException(status_code=400, detail="No correlated suspect vessels for this incident.")
    
    # Generate cryptographic SHA-256 integrity hash
    raw_evidence_string = f"{incident_id}_{inc['detectionTime']}_{prime_suspect['vessel']['mmsi']}_{prime_suspect['attributionScore']}"
    sha256_hash = hashlib.sha256(raw_evidence_string.encode('utf-8')).hexdigest()
    
    return {
        "dossierId": f"DOSSIER-{incident_id}",
        "caseFileNumber": f"SR-2026-LAW-{incident_id}",
        "incidentId": incident_id,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "sha256Digest": sha256_hash,
        "securityClassification": "RESTRICTED // LAW ENFORCEMENT SENSITIVE",
        "signOffAuthority": "Directorate General of Shipping // Indian Coast Guard C4I",
        "incidentSummary": {
            "title": inc["title"],
            "region": inc["regionId"],
            "detectionTime": inc["detectionTime"],
            "slickAreaSqKm": inc["geometry"]["areaSqKm"],
            "estimatedVolumeM3": inc["geometry"]["estimatedVolumeM3"],
            "satelliteScene": inc["satellite"]["sceneId"]
        },
        "weatheringSummary": inc["weathering"],
        "driftSummary": {
            "originZone": inc["hindcast"]["originZone"],
            "landfallThreats": inc["forecast"]["landfallThreats"]
        },
        "accusedVessel": prime_suspect,
        "statutoryViolations": [
            {
                "statute": "MARPOL 73/78 Annex I Regulation 15",
                "finding": "Oily bilge/sludge discharge into the sea exceeding 15 ppm statutory limit."
            },
            {
                "statute": "Merchant Shipping Act 1958 Section 356 (India)",
                "finding": "Discharge of oil or oily mixture within the Exclusive Economic Zone of India."
            },
            {
                "statute": "IMO Resolution A.1155(32) Procedures for PSC",
                "finding": "Deliberate AIS transponder blackout for 4.2 hours within designated coastal buffer zone."
            }
        ],
        "recommendedSanctions": [
            "Issue Port State Control (PSC) vessel detention warrant upon berth at Indian port.",
            "Impound and inspect Oil Record Book (ORB) Part II and Engine Room Log.",
            "Demand environmental damage mitigation guarantee / P&I Club indemnity bond."
        ],
        "isSimulated": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
