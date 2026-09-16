import React, { useState } from 'react'
import { IncidentProvider, useIncident } from './state/IncidentContext'
import { TacticalHeader } from './components/layout/TacticalHeader'
import { KPIRibbon } from './components/layout/KPIRibbon'
import { PipelineStepper } from './components/pipeline/PipelineStepper'
import { TacticalMapCanvas } from './components/map/TacticalMapCanvas'
import { SatellitePanel } from './components/panels/SatellitePanel'
import { DetectionPanel } from './components/panels/DetectionPanel'
import { CharacterisationPanel } from './components/panels/CharacterisationPanel'
import { DriftPanel } from './components/panels/DriftPanel'
import { AISPanel } from './components/panels/AISPanel'
import { AttributionPanel } from './components/panels/AttributionPanel'
import { AlertsPanel } from './components/panels/AlertsPanel'
import { AgencyRolePanel } from './components/panels/AgencyRolePanel'
import { TimelinePanel } from './components/panels/TimelinePanel'
import { EvidenceReportModal } from './components/reports/EvidenceReportModal'
import { JudgeDemoController } from './components/demo/JudgeDemoController'
import { IncidentSummaryCard } from './components/layout/IncidentSummaryCard'
import { PILOT_REGIONS } from './data/regions'
import { Shield, Clock, Layers, ChevronLeft, ChevronRight } from 'lucide-react'

const ControlRoomContent: React.FC = () => {
  const { incident, activeStage, activeRole, currentScenario } = useIncident()
  const [sideTab, setSideTab] = useState<'PIPELINE' | 'TIMELINE' | 'AGENCY'>('PIPELINE')
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState<boolean>(false)

  const roleTabLabel = activeRole === 'COAST_GUARD' ? 'COAST GUARD VIEW' : `${activeRole.replace(/_/g, ' ')} VIEW`

  return (
    <div className="app-shell">
      {/* 1. TOP HEADER */}
      <TacticalHeader />

      {/* 2. KPI / INCIDENT SUMMARY RIBBON */}
      <KPIRibbon />

      {/* 3. PIPELINE NAVIGATION */}
      <PipelineStepper />

      {/* 4. MAIN CONTENT (MAP + INSPECTOR PANEL) */}
      <div
        className="main-content"
        style={{
          gridTemplateColumns: isInspectorCollapsed ? '1fr 0px' : undefined
        }}
      >
        {/* Main Map Workspace (Remaining Viewport) */}
        <div className="map-container">
          <TacticalMapCanvas />

          {/* Floating Show Inspector Button when Collapsed */}
          {isInspectorCollapsed && (
            <button
              onClick={() => setIsInspectorCollapsed(false)}
              title="Show Inspector Panel"
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'rgba(8, 12, 22, 0.92)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-cyan)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-cyan-glow)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <ChevronLeft size={14} />
              <span>SHOW INSPECTOR</span>
            </button>
          )}
        </div>

        {/* Tactical Right Inspector Panel */}
        {!isInspectorCollapsed && (
          <aside className="inspector-panel" aria-label="Incident Inspector">
            {/* Inspector Tabs */}
            <div
              style={{
                height: '40px',
                background: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'stretch',
                flexShrink: 0
              }}
            >
              <button
                onClick={() => setSideTab('PIPELINE')}
                style={{
                  flex: 1,
                  border: 'none',
                  background: sideTab === 'PIPELINE' ? 'var(--bg-secondary)' : 'transparent',
                  borderBottom: sideTab === 'PIPELINE' ? '2px solid var(--accent-cyan)' : 'none',
                  color: sideTab === 'PIPELINE' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '0 4px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Layers size={13} />
                <span>PIPELINE</span>
              </button>

              <button
                onClick={() => setSideTab('TIMELINE')}
                style={{
                  flex: 1,
                  border: 'none',
                  background: sideTab === 'TIMELINE' ? 'var(--bg-secondary)' : 'transparent',
                  borderBottom: sideTab === 'TIMELINE' ? '2px solid var(--accent-cyan)' : 'none',
                  color: sideTab === 'TIMELINE' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '0 4px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Clock size={13} />
                <span>TIMELINE</span>
              </button>

              <button
                onClick={() => setSideTab('AGENCY')}
                style={{
                  flex: 1,
                  border: 'none',
                  background: sideTab === 'AGENCY' ? 'var(--bg-secondary)' : 'transparent',
                  borderBottom: sideTab === 'AGENCY' ? '2px solid var(--accent-cyan)' : 'none',
                  color: sideTab === 'AGENCY' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '0 4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <Shield size={13} />
                <span>{roleTabLabel.replace(' VIEW', '')}</span>
              </button>

              {/* Collapse Button */}
              <button
                onClick={() => setIsInspectorCollapsed(true)}
                title="Collapse Inspector Panel"
                style={{
                  width: '32px',
                  border: 'none',
                  background: 'transparent',
                  borderLeft: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>

          {/* Independently Scrollable Inspector Body */}
          <div className="inspector-body">
            {sideTab === 'TIMELINE' ? (
              <TimelinePanel />
            ) : sideTab === 'AGENCY' ? (
              <AgencyRolePanel />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Persistent Incident Summary Overview Card */}
                <IncidentSummaryCard incident={incident} activeStage={activeStage} />

                {/* Stage-Specific Content */}
                <div style={{ flex: 1 }}>
                  {activeStage === 'INGESTION' && <SatellitePanel />}
                  {activeStage === 'DETECTION' && <DetectionPanel />}
                  {activeStage === 'CHARACTERISATION' && <CharacterisationPanel />}
                  {(activeStage === 'HINDCAST' || activeStage === 'FORECAST') && <DriftPanel />}
                  {activeStage === 'CORRELATION' && <AISPanel />}
                  {activeStage === 'ATTRIBUTION' && <AttributionPanel />}
                  {activeStage === 'ALERTS' && <AlertsPanel />}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </div>

      {/* 5. STATUS / TELEMETRY CONTROLS FOOTER */}
      <footer
        style={{
          height: '24px',
          background: '#060911',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          fontSize: '0.62rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          flexShrink: 0,
          zIndex: 1000
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span className="pulse-dot cyan" style={{ width: '6px', height: '6px' }}></span>
            <span style={{ color: 'var(--accent-cyan)' }}>SAR SENSOR: {incident.scene.sensor}</span>
          </span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span>HYDRODYNAMIC ENGINE: OPENDRIFT + HYCOM + ECMWF</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>ZONE: {PILOT_REGIONS[currentScenario.regionId]?.name || currentScenario.regionId}</span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span style={{ color: 'var(--text-secondary)' }}>MARPOL ANNEX I PROTOCOL ACTIVE</span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span style={{ color: 'var(--accent-cyan)' }}>TEAM CALCULUS</span>
        </div>
      </footer>

      {/* Non-Blocking Judge Demo Tour HUD */}
      <JudgeDemoController />

      {/* MARPOL Evidence Report Dossier Modal */}
      <EvidenceReportModal />
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <IncidentProvider>
      <ControlRoomContent />
    </IncidentProvider>
  )
}

export default App
