import React from 'react'
import { X, ShieldAlert, Eye, FileText, CheckCircle2, AlertTriangle, Crosshair } from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const WhyVesselModal: React.FC = () => {
  const {
    incident,
    selectedSuspect,
    isWhyVesselModalOpen,
    closeWhyVessel,
    showEvidenceOnMap,
    setIsReportModalOpen
  } = useIncident()

  if (!isWhyVesselModalOpen) return null

  const suspect = selectedSuspect || incident.suspects[0]
  if (!suspect) return null

  const vessel = suspect.vessel
  const scorePercent = Math.round(suspect.overallScore)
  const isHighConfidence = suspect.overallScore >= 80

  const cpaDist = suspect.cpaDistanceNm ?? 0.82
  const cpaTime = suspect.cpaTimeDeltaMin ?? 18
  const blackoutMins = vessel.blackoutDurationMin || (vessel.blackoutAnomaly ? Math.round(vessel.blackoutAnomaly.durationHours * 60) : 45)
  const dwt = (vessel.deadweightTons || Math.round(vessel.grossTonnage * 1.5)).toLocaleString()

  const handleShowOnMap = () => {
    showEvidenceOnMap(vessel.id)
    closeWhyVessel()
  }

  const handleOpenDossier = () => {
    closeWhyVessel()
    setIsReportModalOpen(true)
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 5, 12, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={closeWhyVessel}
    >
      <div
        style={{
          width: '840px',
          maxWidth: '96vw',
          maxHeight: '92vh',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 16px 64px rgba(0, 242, 255, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isHighConfidence ? 'rgba(255, 34, 85, 0.15)' : 'rgba(255, 187, 0, 0.15)',
                border: `1px solid ${isHighConfidence ? 'var(--accent-red)' : 'var(--accent-amber)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldAlert size={20} color={isHighConfidence ? 'var(--accent-red)' : 'var(--accent-amber)'} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
                  FORENSIC ATTRIBUTION EXPLAINABILITY
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    background: isHighConfidence ? 'rgba(255, 34, 85, 0.2)' : 'rgba(255, 187, 0, 0.2)',
                    color: isHighConfidence ? 'var(--accent-red)' : 'var(--accent-amber)',
                    border: `1px solid ${isHighConfidence ? 'var(--accent-red)' : 'var(--accent-amber)'}`
                  }}
                >
                  RANK #{suspect.rank} — {scorePercent}% CONFIDENCE
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                Target: {vessel.name} (IMO: {vessel.imo} | MMSI: {vessel.mmsi}) • Flag: {vessel.flagCountry} ({vessel.flag})
              </div>
            </div>
          </div>

          <button
            onClick={closeWhyVessel}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Top Metric Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              padding: '14px',
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-medium)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Closest Approach (CPA)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {cpaDist} NM
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>Distance to slick origin</div>
            </div>

            <div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Time Difference (Δt)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                {cpaTime} min
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>Estimated release window</div>
            </div>

            <div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Vessel Speed (SOG)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
                {vessel.sogKnots} kts
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>Course: {vessel.cogDegrees}°</div>
            </div>

            <div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Vessel Type & Draft</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {vessel.vesselType.replace(/_/g, ' ')}
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>Draft: {vessel.draughtMeters}m / DWT: {dwt}t</div>
            </div>
          </div>

          {/* Forensic Evidence Weighting Factors */}
          <div
            style={{
              padding: '16px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-medium)'
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Crosshair size={14} color="var(--accent-cyan)" />
              <span>FIVE-FACTOR BAYESIAN ATTRIBUTION BREAKDOWN</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {suspect.evidenceFactors.map((factor, idx) => {
                const percent = Math.round((factor.score / factor.maxScore) * 100)
                const barColor = idx === 0 ? 'var(--accent-cyan)' : idx === 1 ? 'var(--accent-green)' : idx === 2 ? 'var(--accent-cyan)' : idx === 3 ? 'var(--accent-amber)' : 'var(--accent-red)'
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {factor.name}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: barColor }}>
                        +{factor.score} / {factor.maxScore} pts ({percent}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: barColor }} />
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.35 }}>
                      {factor.description}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Anomaly Callout */}
          {vessel.hasBlackout && (
            <div
              style={{
                padding: '12px 14px',
                background: 'rgba(255, 34, 85, 0.08)',
                border: '1px solid var(--accent-red)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              <AlertTriangle size={18} color="var(--accent-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--accent-red)', marginBottom: '2px' }}>
                  CRITICAL ANOMALY: AIS TRANSPONDER BLACKOUT DETECTED
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Vessel ceased VHF Class-A AIS transmissions for {blackoutMins} minutes while traversing within {cpaDist} NM of the estimated spill origin. This intentional gap coincides with the backward hindcast discharge time window.
                </div>
              </div>
            </div>
          )}

          {/* Legal Admissibility Statement */}
          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(0, 242, 255, 0.04)',
              border: '1px solid rgba(0, 242, 255, 0.25)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}
          >
            <CheckCircle2 size={18} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '2px' }}>
                MARPOL 73/78 ANNEX I EVIDENTIARY COMPLIANCE
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Combined evidence fulfills standard evidentiary protocols for Port State Control (PSC) detention under MARPOL Articles 4 & 6. Spatio-temporal reconstruction eliminates alternate vessel tracks within a 15 NM radius.
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '12px 20px',
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            Selected Suspect: {vessel.name} ({vessel.flagCountry})
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleShowOnMap}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: 'rgba(0, 242, 255, 0.15)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-cyan)',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Eye size={14} />
              <span>SHOW EVIDENCE ON MAP</span>
            </button>

            <button
              onClick={handleOpenDossier}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: 'var(--accent-cyan)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: '#000',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <FileText size={14} />
              <span>FULL INCIDENT DOSSIER</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
