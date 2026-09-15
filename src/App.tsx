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
import { Shield, Clock, Layers } from 'lucide-react'

const ControlRoomContent: React.FC = () => {
  const { activeStage, activeRole } = useIncident()
  const [sideTab, setSideTab] = useState<'PIPELINE' | 'TIMELINE' | 'AGENCY'>('PIPELINE')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Tactical C4I Header */}
      <TacticalHeader />

      {/* Real-time KPI Ribbon */}
      <KPIRibbon />

      {/* 7-Step Pipeline Stepper Bar */}
      <PipelineStepper />

      {/* Main Tactical Grid (Map + Side Panel) */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Map Canvas (Left 65% / Flex 1) */}
        <div style={{ flex: 1, position: 'relative', height: '100%', overflow: 'hidden' }}>
          <TacticalMapCanvas />
        </div>

        {/* Tactical Right Panel (Width: 460px) */}
        <div
          style={{
            width: '460px',
            height: '100%',
            background: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1050,
            boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.6)'
          }}
        >
          {/* Side Panel Tabs */}
          <div
            style={{
              height: '40px',
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'stretch'
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
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Layers size={13} />
              <span>PIPELINE INSPECTOR</span>
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
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Clock size={13} />
              <span>TIMELINE AUDIT</span>
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
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Shield size={13} />
              <span>{activeRole.slice(0, 10)} VIEW</span>
            </button>
          </div>

          {/* Panel Content Body */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {sideTab === 'TIMELINE' ? (
              <TimelinePanel />
            ) : sideTab === 'AGENCY' ? (
              <AgencyRolePanel />
            ) : (
              <>
                {activeStage === 'INGESTION' && <SatellitePanel />}
                {activeStage === 'DETECTION' && <DetectionPanel />}
                {activeStage === 'CHARACTERISATION' && <CharacterisationPanel />}
                {(activeStage === 'HINDCAST' || activeStage === 'FORECAST') && <DriftPanel />}
                {activeStage === 'CORRELATION' && <AISPanel />}
                {activeStage === 'ATTRIBUTION' && <AttributionPanel />}
                {activeStage === 'ALERTS' && <AlertsPanel />}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Judge Demo Tour HUD */}
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
