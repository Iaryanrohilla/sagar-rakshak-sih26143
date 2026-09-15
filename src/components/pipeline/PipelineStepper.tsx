import React from 'react'
import {
  Satellite,
  Target,
  Sparkles,
  History,
  TrendingUp,
  Radio,
  UserCheck,
  Bell,
  Loader2
} from 'lucide-react'
import { useIncident, PipelineStage } from '../../state/IncidentContext'

export const PipelineStepper: React.FC = () => {
  const {
    activeStage,
    setActiveStage,
    isProcessing,
    processingProgress,
    processingStatusText
  } = useIncident()

  const stages: { id: PipelineStage; label: string; number: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }[] = [
    { id: 'INGESTION', label: '1. SATELLITE INGEST', number: '1', icon: Satellite },
    { id: 'DETECTION', label: '2. SLICK DETECT', number: '2', icon: Target },
    { id: 'CHARACTERISATION', label: '3. CHARACTERISE & AGE', number: '3', icon: Sparkles },
    { id: 'HINDCAST', label: '4. DRIFT HINDCAST', number: '4', icon: History },
    { id: 'FORECAST', label: '5. DRIFT FORECAST', number: '5', icon: TrendingUp },
    { id: 'CORRELATION', label: '6. AIS CORRELATE', number: '6', icon: Radio },
    { id: 'ATTRIBUTION', label: '7. VESSEL ATTRIBUTION', number: '7', icon: UserCheck },
    { id: 'ALERTS', label: '8. AGENCY ALERTS', number: '8', icon: Bell }
  ]

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-medium)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Step Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}
      >
        {stages.map((stage) => {
          const IconComp = stage.icon
          const isActive = activeStage === stage.id

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              style={{
                flex: 1,
                minWidth: '130px',
                height: '46px',
                background: isActive ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                borderRight: '1px solid var(--border-subtle)',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: isActive ? 700 : 500,
                transition: 'all 0.15s ease'
              }}
            >
              <IconComp size={15} style={{ color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
              <span style={{ whiteSpace: 'nowrap' }}>{stage.label}</span>
            </button>
          )
        })}
      </div>

      {/* Dynamic Processing Status Bar (Visible during async runs) */}
      {isProcessing && (
        <div
          style={{
            height: '24px',
            background: 'rgba(0, 242, 255, 0.1)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--accent-cyan)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Loader2 size={12} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
            <span>{processingStatusText || 'Executing pipeline task...'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '120px',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${processingProgress}%`,
                  height: '100%',
                  background: 'var(--accent-cyan)',
                  transition: 'width 0.2s ease'
                }}
              />
            </div>
            <span>{processingProgress}%</span>
          </div>
        </div>
      )}
    </div>
  )
}
