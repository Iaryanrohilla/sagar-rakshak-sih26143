import React from 'react'
import { Satellite, Cpu, CheckCircle2 } from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const SatellitePanel: React.FC = () => {
  const { incident, runPreprocessing, isProcessing } = useIncident()
  const scene = incident.scene

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Satellite size={18} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            SATELLITE DATA INGESTION
          </h3>
        </div>
        <span className="badge badge-cyan">{scene.sensorType} INGEST</span>
      </div>

      {/* Scene Overview Card */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {scene.sceneName}
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          ID: {scene.id}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Sensor:</span> <strong>{scene.sensor}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Acquisition:</span> <strong>{scene.acquisitionTime.slice(0, 19).replace('T', ' ')} UTC</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Pass:</span> <strong>{scene.orbitPass}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Polarization:</span> <strong>{scene.polarization}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Resolution:</span> <strong>{scene.resolutionMeters}m GRD</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Incidence Angle:</span> <strong>{scene.incidenceAngle}°</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Cloud Cover:</span> <strong>{scene.cloudCoveragePercent}%</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Path/Frame:</span> <strong>{scene.pathRow}</strong>
          </div>
        </div>
      </div>

      {/* Preprocessing Pipeline Status */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            SNAP / GDAL PREPROCESSING PIPELINE
          </span>
          <span className={`badge ${scene.calibrated ? 'badge-emerald' : 'badge-amber'}`}>
            {scene.calibrated ? 'CALIBRATED' : 'RAW SCENE'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={14} style={{ color: scene.calibrated ? 'var(--accent-emerald)' : 'var(--text-muted)' }} />
            <span>Precise Orbit Ephemeris Applied</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={14} style={{ color: scene.calibrated ? 'var(--accent-emerald)' : 'var(--text-muted)' }} />
            <span>Border Radiometric Noise Masking</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={14} style={{ color: scene.calibrated ? 'var(--accent-emerald)' : 'var(--text-muted)' }} />
            <span>Sigma0 Radiometric Calibration (dB)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={14} style={{ color: scene.speckleFiltered ? 'var(--accent-emerald)' : 'var(--text-muted)' }} />
            <span>Refined Lee Speckle Filtering (7x7 Window)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={14} style={{ color: scene.terrainCorrected ? 'var(--accent-emerald)' : 'var(--text-muted)' }} />
            <span>Range-Doppler Terrain Correction</span>
          </div>
        </div>

        <button
          onClick={runPreprocessing}
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
          <Cpu size={14} />
          <span>{scene.calibrated ? 'RE-RUN PREPROCESSING PIPELINE' : 'RUN PREPROCESSING PIPELINE'}</span>
        </button>
      </div>
    </div>
  )
}
