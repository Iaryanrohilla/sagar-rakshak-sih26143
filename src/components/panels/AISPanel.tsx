import React from 'react'
import { Radio, AlertOctagon, Anchor, MapPin } from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const AISPanel: React.FC = () => {
  const { incident, runAISCorrelation, isProcessing, setSelectedSuspect, setMapFocusTarget } = useIncident()
  const vessels = incident.aisVessels
  const blackoutsCount = vessels.filter((v) => v.hasBlackout).length

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={18} style={{ color: 'var(--accent-blue)' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>
            AIS TRAFFIC CORRELATION (ST5)
          </h3>
        </div>
        <span className="badge badge-cyan">{vessels.length} VESSELS CORRELATED</span>
      </div>

      {/* AIS Stream Summary Banner */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>CORRELATION WINDOW:</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {incident.characterisation.releaseWindowStart.slice(11, 16)} — {incident.characterisation.releaseWindowEnd.slice(11, 16)} UTC
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>BLACKOUT ANOMALIES:</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: blackoutsCount > 0 ? 'var(--accent-crimson)' : 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
            {blackoutsCount} FLAGGED
          </div>
        </div>
      </div>

      {/* Vessel List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          CORRELATED MARITIME TRAFFIC (SPATIO-TEMPORAL BOUNDING BOX)
        </span>

        {vessels.map((vessel) => {
          const suspectMatch = incident.suspects.find((s) => s.vessel.id === vessel.id)
          const isTop = suspectMatch && suspectMatch.rank === 1

          return (
            <div
              key={vessel.id}
              style={{
                background: isTop ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-surface)',
                border: `1px solid ${isTop ? 'var(--accent-crimson)' : vessel.hasBlackout ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Anchor size={14} style={{ color: isTop ? 'var(--accent-crimson)' : 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {vessel.name}
                  </span>
                </div>
                {isTop && <span className="badge badge-crimson">#1 SUSPECT</span>}
                {!isTop && vessel.hasBlackout && <span className="badge badge-amber">AIS GAP</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>IMO:</span> <strong>{vessel.imo}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>MMSI:</span> <strong>{vessel.mmsi}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Type:</span> <strong>{vessel.vesselType.replace(/_/g, ' ')}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Flag:</span> <strong>{vessel.flagCountry} ({vessel.flag})</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Speed / Course:</span> <strong>{vessel.sogKnots} kts / {vessel.cogDegrees}°</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Draught:</span> <strong>{vessel.draughtMeters}m</strong>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Destination:</span> <strong>{vessel.destination}</strong>
                </div>
              </div>

              {/* Blackout Anomaly Callout */}
              {vessel.hasBlackout && vessel.blackoutAnomaly && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px',
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-crimson)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <AlertOctagon size={13} />
                    <span>SOLAS ANOMALY: {vessel.blackoutAnomaly.durationHours}H AIS TRANSPONDER BLACKOUT</span>
                  </div>
                  <div>
                    Dark Segment: {vessel.blackoutAnomaly.startTime.slice(11, 16)} to {vessel.blackoutAnomaly.endTime.slice(11, 16)} UTC ({vessel.blackoutAnomaly.distanceTraveledKm} km covered)
                  </div>
                  <div style={{ color: 'var(--text-primary)' }}>
                    Transponder switched off 10 NM prior to spill origin and resumed after crossing release centroid.
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  onClick={() => {
                    if (suspectMatch) setSelectedSuspect(suspectMatch)
                    setMapFocusTarget(vessel.currentPosition)
                  }}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--accent-cyan)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <MapPin size={11} />
                  <span>TRACK ON MAP</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={runAISCorrelation}
        disabled={isProcessing}
        style={{
          marginTop: '6px',
          padding: '8px 14px',
          background: 'rgba(59, 130, 246, 0.15)',
          border: '1px solid var(--accent-blue)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--accent-blue)',
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
        <Radio size={14} />
        <span>RE-CORRELATE AIS MARITIME FEED</span>
      </button>
    </div>
  )
}
