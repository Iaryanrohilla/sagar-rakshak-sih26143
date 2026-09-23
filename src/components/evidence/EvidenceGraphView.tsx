import React, { useState } from 'react'
import { useIncident } from '../../state/IncidentContext'
import {
  Satellite,
  Target,
  Sparkles,
  History,
  MapPin,
  Radio,
  AlertTriangle,
  UserCheck,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'

interface GraphNode {
  id: string
  title: string
  subtitle: string
  sourceType: 'SAR' | 'OCEAN' | 'AIS' | 'SUSPECT'
  confidencePercent: number
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  category: string
  telemetrySummary: string
  equations: string
  legalDefensibility: string
  rawMetrics: Record<string, string | number>
}

export const EvidenceGraphView: React.FC = () => {
  const {
    incident,
    setActiveConsoleView,
    triggerFocusPreset,
    showEvidenceOnMap,
    openWhyVessel
  } = useIncident()

  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-suspect')

  const topSuspect = incident.suspects[0]
  const vesselName = topSuspect?.vessel.name || 'MT Oceanus Pride'

  const nodes: GraphNode[] = [
    {
      id: 'node-sar',
      title: 'SAR Satellite Observation',
      subtitle: incident.scene.sensor,
      sourceType: 'SAR',
      confidencePercent: 96.2,
      icon: Satellite,
      category: 'PRIMARY REMOTE SENSING',
      telemetrySummary: `Sentinel-1 C-band Synthetic Aperture Radar (VV+VH). Surface roughness capillary wave damping recorded at ${incident.detection.sarDampingRatioDb} dB below background sea state.`,
      equations: 'σ₀(attenuation) = 10 · log₁₀(P_ocean / P_slick) > 8.5 dB',
      legalDefensibility: 'Raw ESA Level-1 GRD product with cryptographic satellite orbital state vectors, fully admissible under Section 65B.',
      rawMetrics: {
        'Orbit Pass': incident.scene.orbitPass,
        'Resolution': `${incident.scene.resolutionMeters}m`,
        'Incidence Angle': `${incident.scene.incidenceAngle}°`,
        'Polarization': incident.scene.polarization,
        'Damping Attenuation': `${incident.detection.sarDampingRatioDb} dB`
      }
    },
    {
      id: 'node-morphology',
      title: 'Slick Morphology & Texture',
      subtitle: `${incident.characterisation.surfaceAreaKm2} km² Polygon`,
      sourceType: 'SAR',
      confidencePercent: 94.6,
      icon: Target,
      category: 'SPATIAL SEGMENTATION',
      telemetrySummary: `Dual-sensor U-Net segmentation delineated a continuous slick boundary covering ${incident.characterisation.surfaceAreaKm2} km² with an elongation ratio of ${incident.characterisation.elongationRatio}.`,
      equations: 'Elongation = Major_Axis / Minor_Axis = 3.25 (Steep directional dispersion)',
      legalDefensibility: 'Contour coordinates verified against Sentinel-2 SWIR/NIR negative contrast index, eliminating biogenic false positives.',
      rawMetrics: {
        'Surface Area': `${incident.characterisation.surfaceAreaKm2} km²`,
        'Perimeter': `${incident.characterisation.perimeterKm} km`,
        'Elongation Ratio': incident.characterisation.elongationRatio,
        'Orientation': `${incident.characterisation.orientationDegrees}° True North`,
        'Estimated Volume': `${incident.characterisation.estimatedVolumeM3.toLocaleString()} m³`
      }
    },
    {
      id: 'node-weathering',
      title: 'Oil Verification & Ageing',
      subtitle: `${incident.characterisation.weatheringPhysics?.oilType || 'Heavy Crude'} (${incident.characterisation.spillAgeHours}h)`,
      sourceType: 'SAR',
      confidencePercent: 91.8,
      icon: Sparkles,
      category: 'CHEMICAL FORENSICS',
      telemetrySummary: `Mackay weathering kinetics match API ${incident.characterisation.weatheringPhysics?.apiGravity || 27.9} crude with ${incident.characterisation.weatheringPhysics?.evaporationPercent}% evaporation, establishing spill release ${incident.characterisation.spillAgeHours}h prior.`,
      equations: 'dm/dt = -K_evap · (P_vap · M / RT) · A · m (Mackay Evaporative Loss Model)',
      legalDefensibility: 'Defines the exact temporal window of discharge (11:30–14:00 UTC), narrowing candidate vessels.',
      rawMetrics: {
        'Oil Type': incident.characterisation.weatheringPhysics?.oilType || 'Heavy Crude',
        'API Gravity': incident.characterisation.weatheringPhysics?.apiGravity || 27.9,
        'Evaporation Rate': `${incident.characterisation.weatheringPhysics?.evaporationPercent}%`,
        'Viscosity': `${incident.characterisation.weatheringPhysics?.currentViscosityCst} cSt`,
        'Estimated Release': `${incident.characterisation.spillAgeHours} hours ago`
      }
    },
    {
      id: 'node-drift',
      title: 'Lagrangian Hydrodynamic Drift',
      subtitle: 'OpenDrift Coupled Simulation',
      sourceType: 'OCEAN',
      confidencePercent: 93.4,
      icon: History,
      category: 'HYDRODYNAMIC HINDCAST',
      telemetrySummary: `Coupled HYCOM ocean current field (${incident.metocean.currentSpeedKnots} kts) and ECMWF ERA5 wind vectors (${incident.metocean.windSpeedKnots} kts) with 3.0% windage leeway factor.`,
      equations: 'x(t-Δt) = x(t) - [u_curr(x,t) + α_leeway · u_wind(x,t) + u_stokes(x,t)] · Δt',
      legalDefensibility: 'Court-defensible numerical hindcasting validated across international maritime accident investigation branches (MAIB / NTSB).',
      rawMetrics: {
        'Surface Current': `${incident.metocean.currentSpeedKnots} kts @ ${incident.metocean.currentDirectionDegrees}°`,
        'Wind Speed': `${incident.metocean.windSpeedKnots} kts @ ${incident.metocean.windDirectionDegrees}°`,
        'Windage Leeway': '3.0% (OpenDrift baseline)',
        'Particle Count': incident.hindcast.particlesSimulated || 100,
        'Hindcast Horizon': `${incident.hindcast.backwardHorizonHours}h`
      }
    },
    {
      id: 'node-origin',
      title: 'Estimated Spill Origin Zone',
      subtitle: `${incident.hindcast.probableOrigin?.coordinates[0].toFixed(3)}°N, ${incident.hindcast.probableOrigin?.coordinates[1].toFixed(3)}°E`,
      sourceType: 'OCEAN',
      confidencePercent: 91.5,
      icon: MapPin,
      category: 'PROBABILISTIC LOCALIZATION',
      telemetrySummary: `Convergence envelope isolates release centroid to within ±${incident.hindcast.probableOrigin?.searchRadiusKm || 1.8} km with a 95% spatial confidence circle.`,
      equations: 'P(x, y | T₀) ~ N(μ_particles, Σ_dispersion) ; Radius(95%) = 1.8 km',
      legalDefensibility: 'Defines the geographical locus delicti (scene of environmental violation) for maritime jurisdiction.',
      rawMetrics: {
        'Latitude': `${incident.hindcast.probableOrigin?.coordinates[0].toFixed(4)}°N`,
        'Longitude': `${incident.hindcast.probableOrigin?.coordinates[1].toFixed(4)}°E`,
        'Search Radius': `±${incident.hindcast.probableOrigin?.searchRadiusKm || 1.8} km`,
        'Release Timestamp': incident.hindcast.probableOrigin?.releaseTime || '12:45 UTC',
        'Spatial Confidence': `${incident.hindcast.probableOrigin?.confidencePercent || 91.5}%`
      }
    },
    {
      id: 'node-ais',
      title: 'AIS Traffic Reconstruction',
      subtitle: `${incident.aisVessels.length} Commercial Vessels Screened`,
      sourceType: 'AIS',
      confidencePercent: 97.5,
      icon: Radio,
      category: 'TRAFFIC SURVEILLANCE',
      telemetrySummary: `NMEA decoded AIS trajectories reconstructed all vessel transits across the corridor during the discharge temporal window.`,
      equations: 'CPA(V_i, Origin) = min_t ||Pos_i(t) - Origin(t)|| = 0.82 NM',
      legalDefensibility: 'Official Coastal Vessel Traffic Service (VTS) Class A logs with cryptographically intact transmission timestamps.',
      rawMetrics: {
        'Vessels Correlated': incident.aisVessels.length,
        'Corridor Width': '25 NM Fairway',
        'MMSI Verification': '100% Resolved',
        'Closest Approach': `${topSuspect?.cpaDistanceNm || 0.82} NM`,
        'Time Delta': `${topSuspect?.cpaTimeDeltaMin || 18} min`
      }
    },
    {
      id: 'node-blackout',
      title: 'AIS Blackout & Behavior Anomaly',
      subtitle: `${topSuspect?.vessel.blackoutDurationMin || 45} min Unexplained Gap`,
      sourceType: 'AIS',
      confidencePercent: 95.0,
      icon: AlertTriangle,
      category: 'BEHAVIORAL ANOMALY',
      telemetrySummary: `${vesselName} disabled AIS transponder transmissions for ${topSuspect?.vessel.blackoutDurationMin || 45} minutes exactly while traversing the Lagrangian spill origin zone.`,
      equations: 'Anomaly_Penalty = w_dark · (ΔT_gap / 30min) · exp(-CPA / R_fairway) = +22%',
      legalDefensibility: 'Prima facie violation of SOLAS Chapter V Regulation 19 (Carriage requirements for shipborne navigational systems).',
      rawMetrics: {
        'Blackout Duration': `${topSuspect?.vessel.blackoutDurationMin || 45} minutes`,
        'Gap Start': '12:15 UTC (Pre-spill)',
        'Gap End': '13:00 UTC (Post-spill)',
        'Course Maintained': '242° True (Transit Unaltered)',
        'SOLAS Violation': 'Non-compliance flagged'
      }
    },
    {
      id: 'node-suspect',
      title: 'Ranked Suspect Attribution',
      subtitle: `${vesselName} (Score: ${topSuspect?.compositeScore ?? topSuspect?.overallScore}%)`,
      sourceType: 'SUSPECT',
      confidencePercent: Number(topSuspect?.compositeScore ?? topSuspect?.overallScore ?? 92.4),
      icon: UserCheck,
      category: 'BAYESIAN FORENSIC SYNTHESIS',
      telemetrySummary: `Composite Bayesian attribution combines 5 orthogonal evidence dimensions, isolating ${vesselName} as the primary responsible vessel with court-defensible certainty.`,
      equations: 'P(Attribution | Evidence) = Π_k P(E_k | Vessel) · P_prior / Normalizer = 92.4%',
      legalDefensibility: 'Complete evidence chain meeting Indian Evidence Act Section 65B requirements for court prosecution under Merchant Shipping Act 1958.',
      rawMetrics: {
        'Suspect Rank': '#01 PRIMARY SUSPECT',
        'Overall Score': `${topSuspect?.compositeScore ?? topSuspect?.overallScore}%`,
        'Vessel Flag': `${topSuspect?.vessel.flagCountry} (${topSuspect?.vessel.flag})`,
        'IMO Number': topSuspect?.vessel.imo,
        'DWT / Cargo': `${topSuspect?.vessel.deadweightTons?.toLocaleString() || '158,000'} MT Crude`
      }
    }
  ]

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[nodes.length - 1]

  const getColorBySource = (source: GraphNode['sourceType']) => {
    switch (source) {
      case 'SAR': return 'var(--accent-teal)'
      case 'OCEAN': return 'var(--accent-green)'
      case 'AIS': return 'var(--accent-amber)'
      case 'SUSPECT': return 'var(--accent-coral)'
    }
  }

  const getGlowBySource = (source: GraphNode['sourceType']) => {
    switch (source) {
      case 'SAR': return 'var(--shadow-teal-glow)'
      case 'OCEAN': return '0 0 20px rgba(16, 185, 129, 0.4)'
      case 'AIS': return 'var(--shadow-amber-glow)'
      case 'SUSPECT': return 'var(--shadow-coral-glow)'
    }
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at 50% 10%, #081324 0%, #050a12 85%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        color: 'var(--text-primary)'
      }}
    >
      {/* View Header */}
      <div
        style={{
          height: '46px',
          background: 'rgba(9, 17, 30, 0.95)',
          borderBottom: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={18} style={{ color: 'var(--accent-teal)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-teal)' }}>
            INTERACTIVE CAUSAL EVIDENCE GRAPH // SATELLITE TO VESSEL ATTRIBUTION CHAIN
          </span>
          <span className="badge badge-simulated" style={{ fontSize: '0.62rem' }}>
            [● SIMULATED DATA]
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-teal)' }} />
            <span>SAR / Satellite</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }} />
            <span>Ocean / Drift</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-amber)' }} />
            <span>AIS / Vessel</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-coral)' }} />
            <span>Suspect Attribution</span>
          </div>
        </div>
      </div>

      {/* Main Graph Content Area: Left Node Chain + Right Telemetry Inspector */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Left Interactive Node Pipeline */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
            CLICK ANY CAUSAL NODE TO INSPECT ITS EVIDENCE PARAMETERS AND GEOSPATIAL CORRELATION:
          </div>

          {nodes.map((node, idx) => {
            const isSelected = selectedNodeId === node.id
            const nodeColor = getColorBySource(node.sourceType)
            const nodeGlow = getGlowBySource(node.sourceType)
            const IconComp = node.icon

            // Node size/scale factor based on confidence score
            const scaleSize = 0.95 + (node.confidencePercent / 100) * 0.1

            return (
              <div key={node.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{
                    background: isSelected ? 'rgba(15, 28, 48, 0.95)' : 'rgba(9, 17, 30, 0.75)',
                    border: `1.5px solid ${isSelected ? nodeColor : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? nodeGlow : 'var(--shadow-tactical)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transform: `scale(${isSelected ? 1.01 : scaleSize})`,
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Node Avatar Icon */}
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '8px',
                        background: `rgba(255, 255, 255, 0.04)`,
                        border: `1.5px solid ${nodeColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 0 12px ${nodeColor}40`
                      }}
                    >
                      <IconComp size={20} style={{ color: nodeColor }} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: nodeColor, fontWeight: 800 }}>
                          STEP {idx + 1} // {node.category}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff' }}>
                        {node.title}
                      </h3>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {node.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Confidence Gauge Badge */}
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: nodeColor
                      }}
                    >
                      {node.confidencePercent}%
                    </div>
                    <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      EVIDENCE CONFIDENCE
                    </div>
                  </div>
                </div>

                {/* Connecting Causal Link Line */}
                {idx < nodes.length - 1 && (
                  <div
                    style={{
                      width: '2px',
                      height: '14px',
                      background: `linear-gradient(to bottom, ${nodeColor}, ${getColorBySource(nodes[idx + 1].sourceType)})`,
                      margin: '0 auto',
                      opacity: 0.65
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Right Floating Forensic Telemetry Inspector Card */}
        <aside
          style={{
            width: '460px',
            borderLeft: '1px solid var(--border-medium)',
            background: 'rgba(9, 17, 30, 0.96)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '24px'
          }}
        >
          {/* Header */}
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: getColorBySource(activeNode.sourceType)
                }}
              >
                {activeNode.category}
              </span>
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)' }}>
                CONFIDENCE: {activeNode.confidencePercent}%
              </span>
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', marginBottom: '4px' }}>
              {activeNode.title}
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {activeNode.subtitle}
            </div>
          </div>

          {/* Telemetry Summary */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Forensic Telemetry Summary
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {activeNode.telemetrySummary}
            </p>
          </div>

          {/* Physical / Mathematical Equation */}
          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(5, 10, 18, 0.85)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--accent-teal)',
              marginBottom: '20px'
            }}
          >
            <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              MATHEMATICAL / SENSOR FORMULATION:
            </div>
            {activeNode.equations}
          </div>

          {/* Raw Metrics Table */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Telemetry Tele-Points
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {Object.entries(activeNode.rawMetrics).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}:</span>
                  <strong style={{ color: '#ffffff' }}>{v}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Defensibility Note */}
          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: 'var(--accent-amber-bright)',
              lineHeight: 1.5,
              marginBottom: '24px'
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '0.68rem', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
              LEGAL ADMISSIBILITY // COURT DEFENSIBILITY:
            </div>
            {activeNode.legalDefensibility}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
            <button
              onClick={() => {
                setActiveConsoleView('MAP')
                if (activeNode.id === 'node-sar' || activeNode.id === 'node-morphology') {
                  triggerFocusPreset('SLICK')
                } else if (activeNode.id === 'node-origin' || activeNode.id === 'node-drift') {
                  triggerFocusPreset('ORIGIN')
                } else if (activeNode.id === 'node-blackout') {
                  triggerFocusPreset('DARK_SEGMENT')
                } else {
                  triggerFocusPreset('TOP_SUSPECT')
                  showEvidenceOnMap(topSuspect?.vessel.id || '')
                }
              }}
              className="btn-tactical"
              style={{ width: '100%', height: '38px', fontSize: '0.74rem' }}
            >
              <span>INSPECT ON TACTICAL MAP</span>
              <ExternalLink size={14} />
            </button>

            <button
              onClick={openWhyVessel}
              className="btn-tactical-amber"
              style={{ width: '100%', height: '36px', fontSize: '0.72rem' }}
            >
              <span>VIEW 5-FACTOR ATTRIBUTION BREAKDOWN</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
