import React, { useState } from 'react'
import { IncidentProvider, useIncident } from './state/IncidentContext'
import { AuthPage } from './components/auth/AuthPage'
import { LandingPage } from './components/landing/LandingPage'
import { TacticalHeader } from './components/layout/TacticalHeader'
import { KPIRibbon } from './components/layout/KPIRibbon'
import { PipelineStepper } from './components/pipeline/PipelineStepper'
import { TacticalMapCanvas } from './components/map/TacticalMapCanvas'
import { EvidenceGraphView } from './components/evidence/EvidenceGraphView'
import { SuspectsView } from './components/suspects/SuspectsView'
import { WhatIfView } from './components/whatif/WhatIfView'
import { DossierView } from './components/dossier/DossierView'
import { ForensicsCopilotDrawer } from './components/copilot/ForensicsCopilotDrawer'
import { SatellitePanel } from './components/panels/SatellitePanel'
import { DetectionPanel } from './components/panels/DetectionPanel'
import { CharacterisationPanel } from './components/panels/CharacterisationPanel'
import { DriftPanel } from './components/panels/DriftPanel'
import { AISPanel } from './components/panels/AISPanel'
import { AttributionPanel } from './components/panels/AttributionPanel'
import { AlertsPanel } from './components/panels/AlertsPanel'
import { AgencyRolePanel } from './components/panels/AgencyRolePanel'
import { TimelinePanel } from './components/panels/TimelinePanel'
import { TimelineScrubber } from './components/timeline/TimelineScrubber'
import { EvidenceReportModal } from './components/reports/EvidenceReportModal'
import { WhyVesselModal } from './components/modals/WhyVesselModal'
import { ExplainAIModal } from './components/modals/ExplainAIModal'
import { JudgeDemoController } from './components/demo/JudgeDemoController'
import { IncidentSummaryCard } from './components/layout/IncidentSummaryCard'
import { PILOT_REGIONS } from './data/regions'
import { Shield, Clock, Layers, ChevronLeft, ChevronRight } from 'lucide-react'

const OperationsConsoleContent: React.FC = () => {
  const { incident, activeStage, activeRole, currentScenario, activeConsoleView } = useIncident()
  const [sideTab, setSideTab] = useState<'PIPELINE' | 'TIMELINE' | 'AGENCY'>('PIPELINE')
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState<boolean>(false)

  const roleTabLabel = activeRole === 'COAST_GUARD' ? 'COAST GUARD VIEW' : `${activeRole.replace(/_/g, ' ')} VIEW`

  return (
    <div className="app-shell">
      {/* 1. TOP FIXED HEADER REGION (Navbar + KPI Ribbon + Workflow Stepper) */}
      <header className="app-header-region">
        <TacticalHeader />
        <KPIRibbon />
        <PipelineStepper />
      </header>

      {/* 2. MAIN CONTENT WORKSPACE (CSS Grid with Explicit Fractional Tracks) */}
      <main className="main-content">
        {/* Render Active Console View */}
        {activeConsoleView === 'MAP' && (
          <div className={`console-map-layout ${isInspectorCollapsed ? 'inspector-collapsed' : ''}`}>
            {/* Column 1, Row 1: Tactical Map Canvas Viewport */}
            <div className="map-viewport-wrapper">
              <TacticalMapCanvas />
            </div>

            {/* Column 1, Row 2: Bottom Docked Timeline Scrubber */}
            <div className="timeline-scrubber-region">
              <TimelineScrubber />
            </div>

            {/* Column 2, Row 1 & 2: Right Tactical Inspector Panel / Collapsed Rail */}
            {isInspectorCollapsed ? (
              <div className="inspector-collapsed-rail">
                <button
                  onClick={() => setIsInspectorCollapsed(false)}
                  title="Show Inspector Panel"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent-teal)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 4px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    letterSpacing: '0.08em'
                  }}
                >
                  <ChevronLeft size={16} />
                  <span>SHOW INSPECTOR</span>
                </button>
              </div>
            ) : (
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
                      borderBottom: sideTab === 'PIPELINE' ? '2.5px solid var(--accent-teal)' : 'none',
                      color: sideTab === 'PIPELINE' ? 'var(--accent-teal)' : 'var(--text-secondary)',
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
                      borderBottom: sideTab === 'TIMELINE' ? '2.5px solid var(--accent-teal)' : 'none',
                      color: sideTab === 'TIMELINE' ? 'var(--accent-teal)' : 'var(--text-secondary)',
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
                      borderBottom: sideTab === 'AGENCY' ? '2.5px solid var(--accent-teal)' : 'none',
                      color: sideTab === 'AGENCY' ? 'var(--accent-teal)' : 'var(--text-secondary)',
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

                {/* Inspector Body */}
                <div className="inspector-body">
                  {sideTab === 'TIMELINE' ? (
                    <TimelinePanel />
                  ) : sideTab === 'AGENCY' ? (
                    <AgencyRolePanel />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
                      <IncidentSummaryCard incident={incident} activeStage={activeStage} />
                      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
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
        )}

        {/* View 2: Evidence Graph */}
        {activeConsoleView === 'EVIDENCE_GRAPH' && (
          <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <EvidenceGraphView />
          </div>
        )}

        {/* View 3: Suspects Leaderboard */}
        {activeConsoleView === 'SUSPECTS' && (
          <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <SuspectsView />
          </div>
        )}

        {/* View 4: What-If Sensitivity Testing */}
        {activeConsoleView === 'WHAT_IF' && (
          <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <WhatIfView />
          </div>
        )}

        {/* View 5: Formal Legal Dossier Report */}
        {activeConsoleView === 'DOSSIER' && (
          <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <DossierView />
          </div>
        )}
      </main>

      {/* 5. STATUS / TELEMETRY CONTROLS FOOTER */}
      <footer
        style={{
          height: '24px',
          background: '#04070d',
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
            <span className="pulse-dot teal" style={{ width: '6px', height: '6px' }} />
            <span style={{ color: 'var(--accent-teal)' }}>SAR SENSOR: {incident.scene.sensor}</span>
          </span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span>HYDRODYNAMIC ENGINE: OPENDRIFT + HYCOM + ECMWF</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>ZONE: {PILOT_REGIONS[currentScenario.regionId]?.name || currentScenario.regionId}</span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span style={{ color: 'var(--text-secondary)' }}>MARPOL ANNEX I PROTOCOL ACTIVE</span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span style={{ color: 'var(--accent-teal)' }}>TEAM CALCULUS</span>
        </div>
      </footer>

      {/* Docked AI Forensics Copilot Slide-out Drawer */}
      <ForensicsCopilotDrawer />

      {/* Non-Blocking Judge Demo Tour HUD */}
      <JudgeDemoController />

      {/* MARPOL Evidence Report Dossier Modal */}
      <EvidenceReportModal />

      {/* Forensic Suspect Explainability Modal */}
      <WhyVesselModal />

      {/* Scientific Methodology & AI Explainability Modal */}
      <ExplainAIModal />
    </div>
  )
}

const MainAppContent: React.FC = () => {
  const { appPage } = useIncident()

  switch (appPage) {
    case 'AUTH':
      return <AuthPage />
    case 'LANDING':
      return <LandingPage />
    case 'CONSOLE':
      return <OperationsConsoleContent />
    default:
      return <AuthPage />
  }
}

export const App: React.FC = () => {
  return (
    <IncidentProvider>
      <MainAppContent />
    </IncidentProvider>
  )
}

export default App
