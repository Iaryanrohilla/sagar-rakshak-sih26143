import React from 'react'
import { Target, CheckCircle2 } from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const DetectionPanel: React.FC = () => {
  const { incident, runDetection, isProcessing } = useIncident()
  const detection = incident.detection
  const isConfirmed = detection.isConfirmedSlick

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            OIL-SPILL DETECTION
          </h3>
        </div>
        <span className={`badge ${isConfirmed ? 'badge-emerald' : 'badge-amber'}`}>
          {isConfirmed ? 'CONFIRMED SLICK' : 'LOOK-ALIKE SCREENED'}
        </span>
      </div>

      {/* Primary Classification Verdict Banner */}
      <div
        style={{
          background: isConfirmed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          border: `1px solid ${isConfirmed ? 'var(--accent-emerald)' : 'var(--accent-amber)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>CLASSIFICATION:</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isConfirmed ? 'var(--accent-emerald)' : 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
            {detection.classification.replace(/_/g, ' ')}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>CONFIDENCE SCORE:</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {detection.confidenceScore}%
          </span>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '4px' }}>
          {detection.detectionNotes}
        </div>
      </div>

      {/* Physics & Sensor Verification Metrics */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          DUAL-SENSOR FUSION TELEMETRY
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>SAR Damping:</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: detection.sarDampingRatioDb >= 8.5 ? 'var(--accent-cyan)' : 'var(--accent-amber)' }}>
              {detection.sarDampingRatioDb} dB
            </div>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Threshold: &gt; 8.5 dB</span>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Optical Index:</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: detection.opticalContrastIndex > 0 ? 'var(--accent-cyan)' : 'var(--accent-amber)' }}>
              {detection.opticalContrastIndex}
            </div>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>SWIR/NIR Contrast</span>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Centroid Coordinates:</span>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {detection.centroid[0].toFixed(3)}°N, {detection.centroid[1].toFixed(3)}°E
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Model Backbone:</span>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {detection.modelArchitecture.slice(0, 24)}...
            </div>
          </div>
        </div>

        {/* Look-alike Discriminated List */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>LOOK-ALIKE DISCRIMINATION CHECKS:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: detection.classification === 'ALGAL_BLOOM' ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
            <CheckCircle2 size={12} />
            <span>Algal Bloom / Chlorophyll-a NIR Peak: {detection.classification === 'ALGAL_BLOOM' ? 'FLAGGED' : 'REJECTED'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: detection.classification === 'BIOGENIC_FILM' ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
            <CheckCircle2 size={12} />
            <span>Biogenic Film / Fish Oil Surfactant: {detection.classification === 'BIOGENIC_FILM' ? 'FLAGGED' : 'REJECTED'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: detection.classification === 'WIND_SHADOW' ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
            <CheckCircle2 size={12} />
            <span>Low-Wind Shadow (&lt;3 m/s calm sea): {detection.classification === 'WIND_SHADOW' ? 'FLAGGED' : 'REJECTED'}</span>
          </div>
        </div>

        <button
          onClick={runDetection}
          disabled={isProcessing}
          style={{
            marginTop: '8px',
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
          <Target size={14} />
          <span>RE-RUN AI DETECTION &amp; LOOK-ALIKE FILTER</span>
        </button>
      </div>
    </div>
  )
}
