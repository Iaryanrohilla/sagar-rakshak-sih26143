import React, { useState, useEffect } from 'react'
import {
  Shield,
  Play,
  FileText
} from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'
import { DEMO_SCENARIOS } from '../../data/scenarios'
import { PILOT_REGIONS } from '../../data/regions'
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
        height: '58px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-medium)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 1100,
        boxShadow: 'var(--shadow-tactical)',
        gap: '12px',
        flexShrink: 0
      }}
    >
      {/* 1. Left: Branding & Tagline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '240px', flexShrink: 0 }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 242, 255, 0.12)',
            border: '1px solid var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Shield style={{ color: 'var(--accent-cyan)' }} size={20} />
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 900, letterSpacing: '0.08em', color: 'var(--text-primary)', fontSize: '1.02rem', fontFamily: 'var(--font-sans)' }}>
              SAGAR RAKSHAK
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
              SIH26143
            </span>
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', letterSpacing: '0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
            AI-Powered Satellite Oil-Spill Detection & Vessel Attribution
          </div>
        </div>
      </div>

      {/* 2. Center: Current Incident / Scenario Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-surface)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
          maxWidth: '420px',
          flex: '0 1 auto'
        }}
      >
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
          SCENARIO:
        </span>
        <select
          value={currentScenario.id}
          onChange={(e) => selectScenario(e.target.value)}
          aria-label="Active Incident Scenario"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.76rem',
            fontWeight: 700,
            cursor: 'pointer',
            outline: 'none',
            maxWidth: '280px',
            textOverflow: 'ellipsis'
          }}
        >
          {DEMO_SCENARIOS.map((sc) => (
            <option key={sc.id} value={sc.id} style={{ background: '#0d1322', color: '#f8fafc' }}>
              {sc.title} [{sc.badge}]
            </option>
          ))}
        </select>
        <span className="badge badge-emerald" style={{ fontSize: '0.6rem', padding: '2px 5px' }}>
          {(PILOT_REGIONS[currentScenario.regionId]?.name || currentScenario.regionId).split(' ')[0]}
        </span>
      </div>

      {/* 3. Right: Live Clocks, Active Role, Demo Mode Badge & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* UTC & IST Clocks */}
        <div style={{ display: 'flex', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
          <div
            title="Coordinated Universal Time"
            style={{
              background: 'var(--bg-surface)',
              padding: '3px 7px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--accent-cyan)'
            }}
          >
            {currentTime.utc}
          </div>
          <div
            title="Indian Standard Time"
            style={{
              background: 'var(--bg-surface)',
              padding: '3px 7px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            {currentTime.ist}
          </div>
        </div>

        {/* Active Role Selector */}
        <div
          title={agencyRoles.find(r => r.id === activeRole)?.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px 6px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ROLE:</span>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as AgencyRole)}
            aria-label="Active Agency Role"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-amber)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
              maxWidth: '90px'
            }}
          >
            {agencyRoles.map((role) => (
              <option key={role.id} value={role.id} style={{ background: '#0d1322', color: '#f8fafc' }}>
                {role.short} — {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* Demo Mode Badge */}
        <span className="badge badge-cyan" style={{ fontSize: '0.62rem', letterSpacing: '0.04em', padding: '2px 6px' }}>
          DEMO MODE
        </span>

        {/* Action: Run Judge Demo */}
        <button
          onClick={isJudgeDemoRunning ? stopJudgeDemo : startJudgeDemo}
          title={isJudgeDemoRunning ? 'Stop automated tour' : 'Start 2-minute judge demo tour'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            background: isJudgeDemoRunning ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 242, 255, 0.15)',
            border: `1px solid ${isJudgeDemoRunning ? 'var(--accent-crimson)' : 'var(--accent-cyan)'}`,
            borderRadius: 'var(--radius-sm)',
            color: isJudgeDemoRunning ? 'var(--accent-crimson)' : 'var(--accent-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: isJudgeDemoRunning ? 'var(--shadow-crimson-glow)' : 'var(--shadow-cyan-glow)'
          }}
        >
          <Play size={11} fill={isJudgeDemoRunning ? 'var(--accent-crimson)' : 'var(--accent-cyan)'} />
          <span>{isJudgeDemoRunning ? 'STOP' : 'DEMO'}</span>
        </button>

        {/* Action: Evidence Report Dossier */}
        <button
          onClick={() => setIsReportModalOpen(true)}
          title="Open MARPOL Article 4/6 Evidence Dossier"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <FileText size={12} style={{ color: 'var(--accent-emerald)' }} />
          <span>DOSSIER</span>
        </button>
      </div>
    </header>
  )
}
