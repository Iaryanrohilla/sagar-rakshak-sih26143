import React from 'react'
import { Bell, AlertTriangle } from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const AlertsPanel: React.FC = () => {
  const { incident, updateAlertStatus } = useIncident()
  const alerts = incident.alerts

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} style={{ color: 'var(--accent-amber)' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>
            MULTI-AGENCY ALERT ENGINE (ST6)
          </h3>
        </div>
        <span className="badge badge-amber">{alerts.length} ALERTS LOGGED</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL'
          const isResolved = alert.status === 'RESOLVED'

          return (
            <div
              key={alert.id}
              style={{
                background: 'var(--bg-surface)',
                border: `1px solid ${isCritical && !isResolved ? 'var(--accent-crimson)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              {/* Alert Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={15} style={{ color: isCritical ? 'var(--accent-crimson)' : 'var(--accent-amber)' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {alert.title}
                  </span>
                </div>
                <span className={`badge ${alert.status === 'ESCALATED' || alert.status === 'NEW' ? 'badge-crimson' : alert.status === 'RESOLVED' ? 'badge-emerald' : 'badge-amber'}`}>
                  {alert.status}
                </span>
              </div>

              {/* Alert Meta */}
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {alert.description}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                <span>Assigned: <strong>{alert.assignedAgency.replace(/_/g, ' ')}</strong></span>
                <span>Logged: {alert.timestamp.slice(11, 19)} UTC</span>
              </div>

              {/* Audit History Trail */}
              {alert.history && alert.history.length > 0 && (
                <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', padding: '8px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>ACTION TRAIL:</span>
                  {alert.history.map((h, hIdx) => (
                    <div key={hIdx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                      <span>[{h.status}] {h.note}</span>
                      <span>{h.updatedBy}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Interactive State Transition Buttons */}
              <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '2px' }}>
                {alert.status === 'NEW' && (
                  <button
                    onClick={() => updateAlertStatus(alert.id, 'ACKNOWLEDGED', 'Incident acknowledged by operations desk')}
                    style={{
                      flex: 1,
                      padding: '6px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid var(--accent-amber)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--accent-amber)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ACKNOWLEDGE
                  </button>
                )}

                {alert.status !== 'ESCALATED' && alert.status !== 'RESOLVED' && (
                  <button
                    onClick={() => updateAlertStatus(alert.id, 'ESCALATED', 'Escalated to National Pollution Response Command')}
                    style={{
                      flex: 1,
                      padding: '6px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid var(--accent-crimson)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--accent-crimson)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ESCALATE COMMAND
                  </button>
                )}

                {alert.status !== 'RESOLVED' && (
                  <button
                    onClick={() => updateAlertStatus(alert.id, 'RESOLVED', 'Pollution barrier deployed / incident stood down')}
                    style={{
                      flex: 1,
                      padding: '6px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid var(--accent-emerald)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--accent-emerald)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    RESOLVE
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
