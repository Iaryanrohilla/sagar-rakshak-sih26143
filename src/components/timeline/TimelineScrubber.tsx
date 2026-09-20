import React, { useState } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Wind,
  Waves,
  ShieldAlert
} from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const TimelineScrubber: React.FC = () => {
  const {
    incident,
    hindcastPlaybackStep,
    isHindcastPlaying,
    startHindcastAnimation,
    pauseHindcastAnimation,
    setHindcastPlaybackStep,
    forecastSliderHour,
    isForecastPlaying,
    startForecastAnimation,
    pauseForecastAnimation,
    setForecastSliderHour
  } = useIncident()

  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [activeTimelineDomain, setActiveTimelineDomain] = useState<'HINDCAST' | 'FORECAST'>('HINDCAST')

  const originTime = incident.hindcast.probableOrigin.releaseTime
  const detectionTime = incident.scene.acquisitionTime
  const maxForecastHours = 48
  const spillAge = incident.characterisation.spillAgeHours

  // Play/Pause unified toggle
  const isPlaying = activeTimelineDomain === 'HINDCAST' ? isHindcastPlaying : isForecastPlaying

  const handlePlayPause = () => {
    if (activeTimelineDomain === 'HINDCAST') {
      if (isHindcastPlaying) {
        pauseHindcastAnimation()
      } else {
        startHindcastAnimation()
      }
    } else {
      if (isForecastPlaying) {
        pauseForecastAnimation()
      } else {
        startForecastAnimation()
      }
    }
  }

  const handleReset = () => {
    if (activeTimelineDomain === 'HINDCAST') {
      pauseHindcastAnimation()
      setHindcastPlaybackStep(0)
    } else {
      pauseForecastAnimation()
      setForecastSliderHour(0)
    }
  }

  // Calculate current label
  const currentStepTime = activeTimelineDomain === 'HINDCAST'
    ? (hindcastPlaybackStep === 0
        ? `T₀ -${spillAge.toFixed(1)}h [ORIGIN RELEASE]`
        : `T -${((4 - hindcastPlaybackStep) * (spillAge / 4)).toFixed(1)}h [HINDCAST]`)
    : (forecastSliderHour === 0
        ? `T+0.0h [SATELLITE PASS]`
        : `T+${forecastSliderHour.toFixed(1)}h [48h FORECAST CONE]`)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '12px',
        left: '14px',
        right: '14px',
        zIndex: 900,
        background: 'rgba(8, 12, 22, 0.92)',
        backdropFilter: 'blur(16px) saturate(140%)',
        border: '1px solid rgba(0, 240, 255, 0.35)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.75), 0 0 15px rgba(0, 240, 255, 0.15)',
        padding: '10px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      {/* Top Telemetry Header of Scrubber */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulse-dot cyan" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
              TIMELINE SCRUBBER // LAGRANGIAN DRIFT &amp; AIS REPLAY
            </span>
          </div>

          <span
            className="badge"
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--accent-amber)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              fontSize: '0.65rem'
            }}
            title="Metocean drift and AIS replay are mathematically simulated for this exercise."
          >
            ● SIMULATED FEED
          </span>
        </div>

        {/* Metocean Realtime Telemetry Readout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Wind size={13} style={{ color: 'var(--accent-cyan)' }} />
            <span>WIND: <strong style={{ color: 'var(--text-primary)' }}>{incident.metocean.windDirectionDegrees}° @ {incident.metocean.windSpeedKnots} kts</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Waves size={13} style={{ color: 'var(--accent-cyan)' }} />
            <span>CURRENT: <strong style={{ color: 'var(--text-primary)' }}>{incident.metocean.currentDirectionDegrees}° @ {incident.metocean.currentSpeedKnots} kts</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldAlert size={13} style={{ color: 'var(--accent-crimson)' }} />
            <span>LANDFALL THREAT: <strong style={{ color: 'var(--accent-crimson)' }}>94% CRITICAL</strong></span>
          </div>
        </div>
      </div>

      {/* Scrubber Controls & Track Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 240, 255, 0.15)',
            border: isPlaying ? '1px solid var(--accent-crimson)' : '1px solid var(--accent-cyan)',
            color: isPlaying ? 'var(--accent-crimson)' : 'var(--accent-cyan)',
            cursor: 'pointer',
            boxShadow: isPlaying ? '0 0 10px rgba(239, 68, 68, 0.4)' : '0 0 10px rgba(0, 240, 255, 0.3)',
            transition: 'all 0.15s ease'
          }}
          title={isPlaying ? 'Pause Simulation Replay' : 'Play Simulation Replay'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
        </button>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
          title="Reset to Origin / Zero Point"
        >
          <RotateCcw size={14} />
        </button>

        {/* Domain Mode Switcher (Backward Hindcast vs Forward 48h Forecast) */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(4, 7, 14, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px'
          }}
        >
          <button
            onClick={() => {
              setActiveTimelineDomain('HINDCAST')
              pauseForecastAnimation()
            }}
            style={{
              padding: '4px 10px',
              border: 'none',
              borderRadius: '2px',
              background: activeTimelineDomain === 'HINDCAST' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTimelineDomain === 'HINDCAST' ? '#080C16' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            REWIND TO ORIGIN (-{spillAge.toFixed(1)}h)
          </button>
          <button
            onClick={() => {
              setActiveTimelineDomain('FORECAST')
              pauseHindcastAnimation()
            }}
            style={{
              padding: '4px 10px',
              border: 'none',
              borderRadius: '2px',
              background: activeTimelineDomain === 'FORECAST' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTimelineDomain === 'FORECAST' ? '#080C16' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            48h FORWARD FORECAST (+48h)
          </button>
        </div>

        {/* Current Active Scrubber Slider */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            <span>
              {activeTimelineDomain === 'HINDCAST'
                ? `Release Origin [${originTime.slice(11, 16)} UTC]`
                : `Satellite Acquisition [${detectionTime.slice(11, 16)} UTC]`}
            </span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>
              {currentStepTime}
            </span>
            <span>
              {activeTimelineDomain === 'HINDCAST'
                ? `Current Detection [${detectionTime.slice(11, 16)} UTC]`
                : `+48h Shoreline Landfall`}
            </span>
          </div>

          {activeTimelineDomain === 'HINDCAST' ? (
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={hindcastPlaybackStep}
              onChange={(e) => setHindcastPlaybackStep(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--accent-cyan)',
                cursor: 'pointer',
                height: '6px'
              }}
            />
          ) : (
            <input
              type="range"
              min={0}
              max={maxForecastHours}
              step={1}
              value={forecastSliderHour}
              onChange={(e) => setForecastSliderHour(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--accent-cyan)',
                cursor: 'pointer',
                height: '6px'
              }}
            />
          )}
        </div>

        {/* Playback Speed Multiplier */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[1, 2, 5].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              style={{
                padding: '3px 7px',
                borderRadius: 'var(--radius-sm)',
                border: playbackSpeed === spd ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                background: playbackSpeed === spd ? 'rgba(0, 240, 255, 0.15)' : 'rgba(4, 7, 14, 0.6)',
                color: playbackSpeed === spd ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
