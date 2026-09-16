import React from 'react'
import { useIncident } from '../../state/IncidentContext'
import {
  AlertTriangle,
  Target,
  Maximize2,
  Clock,
  Radio,
  UserX,
  Droplet,
  ShieldAlert
} from 'lucide-react'

export const KPIRibbon: React.FC = () => {
  const { incident } = useIncident()

  const primarySuspect = incident.suspects[0]
  const isConfirmed = incident.detection.isConfirmedSlick

  const kpis = [
    {
      label: 'ACTIVE SLICKS',
      value: isConfirmed ? '1 DETECTED' : '0 (LOOK-ALIKE)',
      subtext: isConfirmed ? 'Confirmed Mineral Oil' : 'Biogenic Rejection',
      color: isConfirmed ? 'var(--accent-crimson)' : 'var(--accent-amber)',
      icon: AlertTriangle
    },
    {
      label: 'SURFACE AREA',
      value: `${incident.characterisation.surfaceAreaKm2} km²`,
      subtext: `Vol: ~${incident.characterisation.estimatedVolumeM3} m³`,
      color: 'var(--accent-cyan)',
      icon: Maximize2
    },
    {
      label: 'AI CONFIDENCE',
      value: `${incident.detection.confidenceScore}%`,
      subtext: `Damping: ${incident.detection.sarDampingRatioDb} dB`,
      color: incident.detection.confidenceScore > 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
      icon: Target
    },
    {
      label: 'SPILL AGE (MACKAY)',
      value: `${incident.characterisation.spillAgeHours}h`,
      subtext: `Release: ${incident.characterisation.releaseWindowStart.slice(11, 16)} UTC`,
      color: 'var(--accent-purple)',
      icon: Clock
    },
    {
      label: 'CORRELATED VESSELS',
      value: `${incident.aisVessels.length} VESSELS`,
      subtext: `${incident.aisVessels.filter(v => v.hasBlackout).length} Blackout Anomalies`,
      color: 'var(--accent-blue)',
      icon: Radio
    },
    {
      label: 'TOP SUSPECT ATTRIBUTION',
      value: primarySuspect ? `${primarySuspect.overallScore}%` : 'N/A',
      subtext: primarySuspect ? primarySuspect.vessel.name.slice(0, 18) : 'No suspect identified',
      color: primarySuspect && primarySuspect.overallScore > 80 ? 'var(--accent-crimson)' : 'var(--text-secondary)',
      icon: UserX
    },
    {
      label: 'WEATHERING (EVAP)',
      value: `${incident.characterisation.weatheringPhysics.evaporationPercent}%`,
      subtext: `Mousse: ${incident.characterisation.weatheringPhysics.emulsificationPercent}%`,
      color: 'var(--accent-cyan)',
      icon: Droplet
    },
    {
      label: 'LANDFALL THREAT',
      value: incident.forecast.landfallRisk.riskLevel,
      subtext: incident.forecast.landfallRisk.vulnerableZone ? incident.forecast.landfallRisk.vulnerableZone.slice(0, 20) : 'Open Sea',
      color: incident.forecast.landfallRisk.riskLevel === 'CRITICAL' ? 'var(--accent-crimson)' : 'var(--accent-emerald)',
      icon: ShieldAlert
    }
  ]

  return (
    <div className="kpi-ribbon">
      {kpis.map((kpi, idx) => {
        const IconComponent = kpi.icon
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              minWidth: 0,
              height: '42px'
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <IconComponent size={13} style={{ color: kpi.color }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
              <span
                style={{
                  fontSize: '0.58rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={kpi.label}
              >
                {kpi.label}
              </span>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: kpi.color,
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.15
                }}
                title={kpi.value}
              >
                {kpi.value}
              </span>
              <span
                style={{
                  fontSize: '0.56rem',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={kpi.subtext}
              >
                {kpi.subtext}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
