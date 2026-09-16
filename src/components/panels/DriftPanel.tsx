import React from 'react'
import { History, TrendingUp, Compass, MapPin, ShieldAlert, Play, Pause, Cpu } from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const DriftPanel: React.FC = () => {
  const {
    incident,
    runHindcast,
    runForecast,
    isProcessing,
    setMapFocusTarget,
    startHindcastAnimation,
    pauseHindcastAnimation,
    isHindcastPlaying,
    hindcastPlaybackStep,
    forecastSliderHour,
    setForecastSliderHour,
    startForecastAnimation,
    pauseForecastAnimation,
    isForecastPlaying,
    openExplainAI
  } = useIncident()
  const hindcast = incident.hindcast
  const forecast = incident.forecast
  const origin = hindcast.probableOrigin

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            DRIFT HINDCAST &amp; FORECAST
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

        {/* Animated Hindcast Playback Controls */}
        <div
          style={{
            background: 'var(--bg-primary)',
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              ANIMATED HINDCAST REWIND
            </div>
            <div style={{ fontSize: '0.64rem', color: 'var(--text-secondary)' }}>
              {isHindcastPlaying
                ? `Rewinding step ${hindcastPlaybackStep + 1} / ${hindcast.timeSteps.length}...`
                : 'Simulate inverse drift step-by-step'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={isHindcastPlaying ? pauseHindcastAnimation : startHindcastAnimation}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                background: 'rgba(0, 242, 255, 0.15)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-cyan)',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isHindcastPlaying ? <Pause size={11} /> : <Play size={11} />}
              <span>{isHindcastPlaying ? 'PAUSE' : 'REWIND'}</span>
            </button>

            <button
              onClick={() => openExplainAI('LAGRANGIAN_DRIFT')}
              title="Explain OpenDrift physics"
              style={{
                padding: '5px 8px',
                background: 'transparent',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                fontSize: '0.68rem',
                cursor: 'pointer'
              }}
            >
              <Cpu size={12} />
            </button>
          </div>
        </div>

        <button
          onClick={runHindcast}
          disabled={isProcessing}
          style={{
            marginTop: '2px',
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

        {/* Forecast Time Slider HUD */}
        <div
          style={{
            background: 'var(--bg-primary)',
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
              FORECAST HORIZON: +{forecastSliderHour} HOURS
            </span>
            <button
              onClick={isForecastPlaying ? pauseForecastAnimation : startForecastAnimation}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                background: 'rgba(255, 187, 0, 0.15)',
                border: '1px solid var(--accent-amber)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-amber)',
                fontSize: '0.64rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isForecastPlaying ? <Pause size={10} /> : <Play size={10} />}
              <span>{isForecastPlaying ? 'PAUSE' : 'PLAY 48H'}</span>
            </button>
          </div>

          <input
            type="range"
            min="0"
            max="48"
            step="6"
            value={forecastSliderHour}
            onChange={(e) => setForecastSliderHour(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-amber)' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            <span>T+0h (Detection)</span>
            <span>T+12h</span>
            <span>T+24h</span>
            <span>T+36h</span>
            <span>T+48h (Max Horizon)</span>
          </div>
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
