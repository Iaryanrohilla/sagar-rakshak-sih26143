"""
Deterministic Realistic Pilot Scenarios Data for SAGAR RAKSHAK Backend
(Gulf of Kutch, Mumbai High, Chennai / Ennore)
"""
from typing import Dict, Any

PILOT_REGIONS: Dict[str, Dict[str, Any]] = {
    "gulf-of-kutch": {
        "id": "gulf-of-kutch",
        "name": "Gulf of Kutch Deepwater Basin",
        "state": "Gujarat / Arabian Sea",
        "description": "Critical crude import gateway handling ~70% of India’s imported crude (Deendayal/Kandla Port, Vadinar SPMs) adjacent to Marine National Park.",
        "center": [22.45, 69.45],
        "zoom": 9,
        "trafficDensity": "EXTREME",
        "sensitiveZones": [
            {
                "name": "Marine National Park & Sanctuary (Coral & Mangroves)",
                "type": "CORAL_REEF",
                "coordinates": [22.48, 69.60],
                "radiusKm": 15.0
            },
            {
                "name": "Vadinar Single Point Mooring (SPM) Crude Terminal",
                "type": "SPM_TERMINAL",
                "coordinates": [22.42, 69.72],
                "radiusKm": 4.5
            },
            {
                "name": "Kandla Estuarine Port Channel",
                "type": "PORT_CHANNEL",
                "coordinates": [22.95, 70.20],
                "radiusKm": 8.0
            }
        ]
    },
    "mumbai-high": {
        "id": "mumbai-high",
        "name": "Mumbai High Offshore Corridor",
        "state": "Maharashtra / Arabian Sea",
        "description": "Major offshore crude extraction basin (ONGC platforms) and high-density tanker transit lane along western seaboard.",
        "center": [19.42, 71.35],
        "zoom": 9,
        "trafficDensity": "EXTREME",
        "sensitiveZones": [
            {
                "name": "ONGC Platform BNV Complex",
                "type": "SPM_TERMINAL",
                "coordinates": [19.45, 71.32],
                "radiusKm": 5.0
            },
            {
                "name": "Western Deepwater Tanker Fairway",
                "type": "PORT_CHANNEL",
                "coordinates": [19.35, 71.45],
                "radiusKm": 8.0
            },
            {
                "name": "Alibaug Coastal Estuary & Fishery Reserve",
                "type": "MANGROVE",
                "coordinates": [18.65, 72.85],
                "radiusKm": 12.0
            }
        ]
    },
    "chennai-ennore": {
        "id": "chennai-ennore",
        "name": "Chennai / Ennore Coastal Gateway",
        "state": "Tamil Nadu / Bay of Bengal",
        "description": "Busiest eastern maritime gateway (Kamarajar Port & Chennai Port) with historical sensitivity following 2017 collision spill.",
        "center": [13.25, 80.38],
        "zoom": 10,
        "trafficDensity": "HIGH",
        "sensitiveZones": [
            {
                "name": "Kamarajar Port Oil Basin Approach",
                "type": "PORT_CHANNEL",
                "coordinates": [13.26, 80.34],
                "radiusKm": 5.0
            },
            {
                "name": "Pulicat Lake Brackish Estuary (Flamingo Sanctuary)",
                "type": "MANGROVE",
                "coordinates": [13.42, 80.32],
                "radiusKm": 14.0
            },
            {
                "name": "Marina Beach Coastal Biome",
                "type": "MARINE_PARK",
                "coordinates": [13.04, 80.28],
                "radiusKm": 7.0
            }
        ]
    }
}

