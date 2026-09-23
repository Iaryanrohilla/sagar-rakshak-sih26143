import React from 'react'
import {
  Shield,
  Play,
  FileText,
  Cpu,
  Map,
  Network,
  UserCheck,
  Sliders,
  Bot,
  ArrowLeft,
  LogOut
} from 'lucide-react'
import { useIncident, ConsoleView } from '../../state/IncidentContext'
import { DEMO_SCENARIOS } from '../../data/scenarios'
import { PILOT_REGIONS } from '../../data/regions'

export const TacticalHeader: React.FC = () => {
  const {
    currentScenario,
    selectScenario,
    startJudgeDemo,
    isJudgeDemoRunning,
    stopJudgeDemo,
    openExplainAI,
    activeConsoleView,
    setActiveConsoleView,
    isCopilotOpen,
    setIsCopilotOpen,
    setAppPage,
    currentUser,
    logout
  } = useIncident()

  const consoleViews: { id: ConsoleView; label: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }[] = [
    { id: 'MAP', label: 'MAP', icon: Map },
    { id: 'EVIDENCE_GRAPH', label: 'EVIDENCE GRAPH', icon: Network },
    { id: 'SUSPECTS', label: 'SUSPECTS', icon: UserCheck },
    { id: 'WHAT_IF', label: 'WHAT-IF', icon: Sliders },
    { id: 'DOSSIER', label: 'DOSSIER', icon: FileText }
  ]

  return (
    <header
      className="tactical-header"
      style={{
        height: '56px',
        background: 'rgba(9, 17, 30, 0.96)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-medium)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        zIndex: 1100,
        boxShadow: 'var(--shadow-tactical)',
        gap: '10px',
        flexShrink: 0
      }}
    >
      {/* 1. Left: Back to Command Room, Branding & Pilot Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <button
          onClick={() => setAppPage('LANDING')}
          title="Return to Command Room & Pilot Zone Selection"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '5px 8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={13} />
          <span>PORTAL</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 210, 180, 0.15)',
              border: '1px solid var(--accent-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Shield style={{ color: 'var(--accent-teal)' }} size={16} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 900, letterSpacing: '0.06em', color: '#ffffff', fontSize: '0.96rem', fontFamily: 'var(--font-sans)' }}>
                SAGAR RAKSHAK
              </span>
              <span className="badge badge-teal" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>
                PS 26143
              </span>
              <span className="badge badge-simulated" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>
                [● SIMULATED DATA]
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Center-Left: Incident / Scenario Selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(5, 10, 18, 0.85)',
          padding: '3px 10px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-medium)',
          flexShrink: 0
        }}
      >
        <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
          INCIDENT:
        </span>
        <select
          value={currentScenario.id}
          onChange={(e) => selectScenario(e.target.value)}
          aria-label="Active Incident Scenario"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-teal)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: 'pointer',
            outline: 'none',
            maxWidth: '180px',
            textOverflow: 'ellipsis'
          }}
        >
          {DEMO_SCENARIOS.map((sc) => (
            <option key={sc.id} value={sc.id} style={{ background: '#09111e', color: '#f8fafc' }}>
              {sc.title}
            </option>
          ))}
        </select>
        <span className="badge badge-amber" style={{ fontSize: '0.58rem', padding: '1px 4px' }}>
          {(PILOT_REGIONS[currentScenario.regionId]?.name || currentScenario.regionId).split(' ')[0]}
        </span>
      </div>

      {/* 3. Center: Core Console View Tabs (MAP / EVIDENCE GRAPH / SUSPECTS / WHAT-IF / DOSSIER) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          background: 'rgba(5, 10, 18, 0.9)',
          padding: '3px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-medium)'
        }}
      >
        {consoleViews.map((tab) => {
          const isActive = activeConsoleView === tab.id
          const IconComp = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => setActiveConsoleView(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                background: isActive ? 'rgba(0, 210, 180, 0.22)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
                color: isActive ? 'var(--accent-teal)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <IconComp size={13} style={{ color: isActive ? 'var(--accent-teal)' : 'var(--text-muted)' }} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 4. Right: Actions, AI Copilot, Judge Demo, Role & User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* AI Forensics Copilot Drawer Trigger */}
        <button
          onClick={() => setIsCopilotOpen(!isCopilotOpen)}
          title="Open AI Forensics Copilot"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            background: isCopilotOpen ? 'var(--accent-teal)' : 'rgba(0, 210, 180, 0.14)',
            border: '1px solid var(--accent-teal)',
            borderRadius: 'var(--radius-sm)',
            color: isCopilotOpen ? '#030712' : 'var(--accent-teal)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-teal-glow)'
          }}
        >
          <Bot size={14} />
          <span>AI COPILOT</span>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isCopilotOpen ? '#030712' : 'var(--accent-amber)' }} />
        </button>

        {/* Judge Demo Quick-Tour Button */}
        <button
          onClick={isJudgeDemoRunning ? stopJudgeDemo : startJudgeDemo}
          title={isJudgeDemoRunning ? 'Stop automated tour' : 'Start 2-minute judge demo tour'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 9px',
            background: isJudgeDemoRunning ? 'rgba(244, 63, 94, 0.2)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${isJudgeDemoRunning ? 'var(--accent-coral)' : 'var(--accent-amber)'}`,
            borderRadius: 'var(--radius-sm)',
            color: isJudgeDemoRunning ? 'var(--accent-coral)' : 'var(--accent-amber-bright)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          <Play size={10} fill={isJudgeDemoRunning ? 'var(--accent-coral)' : 'var(--accent-amber-bright)'} />
          <span>{isJudgeDemoRunning ? 'STOP' : 'TOUR'}</span>
        </button>

        {/* Explain AI Science Button */}
        <button
          onClick={() => openExplainAI('UNET_SEGMENTATION')}
          title="Inspect Deep Learning & Physics Methodology"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '5px 8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            cursor: 'pointer'
          }}
        >
          <Cpu size={12} />
          <span>AI TECH</span>
        </button>

        {/* Operator Profile & Logout */}
        {currentUser && (
          <div
            title={`${currentUser.name} (${currentUser.roleTitle})`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem'
            }}
          >
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              {currentUser.name.split(',')[0]}
            </span>
            <button
              onClick={logout}
              title="Sign Out"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
            >
              <LogOut size={12} />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
