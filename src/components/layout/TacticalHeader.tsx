import React, { useState, useEffect } from 'react'
import {
  Shield,
  Play,
  FileText
} from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'
import { DEMO_SCENARIOS } from '../../data/scenarios'
import { AgencyRole } from '../../types'

export const TacticalHeader: React.FC = () => {
  const {
    currentScenario,
    selectScenario,
    activeRole,
    setActiveRole,
    startJudgeDemo,
    isJudgeDemoRunning,
    stopJudgeDemo,
    setIsReportModalOpen
  } = useIncident()

  // Real-time UTC & IST clock
  const [currentTime, setCurrentTime] = useState({
    utc: new Date().toUTCString().slice(17, 25) + ' UTC',
    ist: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST'
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime({
        utc: now.toUTCString().slice(17, 25) + ' UTC',
        ist: now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST'
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const agencyRoles: { id: AgencyRole; label: string; short: string }[] = [
    { id: 'COAST_GUARD', label: 'Indian Coast Guard', short: 'ICG' },
    { id: 'NAVY', label: 'Indian Navy', short: 'NAVY' },
    { id: 'MOEFCC', label: 'MoEFCC Ecology', short: 'MoEFCC' },
    { id: 'DG_SHIPPING', label: 'DG Shipping Compliance', short: 'DGS' },
    { id: 'PORT_AUTHORITY', label: 'Port Authority', short: 'PORT' },
    { id: 'INSURER', label: 'Marine Insurer', short: 'INSURER' }
  ]

  return (
    <header
      style={{
        height: '62px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-medium)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 1100,
        boxShadow: 'var(--shadow-tactical)'
      }}
    >
      {/* Brand Title & SIH Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 242, 255, 0.1)',
            border: '1px solid var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Shield style={{ color: 'var(--accent-cyan)' }} size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 900, letterSpacing: '0.08em', color: 'var(--text-primary)', fontSize: '1.05rem' }}>
              SAGAR RAKSHAK
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
              SIH 2026 DEMO MODE
            </span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
            AI-Powered Satellite Oil-Spill Detection & Vessel Attribution Platform • Team Calculus
          </div>
        </div>
      </div>

      {/* Center: Scenario Switcher & Live Clocks */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Scenario Select Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>SCENARIO:</span>
          <select
            value={currentScenario.id}
            onChange={(e) => selectScenario(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-cyan)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {DEMO_SCENARIOS.map((sc) => (
              <option key={sc.id} value={sc.id} style={{ background: '#0d1322', color: '#f8fafc' }}>
                {sc.title} [{sc.badge}]
              </option>
            ))}
          </select>
        </div>

        {/* Live Clocks */}
        <div style={{ display: 'flex', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--accent-cyan)' }}>{currentTime.utc}</span>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{currentTime.ist}</span>
          </div>
        </div>
      </div>

      {/* Right: Role Switcher, Judge Demo, Evidence Report */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Agency Roles */}
        <div style={{ display: 'flex', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', padding: '2px', border: '1px solid var(--border-subtle)' }}>
          {agencyRoles.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              style={{
                padding: '4px 8px',
                fontSize: '0.68rem',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                background: activeRole === role.id ? 'var(--accent-cyan)' : 'transparent',
                color: activeRole === role.id ? '#080c16' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
              title={role.label}
            >
              {role.short}
            </button>
          ))}
        </div>

        {/* Judge Demo Button */}
        <button
          onClick={isJudgeDemoRunning ? stopJudgeDemo : startJudgeDemo}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: isJudgeDemoRunning ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 242, 255, 0.15)',
            border: `1px solid ${isJudgeDemoRunning ? 'var(--accent-crimson)' : 'var(--accent-cyan)'}`,
            borderRadius: 'var(--radius-sm)',
            color: isJudgeDemoRunning ? 'var(--accent-crimson)' : 'var(--accent-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: isJudgeDemoRunning ? 'var(--shadow-crimson-glow)' : 'var(--shadow-cyan-glow)',
            animation: isJudgeDemoRunning ? 'none' : 'pulse 2s infinite'
          }}
        >
          <Play size={12} fill={isJudgeDemoRunning ? 'var(--accent-crimson)' : 'var(--accent-cyan)'} />
          <span>{isJudgeDemoRunning ? 'STOP DEMO' : 'RUN FULL DEMO'}</span>
        </button>

        {/* Evidence Dossier Report Button */}
        <button
          onClick={() => setIsReportModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <FileText size={13} style={{ color: 'var(--accent-emerald)' }} />
          <span>EVIDENCE REPORT</span>
        </button>
      </div>
    </header>
  )
}
