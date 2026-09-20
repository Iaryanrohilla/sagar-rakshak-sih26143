import React from 'react'
import {
  UserCheck,
  Clock,
  Radio,
  MapPin
} from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const AttributionPanel: React.FC = () => {
  const {
    incident,
    selectedSuspect,
    setSelectedSuspect,
    runAttribution,
    isProcessing,
    setMapFocusTarget,
    openWhyVessel,
    showEvidenceOnMap
  } = useIncident()

  const suspects = incident.suspects
  const activeSuspect = selectedSuspect || suspects[0]

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'var(--accent-crimson)'
    if (score >= 40) return 'var(--accent-amber)'
    return 'var(--accent-emerald)'
  }

  const getSeverityLabel = (score: number) => {
    if (score >= 75) return '[CRITICAL ATTRIBUTION]'
    if (score >= 40) return '[MEDIUM SUSPECT]'
    return '[LOW / CLEARED]'
  }

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) return { background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-crimson)', border: '1px solid var(--accent-crimson)' }
    if (rank === 2) return { background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)', border: '1px solid var(--accent-amber)' }
    return { background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', border: '1px solid var(--accent-emerald)' }
  }

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={18} style={{ color: 'var(--accent-crimson)' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-crimson)' }}>
            VESSEL ATTRIBUTION LEADERBOARD
          </h3>
        </div>
        <span
          className="badge"
          style={{
            background: 'rgba(245, 158, 11, 0.15)',
            color: 'var(--accent-amber)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            fontSize: '0.62rem'
          }}
          title="Vessel tracks and Bayesian scoring are simulated for demonstration."
        >
          ● SIMULATED
        </span>
      </div>

      {/* Subheader summary */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
        <span>CORRELATED CANDIDATES IN WINDOW: <strong style={{ color: 'var(--text-primary)' }}>{suspects.length} VESSELS</strong></span>
        <span style={{ color: 'var(--accent-cyan)' }}>BAYESIAN 5-FACTOR MODEL</span>
      </div>

      {/* Tactical Leaderboard Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {suspects.map((s) => {
          const isSelected = activeSuspect && activeSuspect.vessel.id === s.vessel.id
          const scoreColor = getScoreColor(s.overallScore)
          const severityLabel = getSeverityLabel(s.overallScore)
          const rankBadge = getRankBadgeStyle(s.rank)

          // Derive driving factors
          const cpaDist = s.cpaDistanceNm ?? (s.rank === 1 ? 0.8 : s.rank === 2 ? 4.1 : 11.2)
          const timeDelta = s.cpaTimeDeltaMin ? (s.cpaTimeDeltaMin / 60).toFixed(1) : (s.rank === 1 ? '-0.4' : s.rank === 2 ? '+2.1' : '+6.5')
          const hasBlackout = s.vessel.hasBlackout
          const blackoutDuration = s.vessel.blackoutDurationMin ? `${(s.vessel.blackoutDurationMin / 60).toFixed(1)}h` : (hasBlackout ? '4.2h' : 'None')

          return (
            <div
              key={s.vessel.id}
              style={{
                background: isSelected ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-surface)',
                border: isSelected ? `1.5px solid ${scoreColor}` : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: isSelected ? `0 0 15px rgba(239, 68, 68, 0.2)` : 'var(--shadow-tactical)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onClick={() => {
                setSelectedSuspect(s)
                setMapFocusTarget(s.vessel.currentPosition)
              }}
            >
              {/* Top Row: Rank, Vessel Name & Dual-Encoded Score */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      ...rankBadge
                    }}
                  >
                    #{s.rank < 10 ? `0${s.rank}` : s.rank}
                  </span>

                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {s.vessel.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      IMO: {s.vessel.imo} // MMSI: {s.vessel.mmsi} // {s.vessel.flagCountry}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: scoreColor, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                    {s.overallScore}%
                  </div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, color: scoreColor, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    {severityLabel}
                  </div>
                </div>
              </div>

              {/* Score Progress Bar (Dual Encoding Visual) */}
              <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${s.overallScore}%`,
                    height: '100%',
                    background: scoreColor,
                    boxShadow: `0 0 8px ${scoreColor}`
                  }}
                />
              </div>

              {/* Driving Factors Pills (The 2-3 factors that drove the score) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {/* 1. Proximity CPA */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-sm)',
                    background: cpaDist < 2 ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                    border: cpaDist < 2 ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid var(--border-subtle)',
                    color: cpaDist < 2 ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    fontWeight: 700
                  }}
                >
                  <MapPin size={10} />
                  CPA: {cpaDist} nm
                </span>

                {/* 2. Temporal Alignment */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-sm)',
                    background: Math.abs(Number(timeDelta)) < 1 ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                    border: Math.abs(Number(timeDelta)) < 1 ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid var(--border-subtle)',
                    color: Math.abs(Number(timeDelta)) < 1 ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    fontWeight: 700
                  }}
                >
                  <Clock size={10} />
                  Δt: {timeDelta}h
                </span>

                {/* 3. AIS Blackout Anomaly */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-sm)',
                    background: hasBlackout ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                    border: hasBlackout ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.3)',
                    color: hasBlackout ? 'var(--accent-crimson)' : 'var(--accent-emerald)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    fontWeight: 700
                  }}
                >
                  <Radio size={10} />
                  {hasBlackout ? `AIS GAP: ${blackoutDuration}` : 'AIS NORMAL'}
                </span>

                {/* 4. Vessel Type Pill */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem'
                  }}
                >
                  {s.vessel.vesselType.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Action Buttons for Card */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '2px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedSuspect(s)
                    openWhyVessel()
                  }}
                  style={{
                    padding: '6px 10px',
                    background: isSelected ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface-elevated)',
                    border: isSelected ? '1px solid var(--accent-crimson)' : '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    color: isSelected ? 'var(--accent-crimson)' : 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <span>🔍 WHY THIS VESSEL?</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedSuspect(s)
                    showEvidenceOnMap(s.vessel.id)
                  }}
                  style={{
                    padding: '6px 10px',
                    background: 'rgba(0, 240, 255, 0.12)',
                    border: '1px solid var(--accent-cyan)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--accent-cyan)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <span>🗺️ SHOW EVIDENCE</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Suspect Deep Dive Details */}
      {activeSuspect && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              FORENSIC FACTOR EVIDENCE (+POINTS)
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {activeSuspect.vessel.name}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeSuspect.evidenceFactors.map((factor, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  borderBottom: idx < activeSuspect.evidenceFactors.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  paddingBottom: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{factor.name}</span>
                  <span style={{ fontWeight: 800, color: factor.score > (factor.maxScore * 0.7) ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                    +{factor.score} / {factor.maxScore} pts
                  </span>
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                  {factor.description}
                </div>
              </div>
            ))}
          </div>

          {/* Legal Admissibility Notice */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderLeft: '3px solid var(--accent-amber)',
              padding: '6px 10px',
              fontSize: '0.66rem',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              lineHeight: 1.35
            }}
          >
            {activeSuspect.legalAdmissibilityCaveat}
          </div>
        </div>
      )}

      {/* Recalculate Button */}
      <button
        onClick={runAttribution}
        disabled={isProcessing}
        style={{
          marginTop: '4px',
          padding: '8px 14px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid var(--accent-crimson)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--accent-crimson)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.74rem',
          fontWeight: 700,
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <UserCheck size={14} />
        <span>RE-RUN EXPLAINABLE ATTRIBUTION ENGINE</span>
      </button>
    </div>
  )
}
