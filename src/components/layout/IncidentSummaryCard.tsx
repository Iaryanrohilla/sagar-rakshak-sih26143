import React from 'react'
import { Incident } from '../../types'
import { PipelineStage } from '../../state/IncidentContext'
import { AlertCircle, Ship, MapPin } from 'lucide-react'

interface IncidentSummaryCardProps {
  incident: Incident
  activeStage: PipelineStage
}

export const IncidentSummaryCard: React.FC<IncidentSummaryCardProps> = ({ incident }) => {
  const isConfirmed = incident.detection.isConfirmedSlick
  const primarySuspect = incident.suspects[0]

  return (
    <div
      className="incident-summary-card"
      style={{
        margin: '10px 12px 0 12px',
        padding: '8px 12px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        boxShadow: 'var(--shadow-tactical)',
        minHeight: '94px',
        maxHeight: '124px',
        flexShrink: 0,
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={14} style={{ color: isConfirmed ? 'var(--accent-crimson)' : 'var(--accent-amber)' }} />
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            INCIDENT SUMMARY
          </span>
        </div>
        <span
          className={`badge ${isConfirmed ? 'badge-crimson' : 'badge-amber'}`}
          style={{ fontSize: '0.58rem', padding: '1px 5px' }}
        >
          {incident.detection.classification.replace(/_/g, ' ')}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
          <MapPin size={11} style={{ color: 'var(--accent-cyan)' }} />
          <span>
            {incident.detection.centroid[0].toFixed(3)}°N, {incident.detection.centroid[1].toFixed(3)}°E
          </span>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>
          Area: <strong style={{ color: 'var(--accent-cyan)' }}>{incident.characterisation.surfaceAreaKm2} km²</strong>
        </span>
      </div>

      {primarySuspect && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface-elevated)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.65rem',
            fontFamily: 'var(--font-mono)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
            <Ship size={11} style={{ color: primarySuspect.overallScore > 80 ? 'var(--accent-crimson)' : 'var(--accent-amber)' }} />
            <span>SUSPECT: <strong style={{ color: 'var(--text-primary)' }}>{primarySuspect.vessel.name}</strong></span>
          </div>
          <span style={{ color: primarySuspect.overallScore > 80 ? 'var(--accent-crimson)' : 'var(--accent-amber)', fontWeight: 800 }}>
            {primarySuspect.overallScore}% MATCH
          </span>
        </div>
      )}
    </div>
  )
}
