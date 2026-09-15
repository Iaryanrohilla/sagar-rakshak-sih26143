import React from 'react'
import { Shield, Anchor, Trees, Scale, Ship, Landmark } from 'lucide-react'
import { useIncident } from '../../state/IncidentContext'

export const AgencyRolePanel: React.FC = () => {
  const { activeRole, incident, selectedSuspect } = useIncident()
  const suspect = selectedSuspect || incident.suspects[0]

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            AGENCY OPERATIONAL VIEW (ST6)
          </h3>
        </div>
        <span className="badge badge-cyan">{activeRole.replace(/_/g, ' ')}</span>
      </div>

      {/* Coast Guard View */}
      {activeRole === 'COAST_GUARD' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <Shield size={16} />
              <span>ICG POLLUTION RESPONSE &amp; INTERCEPTION DESK</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Target Interception Coordinates for Fast Patrol Vessel (FPV):
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {suspect ? `${suspect.vessel.currentPosition[0].toFixed(3)}°N, ${suspect.vessel.currentPosition[1].toFixed(3)}°E` : 'N/A'}
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Bearing: {suspect ? `${suspect.vessel.cogDegrees}° at ${suspect.vessel.sogKnots} kts` : 'N/A'}
            </div>
            <button
              style={{
                marginTop: '6px',
                padding: '8px',
                background: 'rgba(0, 242, 255, 0.15)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-cyan)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              DISPATCH ICG DORNIER-228 AERIAL SURVEILLANCE
            </button>
          </div>
        </div>
      )}

      {/* Indian Navy View */}
      {activeRole === 'NAVY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <Anchor size={16} />
              <span>MARITIME DOMAIN AWARENESS (MDA) DESK</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Dark Ship Evasion Threat Level:
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: suspect && suspect.vessel.hasBlackout ? 'var(--accent-crimson)' : 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
              {suspect && suspect.vessel.hasBlackout ? 'CRITICAL EVASION DETECTED' : 'STANDARD AIS INTEGRITY'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Western Naval Command surveillance feed cross-referenced with Indian Space Research Organisation (ISRO) satellite AIS constellation.
            </div>
          </div>
        </div>
      )}

      {/* MoEFCC View */}
      {activeRole === 'MOEFCC' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <Trees size={16} />
              <span>ECOLOGICAL SENSITIVITY &amp; DAMAGE ASSESSMENT</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Threatened Biome Zone:
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
              {incident.forecast.landfallRisk.vulnerableZone || 'Open Fairway'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Estimated remediation damage: ₹{(incident.characterisation.surfaceAreaKm2 * 14.5).toFixed(1)} Lakhs based on National Green Tribunal (NGT) environmental restitution formula.
            </div>
          </div>
        </div>
      )}

      {/* DG Shipping View */}
      {activeRole === 'DG_SHIPPING' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <Scale size={16} />
              <span>PORT STATE CONTROL (PSC) COMPLIANCE ENFORCEMENT</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Violation Category:
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-crimson)', fontFamily: 'var(--font-mono)' }}>
              MARPOL 73/78 Annex I (Discharge Prohibition at Sea)
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Target Vessel: <strong>{suspect ? suspect.vessel.name : 'Unknown'}</strong> (IMO: {suspect ? suspect.vessel.imo : 'N/A'}, Flag: {suspect ? suspect.vessel.flagCountry : 'N/A'})
            </div>
            <button
              style={{
                marginTop: '6px',
                padding: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid var(--accent-crimson)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-crimson)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ISSUE PORT STATE CONTROL DETENTION NOTICE
            </button>
          </div>
        </div>
      )}

      {/* Port Authority View */}
      {activeRole === 'PORT_AUTHORITY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <Ship size={16} />
              <span>HARBOR TRAFFIC &amp; CHANNEL CLEARANCE</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Traffic Fairway Clearance Status:
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
              CAUTIONARY NOTICE TO MARINERS BROADCAST
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Barrier deployment tugs stationed at harbor entrance fairway.
            </div>
          </div>
        </div>
      )}

      {/* Marine Insurer View */}
      {activeRole === 'INSURER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <Landmark size={16} />
              <span>P&amp;I CLUB LIABILITY &amp; SUBROGATION AUDIT</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Estimated Cleanup Liability Apportionment:
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
              $2.4M — $4.8M USD
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Evidence dossier establishes 92%+ forensic linkage to responsible vessel for full civil cost recovery.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
