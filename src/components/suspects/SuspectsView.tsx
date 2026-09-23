import React, { useState } from 'react'
import { useIncident } from '../../state/IncidentContext'
import {
  UserCheck,
  ChevronDown,
  ChevronUp,
  Sliders,
  ExternalLink,
  Ban,
  RotateCcw,
  AlertTriangle,
  Radio,
  Clock,
  Compass,
  Layers
} from 'lucide-react'

export const SuspectsView: React.FC = () => {
  const {
    incident,
    setSelectedSuspect,
    excludedSuspectIds,
    excludeSuspect,
    restoreSuspect,
    showEvidenceOnMap,
    setActiveConsoleView,
    openWhyVessel
  } = useIncident()

  const [expandedSuspectId, setExpandedSuspectId] = useState<string | null>(
    incident.suspects[0]?.vessel.id || null
  )

  const [exclusionModalVesselId, setExclusionModalVesselId] = useState<string | null>(null)
  const [exclusionReason, setExclusionReason] = useState<string>('Physical inspection verified no oily bilge discharge')

  const toggleExpand = (id: string) => {
    setExpandedSuspectId(prev => (prev === id ? null : id))
  }

  const handleConfirmExclude = () => {
    if (exclusionModalVesselId) {
      excludeSuspect(exclusionModalVesselId, exclusionReason)
      setExclusionModalVesselId(null)
    }
  }

  // Filter suspects into active and excluded
  const activeSuspects = incident.suspects.filter(s => !excludedSuspectIds.includes(s.vessel.id))
  const excludedSuspects = incident.suspects.filter(s => excludedSuspectIds.includes(s.vessel.id))

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at 50% 10%, #081324 0%, #050a12 85%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowY: 'auto',
        color: 'var(--text-primary)',
        padding: '24px 32px'
      }}
    >
      {/* View Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <UserCheck size={20} style={{ color: 'var(--accent-coral)' }} />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff' }}>
              Ranked Vessel Suspects & Multi-Factor Scorecards
            </h1>
            <span className="badge badge-simulated" style={{ fontSize: '0.62rem' }}>
              [● SIMULATED DATA]
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Bayesian composite attribution ranking based on spatial proximity, temporal alignment, course coincidence, backward particle overlap, and AIS anomaly profiling.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-coral">
            {activeSuspects.length} ACTIVE CANDIDATES
          </span>
          {excludedSuspects.length > 0 && (
            <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
              {excludedSuspects.length} EXCLUDED
            </span>
          )}
        </div>
      </div>

      {/* Ranked Suspect Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1200px' }}>
        {activeSuspects.map((suspect, idx) => {
          const isExpanded = expandedSuspectId === suspect.vessel.id
          const score = suspect.compositeScore ?? suspect.overallScore
          const isTopRank = idx === 0
          const vessel = suspect.vessel

          return (
            <div
              key={vessel.id}
              className="glass-card"
              style={{
                borderColor: isTopRank ? 'var(--accent-coral)' : 'var(--border-medium)',
                boxShadow: isTopRank ? 'var(--shadow-coral-glow)' : 'var(--shadow-tactical)',
                overflow: 'hidden'
              }}
            >
              {/* Card Summary Banner */}
              <div
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: isTopRank ? 'rgba(244, 63, 94, 0.08)' : 'rgba(255, 255, 255, 0.02)'
                }}
                onClick={() => toggleExpand(vessel.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Rank Badge */}
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      background: isTopRank ? 'var(--accent-coral)' : 'rgba(255, 255, 255, 0.05)',
                      color: isTopRank ? '#ffffff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.1rem',
                      fontWeight: 900,
                      boxShadow: isTopRank ? '0 0 16px rgba(244, 63, 94, 0.5)' : 'none'
                    }}
                  >
                    #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </div>

                  {/* Vessel Information */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
                        {vessel.name}
                      </h3>
                      {isTopRank && (
                        <span className="badge badge-coral" style={{ fontSize: '0.62rem' }}>
                          PRIMARY SUSPECT
                        </span>
                      )}
                      {vessel.hasBlackout && (
                        <span className="badge badge-amber" style={{ fontSize: '0.62rem' }}>
                          ⚠️ AIS BLACKOUT ({vessel.blackoutDurationMin || 45}m)
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      IMO: {vessel.imo} | MMSI: {vessel.mmsi} | FLAG: {vessel.flagCountry} ({vessel.flag}) | TYPE: {vessel.vesselType.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>

                {/* Score & Expand Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      className="hero-number"
                      style={{
                        color: isTopRank ? 'var(--accent-coral)' : score > 60 ? 'var(--accent-amber)' : 'var(--text-muted)',
                        fontSize: '1.65rem'
                      }}
                    >
                      {score}%
                    </div>
                    <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      ATTRIBUTION SCORE
                    </div>
                  </div>

                  <div style={{ color: 'var(--text-muted)' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {/* Expandable 5-Factor Sub-Score Breakdown */}
              {isExpanded && (
                <div
                  style={{
                    padding: '20px',
                    borderTop: '1px solid var(--border-subtle)',
                    background: 'rgba(5, 10, 18, 0.85)'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '14px' }}>
                    Transparent Bayesian Evidence Breakdown (5 Orthogonal Factors):
                  </div>

                  {/* 5 Sub-score Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
                    {/* Factor 1: Spatial Proximity */}
                    <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <Compass size={14} style={{ color: 'var(--accent-teal)' }} />
                        <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          SPATIAL CPA
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                        {suspect.cpaDistanceNm || 0.82} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>NM</span>
                      </div>
                      <div style={{ fontSize: '0.64rem', color: 'var(--accent-teal)', marginTop: '4px' }}>
                        Sub-Score: {idx === 0 ? '96%' : '64%'}
                      </div>
                    </div>

                    {/* Factor 2: Temporal Compatibility */}
                    <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <Clock size={14} style={{ color: 'var(--accent-amber)' }} />
                        <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          TIME DELTA (Δt)
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                        {suspect.cpaTimeDeltaMin || 18} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MIN</span>
                      </div>
                      <div style={{ fontSize: '0.64rem', color: 'var(--accent-amber)', marginTop: '4px' }}>
                        Sub-Score: {idx === 0 ? '94%' : '58%'}
                      </div>
                    </div>

                    {/* Factor 3: Trajectory Alignment */}
                    <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <Radio size={14} style={{ color: 'var(--accent-green)' }} />
                        <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          COURSE MATCH
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                        {vessel.cogDegrees}° <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>HDG</span>
                      </div>
                      <div style={{ fontSize: '0.64rem', color: 'var(--accent-green)', marginTop: '4px' }}>
                        Sub-Score: {idx === 0 ? '89%' : '42%'}
                      </div>
                    </div>

                    {/* Factor 4: Drift Overlap */}
                    <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <Layers size={14} style={{ color: 'var(--accent-teal)' }} />
                        <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          PARTICLE OVERLAP
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                        {idx === 0 ? '91.2%' : '34.5%'}
                      </div>
                      <div style={{ fontSize: '0.64rem', color: 'var(--accent-teal)', marginTop: '4px' }}>
                        Sub-Score: {idx === 0 ? '91%' : '35%'}
                      </div>
                    </div>

                    {/* Factor 5: AIS Anomaly Profile */}
                    <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <AlertTriangle size={14} style={{ color: 'var(--accent-coral)' }} />
                        <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          AIS ANOMALY
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: vessel.hasBlackout ? 'var(--accent-coral)' : '#ffffff' }}>
                        {vessel.hasBlackout ? `${vessel.blackoutDurationMin || 45}m GAP` : 'NOMINAL'}
                      </div>
                      <div style={{ fontSize: '0.64rem', color: vessel.hasBlackout ? 'var(--accent-coral)' : 'var(--text-muted)', marginTop: '4px' }}>
                        Sub-Score: {vessel.hasBlackout ? '+22% Risk' : '0% Base'}
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => {
                          showEvidenceOnMap(vessel.id)
                          setActiveConsoleView('MAP')
                        }}
                        className="btn-tactical"
                        style={{ height: '34px', fontSize: '0.72rem' }}
                      >
                        <ExternalLink size={13} />
                        <span>SHOW INTERCEPT ON MAP</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedSuspect(suspect)
                          setActiveConsoleView('WHAT_IF')
                        }}
                        className="btn-tactical-amber"
                        style={{ height: '34px', fontSize: '0.72rem' }}
                      >
                        <Sliders size={13} />
                        <span>WHAT-IF SENSITIVITY TEST</span>
                      </button>

                      <button
                        onClick={openWhyVessel}
                        className="btn-tactical-secondary"
                        style={{ height: '34px', fontSize: '0.72rem' }}
                      >
                        <span>EXPLAIN BAYESIAN WEIGHTS</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setExclusionModalVesselId(vessel.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: 'rgba(244, 63, 94, 0.08)',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--accent-coral)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Ban size={13} />
                      <span>EXCLUDE CANDIDATE</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Excluded Candidates Section */}
        {excludedSuspects.length > 0 && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '10px' }}>
              EXCLUDED FROM ATTRIBUTION POOL:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {excludedSuspects.map((s) => (
                <div
                  key={s.vessel.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    opacity: 0.7
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      [EXCLUDED]
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>{s.vessel.name}</strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      IMO: {s.vessel.imo}
                    </span>
                  </div>

                  <button
                    onClick={() => restoreSuspect(s.vessel.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'transparent',
                      border: '1px solid var(--accent-teal)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '4px 10px',
                      color: 'var(--accent-teal)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <RotateCcw size={12} />
                    <span>RESTORE</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Exclusion Reason Modal */}
      {exclusionModalVesselId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            className="glass-hud"
            style={{
              width: '460px',
              maxWidth: '92vw',
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--accent-coral)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--accent-coral)' }}>
              <Ban size={20} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900 }}>
                Exclude Vessel from Attribution Pool
              </h3>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
              Excluding this candidate will dynamically recalculate the ranked suspect leaderboard. Please record the forensic justification for the MARPOL Annex I investigative audit trail:
            </p>

            <textarea
              value={exclusionReason}
              onChange={(e) => setExclusionReason(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(5, 10, 18, 0.8)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                outline: 'none',
                marginBottom: '18px'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setExclusionModalVesselId(null)}
                className="btn-tactical-secondary"
                style={{ padding: '6px 14px', fontSize: '0.72rem' }}
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmExclude}
                className="btn-tactical-coral"
                style={{ padding: '6px 16px', fontSize: '0.72rem' }}
              >
                CONFIRM EXCLUSION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
