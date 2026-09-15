import React from 'react'
import { History, TrendingUp, Compass, MapPin, ShieldAlert } from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const DriftPanel: React.FC = () => {
  const { incident, runHindcast, runForecast, isProcessing, setMapFocusTarget } = useIncident()
  const hindcast = incident.hindcast
  const forecast = incident.forecast
  const origin = hindcast.probableOrigin

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            DRIFT HINDCAST &amp; FORECAST (ST4)
          </h3>
        </div>
        <span className="badge badge-cyan">OPENDRIFT SIMULATION</span>
      </div>

      {/* Probable Origin Hero Card */}
      <div
        style={{
          background: 'rgba(0, 242, 255, 0.08)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>PROBABLE RELEASE ORIGIN:</span>
          <span className="badge badge-cyan">{origin.confidencePercent}% CONFIDENCE</span>
        </div>

        <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
          {origin.coordinates[0].toFixed(3)}°N, {origin.coordinates[1].toFixed(3)}°E
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Search Radius:</span> <strong>{origin.searchRadiusKm} km</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Release Time:</span> <strong>{origin.releaseTime.slice(11, 19)} UTC</strong>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Location:</span> <strong>{origin.locationDescription}</strong>
          </div>
        </div>

        <button
          onClick={() => setMapFocusTarget(origin.coordinates)}
          style={{
            marginTop: '6px',
            padding: '6px 10px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--accent-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <MapPin size={12} />
          <span>FOCUS MAP ON ORIGIN ELLIPSE</span>
        </button>
      </div>

      {/* Hindcast Model Specifications */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          LAGRANGIAN HYDRODYNAMIC SIMULATION ENGINE
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Hydrodynamic Model:</span>
            <div>HYCOM Global 1/12°</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Wind Forcing:</span>
            <div>ECMWF ERA5 (3% Windage)</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Particles Tracked:</span>
            <div>{hindcast.particlesSimulated} Lagrangian Tracers</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Stokes Drift Factor:</span>
            <div>{incident.metocean.stokesDriftKnots} kts wave drift</div>
          </div>
        </div>

        <button
          onClick={runHindcast}
          disabled={isProcessing}
          style={{
            marginTop: '6px',
            padding: '8px 14px',
            background: 'rgba(0, 242, 255, 0.15)',
            border: '1px solid var(--accent-cyan)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--accent-cyan)',
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
          <History size={14} />
          <span>RE-RUN BACKWARD HINDCAST TO ORIGIN</span>
        </button>
      </div>

      {/* Forward Forecast & Coastal Landfall Risk */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            FORWARD DRIFT &amp; LANDFALL IMPACT (48H)
          </span>
          <span className={`badge ${forecast.landfallRisk.riskLevel === 'CRITICAL' ? 'badge-crimson' : forecast.landfallRisk.riskLevel === 'HIGH' ? 'badge-amber' : 'badge-emerald'}`}>
            {forecast.landfallRisk.riskLevel} RISK
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
          {forecast.landfallRisk.threatensCoast ? (
            <div style={{ color: 'var(--accent-crimson)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={14} />
              <span>COASTAL LANDFALL IMMINENT: {forecast.landfallRisk.estimatedLandfallTime}</span>
            </div>
          ) : (
            <div style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={14} />
              <span>Offshore trajectory — No immediate mainland coastline impact.</span>
            </div>
          )}

          {forecast.landfallRisk.vulnerableZone && (
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Vulnerable Zone:</span> <strong>{forecast.landfallRisk.vulnerableZone}</strong>
            </div>
          )}

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px', borderRadius: 'var(--radius-sm)', marginTop: '4px', lineHeight: 1.4 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Containment Strategy:</span> {forecast.landfallRisk.containmentPriority}
          </div>
        </div>

        <button
          onClick={runForecast}
          disabled={isProcessing}
          style={{
            marginTop: '6px',
            padding: '8px 14px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid var(--accent-amber)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--accent-amber)',
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
          <TrendingUp size={14} />
          <span>RUN 48-HOUR FORWARD DRIFT FORECAST</span>
        </button>
      </div>
    </div>
  )
}
