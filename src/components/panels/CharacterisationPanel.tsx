import React from 'react'
import { Sparkles } from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const CharacterisationPanel: React.FC = () => {
  const { incident, runCharacterisation, isProcessing } = useIncident()
  const char = incident.characterisation
  const wp = char.weatheringPhysics

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} style={{ color: 'var(--accent-purple)' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
            CHARACTERISATION &amp; AGEING (ST3)
          </h3>
        </div>
        <span className="badge badge-purple">{char.spillAgeHours}H ESTIMATED AGE</span>
      </div>

      {/* Spill Age & Release Window Hero Card */}
      <div
        style={{
          background: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid var(--accent-purple)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>ESTIMATED SPILL AGE:</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
            {char.spillAgeHours} HOURS AGO
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>ESTIMATED RELEASE WINDOW:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
            {char.releaseWindowStart.slice(11, 16)} — {char.releaseWindowEnd.slice(11, 16)} UTC
          </span>
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '4px' }}>
          Computed via Mackay physical evaporation kinetics &amp; Fay spreading equations cross-referenced against Metocean sea surface temperature ({incident.metocean.seaTemperatureCelsius}°C) and wind velocity ({incident.metocean.windSpeedKnots} kts).
        </div>
      </div>

      {/* Geometric Dimensions */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          SLICK MORPHOLOGY &amp; SPREADING GEOMETRY
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Surface Area:</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {char.surfaceAreaKm2} km²
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Perimeter:</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {char.perimeterKm} km
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Elongation Ratio:</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
              {char.elongationRatio}:1
            </div>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Major: {char.majorAxisKm}km / Minor: {char.minorAxisKm}km</span>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Spreading Axis:</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {char.orientationDegrees}° Azimuth
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Estimated Volume:</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
              ~{char.estimatedVolumeM3} m³
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Crude Classification:</span>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {wp.oilType.slice(0, 18)}
            </div>
          </div>
        </div>
      </div>

      {/* Mackay Weathering Kinetics & Curves */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          MACKAY PHYSICAL WEATHERING METRICS
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px 4px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>EVAPORATED</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{wp.evaporationPercent}%</div>
          </div>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px 4px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>EMULSIFIED</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{wp.emulsificationPercent}%</div>
          </div>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px 4px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>VISCOSITY</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{wp.currentViscosityCst} cSt</div>
          </div>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px 4px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>REMAINING</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{wp.remainingMassPercent}%</div>
          </div>
        </div>

        {/* Visual Weathering Progression */}
        {wp.weatheringCurve.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>WEATHERING PROGRESSION OVER TIME:</span>
            {wp.weatheringCurve.slice(0, 5).map((pt, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '40px', color: 'var(--text-muted)' }}>T+{pt.hour}h:</span>
                <div style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${pt.evaporationPercent}%`, background: 'var(--accent-cyan)' }} title="Evaporation" />
                  <div style={{ width: `${pt.emulsificationPercent * 0.4}%`, background: 'var(--accent-amber)' }} title="Emulsification" />
                </div>
                <span style={{ width: '70px', textAlign: 'right', color: 'var(--text-secondary)' }}>{pt.viscosityCst} cSt</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={runCharacterisation}
          disabled={isProcessing}
          style={{
            marginTop: '8px',
            padding: '8px 14px',
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid var(--accent-purple)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--accent-purple)',
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
          <Sparkles size={14} />
          <span>RE-CALCULATE PHYSICAL CHARACTERISATION &amp; AGE</span>
        </button>
      </div>
    </div>
  )
}
