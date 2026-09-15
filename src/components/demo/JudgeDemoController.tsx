import React from 'react'
import { Play, Pause, Square, Sparkles } from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const JudgeDemoController: React.FC = () => {
  const { isJudgeDemoRunning, judgeDemoStep, judgeDemoCaption, pauseJudgeDemo, resumeJudgeDemo, stopJudgeDemo } = useIncident()

  if (!isJudgeDemoRunning && judgeDemoStep === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1500,
        background: 'rgba(8, 12, 22, 0.95)',
        border: '1px solid var(--accent-cyan)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 0 30px rgba(0, 242, 255, 0.35)',
        backdropFilter: 'blur(12px)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        maxWidth: '780px',
        width: '90%'
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(0, 242, 255, 0.15)',
          border: '1px solid var(--accent-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Sparkles size={16} style={{ color: 'var(--accent-cyan)' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
            AUTOMATED SIH JUDGE DEMO TOUR
          </span>
          <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>
            STEP {judgeDemoStep} / 12
          </span>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {judgeDemoCaption || 'Executing automated end-to-end attribution tour...'}
        </div>
      </div>

      {/* Demo Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {isJudgeDemoRunning ? (
          <button
            onClick={pauseJudgeDemo}
            title="Pause Tour"
            style={{
              padding: '6px 10px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem'
            }}
          >
            <Pause size={12} />
            <span>PAUSE</span>
          </button>
        ) : (
          <button
            onClick={resumeJudgeDemo}
            title="Resume Tour"
            style={{
              padding: '6px 10px',
              background: 'rgba(0, 242, 255, 0.15)',
              border: '1px solid var(--accent-cyan)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem'
            }}
          >
            <Play size={12} />
            <span>RESUME</span>
          </button>
        )}

        <button
          onClick={stopJudgeDemo}
          title="Exit Tour"
          style={{
            padding: '6px 10px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--accent-crimson)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--accent-crimson)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem'
          }}
        >
          <Square size={12} />
          <span>EXIT</span>
        </button>
      </div>
    </div>
  )
}
