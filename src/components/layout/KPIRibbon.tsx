import React from 'react'
import { useIncident } from '../../state/IncidentContext'
import {
  Target,
  Maximize2,
  UserX,
  Radio,
  Droplet,
  Clock,
  ShieldAlert
} from 'lucide-react'

export const KPIRibbon: React.FC = () => {
  const { incident } = useIncident()

  const primarySuspect = incident.suspects[0]
  const isConfirmed = incident.detection.isConfirmedSlick
  const darkVesselsCount = incident.aisVessels.filter((v) => v.hasBlackout).length

  return (
    <div className="kpi-ribbon" role="region" aria-label="Incident Hero KPIs and Telemetry">
      {/* ========================================================================= */}
      {/* 3 CORE HERO NUMBERS (HUGE & BOLD) */}
      {/* ========================================================================= */}

      {/* HERO 1: AI CONFIDENCE % (SAR = Teal) */}
      <div
        className="kpi-hero-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minWidth: '190px',
          height: '50px',
          padding: '4px 12px',
          background: 'rgba(0, 210, 180, 0.06)',
          border: '1px solid rgba(0, 210, 180, 0.35)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 0 16px rgba(0, 210, 180, 0.08) inset',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6rem', color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.04em' }}>
            <Target size={11} style={{ color: 'var(--accent-teal)' }} />
            AI CONFIDENCE
          </span>
          <span className="badge badge-teal" style={{ fontSize: '0.55rem', padding: '0 4px', lineHeight: '14px' }}>
            {isConfirmed ? 'SAR UNET' : 'LOOK-ALIKE'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '1px' }}>
          <span style={{ fontSize: '1.42rem', fontWeight: 900, color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)', lineHeight: 1, letterSpacing: '-0.02em', textShadow: '0 0 10px rgba(0,210,180,0.35)' }}>
            {incident.detection.confidenceScore}%
          </span>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {incident.detection.sarDampingRatioDb} dB damping
          </span>
        </div>
      </div>

      {/* HERO 2: SPILL AREA (SAR / Slick = Teal/Cyan) */}
      <div
        className="kpi-hero-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minWidth: '190px',
          height: '50px',
          padding: '4px 12px',
          background: 'rgba(14, 165, 233, 0.06)',
          border: '1px solid rgba(14, 165, 233, 0.35)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 0 16px rgba(14, 165, 233, 0.08) inset',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6rem', color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.04em' }}>
            <Maximize2 size={11} style={{ color: 'var(--accent-blue)' }} />
            SPILL AREA
          </span>
          <span style={{ fontSize: '0.55rem', padding: '0 4px', lineHeight: '14px', background: 'rgba(14, 165, 233, 0.15)', color: 'var(--accent-blue)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            POLYGON
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '1px' }}>
          <span style={{ fontSize: '1.42rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--font-mono)', lineHeight: 1, letterSpacing: '-0.02em', textShadow: '0 0 10px rgba(56,189,248,0.35)' }}>
            {incident.characterisation.surfaceAreaKm2} km²
          </span>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            ~{incident.characterisation.estimatedVolumeM3.toLocaleString()} m³ vol
          </span>
        </div>
      </div>

      {/* HERO 3: TOP SUSPECT MATCH % (Suspects = Coral-Red) */}
      <div
        className="kpi-hero-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minWidth: '210px',
          height: '50px',
          padding: '4px 12px',
          background: 'rgba(244, 63, 94, 0.07)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 0 16px rgba(244, 63, 94, 0.1) inset',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6rem', color: 'var(--accent-coral)', fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.04em' }}>
            <UserX size={11} style={{ color: 'var(--accent-coral)' }} />
            TOP SUSPECT MATCH
          </span>
          <span style={{ fontSize: '0.55rem', padding: '0 4px', lineHeight: '14px', background: 'rgba(244, 63, 94, 0.2)', color: 'var(--accent-coral)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            {primarySuspect ? primarySuspect.vessel.flag : 'NO MATCH'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '1px' }}>
          <span style={{ fontSize: '1.42rem', fontWeight: 900, color: 'var(--accent-coral)', fontFamily: 'var(--font-mono)', lineHeight: 1, letterSpacing: '-0.02em', textShadow: '0 0 10px rgba(244,63,94,0.4)' }}>
            {primarySuspect ? `${primarySuspect.overallScore}%` : 'N/A'}
          </span>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }} title={primarySuspect?.vessel.name}>
            {primarySuspect ? primarySuspect.vessel.name : 'Unassigned'}
          </span>
        </div>
      </div>

      {/* Vertical Subtle Separator */}
      <div style={{ width: '1px', height: '36px', background: 'var(--border-medium)', margin: '0 4px', flexShrink: 0 }} />

      {/* ========================================================================= */}
      {/* SECONDARY TELEMETRY STREAM (STRICT COLOR HIERARCHY) */}
      {/* ========================================================================= */}

      {/* 4. AIS Traffic (AIS = Amber) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px',
          background: 'rgba(245, 158, 11, 0.04)',
          border: '1px solid var(--border-amber)',
          borderRadius: 'var(--radius-sm)',
          minWidth: '150px',
          height: '50px',
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(245, 158, 11, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Radio size={13} style={{ color: 'var(--accent-amber)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: '0.58rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            AIS CORRELATION
          </span>
          <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--accent-amber-bright)', fontFamily: 'var(--font-mono)', lineHeight: 1.15 }}>
            {incident.aisVessels.length} VESSELS
          </span>
          <span style={{ fontSize: '0.56rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
            {darkVesselsCount} dark / gap anomalies
          </span>
        </div>
      </div>

      {/* 5. Ocean & Weather (Ocean/Weather = Green) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px',
          background: 'rgba(16, 185, 129, 0.04)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: 'var(--radius-sm)',
          minWidth: '150px',
          height: '50px',
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(16, 185, 129, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Droplet size={13} style={{ color: 'var(--accent-green)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: '0.58rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            METOCEAN & EVAP
          </span>
          <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--accent-green-bright)', fontFamily: 'var(--font-mono)', lineHeight: 1.15 }}>
            {incident.characterisation.weatheringPhysics.evaporationPercent}% EVAP
          </span>
          <span style={{ fontSize: '0.56rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
            {incident.metocean.currentSpeedKnots}kt Current • HYCOM
          </span>
        </div>
      </div>

      {/* 6. Lagrangian Spill Age (SAR Hindcast = Teal) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px',
          background: 'rgba(0, 210, 180, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          minWidth: '145px',
          height: '50px',
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 210, 180, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Clock size={13} style={{ color: 'var(--accent-teal)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: '0.58rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            HINDCAST T₀ AGE
          </span>
          <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)', lineHeight: 1.15 }}>
            {incident.characterisation.spillAgeHours}h DRIFT
          </span>
          <span style={{ fontSize: '0.56rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
            Release: {incident.characterisation.releaseWindowStart.slice(11, 16)} UTC
          </span>
        </div>
      </div>

      {/* 7. Landfall Risk (Green if Open Sea / Coral if Critical) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px',
          background: incident.forecast.landfallRisk.riskLevel === 'CRITICAL' ? 'rgba(244, 63, 94, 0.06)' : 'rgba(16, 185, 129, 0.04)',
          border: `1px solid ${incident.forecast.landfallRisk.riskLevel === 'CRITICAL' ? 'var(--border-coral)' : 'rgba(16, 185, 129, 0.3)'}`,
          borderRadius: 'var(--radius-sm)',
          minWidth: '150px',
          height: '50px',
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: 'var(--radius-sm)',
            background: incident.forecast.landfallRisk.riskLevel === 'CRITICAL' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <ShieldAlert size={13} style={{ color: incident.forecast.landfallRisk.riskLevel === 'CRITICAL' ? 'var(--accent-coral)' : 'var(--accent-green)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: '0.58rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            LANDFALL RISK
          </span>
          <span style={{ fontSize: '0.86rem', fontWeight: 800, color: incident.forecast.landfallRisk.riskLevel === 'CRITICAL' ? 'var(--accent-coral)' : 'var(--accent-green-bright)', fontFamily: 'var(--font-mono)', lineHeight: 1.15 }}>
            {incident.forecast.landfallRisk.riskLevel}
          </span>
          <span style={{ fontSize: '0.56rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '95px' }} title={incident.forecast.landfallRisk.vulnerableZone || 'Open Waters'}>
            {incident.forecast.landfallRisk.vulnerableZone || 'Open Fairway'}
          </span>
        </div>
      </div>
    </div>
  )
}
