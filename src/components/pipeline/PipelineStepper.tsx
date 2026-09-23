import React from 'react'
import {
  Target,
  History,
  Radio,
  FileCheck,
  Loader2,
  ChevronRight
} from 'lucide-react'
import { useIncident, PipelineStage } from '../../state/IncidentContext'

interface WorkflowStep {
  id: string
  label: string
  stage: PipelineStage
  viewTarget?: 'MAP' | 'EVIDENCE_GRAPH' | 'SUSPECTS' | 'WHAT_IF' | 'DOSSIER'
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  caption: string
}

export const PipelineStepper: React.FC = () => {
  const {
    activeStage,
    setActiveStage,
    activeConsoleView,
    setActiveConsoleView,
    isProcessing,
    processingProgress,
    processingStatusText
  } = useIncident()

  const workflowSteps: WorkflowStep[] = [
    {
      id: 'step-detect',
      label: '1. DETECT & VERIFY',
      stage: 'DETECTION',
      viewTarget: 'MAP',
      icon: Target,
      caption: 'SAR + Optical Slick Ingest'
    },
    {
      id: 'step-drift',
      label: '2. REVERSE DRIFT',
      stage: 'HINDCAST',
      viewTarget: 'MAP',
      icon: History,
      caption: 'Lagrangian Hindcast T₀'
    },
    {
      id: 'step-ais',
      label: '3. AIS CORRELATION',
      stage: 'ATTRIBUTION',
      viewTarget: 'SUSPECTS',
      icon: Radio,
      caption: 'Traffic & Suspect Ranking'
    },
    {
      id: 'step-dossier',
      label: '4. LEGAL DOSSIER',
      stage: 'ALERTS',
      viewTarget: 'DOSSIER',
      icon: FileCheck,
      caption: 'Court-Admissible Evidence'
    }
  ]

  const handleStepClick = (step: WorkflowStep) => {
    setActiveStage(step.stage)
    if (step.viewTarget) {
      setActiveConsoleView(step.viewTarget)
    }
  }

  // Determine which workflow step is currently active
  const isStepActive = (step: WorkflowStep) => {
    if (step.id === 'step-detect') {
      return activeStage === 'INGESTION' || activeStage === 'DETECTION' || activeStage === 'CHARACTERISATION'
    }
    if (step.id === 'step-drift') {
      return activeStage === 'HINDCAST' || activeStage === 'FORECAST'
    }
    if (step.id === 'step-ais') {
      return activeStage === 'CORRELATION' || activeStage === 'ATTRIBUTION' || activeConsoleView === 'SUSPECTS' || activeConsoleView === 'WHAT_IF'
    }
    if (step.id === 'step-dossier') {
      return activeStage === 'ALERTS' || activeConsoleView === 'DOSSIER'
    }
    return false
  }

  return (
    <div
      className="pipeline-stepper"
      style={{
        background: 'rgba(9, 17, 30, 0.98)',
        borderBottom: '1px solid var(--border-medium)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        zIndex: 1000
      }}
    >
      {/* 4-Step Master Stepper Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          width: '100%',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}
      >
        {workflowSteps.map((step, idx) => {
          const IconComp = step.icon
          const active = isStepActive(step)

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step)}
              style={{
                flex: 1,
                minWidth: '220px',
                height: '46px',
                background: active ? 'rgba(15, 28, 48, 0.95)' : 'transparent',
                border: 'none',
                borderBottom: active ? '2.5px solid var(--accent-teal)' : '2.5px solid transparent',
                borderRight: '1px solid var(--border-subtle)',
                color: active ? '#ffffff' : 'var(--text-secondary)',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: active ? 'rgba(0, 210, 180, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1.5px solid ${active ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <IconComp size={13} style={{ color: active ? 'var(--accent-teal)' : 'var(--text-muted)' }} />
                </div>

                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: active ? 800 : 600, letterSpacing: '0.04em' }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: active ? 'var(--accent-teal)' : 'var(--text-muted)' }}>
                    {step.caption}
                  </div>
                </div>
              </div>

              {idx < workflowSteps.length - 1 && (
                <ChevronRight size={14} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Dynamic Processing Status Bar (Visible during async runs) */}
      {isProcessing && (
        <div
          style={{
            height: '24px',
            background: 'rgba(0, 210, 180, 0.12)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.66rem',
            color: 'var(--accent-teal)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Loader2 size={12} className="animate-spin" />
            <span style={{ fontWeight: 700 }}>{processingStatusText}</span>
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
                  background: 'var(--accent-teal)',
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
