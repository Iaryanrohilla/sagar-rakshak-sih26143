import React, { useState } from 'react'
import { Play, Pause, Square, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const JudgeDemoController: React.FC = () => {
  const { isJudgeDemoRunning, judgeDemoStep, judgeDemoCaption, pauseJudgeDemo, resumeJudgeDemo, stopJudgeDemo } = useIncident()
  const [isMinimized, setIsMinimized] = useState<boolean>(false)

  if (!isJudgeDemoRunning && judgeDemoStep === 0) return null

  // Collapsed / Minimized floating pill
  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1200,
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={() => setIsMinimized(false)}
          title="Expand Judge Demo Controls"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            background: 'rgba(8, 12, 22, 0.94)',
            border: '1px solid var(--accent-cyan)',
            borderRadius: '20px',
            color: 'var(--accent-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-cyan-glow)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Sparkles size={13} style={{ color: 'var(--accent-cyan)' }} />
          <span>DEMO TOUR [STEP {judgeDemoStep}/12]</span>
          <ChevronUp size={14} />
        </button>
      </div>
    )
  }

  // Expanded compact floating bar
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1200,
        background: 'rgba(8, 12, 22, 0.95)',
        border: '1px solid var(--accent-cyan)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), var(--shadow-cyan-glow)',
        backdropFilter: 'blur(10px)',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '520px',
        width: 'calc(100% - 32px)',
        pointerEvents: 'auto'
      }}
    >
      {/* Step Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
          DEMO TOUR
        </span>
        <span className="badge badge-cyan" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>
          {judgeDemoStep}/12
        </span>
      </div>

      {/* Single Line Caption */}
      <div
        style={{
          flex: 1,
          fontSize: '0.7rem',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
        title={judgeDemoCaption}
      >
        {judgeDemoCaption || 'Executing automated attribution tour...'}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {isJudgeDemoRunning ? (
          <button
            onClick={pauseJudgeDemo}
            title="Pause Tour"
            style={{
              padding: '3px 7px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem'
            }}
          >
            <Pause size={10} />
            <span>PAUSE</span>
          </button>
        ) : (
          <button
            onClick={resumeJudgeDemo}
            title="Resume Tour"
            style={{
              padding: '3px 7px',
              background: 'rgba(0, 242, 255, 0.15)',
              border: '1px solid var(--accent-cyan)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem'
            }}
          >
            <Play size={10} />
            <span>RESUME</span>
          </button>
        )}

        <button
          onClick={stopJudgeDemo}
          title="Exit Tour"
          style={{
            padding: '3px 7px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--accent-crimson)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--accent-crimson)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.66rem'
          }}
        >
          <Square size={10} />
          <span>EXIT</span>
        </button>

        {/* Minimize Button */}
        <button
          onClick={() => setIsMinimized(true)}
          title="Minimize Demo Controls"
          style={{
            padding: '3px 5px',
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ChevronDown size={12} />
        </button>
      </div>
    </div>
  )
}
