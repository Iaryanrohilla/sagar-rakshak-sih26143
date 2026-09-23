import React from 'react'
import { useIncident } from '../../state/IncidentContext'
import {
  Sliders,
  RotateCcw,
  ShieldCheck,
  Compass,
  Wind,
  Clock,
  Layers,
  Activity,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react'

export const WhatIfView: React.FC = () => {
  const {
    incident,
    whatIfPerturbation,
    whatIfResult,
    setWhatIfPerturbation,
    resetWhatIfPerturbation,
    setActiveConsoleView,
    triggerFocusPreset
  } = useIncident()

  const {
    currentSpeedDeltaKnots,
    currentDirectionDeltaDeg,
    windLeewayPercent,
    releaseTimeDeltaHours
  } = whatIfPerturbation

  const topVessel = incident.suspects[0]?.vessel.name || 'Primary Suspect'

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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Sliders size={20} style={{ color: 'var(--accent-amber)' }} />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff' }}>
              What-If Hydrodynamic Sensitivity & Court Defensibility Testing
            </h1>
            <span className="badge badge-simulated" style={{ fontSize: '0.62rem' }}>
              [● SIMULATED DATA]
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Perturb ocean current speed, current heading, wind leeway coefficients, and discharge windows to demonstrate attribution robustness under cross-examination.
          </p>
        </div>

        <button
          onClick={resetWhatIfPerturbation}
          className="btn-tactical-secondary"
          style={{ height: '36px', padding: '0 14px', fontSize: '0.72rem', gap: '6px' }}
        >
          <RotateCcw size={14} />
          <span>RESET TO METOCEAN BASELINE</span>
        </button>
      </div>

      {/* Main Grid: Left Controls + Right Outcome Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '460px 1fr', gap: '24px', maxWidth: '1380px' }}>
        {/* Left Column: Sensitivity Perturbation Sliders */}
        <div
          className="glass-hud"
          style={{
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={16} style={{ color: 'var(--accent-teal)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-teal)' }}>
                PERTURBATION CONTROLS
              </span>
            </div>
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              MONTE CARLO DRIFT ENGINE
            </span>
          </div>

          {/* Slider 1: Current Speed Delta */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>1. OCEAN CURRENT SPEED OFFSET</span>
              <strong style={{ color: 'var(--accent-teal)' }}>
                {currentSpeedDeltaKnots >= 0 ? '+' : ''}{currentSpeedDeltaKnots.toFixed(2)} kts
              </strong>
            </div>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.05"
              value={currentSpeedDeltaKnots}
              onChange={(e) => setWhatIfPerturbation({ currentSpeedDeltaKnots: parseFloat(e.target.value) })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              <span>-0.50 kts (Slack)</span>
              <span>Baseline: {incident.metocean.currentSpeedKnots} kts</span>
              <span>+0.50 kts (Spring Flood)</span>
            </div>
          </div>

          {/* Slider 2: Current Direction Delta */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>2. CURRENT HEADING PERTURBATION</span>
              <strong style={{ color: 'var(--accent-amber)' }}>
                {currentDirectionDeltaDeg >= 0 ? '+' : ''}{currentDirectionDeltaDeg}°
              </strong>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="5"
              value={currentDirectionDeltaDeg}
              onChange={(e) => setWhatIfPerturbation({ currentDirectionDeltaDeg: parseInt(e.target.value) })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              <span>-30° (Port Deflection)</span>
              <span>Baseline: {incident.metocean.currentDirectionDegrees}°</span>
              <span>+30° (Stbd Deflection)</span>
            </div>
          </div>

          {/* Slider 3: Wind Leeway % */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>3. WINDAGE LEEWAY FACTOR</span>
              <strong style={{ color: 'var(--accent-green)' }}>
                {windLeewayPercent.toFixed(1)}%
              </strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.2"
              value={windLeewayPercent}
              onChange={(e) => setWhatIfPerturbation({ windLeewayPercent: parseFloat(e.target.value) })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              <span>1.0% (Sub-surface)</span>
              <span>Baseline: 3.0%</span>
              <span>5.0% (Light Sheen)</span>
            </div>
          </div>

          {/* Slider 4: Release Time Window */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>4. RELEASE TIME WINDOW SHIFT</span>
              <strong style={{ color: 'var(--accent-coral)' }}>
                {releaseTimeDeltaHours >= 0 ? '+' : ''}{releaseTimeDeltaHours.toFixed(1)} hours
              </strong>
            </div>
            <input
              type="range"
              min="-3.0"
              max="3.0"
              step="0.5"
              value={releaseTimeDeltaHours}
              onChange={(e) => setWhatIfPerturbation({ releaseTimeDeltaHours: parseFloat(e.target.value) })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              <span>-3.0h (Earlier Spill)</span>
              <span>Baseline: {incident.characterisation.spillAgeHours}h Age</span>
              <span>+3.0h (Later Spill)</span>
            </div>
          </div>

          {/* Perturbed Origin Coordinates Preview */}
          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(5, 10, 18, 0.75)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ color: 'var(--text-muted)', fontSize: '0.64rem' }}>
              PERTURBED REVERSE DRIFT ORIGIN (T₀):
            </div>
            <div style={{ color: '#ffffff', fontWeight: 800 }}>
              {whatIfResult.perturbedOriginCoords[0].toFixed(3)}°N, {whatIfResult.perturbedOriginCoords[1].toFixed(3)}°E
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.66rem' }}>
              Shift from Baseline: <strong style={{ color: 'var(--accent-coral)' }}>{whatIfResult.centroidErrorKm} km</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Outcomes & Court Defensibility Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Hero KPI Counters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            {/* KPI 1: Rank Retention */}
            <div className="glass-card" style={{ padding: '16px 18px', borderColor: 'var(--border-coral)' }}>
              <div
                className="hero-number-lg"
                style={{
                  color: whatIfResult.rankRetentionPercent >= 85 ? 'var(--accent-green)' : whatIfResult.rankRetentionPercent >= 70 ? 'var(--accent-amber)' : 'var(--accent-coral)'
                }}
              >
                {whatIfResult.rankRetentionPercent}<span className="hero-unit">%</span>
              </div>
              <div className="hero-label">Rank #1 Retention Rate</div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Stability of {topVessel} across 100 trials
              </div>
            </div>

            {/* KPI 2: Correlation Variance */}
            <div className="glass-card" style={{ padding: '16px 18px', borderColor: 'var(--border-amber)' }}>
              <div className="hero-number-lg" style={{ color: 'var(--accent-amber)' }}>
                ±{whatIfResult.correlationVariancePercent}<span className="hero-unit">%</span>
              </div>
              <div className="hero-label">Correlation Variance (σ)</div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Score dispersion under drift perturbation
              </div>
            </div>

            {/* KPI 3: Spatial Overlap */}
            <div className="glass-card" style={{ padding: '16px 18px', borderColor: 'var(--border-strong)' }}>
              <div className="hero-number-lg" style={{ color: 'var(--accent-teal)' }}>
                {whatIfResult.spatialOverlapPercent}<span className="hero-unit">%</span>
              </div>
              <div className="hero-label">Spatial Kernel Overlap</div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Intersection with vessel corridor
              </div>
            </div>

            {/* KPI 4: Centroid Error */}
            <div className="glass-card" style={{ padding: '16px 18px', borderColor: 'var(--border-subtle)' }}>
              <div className="hero-number-lg" style={{ color: whatIfResult.centroidErrorKm <= 2.5 ? 'var(--accent-green)' : 'var(--accent-coral)' }}>
                {whatIfResult.centroidErrorKm}<span className="hero-unit">km</span>
              </div>
              <div className="hero-label">Centroid Drift Shift</div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Displacement from baseline $T_0$
              </div>
            </div>
          </div>

          {/* Plain-Language Forensic Readout Box */}
          <div
            className="glass-card"
            style={{
              padding: '20px 24px',
              border: `1.5px solid ${whatIfResult.defensibilityRating.startsWith('HIGH') ? 'var(--accent-teal)' : 'var(--accent-amber)'}`,
              background: 'rgba(9, 17, 30, 0.95)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} style={{ color: 'var(--accent-teal)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', fontWeight: 800, color: 'var(--accent-teal)' }}>
                  COURT-DEFENSIBLE FORENSIC SENSITIVITY READOUT
                </span>
              </div>
              <span
                className="badge"
                style={{
                  background: whatIfResult.defensibilityRating.startsWith('HIGH') ? 'rgba(0, 210, 180, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: whatIfResult.defensibilityRating.startsWith('HIGH') ? 'var(--accent-teal)' : 'var(--accent-amber-bright)',
                  border: `1px solid ${whatIfResult.defensibilityRating.startsWith('HIGH') ? 'var(--accent-teal)' : 'var(--accent-amber)'}`
                }}
              >
                DEFENSIBILITY: {whatIfResult.defensibilityRating}
              </span>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '14px' }}>
              {whatIfResult.forensicSensitivityReadout}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              <span>LEGAL STATUTE: MARPOL Annex I Article 4</span>
              <span>|</span>
              <span>INDIAN EVIDENCE ACT: Sec. 65B Electronic Certificate</span>
            </div>
          </div>

          {/* Perturbed Leaderboard Ranking Table */}
          <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>
              Recomputed Suspect Attribution Under Perturbation:
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', fontFamily: 'var(--font-mono)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '8px 10px' }}>RANK</th>
                  <th style={{ padding: '8px 10px' }}>VESSEL NAME</th>
                  <th style={{ padding: '8px 10px' }}>IMO / MMSI</th>
                  <th style={{ padding: '8px 10px' }}>BASELINE SCORE</th>
                  <th style={{ padding: '8px 10px' }}>PERTURBED SCORE</th>
                  <th style={{ padding: '8px 10px' }}>SCORE DELTA</th>
                </tr>
              </thead>
              <tbody>
                {whatIfResult.recomputedSuspects.map((item) => {
                  const base = item.suspect.compositeScore ?? item.suspect.overallScore
                  return (
                    <tr key={item.suspect.vessel.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px', fontWeight: 800, color: item.retainedRank === 1 ? 'var(--accent-coral)' : '#ffffff' }}>
                        #{item.retainedRank}
                      </td>
                      <td style={{ padding: '10px', fontWeight: 700, color: '#ffffff' }}>
                        {item.suspect.vessel.name}
                      </td>
                      <td style={{ padding: '10px', color: 'var(--text-muted)' }}>
                        {item.suspect.vessel.imo} / {item.suspect.vessel.mmsi}
                      </td>
                      <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>
                        {base}%
                      </td>
                      <td style={{ padding: '10px', fontWeight: 800, color: item.retainedRank === 1 ? 'var(--accent-coral)' : 'var(--accent-amber)' }}>
                        {item.perturbedScore}%
                      </td>
                      <td style={{ padding: '10px', color: item.scoreDelta >= 0 ? 'var(--accent-green)' : 'var(--accent-coral)' }}>
                        {item.scoreDelta >= 0 ? `+${item.scoreDelta}` : item.scoreDelta}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
