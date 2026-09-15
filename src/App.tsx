import React from 'react'
import { Shield, Radio, Satellite, AlertTriangle } from 'lucide-react'

export const App: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      {/* Header Bar */}
      <header style={{
        height: '56px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-medium)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield style={{ color: 'var(--accent-cyan)' }} size={24} />
          <div>
            <span style={{ fontWeight: 800, letterSpacing: '0.05em', color: 'var(--accent-cyan)' }}>SAGAR RAKSHAK</span>
            <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SIH 2026 DEMO MODE</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="badge badge-cyan"><Radio size={12} /> AIS ONLINE</span>
          <span className="badge badge-emerald"><Satellite size={12} /> SENTINEL-1/2 INGEST</span>
          <span className="badge badge-crimson"><AlertTriangle size={12} /> 3 ACTIVE SLICKS</span>
        </div>
      </header>

      {/* Main Container Placeholder for Phase 02+ */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Maritime C4I Operations Center Initializing</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px' }}>
            Multi-sensor satellite imagery ingestion, hydrodynamic drift hindcast, and explainable AIS vessel attribution engine.
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
