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
      {/* 1. TOP HEADER WITH VIEW SWITCHER & COPILOT */}
      <TacticalHeader />

      {/* 2. KPI / INCIDENT SUMMARY RIBBON */}
      <KPIRibbon />

      {/* 3. 4-STEP MASTER WORKFLOW STEPPER */}
      <PipelineStepper />

      {/* 4. MAIN CONTENT WORKSPACE */}
      <div className="main-content">
        {/* Render Active Console View */}
        {activeConsoleView === 'MAP' && (
          <>
            {/* Full-Bleed Map Canvas */}
            <div className="map-container">
              <TacticalMapCanvas />
            </div>

            {/* Bottom Docked Interactive Timeline Scrubber */}
            <TimelineScrubber />

            {/* Floating Show Inspector Button when Collapsed */}
            {isInspectorCollapsed && (
              <button
                onClick={() => setIsInspectorCollapsed(false)}
                title="Show Inspector Panel"
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  zIndex: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: 'rgba(9, 17, 30, 0.94)',
                  border: '1px solid var(--accent-teal)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--accent-teal)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-teal-glow)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <ChevronLeft size={14} />
                <span>SHOW INSPECTOR</span>
              </button>
            )}

            {/* Tactical Right Floating Inspector HUD */}
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
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <IncidentSummaryCard incident={incident} activeStage={activeStage} />
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
          </>
        )}

        {/* View 2: Evidence Graph */}
        {activeConsoleView === 'EVIDENCE_GRAPH' && <EvidenceGraphView />}

        {/* View 3: Suspects Leaderboard */}
        {activeConsoleView === 'SUSPECTS' && <SuspectsView />}

        {/* View 4: What-If Sensitivity Testing */}
        {activeConsoleView === 'WHAT_IF' && <WhatIfView />}

        {/* View 5: Formal Legal Dossier Report */}
        {activeConsoleView === 'DOSSIER' && <DossierView />}
      </div>

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