INCIDENTS: Dict[str, Dict[str, Any]] = {
    "SR-KUTCH-01": {
        "id": "SR-KUTCH-01",
        "regionId": "gulf-of-kutch",
        "title": "Vadinar SPM Fairway Heavy Crude Discharge",
        "detectionTime": "2026-09-20T14:15:00Z",
        "status": "INVESTIGATING",
        "severity": "CRITICAL",
        "centroid": [22.45, 69.45],
        "slickPolygon": [
            [22.462, 69.431],
            [22.468, 69.455],
            [22.458, 69.479],
            [22.441, 69.465],
            [22.435, 69.442],
            [22.448, 69.428]
        ],
        "metocean": {
            "windSpeedKnots": 14.5,
            "windDirectionDeg": 235.0,
            "currentSpeedKnots": 0.8,
            "currentDirectionDeg": 65.0,
            "seaSurfaceTempC": 28.4,
            "waveHeightMeters": 0.8,
            "tideState": "FLOOD"
        },
        "satellite": {
            "sceneId": "S1A_IW_GRDH_1SDV_20260920T135500_KUTCH",
            "satellite": "Sentinel-1A SAR C-band",
            "sensorType": "SAR_C_BAND",
            "acquisitionTime": "2026-09-20T13:55:00Z",
            "orbitDirection": "DESCENDING",
            "polarization": "VV+VH",
            "footprint": [
                [22.80, 69.10],
                [22.80, 70.10],
                [22.10, 70.10],
                [22.10, 69.10]
            ],
            "resolutionMeters": 10.0,
            "isSimulated": True
        },
        "geometry": {
            "areaSqKm": 14.2,
            "perimeterKm": 34.8,
            "elongationRatio": 3.8,
            "majorAxisKm": 7.6,
            "minorAxisKm": 2.0,
            "estimatedVolumeM3": 420.0,
            "thicknessMm": 0.035
        },
        "weathering": {
            "estimatedAgeHours": 18.4,
            "releaseTimestamp": "2026-09-19T19:51:00Z",
            "evaporatedPercentage": 22.4,
            "emulsifiedPercentage": 38.0,
            "waterInOilContent": 62.0,
            "viscosityCSt": 310.0,
            "dispersantSuitabilityWindowHours": 4.8
        },
        "hindcast": {
            "simulationType": "HINDCAST",
            "steps": [
                {"stepIndex": 0, "hourOffset": 0.0, "timestamp": "2026-09-20T13:55:00Z", "centroid": [22.45, 69.45], "particleCount": 1000, "spreadRadiusKm": 1.2},
                {"stepIndex": 1, "hourOffset": -4.0, "timestamp": "2026-09-20T09:55:00Z", "centroid": [22.435, 69.418], "particleCount": 1000, "spreadRadiusKm": 1.5},
                {"stepIndex": 2, "hourOffset": -8.0, "timestamp": "2026-09-20T05:55:00Z", "centroid": [22.420, 69.385], "particleCount": 1000, "spreadRadiusKm": 1.9},
                {"stepIndex": 3, "hourOffset": -12.0, "timestamp": "2026-09-20T01:55:00Z", "centroid": [22.405, 69.352], "particleCount": 1000, "spreadRadiusKm": 2.3},
                {"stepIndex": 4, "hourOffset": -18.4, "timestamp": "2026-09-19T19:51:00Z", "centroid": [22.380, 69.310], "particleCount": 1000, "spreadRadiusKm": 2.8}
            ],
            "originZone": {
                "center": [22.380, 69.310],
                "semiMajorKm": 3.2,
                "semiMinorKm": 1.8,
                "orientationDeg": 68.0
            }
        },
        "forecast": {
            "simulationType": "FORECAST",
            "steps": [
                {"stepIndex": 0, "hourOffset": 0.0, "timestamp": "2026-09-20T14:15:00Z", "centroid": [22.45, 69.45], "particleCount": 1000, "spreadRadiusKm": 1.2},
                {"stepIndex": 1, "hourOffset": 12.0, "timestamp": "2026-09-21T02:15:00Z", "centroid": [22.472, 69.525], "particleCount": 1000, "spreadRadiusKm": 2.4},
                {"stepIndex": 2, "hourOffset": 24.0, "timestamp": "2026-09-21T14:15:00Z", "centroid": [22.490, 69.595], "particleCount": 1000, "spreadRadiusKm": 3.6},
                {"stepIndex": 3, "hourOffset": 36.0, "timestamp": "2026-09-22T02:15:00Z", "centroid": [22.505, 69.660], "particleCount": 1000, "spreadRadiusKm": 4.8},
                {"stepIndex": 4, "hourOffset": 48.0, "timestamp": "2026-09-22T14:15:00Z", "centroid": [22.518, 69.720], "particleCount": 1000, "spreadRadiusKm": 6.2}
            ],
            "landfallThreats": [
                {"name": "Pirotan Coral Reef Sanctuary", "riskScore": 94, "timeToLandfallHours": 14.2, "distanceNm": 3.8},
                {"name": "Vadinar SPM Crude Berth 3", "riskScore": 68, "timeToLandfallHours": 22.0, "distanceNm": 7.4},
                {"name": "Jamnagar Mangrove Buffer", "riskScore": 82, "timeToLandfallHours": 18.6, "distanceNm": 5.2}
            ]
        },
        "suspects": [
            {
                "rank": 1,
                "attributionScore": 89.4,
                "severityLevel": "CRITICAL",
                "cpaNauticalMiles": 0.8,
                "timeDeltaHours": -0.4,
                "blackoutDurationHours": 4.2,
                "headingDeviationDeg": 42.0,
                "speedAnomalyKnots": 7.7,
                "drivingFactors": [
                    "CPA: 0.8 nm (Within 1.5nm Release Radius)",
                    "Δt: -0.4h (Aligned with Mackay Weathering)",
                    "AIS Blackout: 4.2h Transponder Gap in Origin Zone",
                    "Speed Drop: 14.8 -> 7.1 kts (Bilge Flushing Profile)"
                ],
                "factorWeights": {
                    "proximity": 0.30,
                    "timing": 0.25,
                    "aisBlackout": 0.20,
                    "courseSpeedAnomaly": 0.15,
                    "cargoRisk": 0.10
                },
                "factorScores": {
                    "proximity": 0.96,
                    "timing": 0.92,
                    "aisBlackout": 0.98,
                    "courseSpeedAnomaly": 0.85,
                    "cargoRisk": 0.78
                },
                "interceptVector": [
                    [22.380, 69.310],
                    [22.374, 69.298]
                ],
                "vessel": {
                    "mmsi": "354891000",
                    "imo": "9482103",
                    "name": "MT PACIFIC VOYAGER",
                    "vesselType": "VLCC Crude Oil Tanker",
                    "flagCountry": "Panama",
                    "callsign": "3EFL9",
                    "draughtMeters": 18.2,
                    "deadweightTonnage": 305000,
                    "trackPoints": [
                        {"lat": 22.31, "lng": 69.12, "time": "2026-09-19T18:00:00Z", "speed": 14.8, "heading": 68},
                        {"lat": 22.35, "lng": 69.21, "time": "2026-09-19T19:00:00Z", "speed": 14.5, "heading": 67},
                        {"lat": 22.374, "lng": 69.298, "time": "2026-09-19T19:45:00Z", "speed": 7.1, "heading": 110, "isGapStart": True},
                        {"lat": 22.41, "lng": 69.41, "time": "2026-09-20T00:00:00Z", "speed": 14.2, "heading": 65, "isGapEnd": True}
                    ]
                }
            },
            {
                "rank": 2,
                "attributionScore": 48.2,
                "severityLevel": "MEDIUM",
                "cpaNauticalMiles": 4.1,
                "timeDeltaHours": 2.1,
                "blackoutDurationHours": 0.0,
                "headingDeviationDeg": 8.0,
                "speedAnomalyKnots": 0.8,
                "drivingFactors": [
                    "CPA: 4.1 nm (Outer Boundary)",
                    "Δt: +2.1h (Partial Timing Match)",
                    "AIS: Continuous Stream (No Blackout)"
                ],
                "factorWeights": {
                    "proximity": 0.30,
                    "timing": 0.25,
                    "aisBlackout": 0.20,
                    "courseSpeedAnomaly": 0.15,
                    "cargoRisk": 0.10
                },
                "factorScores": {
                    "proximity": 0.45,
                    "timing": 0.58,
                    "aisBlackout": 0.10,
                    "courseSpeedAnomaly": 0.30,
                    "cargoRisk": 0.85
                },
                "vessel": {
                    "mmsi": "636018245",
                    "imo": "9314412",
                    "name": "MT NORDIC GLORY",
                    "vesselType": "Suezmax Tanker",
                    "flagCountry": "Liberia",
                    "callsign": "A8XG2",
                    "draughtMeters": 14.5,
                    "deadweightTonnage": 158000,
                    "trackPoints": [
                        {"lat": 22.25, "lng": 69.20, "time": "2026-09-19T21:00:00Z", "speed": 13.2, "heading": 60},
                        {"lat": 22.32, "lng": 69.38, "time": "2026-09-19T22:00:00Z", "speed": 13.1, "heading": 62}
                    ]
                }
            },
            {
                "rank": 3,
                "attributionScore": 14.6,
                "severityLevel": "LOW",
                "cpaNauticalMiles": 11.2,
                "timeDeltaHours": 6.5,
                "blackoutDurationHours": 0.0,
                "headingDeviationDeg": 3.0,
                "speedAnomalyKnots": 0.3,
                "drivingFactors": [
                    "CPA: 11.2 nm (Distant Transit)",
                    "Cargo: Dry Bulk Carrier",
                    "AIS: Full Compliance"
                ],
                "factorWeights": {
                    "proximity": 0.30,
                    "timing": 0.25,
                    "aisBlackout": 0.20,
                    "courseSpeedAnomaly": 0.15,
                    "cargoRisk": 0.10
                },
                "factorScores": {
                    "proximity": 0.08,
                    "timing": 0.12,
                    "aisBlackout": 0.05,
                    "courseSpeedAnomaly": 0.10,
                    "cargoRisk": 0.20
                },
                "vessel": {
                    "mmsi": "563042100",
                    "imo": "9198822",
                    "name": "MV STAR CLIPPER",
                    "vesselType": "Capesize Bulk Carrier",
                    "flagCountry": "Singapore",
                    "callsign": "9V821",
                    "draughtMeters": 16.0,
                    "deadweightTonnage": 180000,
                    "trackPoints": [
                        {"lat": 22.18, "lng": 69.15, "time": "2026-09-20T02:00:00Z", "speed": 11.5, "heading": 72}
                    ]
                }
            }
        ],
        "alerts": [
            {
                "id": "ALT-KUTCH-01",
                "incidentId": "SR-KUTCH-01",
                "title": "Mangrove & Coral Sanctuary Collision Threshold Warning",
                "agency": "COAST_GUARD",
                "severity": "CRITICAL",
                "status": "DISPATCHED",
                "timestamp": "2026-09-20T14:20:00Z",
                "dispatchedUnits": ["ICGS SAMUDRA PAVAK (PRT Flagship)", "ICG Dornier-228 Sortie CG-782"],
                "actionRequired": "Deploy 800m oleophilic containment boom around Pirotan Island perimeter."
            },
            {
                "id": "ALT-KUTCH-02",
                "incidentId": "SR-KUTCH-01",
                "title": "Port State Control Detention Warrant Recommendation",
                "agency": "DG_SHIPPING",
                "severity": "HIGH",
                "status": "PENDING_ORDER",
                "timestamp": "2026-09-20T14:30:00Z",
                "dispatchedUnits": ["Principal Officer, Mercantile Marine Department (Kandla)"],
                "actionRequired": "Execute detention under Merchant Shipping Act Section 356 upon arrival."
            }
        ],
        "isSimulated": True
    },
    "SR-MUMBAI-02": {
        "id": "SR-MUMBAI-02",
        "regionId": "mumbai-high",
        "title": "Mumbai High BNV Offshore Platform Fairway Spill",
        "detectionTime": "2026-09-20T11:30:00Z",
        "status": "ESCALATED",
        "severity": "CRITICAL",
        "centroid": [19.42, 71.35],
        "slickPolygon": [
            [19.435, 71.332],
            [19.442, 71.358],
            [19.428, 71.375],
            [19.412, 71.360],
            [19.418, 71.335]
        ],
        "metocean": {
            "windSpeedKnots": 18.0,
            "windDirectionDeg": 260.0,
            "currentSpeedKnots": 1.2,
            "currentDirectionDeg": 85.0,
            "seaSurfaceTempC": 29.1,
            "waveHeightMeters": 1.4,
            "tideState": "EBB"
        },
        "satellite": {
            "sceneId": "S1A_IW_GRDH_1SDV_20260920T111500_MUMBAI",
            "satellite": "Sentinel-1A SAR C-band",
            "sensorType": "SAR_C_BAND",
            "acquisitionTime": "2026-09-20T11:15:00Z",
            "orbitDirection": "ASCENDING",
            "polarization": "VV+VH",
            "footprint": [
                [19.80, 70.90],
                [19.80, 71.90],
                [19.00, 71.90],
                [19.00, 70.90]
            ],
            "resolutionMeters": 10.0,
            "isSimulated": True
        },
        "geometry": {
            "areaSqKm": 18.6,
            "perimeterKm": 42.1,
            "elongationRatio": 4.1,
            "majorAxisKm": 9.2,
            "minorAxisKm": 2.2,
            "estimatedVolumeM3": 580.0,
            "thicknessMm": 0.040
        },
        "weathering": {
            "estimatedAgeHours": 14.2,
            "releaseTimestamp": "2026-09-20T00:18:00Z",
            "evaporatedPercentage": 28.5,
            "emulsifiedPercentage": 45.0,
            "waterInOilContent": 58.0,
            "viscosityCSt": 420.0,
            "dispersantSuitabilityWindowHours": 3.2
        },
        "hindcast": {
            "simulationType": "HINDCAST",
            "steps": [
                {"stepIndex": 0, "hourOffset": 0.0, "timestamp": "2026-09-20T11:15:00Z", "centroid": [19.42, 71.35], "particleCount": 1000, "spreadRadiusKm": 1.4},
                {"stepIndex": 1, "hourOffset": -7.0, "timestamp": "2026-09-20T04:15:00Z", "centroid": [19.385, 71.265], "particleCount": 1000, "spreadRadiusKm": 2.1},
                {"stepIndex": 2, "hourOffset": -14.2, "timestamp": "2026-09-20T00:18:00Z", "centroid": [19.345, 71.180], "particleCount": 1000, "spreadRadiusKm": 3.1}
            ],
            "originZone": {
                "center": [19.345, 71.180],
                "semiMajorKm": 3.6,
                "semiMinorKm": 2.1,
                "orientationDeg": 80.0
            }
        },
        "forecast": {
            "simulationType": "FORECAST",
            "steps": [
                {"stepIndex": 0, "hourOffset": 0.0, "timestamp": "2026-09-20T11:30:00Z", "centroid": [19.42, 71.35], "particleCount": 1000, "spreadRadiusKm": 1.4},
                {"stepIndex": 1, "hourOffset": 24.0, "timestamp": "2026-09-21T11:30:00Z", "centroid": [19.465, 71.510], "particleCount": 1000, "spreadRadiusKm": 3.8},
                {"stepIndex": 2, "hourOffset": 48.0, "timestamp": "2026-09-22T11:30:00Z", "centroid": [19.510, 71.680], "particleCount": 1000, "spreadRadiusKm": 6.8}
            ],
            "landfallThreats": [
                {"name": "ONGC Platform BNV Complex", "riskScore": 88, "timeToLandfallHours": 9.5, "distanceNm": 4.2},
                {"name": "Alibaug Fishery Estuary", "riskScore": 62, "timeToLandfallHours": 34.0, "distanceNm": 28.0}
            ]
        },
        "suspects": [
            {
                "rank": 1,
                "attributionScore": 82.5,
                "severityLevel": "CRITICAL",
                "cpaNauticalMiles": 1.2,
                "timeDeltaHours": -0.6,
                "blackoutDurationHours": 3.1,
                "headingDeviationDeg": 35.0,
                "speedAnomalyKnots": 6.2,
                "drivingFactors": [
                    "CPA: 1.2 nm (Origin Corridor)",
                    "Δt: -0.6h (Mackay Peak Alignment)",
                    "AIS Blackout: 3.1h Dark Ship Window"
                ],
                "factorWeights": {"proximity": 0.30, "timing": 0.25, "aisBlackout": 0.20, "courseSpeedAnomaly": 0.15, "cargoRisk": 0.10},
                "factorScores": {"proximity": 0.91, "timing": 0.88, "aisBlackout": 0.89, "courseSpeedAnomaly": 0.78, "cargoRisk": 0.82},
                "interceptVector": [[19.345, 71.180], [19.338, 71.165]],
                "vessel": {
                    "mmsi": "311000421",
                    "imo": "9274981",
                    "name": "MT OCEAN EMPEROR",
                    "vesselType": "Suezmax Crude Tanker",
                    "flagCountry": "Bahamas",
                    "callsign": "C6YZ2",
                    "draughtMeters": 16.8,
                    "deadweightTonnage": 160000,
                    "trackPoints": []
                }
            }
        ],
        "alerts": [],
        "isSimulated": True
    },
    "SR-CHENNAI-03": {
        "id": "SR-CHENNAI-03",
        "regionId": "chennai-ennore",
        "title": "Kamarajar Port Approach Heavy Fuel Oil Slick",
        "detectionTime": "2026-09-20T08:45:00Z",
        "status": "ACKNOWLEDGED",
        "severity": "HIGH",
        "centroid": [13.25, 80.38],
        "slickPolygon": [
            [13.262, 80.368],
            [13.270, 80.385],
            [13.255, 80.398],
            [13.242, 80.380],
            [13.248, 80.365]
        ],
        "metocean": {
            "windSpeedKnots": 12.0,
            "windDirectionDeg": 170.0,
            "currentSpeedKnots": 0.9,
            "currentDirectionDeg": 15.0,
            "seaSurfaceTempC": 29.8,
            "waveHeightMeters": 1.0,
            "tideState": "FLOOD"
        },
        "satellite": {
            "sceneId": "S1A_IW_GRDH_1SDV_20260920T083000_CHENNAI",
            "satellite": "Sentinel-1A SAR C-band",
            "sensorType": "SAR_C_BAND",
            "acquisitionTime": "2026-09-20T08:30:00Z",
            "orbitDirection": "DESCENDING",
            "polarization": "VV+VH",
            "footprint": [
                [13.60, 80.00],
                [13.60, 80.70],
                [12.90, 80.70],
                [12.90, 80.00]
            ],
            "resolutionMeters": 10.0,
            "isSimulated": True
        },
        "geometry": {
            "areaSqKm": 9.8,
            "perimeterKm": 26.4,
            "elongationRatio": 3.2,
            "majorAxisKm": 5.8,
            "minorAxisKm": 1.8,
            "estimatedVolumeM3": 280.0,
            "thicknessMm": 0.030
        },
        "weathering": {
            "estimatedAgeHours": 11.2,
            "releaseTimestamp": "2026-09-19T21:18:00Z",
            "evaporatedPercentage": 18.2,
            "emulsifiedPercentage": 29.0,
            "waterInOilContent": 52.0,
            "viscosityCSt": 280.0,
            "dispersantSuitabilityWindowHours": 6.5
        },
        "hindcast": {
            "simulationType": "HINDCAST",
            "steps": [
                {"stepIndex": 0, "hourOffset": 0.0, "timestamp": "2026-09-20T08:30:00Z", "centroid": [13.25, 80.38], "particleCount": 1000, "spreadRadiusKm": 1.0},
                {"stepIndex": 1, "hourOffset": -5.5, "timestamp": "2026-09-20T03:00:00Z", "centroid": [13.210, 80.365], "particleCount": 1000, "spreadRadiusKm": 1.8},
                {"stepIndex": 2, "hourOffset": -11.2, "timestamp": "2026-09-19T21:18:00Z", "centroid": [13.165, 80.350], "particleCount": 1000, "spreadRadiusKm": 2.5}
            ],
            "originZone": {
                "center": [13.165, 80.350],
                "semiMajorKm": 2.8,
                "semiMinorKm": 1.5,
                "orientationDeg": 18.0
            }
        },
        "forecast": {
            "simulationType": "FORECAST",
            "steps": [
                {"stepIndex": 0, "hourOffset": 0.0, "timestamp": "2026-09-20T08:45:00Z", "centroid": [13.25, 80.38], "particleCount": 1000, "spreadRadiusKm": 1.0},
                {"stepIndex": 1, "hourOffset": 24.0, "timestamp": "2026-09-21T08:45:00Z", "centroid": [13.330, 80.410], "particleCount": 1000, "spreadRadiusKm": 3.2},
                {"stepIndex": 2, "hourOffset": 48.0, "timestamp": "2026-09-22T08:45:00Z", "centroid": [13.410, 80.440], "particleCount": 1000, "spreadRadiusKm": 5.5}
            ],
            "landfallThreats": [
                {"name": "Pulicat Lake Bird Sanctuary Estuary", "riskScore": 86, "timeToLandfallHours": 21.0, "distanceNm": 8.5},
                {"name": "Kamarajar Port Approach Fairway", "riskScore": 74, "timeToLandfallHours": 6.0, "distanceNm": 2.2}
            ]
        },
        "suspects": [
            {
                "rank": 1,
                "attributionScore": 76.8,
                "severityLevel": "HIGH",
                "cpaNauticalMiles": 1.5,
                "timeDeltaHours": 0.8,
                "blackoutDurationHours": 2.4,
                "headingDeviationDeg": 28.0,
                "speedAnomalyKnots": 5.4,
                "drivingFactors": [
                    "CPA: 1.5 nm (Near Kamarajar Approach)",
                    "AIS Blackout: 2.4h Transponder Gap",
                    "Cargo: Heavy Fuel Oil Bunker Carrier"
                ],
                "factorWeights": {"proximity": 0.30, "timing": 0.25, "aisBlackout": 0.20, "courseSpeedAnomaly": 0.15, "cargoRisk": 0.10},
                "factorScores": {"proximity": 0.84, "timing": 0.79, "aisBlackout": 0.82, "courseSpeedAnomaly": 0.72, "cargoRisk": 0.78},
                "interceptVector": [[13.165, 80.350], [13.158, 80.342]],
                "vessel": {
                    "mmsi": "419001289",
                    "imo": "9382176",
                    "name": "MT COROMANDEL STAR",
                    "vesselType": "Bunkering Tanker",
                    "flagCountry": "India",
                    "callsign": "AVKZ",
                    "draughtMeters": 11.2,
                    "deadweightTonnage": 45000,
                    "trackPoints": []
                }
            }
        ],
        "alerts": [],
        "isSimulated": True
    }
}
