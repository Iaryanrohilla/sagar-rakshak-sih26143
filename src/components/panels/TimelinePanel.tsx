import React from 'react'
import { Clock } from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const TimelinePanel: React.FC = () => {
  const { incident } = useIncident()
  const events = incident.timeline

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            EVIDENCE AUDIT TIMELINE (ST6)
          </h3>
        </div>
        <span className="badge badge-cyan">{events.length} EVENTS</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
        {/* Timeline connector bar */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            bottom: '12px',
            left: '11px',
            width: '2px',
            background: 'rgba(0, 242, 255, 0.2)',
            zIndex: 0
          }}
        />

        {events.map((evt, idx) => (
          <div key={evt.id || idx} style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--bg-surface)',
                border: '2px solid var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
            </div>

            <div
              style={{
                flex: 1,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {evt.title}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {evt.timestamp.slice(11, 19)} UTC
                </span>
              </div>

              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                {evt.description}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                <span>Source: {evt.source}</span>
                <span>Confidence: {evt.confidence}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
