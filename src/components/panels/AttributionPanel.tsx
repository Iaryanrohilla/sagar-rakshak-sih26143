import React from 'react'
import { UserCheck } from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const AttributionPanel: React.FC = () => {
  const { incident, selectedSuspect, setSelectedSuspect, runAttribution, isProcessing, setMapFocusTarget } = useIncident()
  const suspects = incident.suspects
  const activeSuspect = selectedSuspect || suspects[0]

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={18} style={{ color: 'var(--accent-crimson)' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-crimson)' }}>
            VESSEL ATTRIBUTION ENGINE
          </h3>
        </div>
        <span className="badge badge-crimson">EXPLAINABLE RANKING</span>
      </div>

      {/* Suspect Leaderboard Selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          RANKED SUSPECT LEADERBOARD:
        </span>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {suspects.map((s) => {
            const isSelected = activeSuspect && activeSuspect.vessel.id === s.vessel.id
            return (
              <button
                key={s.vessel.id}
                onClick={() => {
                  setSelectedSuspect(s)
                  setMapFocusTarget(s.vessel.currentPosition)
                }}
                style={{
                  flex: 1,
                  minWidth: '160px',
                  padding: '8px 12px',
                  background: isSelected ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-surface)',
                  border: `1px solid ${isSelected ? 'var(--accent-crimson)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.72rem', color: isSelected ? 'var(--accent-crimson)' : 'var(--text-secondary)' }}>
                    RANK #{s.rank}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {s.vessel.name.slice(0, 14)}
                  </div>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: s.overallScore > 80 ? 'var(--accent-crimson)' : 'var(--text-secondary)' }}>
                  {s.overallScore}%
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Deep-Dive Explainable Breakdown Card */}
      {activeSuspect ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Hero Banner for Selected Suspect */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--accent-crimson)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>PRIMARY SUSPECT:</span>
              <span className="badge badge-crimson">{activeSuspect.confidenceLevel} ATTRIBUTION CONFIDENCE</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {activeSuspect.vessel.name}
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-crimson)', fontFamily: 'var(--font-mono)' }}>
                {activeSuspect.overallScore}/100
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              <div>IMO: <strong>{activeSuspect.vessel.imo}</strong></div>
              <div>MMSI: <strong>{activeSuspect.vessel.mmsi}</strong></div>
              <div>Type: <strong>{activeSuspect.vessel.vesselType.replace(/_/g, ' ')}</strong></div>
              <div>Flag: <strong>{activeSuspect.vessel.flagCountry} ({activeSuspect.vessel.flag})</strong></div>
            </div>

            {/* Legal Admissibility Disclaimer */}
            <div
              style={{
                marginTop: '6px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderLeft: '3px solid var(--accent-amber)',
                padding: '6px 10px',
                fontSize: '0.68rem',
                color: 'var(--text-secondary)',
                fontStyle: 'italic',
                lineHeight: 1.35
              }}
            >
              {activeSuspect.legalAdmissibilityCaveat}
            </div>
          </div>

          {/* Explainable Factor Score Points */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              FORENSIC EVIDENCE FACTORS BREAKDOWN (+POINTS)
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeSuspect.evidenceFactors.map((factor, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: idx < activeSuspect.evidenceFactors.length - 1 ? '1px solid var(--border-subtle)' : 'none', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{factor.name}</span>
                    <span style={{ fontWeight: 800, color: factor.score > (factor.maxScore * 0.7) ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                      +{factor.score} / {factor.maxScore} pts
                    </span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    {factor.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Authority Action */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              RECOMMENDED ENFORCEMENT ACTION:
            </span>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {activeSuspect.recommendedAction}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          No suspect vessel ranked. Click button below to evaluate attribution.
        </div>
      )}

      <button
        onClick={runAttribution}
        disabled={isProcessing}
        style={{
          marginTop: '6px',
          padding: '8px 14px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid var(--accent-crimson)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--accent-crimson)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
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
